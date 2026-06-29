<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\ProgressBab;
use App\Models\Latihan;
use App\Models\RiwayatLatihan;
use App\Models\Materi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BabSiswaController extends Controller
{
    use ApiLearningHelpers;

    public function index(): JsonResponse
    {
        $flow = $this->buildLearningFlow();

        if ($flow instanceof JsonResponse) {
            return $flow;
        }

        $completedCount = collect($flow['chapters'])->where('chapter_status', 'completed')->count();
        $total = count($flow['chapters']);

        return $this->ok([
            'completedChapters' => $completedCount,
            'totalChapters' => $total,
            'progressPercentage' => $total > 0 ? (int) round(($completedCount / $total) * 100) : 0,
            'chapters' => collect($flow['chapters'])->map(fn (array $item) => [
                'id' => $item['id'],
                'title' => $item['title'],
                'description' => $item['description'],
                'content' => $item['content'],
                'codeExample' => $item['codeExample'],
                'duration' => $item['duration_minutes'] . ' menit',
                'status' => $item['chapter_status'] === 'completed'
                    ? 'completed'
                    : ($item['chapter_unlocked'] ? 'current' : 'locked'),
                'requirement' => $item['chapter_unlocked'] ? null : 'Selesaikan latihan BabLama sebelumnya untuk membuka BabLama ini',
            ]),
        ]);
    }

    public function learningFlow(): JsonResponse
    {
        $flow = $this->buildLearningFlow();

        return $flow instanceof JsonResponse ? $flow : $this->ok($flow);
    }

    public function materis(): JsonResponse
    {
        $flow = $this->buildLearningFlow();

        if ($flow instanceof JsonResponse) {
            return $flow;
        }

        return $this->ok([
            'materis' => $flow['materials'],
            'materials' => $flow['materials'],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $student = $this->currentStudent();
        $Bab = Bab::with('material')->where('status', 'published')->find($id);

        if (! $student || ! $Bab) {
            return $this->fail('Data BabLama tidak ditemukan', null, 404);
        }

        $flow = $this->buildLearningFlow();
        if ($flow instanceof JsonResponse) {
            return $flow;
        }

        $flowChapter = collect($flow['chapters'])->firstWhere('id', $Bab->id);
        if (! $flowChapter || ! $flowChapter['chapter_unlocked']) {
            return $this->fail('BabLama ini masih terkunci. Selesaikan latihan BabLama sebelumnya terlebih dahulu.', null, 403);
        }

        $ProgressLama = ProgressBab::where('user_id', $student->id)
            ->where('chapter_id', $Bab->id)
            ->first();

        return $this->ok([
            'chapter' => [
                'id' => $Bab->id,
                'materialId' => $Bab->material_id,
                'materiId' => $Bab->materi_id ?? $Bab->material_id,
                'materi_id' => $Bab->materi_id ?? $Bab->material_id,
                'materialTitle' => $Bab->material?->title,
                'order' => $Bab->order_number ?? $Bab->chapter_order ?? $Bab->id,
                'title' => $Bab->title,
                'description' => $Bab->description ?? '',
                'content' => $Bab->content ?? '',
                'videoType' => $Bab->video_type,
                'video_type' => $Bab->video_type,
                'videoUrl' => $Bab->video_url ?? '',
                'video_url' => $Bab->video_url ?? '',
                'videoFileUrl' => $Bab->video_file ? asset('storage/' . $Bab->video_file) : null,
                'video_file_url' => $Bab->video_file ? asset('storage/' . $Bab->video_file) : null,
                'codeExample' => $Bab->code_example ?? '',
                'judulContohKode' => $Bab->judul_contoh_kode ?? '',
                'judul_contoh_kode' => $Bab->judul_contoh_kode ?? '',
                'bahasaPemrograman' => $Bab->bahasa_pemrograman ?? '',
                'bahasa_pemrograman' => $Bab->bahasa_pemrograman ?? '',
                'contohKode' => $Bab->contoh_kode ?? $Bab->code_example ?? '',
                'contoh_kode' => $Bab->contoh_kode ?? $Bab->code_example ?? '',
                'penjelasanKode' => $Bab->penjelasan_kode ?? '',
                'penjelasan_kode' => $Bab->penjelasan_kode ?? '',
                'durationMinutes' => $Bab->duration_minutes ?: 45,
                'status' => $ProgressLama?->status ?? 'in_progress',
                'progressPercentage' => $ProgressLama?->progress_percentage ?? 0,
            ],
        ]);
    }

    public function updateProgress(Request $request, int $id): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $flow = $this->buildLearningFlow();
        if ($flow instanceof JsonResponse) {
            return $flow;
        }

        $flowChapter = collect($flow['chapters'])->firstWhere('id', $id);
        if (! $flowChapter || ! $flowChapter['chapter_unlocked']) {
            return $this->fail('BabLama ini masih terkunci. Selesaikan BabLama dan latihan sebelumnya terlebih dahulu.', null, 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:not_started,in_progress,completed'],
            'progress_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);
        $percentage = $validated['status'] === 'completed' ? 100 : ($validated['progress_percentage'] ?? 0);

        $ProgressLama = ProgressBab::updateOrCreate(
            ['user_id' => $student->id, 'chapter_id' => $id],
            [
                'status' => $validated['status'],
                'progress_percentage' => $percentage,
                'completed_at' => $validated['status'] === 'completed' ? Carbon::now() : null,
            ],
        );

        return $this->ok($ProgressLama, 'ProgressLama berhasil disimpan');
    }

    public function complete(int $id): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $flow = $this->buildLearningFlow();
        if ($flow instanceof JsonResponse) {
            return $flow;
        }

        $flowChapter = collect($flow['chapters'])->firstWhere('id', $id);
        if (! $flowChapter || ! $flowChapter['chapter_unlocked']) {
            return $this->fail('BabLama ini masih terkunci.', null, 403);
        }

        ProgressBab::updateOrCreate(
            ['user_id' => $student->id, 'chapter_id' => $id],
            [
                'status' => 'completed',
                'progress_percentage' => 100,
                'completed_at' => Carbon::now(),
            ],
        );

        $exerciseId = $flowChapter['exercise']['id'] ?? null;

        return $this->ok([
            'chapter_status' => 'completed',
            'next_action' => $exerciseId ? 'exercise' : 'materials',
            'exercise_id' => $exerciseId,
        ], 'BabLama berhasil diselesaikan. Latihan BabLama ini sudah terbuka.');
    }

    private function buildLearningFlow(): array|JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $materials = Materi::with([
            'finalExam.questions',
            'chapters' => function ($query) {
                $query->whereIn('status', ['published', 'active'])
                    ->with(['exercises' => fn ($exerciseQuery) => $exerciseQuery->where('type', 'chapter')->where('status', 'active')->orderBy('id')])
                    ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
                    ->orderBy('id');
            },
        ])
            ->whereIn('status', ['publish', 'published', 'active'])
            ->orderByDesc('created_at')
            ->get()
            ->values();
        $chapters = $materials->flatMap(fn (Materi $Materi) => $Materi->chapters)->values();
        $ProgressLama = ProgressBab::where('user_id', $student->id)
            ->whereIn('chapter_id', $chapters->pluck('id'))
            ->get()
            ->keyBy('chapter_id');
        $exercises = $chapters
            ->mapWithKeys(fn (Bab $Bab) => [$Bab->id => $Bab->exercises->first()])
            ->filter();
        $attempts = RiwayatLatihan::where('user_id', $student->id)
            ->whereIn('exercise_id', $exercises->pluck('id'))
            ->latest()
            ->get()
            ->unique('exercise_id')
            ->keyBy('exercise_id');
        $attemptGroups = RiwayatLatihan::where('user_id', $student->id)
            ->whereIn('exercise_id', $exercises->pluck('id'))
            ->get()
            ->groupBy('exercise_id');

        $materialItems = $materials->map(function (Materi $Materi) use ($ProgressLama, $exercises, $attempts, $attemptGroups) {
            $chapterItems = $Materi->chapters->values()->map(function (Bab $Bab, int $index) use ($Materi, $ProgressLama, $exercises, $attempts, $attemptGroups) {
                $ProgressBab = $ProgressLama->get($Bab->id);
                $chapterStatus = $ProgressBab?->status ?? 'not_started';
                $previousChapter = $index > 0 ? $Materi->chapters->values()->get($index - 1) : null;
                $previousExerciseSubmitted = false;

                if ($previousChapter) {
                    $previousExercise = $exercises->get($previousChapter->id);
                    if ($previousExercise) {
                        $previousExerciseSubmitted = (bool) $attempts->get($previousExercise->id);
                    }
                }

                $previousChapterCompleted = false;

                if ($previousChapter) {
                    $previousProgress = $ProgressLama->get($previousChapter->id);
                    $previousChapterCompleted = $previousProgress?->status === 'completed';
                }

                $chapterUnlocked = $index === 0 || ($previousChapterCompleted && $previousExerciseSubmitted);
                $Latihan = $exercises->get($Bab->id);
                $attempt = $Latihan ? $attempts->get($Latihan->id) : null;
                $exerciseAttempts = $Latihan ? $attemptGroups->get($Latihan->id, collect()) : collect();
                $exerciseSubmitted = (bool) $attempt;
                $exerciseUnlocked = $chapterStatus === 'completed';

                return [
                    'id' => $Bab->id,
                    'material_id' => $Materi->id,
                    'materi_id' => $Bab->materi_id ?? $Materi->id,
                    'material_title' => $Materi->title,
                    'order' => $this->chapterOrderValue($Bab),
                    'title' => $Bab->title,
                    'description' => $Bab->description ?? '',
                    'content' => $Bab->content ?? '',
                    'videoType' => $Bab->video_type,
                    'video_type' => $Bab->video_type,
                    'videoUrl' => $Bab->video_url ?? '',
                    'video_url' => $Bab->video_url ?? '',
                    'videoFileUrl' => $Bab->video_file ? asset('storage/' . $Bab->video_file) : null,
                    'video_file_url' => $Bab->video_file ? asset('storage/' . $Bab->video_file) : null,
                    'codeExample' => $Bab->code_example ?? '',
                    'judulContohKode' => $Bab->judul_contoh_kode ?? '',
                    'judul_contoh_kode' => $Bab->judul_contoh_kode ?? '',
                    'bahasaPemrograman' => $Bab->bahasa_pemrograman ?? '',
                    'bahasa_pemrograman' => $Bab->bahasa_pemrograman ?? '',
                    'contohKode' => $Bab->contoh_kode ?? $Bab->code_example ?? '',
                    'contoh_kode' => $Bab->contoh_kode ?? $Bab->code_example ?? '',
                    'penjelasanKode' => $Bab->penjelasan_kode ?? '',
                    'penjelasan_kode' => $Bab->penjelasan_kode ?? '',
                    'duration_minutes' => $Bab->duration_minutes ?: 45,
                    'chapter_status' => $chapterStatus,
                    'chapter_unlocked' => $chapterUnlocked,
                    'exercise' => $Latihan ? [
                        'id' => $Latihan->id,
                        'title' => $Latihan->title ?: 'Latihan ' . $Bab->title,
                        'total_questions' => $Latihan->questions->count() ?: $Latihan->total_questions,
                        'status' => $attempt ? 'submitted' : 'not_started',
                        'score' => $attempt ? (float) $attempt->score : null,
                        'last_score' => $attempt ? (float) $attempt->score : null,
                        'highest_score' => $exerciseAttempts->count() ? (float) $exerciseAttempts->max('score') : null,
                        'attempt_count' => $exerciseAttempts->count(),
                        'unlocked' => $exerciseUnlocked,
                        'submitted' => (bool) $exerciseSubmitted,
                    ] : null,
                ];
            });

            $chapterItems = $chapterItems->values();
            $completedChapters = $chapterItems->where('chapter_status', 'completed')->count();
            $exerciseItems = $chapterItems->filter(fn (array $Bab) => (bool) $Bab['exercise']);
            $completedExercises = $exerciseItems->filter(fn (array $Bab) => (bool) ($Bab['exercise']['submitted'] ?? false))->count();
            $totalActivities = $chapterItems->count() + $exerciseItems->count();
            $completedActivities = $completedChapters + $completedExercises;
            $finalExam = $Materi->finalExam;
            $finalExamUnlocked = $chapterItems->count() > 0
                && $completedChapters >= $chapterItems->count()
                && $completedExercises >= $exerciseItems->count()
                && $exerciseItems->count() > 0;

            return [
                'id' => $Materi->id,
                'title' => $Materi->title,
                'description' => $Materi->description ?? '',
                'thumbnail' => $Materi->thumbnail,
                'chapters' => $chapterItems,
                'progress' => [
                    'completed_chapters' => $completedChapters,
                    'total_chapters' => $chapterItems->count(),
                    'completed_exercises' => $completedExercises,
                    'total_exercises' => $exerciseItems->count(),
                    'completed_activities' => $completedActivities,
                    'total_activities' => $totalActivities,
                    'percentage' => $totalActivities > 0 ? (int) round(($completedActivities / $totalActivities) * 100) : 0,
                ],
                'final_exam' => $finalExam ? [
                    'id' => $finalExam->id,
                    'title' => $finalExam->title,
                    'total_questions' => $finalExam->questions->count() ?: $finalExam->total_questions,
                    'duration_minutes' => $finalExam->duration_minutes ?: 30,
                    'status' => $finalExam->status,
                    'unlocked' => $finalExamUnlocked,
                    'reason' => $finalExamUnlocked ? null : 'Selesaikan semua BabLama dan latihan per BabLama pada MateriLama ini terlebih dahulu',
                ] : null,
            ];
        });
        $items = $materialItems->flatMap(fn (array $Materi) => $Materi['chapters'])->values();

        $allChaptersCompleted = $items->every(fn (array $item) => $item['chapter_status'] === 'completed');
        $allExercisesSubmitted = $items->every(fn (array $item) => $item['exercise'] && $item['exercise']['submitted']);
        $finalUnlocked = $allChaptersCompleted && $allExercisesSubmitted;

        return [
            'materials' => $materialItems,
            'chapters' => $items,
            'final_exam' => [
                'unlocked' => $finalUnlocked,
                'reason' => $finalUnlocked
                    ? null
                    : 'Selesaikan semua BabLama dan latihan per BabLama terlebih dahulu',
            ],
        ];
    }

    private function chapterOrderValue(Bab $Bab): int
    {
        $orderNumber = (int) ($Bab->order_number ?? 0);
        $chapterOrder = (int) ($Bab->chapter_order ?? 0);

        return $orderNumber > 0 ? $orderNumber : ($chapterOrder > 0 ? $chapterOrder : $Bab->id);
    }
}
