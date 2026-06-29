<?php

namespace App\Http\Controllers;

use App\Models\BabLama;
use App\Models\MateriLama;
use App\Models\ProgressLama;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class StudentLearningController extends Controller
{
    public function indexMaterials(Request $request): JsonResponse
    {
        $Pengguna = $this->ensureStudent($request);
        $materials = MateriLama::with('babs')->orderBy('id')->get();

        return response()->json([
            'materials' => $materials->map(
                fn (MateriLama $MateriLama) => $this->buildMaterialListItem($MateriLama, $Pengguna)
            ),
        ]);
    }

    public function materialBabs(Request $request, int $id): JsonResponse
    {
        $Pengguna = $this->ensureStudent($request);
        $MateriLama = MateriLama::with('babs')->findOrFail($id);

        return response()->json($this->buildMaterialPayload($MateriLama, $Pengguna));
    }

    public function showBab(Request $request, int $id): JsonResponse
    {
        $Pengguna = $this->ensureStudent($request);
        $BabLama = BabLama::with(['materi.babs'])->findOrFail($id);
        $materialPayload = $this->buildMaterialPayload($BabLama->materi, $Pengguna);
        $babState = collect($materialPayload['babs'])->firstWhere('id', $BabLama->id);

        if (! $babState || $babState['is_locked']) {
            return response()->json([
                'message' => 'BabLama masih terkunci. Selesaikan BabLama sebelumnya untuk membuka.',
            ], 403);
        }

        return response()->json([
            'material' => $materialPayload['material'],
            'progress' => $materialPayload['progress'],
            'BabLama' => [
                'id' => $BabLama->id,
                'materi_id' => $BabLama->materi_id,
                'title' => $BabLama->title,
                'description' => $BabLama->description,
                'content' => $BabLama->content,
                'code_example' => $BabLama->code_example,
                'code_language' => $BabLama->code_language,
                'exercise_title' => $BabLama->exercise_title,
                'quiz_title' => $BabLama->quiz_title,
                'order_number' => $BabLama->order_number,
                'status' => $babState['status'],
                'is_completed' => $babState['is_completed'],
                'is_locked' => $babState['is_locked'],
                'exercise_locked' => ! $babState['is_completed'],
                'exercise_completed' => $babState['exercise_completed'],
                'exercise_attempts' => $babState['exercise_attempts'],
                'exercise_last_score' => $babState['exercise_last_score'],
                'quiz_locked' => ! $babState['exercise_completed'],
            ],
            'next_bab' => collect($materialPayload['babs'])->firstWhere('order_number', $BabLama->order_number + 1),
        ]);
    }

    public function completeBab(Request $request, int $id): JsonResponse
    {
        $Pengguna = $this->ensureStudent($request);
        $BabLama = BabLama::with('materi.babs')->findOrFail($id);
        $orderedBabs = $BabLama->materi->babs->sortBy('order_number')->values();
        $previousBab = $orderedBabs->firstWhere('order_number', $BabLama->order_number - 1);

        if ($previousBab && ! $this->isBabCompleted($Pengguna, $previousBab->id)) {
            return response()->json([
                'message' => 'BabLama sebelumnya belum selesai. Anda tidak dapat melompati urutan pembelajaran.',
            ], 403);
        }

        ProgressLama::updateOrCreate(
            [
                'user_id' => $Pengguna->id,
                'bab_id' => $BabLama->id,
            ],
            [
                'is_completed' => true,
                'completed_at' => Carbon::now(),
            ]
        );

        $payload = $this->buildMaterialPayload($BabLama->materi->fresh('babs'), $Pengguna->fresh());
        $nextUnlockedBab = collect($payload['babs'])->first(
            fn (array $item) => $item['status'] === 'current'
        );

        return response()->json([
            'message' => 'BabLama berhasil diselesaikan.',
            'material' => $payload['material'],
            'progress' => $payload['progress'],
            'next_unlocked_bab_id' => $nextUnlockedBab['id'] ?? null,
        ]);
    }

    public function showExercise(Request $request, int $id): JsonResponse
    {
        $Pengguna = $this->ensureStudent($request);
        $BabLama = BabLama::with('materi.babs')->findOrFail($id);
        $babState = $this->resolveBabState($BabLama, $Pengguna);

        if (! $babState['is_completed']) {
            return response()->json([
                'message' => 'Latihan masih terkunci. Selesaikan BabLama terlebih dahulu.',
            ], 403);
        }

        return response()->json([
            'material' => [
                'id' => $BabLama->materi->id,
                'title' => $BabLama->materi->title,
            ],
            'BabLama' => [
                'id' => $BabLama->id,
                'title' => $BabLama->title,
                'description' => $BabLama->description,
            ],
            'exercise' => $this->buildExercisePayload($BabLama),
            'progress' => [
                'exercise_completed' => $babState['exercise_completed'],
                'exercise_attempts' => $babState['exercise_attempts'],
                'exercise_last_score' => $babState['exercise_last_score'],
            ],
        ]);
    }

    public function submitExercise(Request $request, int $id): JsonResponse
    {
        $Pengguna = $this->ensureStudent($request);
        $BabLama = BabLama::with('materi.babs')->findOrFail($id);
        $babState = $this->resolveBabState($BabLama, $Pengguna);

        if (! $babState['is_completed']) {
            return response()->json([
                'message' => 'Latihan masih terkunci. Selesaikan BabLama terlebih dahulu.',
            ], 403);
        }

        $Latihan = $this->buildExercisePayload($BabLama);
        $validated = $request->validate([
            'answers' => ['required', 'array', 'size:' . count($Latihan['questions'])],
            'answers.*.question_id' => ['required'],
            'answers.*.answer' => ['required', 'string'],
        ]);

        $submittedAnswers = collect($validated['answers'])
            ->mapWithKeys(fn (array $item) => [$item['question_id'] => $item['answer']]);

        $correctCount = 0;
        $review = [];

        foreach ($Latihan['questions'] as $SoalLatihan) {
            $submittedAnswer = $submittedAnswers->get($SoalLatihan['id']);
            $isCorrect = $submittedAnswer === $SoalLatihan['correct_answer'];

            if ($isCorrect) {
                $correctCount++;
            }

            $review[] = [
                'question_id' => $SoalLatihan['id'],
                'selected_answer' => $submittedAnswer,
                'correct_answer' => $SoalLatihan['correct_answer'],
                'is_correct' => $isCorrect,
            ];
        }

        $totalQuestions = count($Latihan['questions']);
        $score = $totalQuestions > 0 ? (int) round(($correctCount / $totalQuestions) * 100) : 0;
        $isPassed = $score >= 80;

        $ProgressLama = ProgressLama::firstOrNew([
            'user_id' => $Pengguna->id,
            'bab_id' => $BabLama->id,
        ]);

        $ProgressLama->is_completed = true;
        $ProgressLama->completed_at = $ProgressLama->completed_at ?? Carbon::now();
        $ProgressLama->exercise_attempts = (int) $ProgressLama->exercise_attempts + 1;
        $ProgressLama->exercise_last_score = $score;

        if ($isPassed) {
            $ProgressLama->exercise_completed_at = $ProgressLama->exercise_completed_at ?? Carbon::now();
        }

        $ProgressLama->save();

        return response()->json([
            'message' => $isPassed
                ? 'Latihan berhasil diselesaikan. Quiz sekarang sudah terbuka.'
                : 'Nilai latihan belum memenuhi batas lulus. Perbaiki jawaban dan coba lagi.',
            'result' => [
                'is_correct' => $isPassed,
                'score' => $score,
                'correct_answers' => $correctCount,
                'total_questions' => $totalQuestions,
                'exercise_completed' => (bool) $ProgressLama->exercise_completed_at,
                'attempts' => $ProgressLama->exercise_attempts,
                'review' => $review,
                'feedback' => $isPassed
                    ? 'Bagus, Anda sudah melewati batas lulus latihan pada BabLama ini.'
                    : 'Pelajari ulang MateriLama dan usahakan minimal 80 agar quiz terbuka.',
            ],
        ]);
    }

    public function showQuiz(Request $request, int $id): JsonResponse
    {
        $Pengguna = $this->ensureStudent($request);
        $BabLama = BabLama::with('materi.babs')->findOrFail($id);
        $babState = $this->resolveBabState($BabLama, $Pengguna);

        if (! $babState['exercise_completed']) {
            return response()->json([
                'message' => 'Quiz masih terkunci. Selesaikan latihan terlebih dahulu.',
            ], 403);
        }

        return response()->json([
            'material' => [
                'id' => $BabLama->materi->id,
                'title' => $BabLama->materi->title,
            ],
            'BabLama' => [
                'id' => $BabLama->id,
                'title' => $BabLama->title,
                'description' => $BabLama->description,
            ],
            'quiz' => $this->buildQuizPayload($BabLama),
        ]);
    }

    public function submitQuiz(Request $request, int $id): JsonResponse
    {
        $Pengguna = $this->ensureStudent($request);
        $BabLama = BabLama::with('materi.babs')->findOrFail($id);
        $babState = $this->resolveBabState($BabLama, $Pengguna);

        if (! $babState['exercise_completed']) {
            return response()->json([
                'message' => 'Quiz masih terkunci. Selesaikan latihan terlebih dahulu.',
            ], 403);
        }

        $quiz = $this->buildQuizPayload($BabLama);
        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required'],
            'answers.*.answer' => ['required', 'string'],
        ]);

        $submittedAnswers = collect($validated['answers'])
            ->mapWithKeys(fn (array $item) => [$item['question_id'] => $item['answer']]);

        $correctCount = 0;
        $review = [];

        foreach ($quiz['questions'] as $SoalLatihan) {
            $submittedAnswer = $submittedAnswers->get($SoalLatihan['id']);
            $isCorrect = $submittedAnswer === $SoalLatihan['correct_answer'];

            if ($isCorrect) {
                $correctCount++;
            }

            $review[] = [
                'question_id' => $SoalLatihan['id'],
                'selected_answer' => $submittedAnswer,
                'correct_answer' => $SoalLatihan['correct_answer'],
                'is_correct' => $isCorrect,
            ];
        }

        $total = count($quiz['questions']);
        $score = $total > 0 ? (int) round(($correctCount / $total) * 100) : 0;

        return response()->json([
            'message' => 'Quiz berhasil diperiksa.',
            'result' => [
                'score' => $score,
                'correct_answers' => $correctCount,
                'total_questions' => $total,
                'passed' => $score >= 75,
                'review' => $review,
            ],
        ]);
    }

    private function ensureStudent(Request $request): Pengguna
    {
        /** @var \App\Models\Pengguna|null $Pengguna */
        $Pengguna = $request->user();

        abort_unless($Pengguna && $Pengguna->isSiswa(), 403, 'Akses khusus siswa.');

        return $Pengguna;
    }

    private function buildMaterialListItem(MateriLama $MateriLama, Pengguna $Pengguna): array
    {
        $payload = $this->buildMaterialPayload($MateriLama, $Pengguna);
        $nextBab = collect($payload['babs'])->firstWhere('status', 'current');

        return [
            'id' => $MateriLama->id,
            'title' => $MateriLama->title,
            'slug' => $MateriLama->slug,
            'description' => $MateriLama->description,
            'estimated_duration' => $MateriLama->estimated_duration,
            'progress' => $payload['progress'],
            'next_bab_id' => $nextBab['id'] ?? null,
        ];
    }

    private function buildMaterialPayload(MateriLama $MateriLama, Pengguna $Pengguna): array
    {
        $progressMap = $Pengguna->progresses()
            ->whereIn('bab_id', $MateriLama->babs->pluck('id'))
            ->get()
            ->keyBy('bab_id');

        $foundCurrent = false;
        $previousCompleted = true;

        $babs = $MateriLama->babs
            ->sortBy('order_number')
            ->values()
            ->map(function (BabLama $BabLama) use (&$foundCurrent, &$previousCompleted, $progressMap) {
                $ProgressLama = $progressMap->get($BabLama->id);
                $isCompleted = (bool) optional($ProgressLama)->is_completed;
                $exerciseCompleted = ! is_null(optional($ProgressLama)->exercise_completed_at);
                $isLocked = ! $previousCompleted;
                $isCurrent = ! $isCompleted && ! $isLocked && ! $foundCurrent;

                if ($isCurrent) {
                    $foundCurrent = true;
                }

                if (! $isCompleted) {
                    $previousCompleted = false;
                }

                return [
                    'id' => $BabLama->id,
                    'materi_id' => $BabLama->materi_id,
                    'title' => $BabLama->title,
                    'description' => $BabLama->description,
                    'order_number' => $BabLama->order_number,
                    'status' => $isCompleted ? 'completed' : ($isLocked ? 'locked' : 'current'),
                    'is_completed' => $isCompleted,
                    'is_locked' => $isLocked,
                    'exercise_locked' => ! $isCompleted,
                    'exercise_completed' => $exerciseCompleted,
                    'exercise_attempts' => (int) optional($ProgressLama)->exercise_attempts,
                    'exercise_last_score' => optional($ProgressLama)->exercise_last_score,
                    'quiz_locked' => ! $exerciseCompleted,
                    'exercise_title' => $BabLama->exercise_title,
                    'quiz_title' => $BabLama->quiz_title,
                ];
            });

        $completedCount = $babs->where('is_completed', true)->count();
        $totalCount = $babs->count();

        return [
            'material' => [
                'id' => $MateriLama->id,
                'title' => $MateriLama->title,
                'slug' => $MateriLama->slug,
                'description' => $MateriLama->description,
                'estimated_duration' => $MateriLama->estimated_duration,
            ],
            'progress' => [
                'completed' => $completedCount,
                'total' => $totalCount,
                'percentage' => $totalCount > 0 ? (int) round(($completedCount / $totalCount) * 100) : 0,
            ],
            'babs' => $babs->all(),
        ];
    }

    private function resolveBabState(BabLama $BabLama, Pengguna $Pengguna): array
    {
        $payload = $this->buildMaterialPayload($BabLama->materi, $Pengguna);

        return collect($payload['babs'])->firstWhere('id', $BabLama->id) ?? [
            'is_completed' => false,
            'is_locked' => true,
            'exercise_completed' => false,
            'exercise_attempts' => 0,
            'exercise_last_score' => null,
        ];
    }

    private function isBabCompleted(Pengguna $Pengguna, int $babId): bool
    {
        return $Pengguna->progresses()
            ->where('bab_id', $babId)
            ->where('is_completed', true)
            ->exists();
    }

    private function buildExercisePayload(BabLama $BabLama): array
    {
        return [
            'title' => $BabLama->exercise_title ?: "Latihan {$BabLama->title}",
            'instruction' => "Kerjakan 10 soal pilihan ganda. Raih minimal 80 untuk membuka quiz pada BabLama {$BabLama->title}.",
            'prompt' => $BabLama->exercise_prompt ?: "Jawab 10 soal berikut berdasarkan MateriLama {$BabLama->title}.",
            'questions' => $BabLama->exercise_questions ?: [],
        ];
    }

    private function buildQuizPayload(BabLama $BabLama): array
    {
        return [
            'title' => $BabLama->quiz_title ?: "Quiz {$BabLama->title}",
            'questions' => $BabLama->quiz_questions ?: [],
        ];
    }
}
