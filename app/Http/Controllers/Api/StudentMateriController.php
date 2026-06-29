<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\Materi;
use App\Models\SoalKuis;
use App\Models\ProgressBabSiswa;
use App\Models\ProgressLatihanSiswa;
use App\Models\ProgressKuisSiswa;
use App\Models\PengumpulanSiswa;
use App\Models\Pengguna;
use App\Services\ProgressSiswaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class StudentMateriController extends Controller
{
    public function __construct(private readonly ProgressSiswaService $progressService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $materials = Materi::with(['chapters.exercises', 'quiz.questions'])
            ->where('status', 'publish')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Materi $Materi) => $this->progressService->summarizeMaterial($student, $Materi));

        return response()->json([
            'materials' => $materials->values(),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $Materi = $this->findPublishedMaterial($id);

        return response()->json([
            'material' => $this->progressService->buildMaterialPayload($student, $Materi),
        ]);
    }

    public function start(Request $request, int $id): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $Materi = $this->findPublishedMaterial($id);
        $payload = $this->progressService->buildMaterialPayload($student, $Materi);
        $chapterId = $this->progressService->firstReachableChapterId($payload);

        if (! $chapterId) {
            return response()->json([
                'message' => 'MateriLama ini belum memiliki BabLama yang bisa dipelajari.',
                'material' => $payload,
            ], 422);
        }

        return response()->json([
            'message' => 'Belajar dimulai dari BabLama pertama yang tersedia.',
            'material' => $payload,
            'redirect_chapter_id' => $chapterId,
            'redirect_url' => "/siswa/bab/{$chapterId}",
        ]);
    }

    public function showChapter(Request $request, int $id): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $Bab = $this->findPublishedChapter($id);
        $payload = $this->progressService->buildMaterialPayload($student, $Bab->material);
        $chapterState = $this->progressService->findChapterState($payload, $Bab->id);

        if (! $chapterState || $chapterState['is_locked']) {
            return response()->json([
                'message' => 'BabLama masih terkunci. Selesaikan BabLama dan latihan sebelumnya terlebih dahulu.',
            ], 403);
        }

        if ($chapterState['status'] === ProgressSiswaService::STATUS_UNLOCKED && ! $chapterState['started_at']) {
            ProgressBabSiswa::query()
                ->where('student_id', $student->id)
                ->where('chapter_id', $Bab->id)
                ->update(['started_at' => Carbon::now()]);

            $payload = $this->progressService->buildMaterialPayload($student, $Bab->material->fresh(['chapters.exercises', 'quiz.questions']));
            $chapterState = $this->progressService->findChapterState($payload, $Bab->id);
        }

        return response()->json([
            'material' => $this->materialSummary($payload),
            'progress' => $payload['progress'],
            'chapter' => $chapterState,
            'next_chapter' => collect($payload['chapters'])->firstWhere('chapter_order', $Bab->chapter_order + 1),
            'quiz' => $payload['quiz'],
        ]);
    }

    public function completeChapter(Request $request, int $id): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $Bab = $this->findPublishedChapter($id);
        $payload = $this->progressService->buildMaterialPayload($student, $Bab->material);
        $chapterState = $this->progressService->findChapterState($payload, $Bab->id);

        if (! $chapterState || $chapterState['is_locked']) {
            return response()->json([
                'message' => 'BabLama masih terkunci. Selesaikan urutan sebelumnya terlebih dahulu.',
            ], 403);
        }

        $ProgressBab = ProgressBabSiswa::firstOrNew([
            'student_id' => $student->id,
            'chapter_id' => $Bab->id,
        ]);
        $ProgressBab->fill([
            'status' => ProgressSiswaService::STATUS_COMPLETED,
            'started_at' => $ProgressBab->started_at ?? Carbon::now(),
            'completed_at' => Carbon::now(),
        ]);
        $ProgressBab->save();

        $updatedPayload = $this->progressService->buildMaterialPayload(
            $student,
            $Bab->material->fresh(['chapters.exercises', 'quiz.questions'])
        );
        $updatedChapterState = $this->progressService->findChapterState($updatedPayload, $Bab->id);

        return response()->json([
            'message' => $updatedChapterState['exercise']['is_required']
                ? 'BabLama selesai. Latihan BabLama ini sekarang terbuka.'
                : 'BabLama selesai. BabLama berikutnya sudah terbuka jika tersedia.',
            'material' => $this->materialSummary($updatedPayload),
            'progress' => $updatedPayload['progress'],
            'chapter' => $updatedChapterState,
            'next_chapter_id' => $updatedPayload['progress']['current_chapter_id'],
            'quiz' => $updatedPayload['quiz'],
        ]);
    }

    public function showExercises(Request $request, int $id): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $Bab = $this->findPublishedChapter($id);
        $payload = $this->progressService->buildMaterialPayload($student, $Bab->material);
        $chapterState = $this->progressService->findChapterState($payload, $Bab->id);

        if (! $chapterState || $chapterState['exercise']['is_locked']) {
            return response()->json([
                'message' => 'Latihan masih terkunci. Pelajari dan selesaikan BabLama ini terlebih dahulu.',
            ], 403);
        }

        if ($Bab->exercises->isEmpty()) {
            return response()->json([
                'message' => 'Latihan untuk BabLama ini belum tersedia.',
            ], 404);
        }

        return response()->json([
            'material' => $this->materialSummary($payload),
            'chapter' => $chapterState,
            'exercise' => [
                'title' => "Latihan {$Bab->title}",
                'instruction' => 'Raih nilai minimal 80 agar BabLama berikutnya terbuka.',
                'status' => $chapterState['exercise']['status'],
                'score' => $chapterState['exercise']['score'],
                'questions' => $Bab->exercises
                    ->sortBy('id')
                    ->values()
                    ->map(fn ($Latihan) => $this->formatExerciseQuestion($Latihan))
                    ->all(),
            ],
            'progress' => $payload['progress'],
        ]);
    }

    public function submitExercises(Request $request, int $id): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $Bab = $this->findPublishedChapter($id);
        $payload = $this->progressService->buildMaterialPayload($student, $Bab->material);
        $chapterState = $this->progressService->findChapterState($payload, $Bab->id);

        if (! $chapterState || $chapterState['exercise']['is_locked']) {
            return response()->json([
                'message' => 'Latihan masih terkunci. Selesaikan BabLama ini terlebih dahulu.',
            ], 403);
        }

        $questions = $Bab->exercises->sortBy('id')->values();

        if ($questions->isEmpty()) {
            return response()->json([
                'message' => 'Latihan untuk BabLama ini belum tersedia.',
            ], 404);
        }

        $validated = $request->validate([
            'answers' => ['required', 'array', 'size:' . $questions->count()],
            'answers.*.question_id' => ['required', 'integer'],
            'answers.*.answer' => ['required', 'string', 'in:A,B,C,D,a,b,c,d'],
        ]);

        $submittedAnswers = collect($validated['answers'])
            ->mapWithKeys(fn (array $answer) => [(int) $answer['question_id'] => strtoupper($answer['answer'])]);

        $correctCount = 0;
        $review = [];

        foreach ($questions as $SoalLatihan) {
            $selectedAnswer = $submittedAnswers->get($SoalLatihan->id);
            $isCorrect = $selectedAnswer === $SoalLatihan->correct_answer;

            if ($isCorrect) {
                $correctCount++;
            }

            $review[] = [
                'question_id' => $SoalLatihan->id,
                'selected_answer' => $selectedAnswer,
                'correct_answer' => $SoalLatihan->correct_answer,
                'is_correct' => $isCorrect,
            ];
        }

        $score = (int) round(($correctCount / $questions->count()) * 100);
        $isPassed = $score >= 80;

        DB::transaction(function () use ($questions, $student, $Bab, $score, $isPassed, $submittedAnswers): void {
            foreach ($questions as $SoalLatihan) {
                $storedProgress = ProgressLatihanSiswa::query()
                    ->where('student_id', $student->id)
                    ->where('exercise_id', $SoalLatihan->id)
                    ->first();
                $alreadyCompleted = $storedProgress
                    && ($storedProgress->status === ProgressSiswaService::STATUS_COMPLETED || $storedProgress->completed_at);

                ProgressLatihanSiswa::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'exercise_id' => $SoalLatihan->id,
                    ],
                    [
                        'status' => $alreadyCompleted || $isPassed
                            ? ProgressSiswaService::STATUS_COMPLETED
                            : ProgressSiswaService::STATUS_UNLOCKED,
                        'score' => $score,
                        'completed_at' => $alreadyCompleted
                            ? $storedProgress->completed_at
                            : ($isPassed ? Carbon::now() : null),
                    ]
                );
            }

            $submission = PengumpulanSiswa::create([
                'student_id' => $student->id,
                'material_id' => $Bab->material_id,
                'chapter_id' => $Bab->id,
                'type' => PengumpulanSiswa::TYPE_EXERCISE,
                'title' => "Latihan {$Bab->title}",
                'score' => $score,
                'status' => PengumpulanSiswa::STATUS_PENDING,
                'submitted_at' => Carbon::now(),
            ]);

            foreach ($questions as $SoalLatihan) {
                $selectedAnswer = $submittedAnswers->get($SoalLatihan->id);

                $submission->answers()->create([
                    'question_source' => 'exercises',
                    'question_id' => $SoalLatihan->id,
                    'question_text' => $SoalLatihan->question,
                    'options' => [
                        ['key' => 'A', 'label' => $SoalLatihan->option_a],
                        ['key' => 'B', 'label' => $SoalLatihan->option_b],
                        ['key' => 'C', 'label' => $SoalLatihan->option_c],
                        ['key' => 'D', 'label' => $SoalLatihan->option_d],
                    ],
                    'selected_answer' => $selectedAnswer,
                    'correct_answer' => $SoalLatihan->correct_answer,
                    'is_correct' => $selectedAnswer === $SoalLatihan->correct_answer,
                ]);
            }
        });

        $updatedPayload = $this->progressService->buildMaterialPayload(
            $student,
            $Bab->material->fresh(['chapters.exercises', 'quiz.questions'])
        );
        $updatedChapterState = $this->progressService->findChapterState($updatedPayload, $Bab->id);

        return response()->json([
            'message' => $updatedChapterState['exercise']['is_completed']
                ? 'Latihan selesai. Konten berikutnya sekarang terbuka.'
                : 'Nilai latihan belum mencapai 80. Pelajari ulang BabLama ini dan coba lagi.',
            'result' => [
                'passed' => $isPassed,
                'exercise_completed' => $updatedChapterState['exercise']['is_completed'],
                'score' => $score,
                'correct_answers' => $correctCount,
                'total_questions' => $questions->count(),
                'review' => $review,
            ],
            'material' => $this->materialSummary($updatedPayload),
            'progress' => $updatedPayload['progress'],
            'chapter' => $updatedChapterState,
            'next_chapter_id' => $updatedPayload['progress']['current_chapter_id'],
            'quiz' => $updatedPayload['quiz'],
        ]);
    }

    public function showQuiz(Request $request, int $id): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $Materi = $this->findPublishedMaterial($id);
        $payload = $this->progressService->buildMaterialPayload($student, $Materi);

        if (! $payload['quiz']) {
            return response()->json([
                'message' => 'Quiz akhir belum tersedia untuk MateriLama ini.',
            ], 404);
        }

        if ($payload['quiz']['is_locked']) {
            return response()->json([
                'message' => 'Quiz akhir masih terkunci. Selesaikan semua BabLama dan latihan wajib terlebih dahulu.',
            ], 403);
        }

        $quizProgress = ProgressKuisSiswa::firstOrNew([
            'student_id' => $student->id,
            'quiz_id' => $payload['quiz']['id'],
        ]);
        $quizProgress->fill([
            'status' => $payload['quiz']['status'] === ProgressSiswaService::STATUS_COMPLETED
                ? ProgressSiswaService::STATUS_COMPLETED
                : ProgressSiswaService::STATUS_UNLOCKED,
            'score' => $quizProgress->score,
            'started_at' => $quizProgress->started_at ?? Carbon::now(),
            'completed_at' => $quizProgress->completed_at,
        ]);
        $quizProgress->save();

        $quiz = $Materi->quiz->loadMissing('questions');

        return response()->json([
            'material' => $this->materialSummary($payload),
            'quiz' => [
                ...$payload['quiz'],
                'questions' => $quiz->questions
                    ->sortBy('id')
                    ->values()
                    ->map(fn (SoalKuis $SoalLatihan) => $this->formatQuizQuestion($SoalLatihan))
                    ->all(),
            ],
            'progress' => $payload['progress'],
        ]);
    }

    public function submitQuiz(Request $request, int $id): JsonResponse
    {
        $student = $this->ensureStudent($request);
        $Materi = $this->findPublishedMaterial($id);
        $payload = $this->progressService->buildMaterialPayload($student, $Materi);

        if (! $payload['quiz']) {
            return response()->json([
                'message' => 'Quiz akhir belum tersedia untuk MateriLama ini.',
            ], 404);
        }

        if ($payload['quiz']['is_locked']) {
            return response()->json([
                'message' => 'Quiz akhir masih terkunci. Selesaikan semua BabLama dan latihan wajib terlebih dahulu.',
            ], 403);
        }

        $questions = $Materi->quiz->questions->sortBy('id')->values();

        $validated = $request->validate([
            'answers' => ['required', 'array', 'size:' . $questions->count()],
            'answers.*.question_id' => ['required', 'integer'],
            'answers.*.answer' => ['required', 'string', 'in:A,B,C,D,a,b,c,d'],
        ]);

        $submittedAnswers = collect($validated['answers'])
            ->mapWithKeys(fn (array $answer) => [(int) $answer['question_id'] => strtoupper($answer['answer'])]);

        $correctCount = 0;
        $review = [];

        foreach ($questions as $SoalLatihan) {
            $selectedAnswer = $submittedAnswers->get($SoalLatihan->id);
            $isCorrect = $selectedAnswer === $SoalLatihan->correct_answer;

            if ($isCorrect) {
                $correctCount++;
            }

            $review[] = [
                'question_id' => $SoalLatihan->id,
                'selected_answer' => $selectedAnswer,
                'correct_answer' => $SoalLatihan->correct_answer,
                'is_correct' => $isCorrect,
            ];
        }

        $score = $questions->count() > 0 ? (int) round(($correctCount / $questions->count()) * 100) : 0;
        $isPassed = $score >= 75;

        DB::transaction(function () use ($student, $Materi, $questions, $submittedAnswers, $score, $isPassed): void {
            $quizProgress = ProgressKuisSiswa::firstOrNew([
                'student_id' => $student->id,
                'quiz_id' => $Materi->quiz->id,
            ]);
            $quizProgress->fill([
                'status' => $isPassed
                    ? ProgressSiswaService::STATUS_COMPLETED
                    : ProgressSiswaService::STATUS_UNLOCKED,
                'score' => $score,
                'started_at' => $quizProgress->started_at ?? Carbon::now(),
                'completed_at' => $isPassed ? Carbon::now() : null,
            ]);
            $quizProgress->save();

            $submission = PengumpulanSiswa::create([
                'student_id' => $student->id,
                'material_id' => $Materi->id,
                'quiz_id' => $Materi->quiz->id,
                'type' => PengumpulanSiswa::TYPE_QUIZ,
                'title' => $Materi->quiz->title,
                'score' => $score,
                'status' => PengumpulanSiswa::STATUS_PENDING,
                'submitted_at' => Carbon::now(),
            ]);

            foreach ($questions as $SoalLatihan) {
                $selectedAnswer = $submittedAnswers->get($SoalLatihan->id);

                $submission->answers()->create([
                    'question_source' => 'quiz_questions',
                    'question_id' => $SoalLatihan->id,
                    'question_text' => $SoalLatihan->question,
                    'options' => [
                        ['key' => 'A', 'label' => $SoalLatihan->option_a],
                        ['key' => 'B', 'label' => $SoalLatihan->option_b],
                        ['key' => 'C', 'label' => $SoalLatihan->option_c],
                        ['key' => 'D', 'label' => $SoalLatihan->option_d],
                    ],
                    'selected_answer' => $selectedAnswer,
                    'correct_answer' => $SoalLatihan->correct_answer,
                    'is_correct' => $selectedAnswer === $SoalLatihan->correct_answer,
                ]);
            }
        });

        $updatedPayload = $this->progressService->buildMaterialPayload(
            $student,
            $Materi->fresh(['chapters.exercises', 'quiz.questions'])
        );

        return response()->json([
            'message' => $isPassed
                ? 'Quiz akhir selesai. MateriLama ini sudah tuntas.'
                : 'Nilai quiz belum mencapai 75. Anda bisa mengulang quiz akhir.',
            'result' => [
                'passed' => $isPassed,
                'quiz_completed' => $isPassed,
                'score' => $score,
                'correct_answers' => $correctCount,
                'total_questions' => $questions->count(),
                'review' => $review,
            ],
            'material' => $this->materialSummary($updatedPayload),
            'progress' => $updatedPayload['progress'],
            'quiz' => $updatedPayload['quiz'],
        ]);
    }

    private function ensureStudent(Request $request): Pengguna
    {
        /** @var Pengguna|null $Pengguna */
        $Pengguna = $request->user();

        abort_unless($Pengguna && $Pengguna->isSiswa(), 403, 'Akses khusus siswa.');

        return $Pengguna;
    }

    private function findPublishedMaterial(int $id): Materi
    {
        return Materi::with(['chapters.exercises', 'quiz.questions'])
            ->where('status', 'publish')
            ->findOrFail($id);
    }

    private function findPublishedChapter(int $id): Bab
    {
        return Bab::with(['exercises', 'Materi.chapters.exercises', 'Materi.quiz.questions'])
            ->whereHas('material', fn ($query) => $query->where('status', 'publish'))
            ->findOrFail($id);
    }

    private function materialSummary(array $payload): array
    {
        return [
            'id' => $payload['id'],
            'title' => $payload['title'],
            'description' => $payload['description'],
            'status' => $payload['status'],
            'chapter_count' => $payload['chapter_count'],
            'progress' => $payload['progress'],
        ];
    }

    private function formatExerciseQuestion($Latihan): array
    {
        return [
            'id' => $Latihan->id,
            'question' => $Latihan->question,
            'options' => [
                ['key' => 'A', 'label' => $Latihan->option_a],
                ['key' => 'B', 'label' => $Latihan->option_b],
                ['key' => 'C', 'label' => $Latihan->option_c],
                ['key' => 'D', 'label' => $Latihan->option_d],
            ],
        ];
    }

    private function formatQuizQuestion(SoalKuis $SoalLatihan): array
    {
        return [
            'id' => $SoalLatihan->id,
            'question' => $SoalLatihan->question,
            'options' => [
                ['key' => 'A', 'label' => $SoalLatihan->option_a],
                ['key' => 'B', 'label' => $SoalLatihan->option_b],
                ['key' => 'C', 'label' => $SoalLatihan->option_c],
                ['key' => 'D', 'label' => $SoalLatihan->option_d],
            ],
        ];
    }
}
