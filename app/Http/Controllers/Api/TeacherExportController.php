<?php

namespace App\Http\Controllers\Api;

use App\Exports\ExportNilaiGuru;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\ProgressBab;
use App\Models\Latihan;
use App\Models\HasilLatihanAkhir;
use App\Models\PengumpulanLatihan;
use App\Models\Pengguna;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TeacherExportController extends Controller
{
    public function studentGradesPdf(Request $request): Response|JsonResponse
    {
        return $this->downloadPdf($request, 'Rekap Nilai Siswa');
    }

    public function studentGradesExcel(Request $request): Response|JsonResponse
    {
        return $this->downloadExcel($request, 'rekap-nilai-siswa');
    }

    public function submissionsPdf(Request $request): Response|JsonResponse
    {
        return $this->downloadPdf($request, 'Rekap Penilaian Latihan');
    }

    public function submissionsExcel(Request $request): Response|JsonResponse
    {
        return $this->downloadExcel($request, 'rekap-penilaian-latihan');
    }

    public function statisticsPdf(Request $request): Response|JsonResponse
    {
        return $this->downloadPdf($request, 'Rekap Statistik Nilai Siswa');
    }

    public function statisticsExcel(Request $request): Response|JsonResponse
    {
        return $this->downloadExcel($request, 'rekap-statistik-siswa');
    }

    private function downloadPdf(Request $request, string $title): Response|JsonResponse
    {
        $teacher = $this->resolveTeacher($request);

        if (! $teacher) {
            return $this->forbidden();
        }

        $rows = $this->rows($request);
        $printedAt = now();
        $pdf = Pdf::loadView('exports.student-grades-pdf', [
            'title' => $title,
            'subtitle' => 'SMK 5 Pekanbaru - Coding Platform',
            'teacher' => $teacher,
            'printedAt' => $printedAt,
            'rows' => $rows,
        ])->setPaper('a4', 'landscape');

        return $pdf->download('rekap-nilai-siswa-'.$printedAt->format('Ymd').'.pdf');
    }

    private function downloadExcel(Request $request, string $prefix): Response|JsonResponse
    {
        $teacher = $this->resolveTeacher($request);

        if (! $teacher) {
            return $this->forbidden();
        }

        $printedAt = now();
        $export = new ExportNilaiGuru($this->rows($request));
        $content = view('exports.student-grades-excel', [
            'rows' => $export->rows(),
            'headings' => $export->headings(),
        ])->render();

        return response($content, 200, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$prefix.'-'.$printedAt->format('Ymd').'.xls"',
            'Cache-Control' => 'max-age=0, no-cache, no-store, must-revalidate',
        ]);
    }

    private function rows(Request $request): Collection
    {
        $students = Pengguna::query()
            ->whereIn('role', ['siswa', 'student'])
            ->when($request->filled('class_name'), fn ($query) => $query->where('class_name', $request->query('class_name')))
            ->orderBy('name')
            ->get();
        $studentIds = $students->pluck('id');
        $chapters = Bab::where('status', 'published')->count();
        $latestFinalExams = HasilLatihanAkhir::with('exercise')
            ->whereIn('user_id', $studentIds)
            ->latest('submitted_at')
            ->get()
            ->unique('user_id')
            ->keyBy('user_id');
        $completedByStudent = ProgressBab::whereIn('user_id', $studentIds)
            ->where('status', 'completed')
            ->selectRaw('user_id, count(*) as total_completed')
            ->groupBy('user_id')
            ->pluck('total_completed', 'user_id');

        $submissionQuery = PengumpulanLatihan::query()
            ->with(['user', 'exercise.chapter'])
            ->whereIn('user_id', $studentIds)
            ->when($request->filled('status'), function ($query) use ($request) {
                $status = $request->query('status');
                $query->where('status', $status === 'pending' ? 'pending_review' : $status);
            })
            ->when($request->filled('exercise_id'), fn ($query) => $query->where('exercise_id', $request->query('exercise_id')))
            ->when($request->filled('date_from'), fn ($query) => $query->whereDate('submitted_at', '>=', $request->query('date_from')))
            ->when($request->filled('date_to'), fn ($query) => $query->whereDate('submitted_at', '<=', $request->query('date_to')));

        if ($request->filled('chapter_id')) {
            $exerciseIds = Latihan::where('chapter_id', $request->query('chapter_id'))->pluck('id');
            $submissionQuery->whereIn('exercise_id', $exerciseIds);
        }

        $submissions = $submissionQuery
            ->orderBy('submitted_at')
            ->get();
        $rows = collect();
        $studentsWithPengumpulanLatihan = collect();

        foreach ($submissions as $submission) {
            $student = $submission->user;

            if (! $student) {
                continue;
            }

            $studentsWithPengumpulanLatihan->push($student->id);
            $rows->push($this->row($student, $submission, $latestFinalExams, $completedByStudent, $chapters));
        }

        if (! $request->filled('status') && ! $request->filled('exercise_id') && ! $request->filled('chapter_id') && ! $request->filled('date_from') && ! $request->filled('date_to')) {
            foreach ($students->whereNotIn('id', $studentsWithPengumpulanLatihan->unique()) as $student) {
                $rows->push($this->row($student, null, $latestFinalExams, $completedByStudent, $chapters));
            }
        }

        return $rows->values()->map(function (array $row, int $index) {
            $row['no'] = $index + 1;

            return $row;
        });
    }

    private function row(Pengguna $student, ?PengumpulanLatihan $submission, Collection $finalExams, Collection $completedByStudent, int $totalChapters): array
    {
        $finalExam = $finalExams->get($student->id);
        $gradedScores = PengumpulanLatihan::where('user_id', $student->id)
            ->where('status', 'graded')
            ->whereNotNull('score')
            ->pluck('score');
        $allScores = $finalExam ? $gradedScores->push($finalExam->score) : $gradedScores;
        $average = $allScores->isNotEmpty() ? round((float) $allScores->avg(), 1) : null;
        $completed = (int) ($completedByStudent->get($student->id) ?? 0);
        $ProgressLama = $totalChapters > 0 ? $completed.'/'.$totalChapters.' BabLama ('.round(($completed / $totalChapters) * 100).'%)' : '-';

        return [
            'no' => null,
            'student_name' => $student->name,
            'class_name' => $student->class_name ?: '-',
            'chapter' => $submission?->exercise?->chapter?->title ?? '-',
            'exercise' => $submission?->exercise?->title ?? '-',
            'score' => $submission?->score,
            'feedback' => $submission?->feedback ?: '-',
            'status' => $this->statusLabel($submission?->status),
            'submitted_at' => $this->dateTime($submission?->submitted_at),
            'graded_at' => $this->dateTime($submission?->graded_at),
            'final_exam_score' => $finalExam?->score,
            'average_score' => $average,
            'progress' => $ProgressLama,
            'description' => $average === null ? '-' : ($average >= 75 ? 'Lulus' : 'Perlu Perbaikan'),
        ];
    }

    private function resolveTeacher(Request $request): ?Pengguna
    {
        $Pengguna = Auth::user() ?? $request->user();

        if (! $Pengguna && ($userId = $request->header('X-User-Id'))) {
            $Pengguna = Pengguna::find($userId);
        }

        return $Pengguna && in_array($Pengguna->role, ['guru', 'teacher', 'admin'], true) ? $Pengguna : null;
    }

    private function forbidden(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Anda tidak memiliki akses export data nilai siswa.',
        ], 403);
    }

    private function statusLabel(?string $status): string
    {
        return match ($status) {
            'graded' => 'Sudah Dinilai',
            'submitted' => 'Terkumpul',
            'pending_review', 'pending' => 'Menunggu Penilaian',
            default => '-',
        };
    }

    private function dateTime(mixed $date): string
    {
        return $date ? Carbon::parse($date)->format('d M Y, H:i') : '-';
    }
}
