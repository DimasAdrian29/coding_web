<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\Latihan;
use App\Models\RiwayatLatihan;
use App\Models\HasilLatihanAkhir;
use App\Models\Materi;
use App\Models\Pengguna;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\Response;

class NilaiGuruController extends Controller
{
    use ApiLearningHelpers;

    public function index(Request $request): JsonResponse
    {
        return $this->ok($this->payload($request));
    }

    public function exportPdf(Request $request): Response|JsonResponse
    {
        $payload = $this->payload($request, true);

        if (! $payload['materi']) {
            return $this->fail('Pilih MateriLama terlebih dahulu untuk export nilai.', null, 422);
        }

        $printedAt = now();
        $pdf = Pdf::loadView('exports.teacher-grades-pdf', [
            'payload' => $payload,
            'printedAt' => $printedAt,
        ])->setPaper('a4', 'landscape');

        return $pdf->download('nilai-siswa-'.$payload['materi']['id'].'-'.$printedAt->format('Ymd').'.pdf');
    }

    public function exportExcel(Request $request): Response|JsonResponse
    {
        $payload = $this->payload($request, true);

        if (! $payload['materi']) {
            return $this->fail('Pilih MateriLama terlebih dahulu untuk export nilai.', null, 422);
        }

        $printedAt = now();
        $content = view('exports.teacher-grades-excel', [
            'payload' => $payload,
            'printedAt' => $printedAt,
        ])->render();

        return response($content, 200, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="nilai-siswa-'.$payload['materi']['id'].'-'.$printedAt->format('Ymd').'.xls"',
            'Cache-Control' => 'max-age=0, no-cache, no-store, must-revalidate',
        ]);
    }

    public function history(Request $request, int $studentId): JsonResponse
    {
        $materialId = (int) $request->query('materi_id');
        $babId = (int) $request->query('bab_id');
        $Materi = $materialId > 0 ? Materi::find($materialId) : null;
        $student = Pengguna::whereIn('role', ['siswa', 'student'])->find($studentId);

        if (! $Materi || ! $student) {
            return $this->fail('Data siswa atau MateriLama tidak ditemukan.', null, 404);
        }

        $chapters = Bab::where(function ($query) use ($Materi) {
                $query->where('material_id', $Materi->id)
                    ->orWhere('materi_id', $Materi->id);
            })
            ->whereIn('status', ['published', 'active'])
            ->when($babId > 0, fn ($query) => $query->where('id', $babId))
            ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
            ->orderBy('id')
            ->get();
        $chapterExercises = Latihan::with('chapter')
            ->where('type', 'chapter')
            ->whereIn('chapter_id', $chapters->pluck('id'))
            ->get();
        $attempts = RiwayatLatihan::with(['exercise.chapter'])
            ->where('user_id', $student->id)
            ->whereIn('exercise_id', $chapterExercises->pluck('id'))
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at')
            ->get();
        $finalExercises = Latihan::where('type', 'final_exam')->where('material_id', $Materi->id)->get();

        if ($finalExercises->isEmpty()) {
            $finalExercises = Latihan::where('type', 'final_exam')->whereNull('material_id')->get();
        }

        $finalResults = HasilLatihanAkhir::with('exercise')
            ->where('user_id', $student->id)
            ->whereIn('exercise_id', $finalExercises->pluck('id'))
            ->orderBy('submitted_at')
            ->get();

        return $this->ok([
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'nisn' => $student->nisn,
            ],
            'materi' => [
                'id' => $Materi->id,
                'title' => $Materi->title,
            ],
            'histories' => $this->attemptHistory($attempts)->values()->map(fn (array $item) => [
                'attempt_id' => $item['attempt_id'],
                'chapter_title' => $item['chapter'],
                'exercise_title' => $item['exercise'],
                'attempt_number' => $item['attempt_number'],
                'correct_answers' => $item['correct_answers'],
                'wrong_answers' => $item['wrong_answers'],
                'score' => $item['score'],
                'submitted_at' => $item['submitted_at'],
            ]),
            'final_exam_histories' => $this->finalHistory($finalResults)->values()->map(fn (array $item) => [
                'attempt_id' => $item['attempt_id'],
                'exercise_title' => $item['exercise'],
                'attempt_number' => $item['attempt_number'],
                'correct_answers' => $item['correct_answers'],
                'wrong_answers' => $item['wrong_answers'],
                'score' => $item['score'],
                'submitted_at' => $item['submitted_at'],
            ]),
        ]);
    }

    private function payload(Request $request, bool $requireMaterial = false): array
    {
        $materials = Materi::whereIn('status', ['publish', 'published', 'active'])
            ->orderBy('title')
            ->get(['id', 'title']);
        $materialId = (int) $request->query('materi_id');
        $babId = (int) $request->query('bab_id');
        $Materi = $materialId > 0 ? Materi::find($materialId) : null;

        if (! $Materi) {
            return [
                'materis' => $materials,
                'materials' => $materials,
                'materi' => null,
            'chapters' => [],
            'all_chapters' => [],
            'students' => [],
            'summary' => [
                'total_students' => 0,
                'average_score' => 0,
                'completed_students' => 0,
                'not_completed_students' => 0,
            ],
            'stats' => [
                    'totalStudents' => 0,
                    'averageScore' => 0,
                    'completedStudents' => 0,
                    'incompleteStudents' => 0,
                ],
                'message' => $requireMaterial ? 'MateriLama tidak ditemukan.' : 'Silakan pilih MateriLama terlebih dahulu untuk melihat nilai siswa.',
            ];
        }

        $allChapters = Bab::where(function ($query) use ($Materi) {
                $query->where('material_id', $Materi->id)
                    ->orWhere('materi_id', $Materi->id);
            })
            ->whereIn('status', ['published', 'active'])
            ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
            ->orderBy('id')
            ->get();
        $chapters = $babId > 0
            ? $allChapters->where('id', $babId)->values()
            : $allChapters;
        $chapterIds = $chapters->pluck('id');
        $chapterExercises = Latihan::with('chapter')
            ->where('type', 'chapter')
            ->whereIn('chapter_id', $chapterIds)
            ->get();
        $chapterExerciseIds = $chapterExercises->pluck('id');
        $finalExercises = Latihan::where('type', 'final_exam')
            ->where('material_id', $Materi->id)
            ->get();

        if ($finalExercises->isEmpty()) {
            $finalExercises = Latihan::where('type', 'final_exam')
                ->whereNull('material_id')
                ->get();
        }
        $students = Pengguna::whereIn('role', ['siswa', 'student'])->orderBy('name')->get();
        $studentIds = $students->pluck('id');

        $attempts = RiwayatLatihan::with(['exercise.chapter'])
            ->whereIn('user_id', $studentIds)
            ->whereIn('exercise_id', $chapterExerciseIds)
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at')
            ->get();
        $finalResults = HasilLatihanAkhir::with('exercise')
            ->whereIn('user_id', $studentIds)
            ->whereIn('exercise_id', $finalExercises->pluck('id'))
            ->orderBy('submitted_at')
            ->get();

        $rows = $students->map(function (Pengguna $student) use ($chapters, $chapterExercises, $attempts, $finalResults) {
            $chapterScores = [];
            $history = collect();

            foreach ($chapters as $Bab) {
                $exerciseIds = $chapterExercises->where('chapter_id', $Bab->id)->pluck('id');
                $studentAttempts = $attempts
                    ->where('user_id', $student->id)
                    ->whereIn('exercise_id', $exerciseIds);
                $bestScore = $studentAttempts->max('score');
                $chapterScores[(string) $Bab->id] = $bestScore === null ? null : (float) $bestScore;

                $history = $history->merge($this->attemptHistory($studentAttempts));
            }

            $studentFinalResults = $finalResults->where('user_id', $student->id);
            $finalScore = $studentFinalResults->max('score');
            $history = $history->merge($this->finalHistory($studentFinalResults));

            $scoreValues = collect($chapterScores)->filter(fn ($score) => $score !== null)->values();
            if ($finalScore !== null) {
                $scoreValues->push((float) $finalScore);
            }

            $average = $scoreValues->isNotEmpty() ? round((float) $scoreValues->avg(), 2) : null;
            $requiredActivities = $chapters->count() + ($studentFinalResults->isNotEmpty() || $finalScore !== null ? 1 : 1);
            $completedActivities = collect($chapterScores)->filter(fn ($score) => $score !== null)->count() + ($finalScore !== null ? 1 : 0);
            $isComplete = $chapters->count() > 0
                && collect($chapterScores)->every(fn ($score) => $score !== null)
                && $finalScore !== null;

            return [
                'id' => $student->id,
                'name' => $student->name,
                'nisn' => $student->nisn,
                'chapter_scores' => $chapterScores,
                'final_score' => $finalScore === null ? null : (float) $finalScore,
                'average_score' => $average,
                'status' => $isComplete ? 'Selesai' : 'Belum Selesai',
                'progress' => $requiredActivities > 0 ? (int) round(($completedActivities / $requiredActivities) * 100) : 0,
                'history' => $history->sortByDesc('submitted_at_raw')->values()->map(function (array $item, int $index) {
                    unset($item['submitted_at_raw']);
                    $item['no'] = $index + 1;

                    return $item;
                }),
            ];
        })->values();

        $summary = [
            'total_students' => $rows->count(),
            'average_score' => round((float) $rows->pluck('average_score')->filter()->avg(), 2),
            'completed_students' => $rows->where('status', 'Selesai')->count(),
            'not_completed_students' => $rows->where('status', 'Belum Selesai')->count(),
        ];

        return [
            'materis' => $materials,
            'materials' => $materials,
            'materi' => [
                'id' => $Materi->id,
                'title' => $Materi->title,
            ],
            'chapters' => $chapters->map(fn (Bab $Bab) => [
                'id' => $Bab->id,
                'title' => $Bab->title,
                'order_number' => $this->chapterOrderValue($Bab),
            ])->values(),
            'all_chapters' => $allChapters->map(fn (Bab $Bab) => [
                'id' => $Bab->id,
                'title' => $Bab->title,
                'order_number' => $this->chapterOrderValue($Bab),
            ])->values(),
            'students' => $rows,
            'summary' => $summary,
            'stats' => [
                'totalStudents' => $summary['total_students'],
                'averageScore' => $summary['average_score'],
                'completedStudents' => $summary['completed_students'],
                'incompleteStudents' => $summary['not_completed_students'],
            ],
        ];
    }

    private function attemptHistory(Collection $attempts): Collection
    {
        $grouped = $attempts->groupBy(fn (RiwayatLatihan $attempt) => $attempt->user_id.'-'.$attempt->exercise_id);

        return $attempts->map(function (RiwayatLatihan $attempt) use ($grouped) {
            $group = $grouped->get($attempt->user_id.'-'.$attempt->exercise_id, collect())->sortBy('id')->values();
            $attemptNumber = $group->search(fn (RiwayatLatihan $item) => $item->id === $attempt->id);

            return [
                'attempt_id' => $attempt->id,
                'type' => 'Latihan BabLama',
                'chapter' => $attempt->exercise?->chapter?->title ?? '-',
                'exercise' => $attempt->exercise?->title ?? '-',
                'attempt_number' => $attemptNumber === false ? 1 : $attemptNumber + 1,
                'score' => (float) $attempt->score,
                'correct_answers' => $attempt->correct_answers,
                'wrong_answers' => $attempt->wrong_answers,
                'submitted_at' => optional($attempt->submitted_at)->format('d M Y, H:i'),
                'submitted_at_raw' => $attempt->submitted_at,
            ];
        });
    }

    private function finalHistory(Collection $results): Collection
    {
        return $results->values()->map(function (HasilLatihanAkhir $result, int $index) {
            $attempt = RiwayatLatihan::where('user_id', $result->user_id)
                ->where('exercise_id', $result->exercise_id)
                ->when($result->submitted_at, fn ($query) => $query->where('submitted_at', $result->submitted_at))
                ->first();

            return [
                'attempt_id' => $attempt?->id,
                'type' => 'Latihan Akhir',
                'chapter' => 'Latihan Akhir',
                'exercise' => $result->exercise?->title ?? 'Latihan Akhir',
                'attempt_number' => $index + 1,
                'score' => (float) $result->score,
                'correct_answers' => $result->total_correct,
                'wrong_answers' => max($result->total_questions - $result->total_correct, 0),
                'submitted_at' => optional($result->submitted_at)->format('d M Y, H:i'),
                'submitted_at_raw' => $result->submitted_at,
            ];
        });
    }

    private function chapterOrderValue(Bab $Bab): int
    {
        $orderNumber = (int) ($Bab->order_number ?? 0);
        $chapterOrder = (int) ($Bab->chapter_order ?? 0);

        return $orderNumber > 0 ? $orderNumber : ($chapterOrder > 0 ? $chapterOrder : $Bab->id);
    }
}
