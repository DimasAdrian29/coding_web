<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PengumpulanSiswa;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class GuruAssessmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureTeacher($request);

        $query = PengumpulanSiswa::with(['student', 'material', 'chapter', 'quiz'])
            ->latest('submitted_at')
            ->latest('id');

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('type') && $request->input('type') !== 'all') {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('search')) {
            $keyword = $request->string('search')->toString();
            $query->where(function ($searchQuery) use ($keyword) {
                $searchQuery->where('title', 'like', "%{$keyword}%")
                    ->orWhereHas('student', fn ($studentQuery) => $studentQuery->where('name', 'like', "%{$keyword}%"))
                    ->orWhereHas('material', fn ($materialQuery) => $materialQuery->where('title', 'like', "%{$keyword}%"))
                    ->orWhereHas('chapter', fn ($chapterQuery) => $chapterQuery->where('title', 'like', "%{$keyword}%"));
            });
        }

        $submissions = $query->paginate(12);
        $total = PengumpulanSiswa::count();
        $pending = PengumpulanSiswa::where('status', PengumpulanSiswa::STATUS_PENDING)->count();
        $graded = PengumpulanSiswa::where('status', PengumpulanSiswa::STATUS_GRADED)->count();

        return response()->json([
            'header' => [
                'title' => 'Penilaian Siswa',
                'description' => 'Data diambil dari hasil latihan dan quiz yang benar-benar dikirim siswa.',
                'actionLabel' => 'Export Data',
            ],
            'tabs' => [
                ['id' => 'all', 'label' => 'Semua', 'count' => $total],
                ['id' => PengumpulanSiswa::STATUS_PENDING, 'label' => 'Belum Dinilai', 'count' => $pending],
                ['id' => PengumpulanSiswa::STATUS_GRADED, 'label' => 'Sudah Dinilai', 'count' => $graded],
            ],
            'items' => $submissions->getCollection()
                ->map(fn (PengumpulanSiswa $submission) => $this->submissionRow($submission))
                ->values(),
            'pagination' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total(),
                'from' => $submissions->firstItem(),
                'to' => $submissions->lastItem(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);

        $submission = PengumpulanSiswa::with(['student', 'material', 'chapter', 'quiz', 'answers'])
            ->findOrFail($id);

        return response()->json([
            'submission' => [
                ...$this->submissionRow($submission),
                'answers' => $submission->answers
                    ->sortBy('id')
                    ->values()
                    ->map(fn ($answer) => [
                        'id' => $answer->id,
                        'question_text' => $answer->question_text,
                        'options' => $answer->options ?? [],
                        'selected_answer' => $answer->selected_answer,
                        'correct_answer' => $answer->correct_answer,
                        'is_correct' => $answer->is_correct,
                    ]),
            ],
        ]);
    }

    public function score(Request $request, int $id): JsonResponse
    {
        $teacher = $this->ensureTeacher($request);
        $submission = PengumpulanSiswa::findOrFail($id);

        $validated = $request->validate([
            'score' => ['required', 'integer', 'min:0', 'max:100'],
            'feedback' => ['nullable', 'string', 'max:2000'],
        ]);

        $submission->update([
            'teacher_score' => $validated['score'],
            'teacher_feedback' => $validated['feedback'] ?? null,
            'teacher_id' => $teacher->id,
            'status' => PengumpulanSiswa::STATUS_GRADED,
            'graded_at' => Carbon::now(),
        ]);

        $assessment = $this->submissionRow($submission->fresh(['student', 'material', 'chapter', 'quiz']));

        return response()->json([
            'message' => 'Penilaian berhasil disimpan.',
            'assessment' => $assessment,
            'data' => [
                'id' => $assessment['id'],
                'score' => $assessment['score'],
                'teacher_score' => $assessment['teacher_score'],
                'feedback' => $assessment['feedback'],
                'status' => $assessment['status'],
                'status_label' => $assessment['status_label'],
            ],
        ]);
    }

    private function ensureTeacher(Request $request): Pengguna
    {
        /** @var Pengguna|null $Pengguna */
        $Pengguna = $request->user();

        abort_unless($Pengguna && $Pengguna->isGuru(), 403, 'Akses khusus guru.');

        return $Pengguna;
    }

    private function submissionRow(PengumpulanSiswa $submission): array
    {
        $studentName = $submission->student?->name ?? 'Siswa';
        $materialTitle = $submission->material?->title ?? '-';
        $chapterTitle = $submission->chapter?->title;
        $taskType = $submission->type === PengumpulanSiswa::TYPE_QUIZ ? 'Quiz Akhir' : 'Latihan BabLama';
        $score = $submission->teacher_score ?? $submission->score;

        return [
            'id' => $submission->id,
            'student_id' => $submission->student_id,
            'name' => $studentName,
            'studentName' => $studentName,
            'avatar' => $this->avatarFromName($studentName),
            'material' => $materialTitle,
            'chapter' => $chapterTitle,
            'lesson' => $materialTitle,
            'task' => $chapterTitle ? "{$taskType}: {$chapterTitle}" : $taskType,
            'type' => $submission->type,
            'type_label' => $taskType,
            'date' => optional($submission->submitted_at)->locale('id')->translatedFormat('d M Y H:i') ?? '-',
            'submitted_at' => optional($submission->submitted_at)->toISOString(),
            'status' => $submission->status,
            'status_label' => $submission->status === PengumpulanSiswa::STATUS_GRADED ? 'Sudah Dinilai' : 'Belum Dinilai',
            'score' => $score,
            'auto_score' => $submission->score,
            'teacher_score' => $submission->teacher_score,
            'feedback' => $submission->teacher_feedback ?? '',
            'answers_count' => $submission->answers_count ?? $submission->answers()->count(),
        ];
    }

    private function avatarFromName(string $name): string
    {
        return 'https://ui-avatars.com/api/?background=71ab54&color=ffffff&name=' . urlencode($name);
    }
}
