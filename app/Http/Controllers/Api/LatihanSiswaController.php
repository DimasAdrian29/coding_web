<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\ProgressBab;
use App\Models\Latihan;
use App\Models\RiwayatLatihan;
use App\Models\HasilLatihanAkhir;
use App\Models\Materi;
use App\Models\SoalLatihan;
use App\Models\PengumpulanLatihan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class LatihanSiswaController extends Controller
{
    use ApiLearningHelpers;

    public function index(Request $request): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $type = $request->query('type', 'chapter');
        $attempts = RiwayatLatihan::where('user_id', $student->id)
            ->orderByDesc('submitted_at')
            ->get()
            ->groupBy('exercise_id');
        $exercises = Latihan::with(['chapter', 'questions'])
            ->where('type', $type)
            ->where('status', 'active')
            ->orderBy('chapter_id')
            ->orderBy('id')
            ->get()
            ->map(function (Latihan $Latihan) use ($attempts) {
                $exerciseAttempts = $attempts->get($Latihan->id, collect());
                $latestAttempt = $exerciseAttempts->first();

                return [
                    'id' => $Latihan->id,
                    'title' => $Latihan->title ?: 'Latihan ' . ($Latihan->chapter?->title ?? ''),
                    'chapterTitle' => $Latihan->chapter?->title,
                    'questionCount' => $Latihan->questions->count() ?: $Latihan->total_questions,
                    'type' => 'Pilihan Ganda',
                    'status' => $latestAttempt ? 'completed' : 'not_started',
                    'score' => $latestAttempt ? (float) $latestAttempt->score : null,
                    'lastScore' => $latestAttempt ? (float) $latestAttempt->score : null,
                    'highestScore' => $exerciseAttempts->max('score') ? (float) $exerciseAttempts->max('score') : null,
                    'attemptCount' => $exerciseAttempts->count(),
                ];
            });

        return $this->ok(['exercises' => $exercises]);
    }

    public function show(int $id): JsonResponse
    {
        $Latihan = Latihan::with(['chapter.material', 'questions'])->find($id);

        if (! $Latihan) {
            return $this->fail('Data latihan tidak ditemukan', null, 404);
        }

        $student = $this->currentStudent();
        $chapterCompleted = $student && $Latihan->chapter_id
            ? ProgressBab::where('user_id', $student->id)
                ->where('chapter_id', $Latihan->chapter_id)
                ->where('status', 'completed')
                ->exists()
            : true;

        return $this->ok([
            'exercise' => $this->exerciseDetail($Latihan),
            'access' => [
                'unlocked' => $chapterCompleted,
                'reason' => $chapterCompleted ? null : 'Selesaikan MateriLama BabLama ini terlebih dahulu.',
            ],
        ]);
    }

    public function attempts(int $id): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        return $this->ok($this->attemptPayload($student->id, $id));
    }

    public function materialChapterExercises(int $materialId): JsonResponse
    {
        $student = $this->currentStudent();
        $Materi = Materi::find($materialId);

        if (! $student || ! $Materi) {
            return $this->fail('Data MateriLama tidak ditemukan', null, 404);
        }

        $chapters = Bab::with(['exercises' => fn ($query) => $query->where('type', 'chapter')->where('status', 'active')->with('questions')])
            ->where(function ($query) use ($materialId) {
                $query->where('material_id', $materialId)
                    ->orWhere('materi_id', $materialId);
            })
            ->whereIn('status', ['published', 'active'])
            ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
            ->orderBy('id')
            ->get();

        $exerciseIds = $chapters->flatMap(fn (Bab $Bab) => $Bab->exercises->pluck('id'))->values();
        $attemptGroups = RiwayatLatihan::where('user_id', $student->id)
            ->whereIn('exercise_id', $exerciseIds)
            ->whereNotNull('submitted_at')
            ->orderByDesc('submitted_at')
            ->get()
            ->groupBy('exercise_id');

        return $this->ok([
            'material' => [
                'id' => $Materi->id,
                'title' => $Materi->title,
            ],
            'exercises' => $chapters->flatMap(function (Bab $Bab) use ($Materi, $attemptGroups) {
                return $Bab->exercises->map(function (Latihan $Latihan) use ($Materi, $Bab, $attemptGroups) {
                    $attempts = $attemptGroups->get($Latihan->id, collect());
                    $latestAttempt = $attempts->first();

                    return [
                        'id' => $Latihan->id,
                        'title' => $Latihan->title ?: 'Latihan ' . $Bab->title,
                        'materialTitle' => $Materi->title,
                        'chapterTitle' => $Bab->title,
                        'questionCount' => $Latihan->questions->count() ?: $Latihan->total_questions,
                        'status' => 'open',
                        'attemptCount' => $attempts->count(),
                        'lastScore' => $latestAttempt ? (float) $latestAttempt->score : null,
                        'highestScore' => $attempts->count() ? (float) $attempts->max('score') : null,
                    ];
                });
            })->values(),
        ]);
    }

    public function submission(int $id): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $submission = RiwayatLatihan::where('user_id', $student->id)
            ->where('exercise_id', $id)
            ->latest()
            ->first();

        if (! $submission) {
            return $this->ok([
                'status' => 'not_submitted',
                'score' => null,
                'submitted_at' => null,
            ]);
        }

        return $this->ok([
            'status' => 'submitted',
            'score' => (float) $submission->score,
            'submitted_at' => optional($submission->submitted_at)->format('d M Y, H:i'),
        ]);
    }

    public function submit(Request $request, int $id): JsonResponse
    {
        $student = $this->currentStudent();
        $Latihan = Latihan::with('questions')->find($id);

        if (! $student || ! $Latihan) {
            return $this->fail('Data latihan tidak ditemukan', null, 404);
        }

        if ($Latihan->type === 'chapter') {
            $chapterCompleted = ProgressBab::where('user_id', $student->id)
                ->where('chapter_id', $Latihan->chapter_id)
                ->where('status', 'completed')
                ->exists();

            if (! $chapterCompleted) {
                return $this->fail('Selesaikan MateriLama BabLama ini terlebih dahulu sebelum mengerjakan latihan.', null, 403);
            }
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer'],
            'answers.*.selected_option' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
        ]);

        $answerMap = collect($validated['answers'])->keyBy(fn (array $answer) => (int) $answer['question_id']);
        $totalQuestions = $Latihan->questions->count();
        $correctAnswers = 0;

        $attempt = DB::transaction(function () use ($student, $Latihan, $answerMap, $totalQuestions, &$correctAnswers) {
            $attempt = RiwayatLatihan::create([
                'user_id' => $student->id,
                'exercise_id' => $Latihan->id,
                'total_questions' => $totalQuestions,
                'correct_answers' => 0,
                'wrong_answers' => 0,
                'score' => 0,
                'started_at' => Carbon::now(),
                'submitted_at' => Carbon::now(),
            ]);

            foreach ($Latihan->questions as $SoalLatihan) {
                $answer = $answerMap->get($SoalLatihan->id);
                $selected = $answer['selected_option'] ?? null;
                $isCorrect = $selected === $SoalLatihan->correct_answer;

                if ($isCorrect) {
                    $correctAnswers++;
                }

                $attempt->answers()->create([
                    'exercise_question_id' => $SoalLatihan->id,
                    'selected_answer' => $selected,
                    'is_correct' => $isCorrect,
                ]);
            }

            $wrongAnswers = max($totalQuestions - $correctAnswers, 0);
            $score = $totalQuestions > 0 ? round(($correctAnswers / $totalQuestions) * 100, 2) : 0;

            $attempt->update([
                'correct_answers' => $correctAnswers,
                'wrong_answers' => $wrongAnswers,
                'score' => $score,
            ]);

            return $attempt->fresh(['answers.question']);
        });

        $nextChapter = null;
        if ($Latihan->chapter) {
            $order = $this->chapterOrderValue($Latihan->chapter);
            $nextChapter = Bab::where('status', 'published')
                ->where(function ($query) use ($Latihan) {
                    $materialId = $Latihan->chapter?->materi_id ?? $Latihan->chapter?->material_id;

                    $query->where('material_id', $materialId)
                        ->orWhere('materi_id', $materialId);
                })
                ->whereRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) > ?', [$order])
                ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
                ->orderBy('id')
                ->first();
        }
        $currentMaterialId = $Latihan->chapter?->material_id ?? $Latihan->chapter?->materi_id;
        $finalExamAccess = $this->finalExamAccessData($student->id, $currentMaterialId);

        return $this->ok([
            'attempt' => $this->attemptRow($attempt, 1),
            'score' => (float) $attempt->score,
            'correctAnswers' => $attempt->correct_answers,
            'wrongAnswers' => $attempt->wrong_answers,
            'totalQuestions' => $attempt->total_questions,
            'submission_status' => 'submitted',
            'next_action' => $nextChapter ? 'chapter' : 'final_exam',
            'next_chapter_id' => $nextChapter?->id,
            'next_chapter_order' => $nextChapter ? $this->chapterOrderValue($nextChapter) : null,
            'final_exam_unlocked' => $finalExamAccess['unlocked'],
        ], $nextChapter ? 'Latihan selesai. Nilai otomatis sudah tersimpan dan BabLama berikutnya terbuka.' : 'Latihan selesai. Nilai otomatis sudah tersimpan.');
    }

    public function finalExam(): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $access = $this->finalExamAccessData($student->id);
        $exam = Latihan::with('questions')
            ->where('type', 'final_exam')
            ->where('status', 'active')
            ->latest()
            ->first();

        return $this->ok([
            'totalChapters' => $access['totalChapters'],
            'completedChapters' => $access['completedChapters'],
            'totalExercises' => $access['totalExercises'],
            'submittedExercises' => $access['submittedExercises'],
            'progressPercentage' => $access['progressPercentage'],
            'finalExamAvailable' => $access['unlocked'] && (bool) $exam,
            'reason' => $access['reason'],
            'exam' => $exam ? $this->exerciseDetail($exam) : null,
        ]);
    }

    public function materialFinalExam(int $materialId): JsonResponse
    {
        $student = $this->currentStudent();
        $Materi = Materi::find($materialId);

        if (! $student || ! $Materi) {
            return $this->fail('Data MateriLama tidak ditemukan', null, 404);
        }

        $access = $this->finalExamAccessData($student->id, $Materi->id);
        $exam = Latihan::with('questions')
            ->where('type', 'final_exam')
            ->where('material_id', $Materi->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        return $this->ok([
            'material' => [
                'id' => $Materi->id,
                'title' => $Materi->title,
            ],
            'totalChapters' => $access['totalChapters'],
            'completedChapters' => $access['completedChapters'],
            'totalExercises' => $access['totalExercises'],
            'submittedExercises' => $access['submittedExercises'],
            'progressPercentage' => $access['progressPercentage'],
            'finalExamAvailable' => $access['unlocked'] && (bool) $exam,
            'reason' => $access['reason'],
            'exam' => $exam ? $this->exerciseDetail($exam) : null,
        ]);
    }

    public function finalExamAccess(): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        return $this->ok($this->finalExamAccessData($student->id));
    }

    public function finalExamShow(int $id): JsonResponse
    {
        $student = $this->currentStudent();
        $Latihan = Latihan::with('questions')
            ->where('type', 'final_exam')
            ->where('status', 'active')
            ->find($id);

        if (! $student || ! $Latihan) {
            return $this->fail('Data latihan akhir tidak ditemukan', null, 404);
        }

        $materialId = $Latihan->material_id ?? $Latihan->chapter?->material_id ?? $Latihan->chapter?->materi_id;
        $access = $this->finalExamAccessData($student->id, $materialId);
        $attempt = null;

        if ($access['unlocked']) {
            $attempt = $this->activeFinalExamAttempt($student->id, $Latihan);

            if ($attempt && $attempt->expires_at && Carbon::now()->greaterThanOrEqualTo($attempt->expires_at)) {
                $result = $this->finalizeFinalExamAttempt($attempt, $Latihan, [], 'auto_timeout');

                return $this->ok([
                    'exam' => $this->exerciseDetail($Latihan),
                    'access' => [
                        'unlocked' => true,
                        'reason' => null,
                    ],
                    'attempt' => $this->finalExamAttemptPayload($attempt->fresh()),
                    'serverNow' => Carbon::now()->toIso8601String(),
                    'submitted' => true,
                    'result' => [
                        'id' => $result->id,
                        'score' => $result->score,
                    ],
                ]);
            }

            if (! $attempt) {
                $startedAt = Carbon::now();
                $attempt = RiwayatLatihan::create([
                    'user_id' => $student->id,
                    'exercise_id' => $Latihan->id,
                    'total_questions' => $Latihan->questions->count(),
                    'correct_answers' => 0,
                    'wrong_answers' => 0,
                    'score' => 0,
                    'started_at' => $startedAt,
                    'expires_at' => $startedAt->copy()->addMinutes(max((int) ($Latihan->duration_minutes ?? 30), 1)),
                ]);
            }
        }

        return $this->ok([
            'exam' => $this->exerciseDetail($Latihan),
            'access' => [
                'unlocked' => $access['unlocked'],
                'reason' => $access['reason'],
            ],
            'attempt' => $attempt ? $this->finalExamAttemptPayload($attempt) : null,
            'serverNow' => Carbon::now()->toIso8601String(),
        ]);
    }

    public function finalExamResult(int $id): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $result = HasilLatihanAkhir::with('exercise')
            ->where('user_id', $student->id)
            ->where('exercise_id', $id)
            ->latest()
            ->first();

        if (! $result) {
            return $this->fail('Hasil latihan akhir tidak ditemukan', null, 404);
        }

        return $this->ok([
            'id' => $result->id,
            'score' => $result->score,
            'total_correct' => $result->total_correct,
            'total_questions' => $result->total_questions,
            'duration_used_minutes' => $result->duration_used_minutes,
            'status' => $result->status,
            'submit_method' => $result->submit_method,
            'submitted_at' => optional($result->submitted_at)->format('d M Y, H:i'),
            'exam' => $result->exercise ? [
                'id' => $result->exercise->id,
                'title' => $result->exercise->title,
            ] : null,
        ]);
    }

    public function submitFinalExam(Request $request, int $id): JsonResponse
    {
        $student = $this->currentStudent();
        $Latihan = Latihan::with('questions')->where('type', 'final_exam')->find($id);

        if (! $student || ! $Latihan) {
            return $this->fail('Data ujian tidak ditemukan', null, 404);
        }

        $materialId = $Latihan->material_id ?? $Latihan->chapter?->material_id ?? $Latihan->chapter?->materi_id;
        $access = $this->finalExamAccessData($student->id, $materialId);
        if (! $access['unlocked']) {
            return $this->fail($access['reason'] ?? 'Latihan akhir belum tersedia.', null, 403);
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer'],
            'answers.*.selected_option' => ['nullable', Rule::in(['A', 'B', 'C', 'D'])],
            'duration_used_minutes' => ['nullable', 'integer', 'min:0'],
            'attempt_id' => ['nullable', 'integer', 'exists:riwayat_latihan,id'],
            'submit_method' => ['nullable', 'in:manual,auto_timeout'],
        ]);

        $attempt = null;
        if (! empty($validated['attempt_id'])) {
            $attempt = RiwayatLatihan::where('user_id', $student->id)
                ->where('exercise_id', $Latihan->id)
                ->whereNull('submitted_at')
                ->find($validated['attempt_id']);
        }

        $attempt ??= $this->activeFinalExamAttempt($student->id, $Latihan);

        if (! $attempt) {
            return $this->fail('Sesi latihan akhir tidak ditemukan. Silakan mulai latihan akhir kembali.', null, 404);
        }

        $submitMethod = $validated['submit_method'] ?? 'manual';
        if ($attempt->expires_at && Carbon::now()->greaterThanOrEqualTo($attempt->expires_at)) {
            $submitMethod = 'auto_timeout';
        }

        $result = $this->finalizeFinalExamAttempt($attempt, $Latihan, $validated['answers'], $submitMethod);

        return $this->ok([
            'id' => $result->id,
            'score' => $result->score,
            'total_correct' => $result->total_correct,
            'total_questions' => $result->total_questions,
            'duration_used_minutes' => $result->duration_used_minutes,
            'status' => $result->status,
            'submit_method' => $result->submit_method,
            'submitted_at' => optional($result->submitted_at)->format('d M Y, H:i'),
        ], $submitMethod === 'auto_timeout' ? 'Waktu habis. Latihan akhir otomatis dikirim.' : 'Latihan akhir berhasil dikirim');
    }

    private function exerciseDetail(Latihan $Latihan): array
    {
        $student = $this->currentStudent();
        $attemptPayload = $student ? $this->attemptPayload($student->id, $Latihan->id) : [
            'attempts' => collect(),
            'lastScore' => null,
            'highestScore' => null,
            'attemptCount' => 0,
        ];

        return [
            'id' => $Latihan->id,
            'title' => $Latihan->title,
            'description' => $Latihan->description,
            'type' => $Latihan->type,
            'chapterTitle' => $Latihan->chapter?->title,
            'materialId' => $Latihan->type === 'final_exam' ? $Latihan->material_id : $Latihan->chapter?->material?->id,
            'materialTitle' => $Latihan->type === 'final_exam' ? $Latihan->material?->title : $Latihan->chapter?->material?->title,
            'totalQuestions' => $Latihan->questions->count() ?: $Latihan->total_questions,
            'durationMinutes' => $Latihan->type === 'final_exam' ? ($Latihan->duration_minutes ?: 30) : $Latihan->duration_minutes,
            'lastScore' => $attemptPayload['lastScore'],
            'highestScore' => $attemptPayload['highestScore'],
            'attemptCount' => $attemptPayload['attemptCount'],
            'attempts' => $attemptPayload['attempts'],
            'questions' => $Latihan->questions->map(fn (SoalLatihan $SoalLatihan) => [
                'id' => $SoalLatihan->id,
                'questionText' => $SoalLatihan->question_text,
                'questionType' => 'multiple_choice',
                'options' => collect([
                    ['key' => 'A', 'text' => $SoalLatihan->option_a],
                    ['key' => 'B', 'text' => $SoalLatihan->option_b],
                    ['key' => 'C', 'text' => $SoalLatihan->option_c],
                    ['key' => 'D', 'text' => $SoalLatihan->option_d],
                ])->filter(fn (array $option) => filled($option['text']))->values(),
                'score' => $SoalLatihan->score,
            ]),
        ];
    }

    private function activeFinalExamAttempt(int $studentId, Latihan $Latihan): ?RiwayatLatihan
    {
        return RiwayatLatihan::where('user_id', $studentId)
            ->where('exercise_id', $Latihan->id)
            ->whereNull('submitted_at')
            ->latest('started_at')
            ->latest('id')
            ->first();
    }

    private function finalExamAttemptPayload(RiwayatLatihan $attempt): array
    {
        return [
            'id' => $attempt->id,
            'startedAt' => optional($attempt->started_at)->toIso8601String(),
            'started_at' => optional($attempt->started_at)->toIso8601String(),
            'expiresAt' => optional($attempt->expires_at)->toIso8601String(),
            'expires_at' => optional($attempt->expires_at)->toIso8601String(),
            'submittedAt' => optional($attempt->submitted_at)->toIso8601String(),
            'submitted_at' => optional($attempt->submitted_at)->toIso8601String(),
            'submitMethod' => $attempt->submit_method,
            'submit_method' => $attempt->submit_method,
        ];
    }

    private function finalizeFinalExamAttempt(RiwayatLatihan $attempt, Latihan $Latihan, array $answers, string $submitMethod): HasilLatihanAkhir
    {
        return DB::transaction(function () use ($attempt, $Latihan, $answers, $submitMethod) {
            $answerMap = collect($answers)->keyBy(fn (array $answer) => (int) ($answer['question_id'] ?? 0));
            $correct = 0;
            $total = $Latihan->questions->count();

            $attempt->answers()->delete();

            foreach ($Latihan->questions as $SoalLatihan) {
                $answer = $answerMap->get($SoalLatihan->id);
                $selected = $answer['selected_option'] ?? null;
                $isCorrect = $selected === $SoalLatihan->correct_answer;

                if ($isCorrect) {
                    $correct++;
                }

                $attempt->answers()->create([
                    'exercise_question_id' => $SoalLatihan->id,
                    'selected_answer' => $selected,
                    'is_correct' => $isCorrect,
                ]);
            }

            $totalForScore = max($total, 1);
            $score = (int) round(($correct / $totalForScore) * 100);
            $submittedAt = Carbon::now();
            $durationLimit = max((int) ($Latihan->duration_minutes ?? 30), 1);
            $durationUsed = $attempt->started_at
                ? min($durationLimit, max(0, (int) ceil($attempt->started_at->diffInSeconds($submittedAt) / 60)))
                : $durationLimit;

            $attempt->update([
                'total_questions' => $total,
                'correct_answers' => $correct,
                'wrong_answers' => max($total - $correct, 0),
                'score' => $score,
                'submitted_at' => $submittedAt,
                'submit_method' => $submitMethod,
            ]);

            return HasilLatihanAkhir::create([
                'user_id' => $attempt->user_id,
                'exercise_id' => $Latihan->id,
                'score' => $score,
                'total_correct' => $correct,
                'total_questions' => $total,
                'duration_used_minutes' => $durationUsed,
                'status' => $score >= 75 ? 'passed' : 'failed',
                'submit_method' => $submitMethod,
                'submitted_at' => $submittedAt,
            ]);
        });
    }

    private function attemptPayload(int $studentId, int $exerciseId): array
    {
        $attempts = RiwayatLatihan::with('answers.question')
            ->where('user_id', $studentId)
            ->where('exercise_id', $exerciseId)
            ->orderByDesc('submitted_at')
            ->orderByDesc('id')
            ->get();

        $oldestIds = $attempts->sortBy('id')->values()->pluck('id');

        return [
            'attempts' => $attempts->map(function (RiwayatLatihan $attempt) use ($oldestIds) {
                $attemptNumber = $oldestIds->search($attempt->id);

                return $this->attemptRow($attempt, $attemptNumber === false ? 1 : $attemptNumber + 1);
            })->values(),
            'lastScore' => $attempts->first() ? (float) $attempts->first()->score : null,
            'highestScore' => $attempts->max('score') ? (float) $attempts->max('score') : null,
            'attemptCount' => $attempts->count(),
        ];
    }

    private function attemptRow(RiwayatLatihan $attempt, int $attemptNumber): array
    {
        return [
            'id' => $attempt->id,
            'attemptNumber' => $attemptNumber,
            'totalQuestions' => $attempt->total_questions,
            'correctAnswers' => $attempt->correct_answers,
            'wrongAnswers' => $attempt->wrong_answers,
            'score' => (float) $attempt->score,
            'submittedAt' => optional($attempt->submitted_at)->format('d M Y, H:i'),
        ];
    }

    private function finalExamAccessData(int $studentId, ?int $materialId = null): array
    {
        $chapters = $this->orderedChapters()
            ->where('status', 'published')
            ->when($materialId, function ($query) use ($materialId) {
                $query->where(function ($materialQuery) use ($materialId) {
                    $materialQuery->where('material_id', $materialId)
                        ->orWhere('materi_id', $materialId);
                });
            })
            ->get();
        $chapterIds = $chapters->pluck('id');
        $exercises = Latihan::where('type', 'chapter')
            ->where('status', 'active')
            ->whereIn('chapter_id', $chapterIds)
            ->get();
        $completedChapters = ProgressBab::where('user_id', $studentId)
            ->whereIn('chapter_id', $chapterIds)
            ->where('status', 'completed')
            ->count();
        $submittedExercises = RiwayatLatihan::where('user_id', $studentId)
            ->whereIn('exercise_id', $exercises->pluck('id'))
            ->distinct('exercise_id')
            ->count('exercise_id');
        $totalChapters = $chapters->count();
        $allChaptersCompleted = $totalChapters > 0 && $completedChapters >= $totalChapters;
        $submittedExerciseIds = RiwayatLatihan::where('user_id', $studentId)
            ->whereIn('exercise_id', $exercises->pluck('id'))
            ->pluck('exercise_id')
            ->unique();
        $allExercisesSubmitted = $chapters->every(function (Bab $Bab) use ($exercises, $submittedExerciseIds) {
            $Latihan = $exercises->firstWhere('chapter_id', $Bab->id);

            return $Latihan && $submittedExerciseIds->contains($Latihan->id);
        });
        $unlocked = $allChaptersCompleted && $allExercisesSubmitted;
        $totalActivities = $totalChapters + $exercises->count();
        $completedActivities = $completedChapters + $submittedExercises;

        return [
            'unlocked' => $unlocked,
            'reason' => $unlocked ? null : 'Selesaikan semua BabLama dan latihan per BabLama terlebih dahulu',
            'totalChapters' => $totalChapters,
            'completedChapters' => $completedChapters,
            'totalExercises' => $exercises->count(),
            'submittedExercises' => $submittedExercises,
            'completedActivities' => $completedActivities,
            'totalActivities' => $totalActivities,
            'progressPercentage' => $totalActivities > 0 ? (int) round(($completedActivities / $totalActivities) * 100) : 0,
        ];
    }

    private function chapterOrderValue(Bab $Bab): int
    {
        $orderNumber = (int) ($Bab->order_number ?? 0);
        $chapterOrder = (int) ($Bab->chapter_order ?? 0);

        return $orderNumber > 0 ? $orderNumber : ($chapterOrder > 0 ? $chapterOrder : $Bab->id);
    }
}
