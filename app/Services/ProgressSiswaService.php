<?php

namespace App\Services;

use App\Models\Bab;
use App\Models\Materi;
use App\Models\Kuis;
use App\Models\ProgressBabSiswa;
use App\Models\ProgressLatihanSiswa;
use App\Models\ProgressMateriSiswa;
use App\Models\ProgressKuisSiswa;
use App\Models\Pengguna;
use Illuminate\Support\Carbon;

class ProgressSiswaService
{
    public const STATUS_LOCKED = 'locked';

    public const STATUS_UNLOCKED = 'unlocked';

    public const STATUS_COMPLETED = 'completed';

    public function buildMaterialPayload(Pengguna $student, Materi $Materi): array
    {
        return $this->syncMaterialProgress($student, $Materi);
    }

    public function summarizeMaterial(Pengguna $student, Materi $Materi): array
    {
        $payload = $this->buildMaterialPayload($student, $Materi);

        return [
            'id' => $payload['id'],
            'title' => $payload['title'],
            'description' => $payload['description'],
            'status' => $payload['status'],
            'chapter_count' => $payload['chapter_count'],
            'progress' => $payload['progress'],
            'next_chapter_id' => $payload['progress']['current_chapter_id'],
            'quiz' => $payload['quiz']
                ? [
                    'id' => $payload['quiz']['id'],
                    'title' => $payload['quiz']['title'],
                    'status' => $payload['quiz']['status'],
                    'is_locked' => $payload['quiz']['is_locked'],
                    'is_completed' => $payload['quiz']['is_completed'],
                ]
                : null,
        ];
    }

    public function findChapterState(array $materialPayload, int $chapterId): ?array
    {
        return collect($materialPayload['chapters'])->firstWhere('id', $chapterId);
    }

    public function firstReachableChapterId(array $materialPayload): ?int
    {
        $Bab = collect($materialPayload['chapters'])->first(
            fn (array $item) => ! $item['is_locked'] && ! $item['gate_completed']
        );

        return $Bab['id'] ?? ($materialPayload['chapters'][0]['id'] ?? null);
    }

    private function syncMaterialProgress(Pengguna $student, Materi $Materi): array
    {
        $Materi->loadMissing(['chapters.exercises', 'quiz.questions']);

        $now = Carbon::now();
        $chapters = $Materi->chapters->sortBy('chapter_order')->values();
        $chapterIds = $chapters->pluck('id');
        $exerciseIds = $chapters->flatMap(fn (Bab $Bab) => $Bab->exercises->pluck('id'))->values();

        $materialProgress = ProgressMateriSiswa::firstOrCreate(
            [
                'student_id' => $student->id,
                'material_id' => $Materi->id,
            ],
            [
                'current_chapter_id' => $chapters->first()?->id,
                'is_completed' => false,
            ]
        );

        $chapterProgresses = ProgressBabSiswa::query()
            ->where('student_id', $student->id)
            ->whereIn('chapter_id', $chapterIds)
            ->get()
            ->keyBy('chapter_id');

        $exerciseProgresses = ProgressLatihanSiswa::query()
            ->where('student_id', $student->id)
            ->whereIn('exercise_id', $exerciseIds)
            ->get()
            ->keyBy('exercise_id');

        $previousGateComplete = true;
        $chapterStates = [];

        foreach ($chapters as $Bab) {
            $storedChapterProgress = $chapterProgresses->get($Bab->id);
            $chapterAlreadyCompleted = $storedChapterProgress
                && ($storedChapterProgress->status === self::STATUS_COMPLETED || $storedChapterProgress->completed_at);
            $chapterCompletedAt = $chapterAlreadyCompleted
                ? ($storedChapterProgress->completed_at ?? $now)
                : null;
            $chapterStatus = $chapterAlreadyCompleted
                ? self::STATUS_COMPLETED
                : ($previousGateComplete ? self::STATUS_UNLOCKED : self::STATUS_LOCKED);

            $ProgressBab = ProgressBabSiswa::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'chapter_id' => $Bab->id,
                ],
                [
                    'status' => $chapterStatus,
                    'started_at' => $storedChapterProgress?->started_at,
                    'completed_at' => $chapterCompletedAt,
                ]
            );

            $exerciseRows = [];

            foreach ($Bab->exercises as $Latihan) {
                $storedExerciseProgress = $exerciseProgresses->get($Latihan->id);
                $exerciseAlreadyCompleted = $storedExerciseProgress
                    && ($storedExerciseProgress->status === self::STATUS_COMPLETED || $storedExerciseProgress->completed_at);
                $exerciseCompletedAt = $exerciseAlreadyCompleted
                    ? ($storedExerciseProgress->completed_at ?? $now)
                    : null;
                $exerciseStatus = $exerciseAlreadyCompleted
                    ? self::STATUS_COMPLETED
                    : ($chapterStatus === self::STATUS_COMPLETED ? self::STATUS_UNLOCKED : self::STATUS_LOCKED);

                $exerciseProgress = ProgressLatihanSiswa::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'exercise_id' => $Latihan->id,
                    ],
                    [
                        'status' => $exerciseStatus,
                        'score' => $storedExerciseProgress?->score,
                        'completed_at' => $exerciseCompletedAt,
                    ]
                );

                $exerciseRows[] = [
                    'id' => $Latihan->id,
                    'status' => $exerciseProgress->status,
                    'score' => $exerciseProgress->score,
                    'completed_at' => $this->toIsoString($exerciseProgress->completed_at),
                ];
            }

            $exerciseQuestionCount = count($exerciseRows);
            $exerciseCompleted = $exerciseQuestionCount === 0
                || collect($exerciseRows)->every(fn (array $row) => $row['status'] === self::STATUS_COMPLETED);
            $exerciseStatus = match (true) {
                $exerciseQuestionCount === 0 => self::STATUS_COMPLETED,
                $exerciseCompleted => self::STATUS_COMPLETED,
                $chapterStatus === self::STATUS_COMPLETED => self::STATUS_UNLOCKED,
                default => self::STATUS_LOCKED,
            };
            $exerciseScore = collect($exerciseRows)
                ->pluck('score')
                ->filter(fn ($score) => ! is_null($score))
                ->max();
            $gateCompleted = $chapterStatus === self::STATUS_COMPLETED && $exerciseCompleted;

            $chapterStates[] = [
                'id' => $Bab->id,
                'material_id' => $Bab->material_id,
                'title' => $Bab->title,
                'content' => $Bab->content,
                'chapter_order' => $Bab->chapter_order,
                'status' => $chapterStatus,
                'status_label' => $this->statusLabel($chapterStatus),
                'is_locked' => $chapterStatus === self::STATUS_LOCKED,
                'is_completed' => $chapterStatus === self::STATUS_COMPLETED,
                'started_at' => $this->toIsoString($ProgressBab->started_at),
                'completed_at' => $this->toIsoString($ProgressBab->completed_at),
                'gate_completed' => $gateCompleted,
                'exercise_count' => $exerciseQuestionCount,
                'exercise' => [
                    'status' => $exerciseStatus,
                    'status_label' => $this->statusLabel($exerciseStatus),
                    'is_required' => $exerciseQuestionCount > 0,
                    'is_locked' => $exerciseStatus === self::STATUS_LOCKED,
                    'is_completed' => $exerciseStatus === self::STATUS_COMPLETED,
                    'question_count' => $exerciseQuestionCount,
                    'score' => $exerciseScore,
                ],
            ];

            $previousGateComplete = $previousGateComplete && $gateCompleted;
        }

        $allRequiredCompleted = collect($chapterStates)->every(
            fn (array $state) => $state['gate_completed']
        );
        $quizState = $Materi->quiz
            ? $this->syncQuizProgress($student, $Materi->quiz, $allRequiredCompleted, $now)
            : null;
        $quizCompleted = ! $quizState || $quizState['status'] === self::STATUS_COMPLETED;
        $materialCompleted = $allRequiredCompleted && $quizCompleted;
        $currentChapterId = collect($chapterStates)->first(
            fn (array $state) => ! $state['is_locked'] && ! $state['gate_completed']
        )['id'] ?? null;

        $materialProgress->update([
            'current_chapter_id' => $materialCompleted ? null : $currentChapterId,
            'is_completed' => $materialCompleted,
            'completed_at' => $materialCompleted
                ? ($materialProgress->completed_at ?? $now)
                : null,
        ]);

        $completedChapterCount = collect($chapterStates)->where('is_completed', true)->count();
        $requiredExerciseCount = collect($chapterStates)->where('Latihan.is_required', true)->count();
        $completedExerciseCount = collect($chapterStates)
            ->filter(fn (array $state) => $state['exercise']['is_required'] && $state['exercise']['is_completed'])
            ->count();
        $quizStepCount = $quizState ? 1 : 0;
        $completedQuizStepCount = $quizState && $quizState['is_completed'] ? 1 : 0;
        $totalSteps = $chapters->count() + $requiredExerciseCount + $quizStepCount;
        $completedSteps = $completedChapterCount + $completedExerciseCount + $completedQuizStepCount;

        return [
            'id' => $Materi->id,
            'title' => $Materi->title,
            'description' => $Materi->description,
            'status' => $Materi->status,
            'chapter_count' => $chapters->count(),
            'progress' => [
                'current_chapter_id' => $materialCompleted ? null : $currentChapterId,
                'first_chapter_id' => $chapters->first()?->id,
                'completed_chapters' => $completedChapterCount,
                'total_chapters' => $chapters->count(),
                'completed_exercises' => $completedExerciseCount,
                'total_exercises' => $requiredExerciseCount,
                'completed_steps' => $completedSteps,
                'total_steps' => $totalSteps,
                'percentage' => $totalSteps > 0 ? (int) round(($completedSteps / $totalSteps) * 100) : 0,
                'is_completed' => $materialCompleted,
                'completed_at' => $this->toIsoString($materialProgress->completed_at),
            ],
            'chapters' => $chapterStates,
            'quiz' => $quizState,
        ];
    }

    private function syncQuizProgress(Pengguna $student, Kuis $quiz, bool $allRequiredCompleted, Carbon $now): array
    {
        $storedQuizProgress = ProgressKuisSiswa::query()
            ->where('student_id', $student->id)
            ->where('quiz_id', $quiz->id)
            ->first();
        $quizAlreadyCompleted = $storedQuizProgress
            && ($storedQuizProgress->status === self::STATUS_COMPLETED || $storedQuizProgress->completed_at);
        $quizCompletedAt = $quizAlreadyCompleted
            ? ($storedQuizProgress->completed_at ?? $now)
            : null;
        $quizStatus = $quizAlreadyCompleted
            ? self::STATUS_COMPLETED
            : ($allRequiredCompleted ? self::STATUS_UNLOCKED : self::STATUS_LOCKED);

        $quizProgress = ProgressKuisSiswa::updateOrCreate(
            [
                'student_id' => $student->id,
                'quiz_id' => $quiz->id,
            ],
            [
                'status' => $quizStatus,
                'score' => $storedQuizProgress?->score,
                'started_at' => $storedQuizProgress?->started_at,
                'completed_at' => $quizCompletedAt,
            ]
        );

        return [
            'id' => $quiz->id,
            'material_id' => $quiz->material_id,
            'title' => $quiz->title,
            'duration_minutes' => $quiz->duration_minutes,
            'question_count' => $quiz->questions->count(),
            'status' => $quizProgress->status,
            'status_label' => $this->statusLabel($quizProgress->status),
            'is_locked' => $quizProgress->status === self::STATUS_LOCKED,
            'is_completed' => $quizProgress->status === self::STATUS_COMPLETED,
            'score' => $quizProgress->score,
            'started_at' => $this->toIsoString($quizProgress->started_at),
            'completed_at' => $this->toIsoString($quizProgress->completed_at),
        ];
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            self::STATUS_COMPLETED => 'Selesai',
            self::STATUS_UNLOCKED => 'Sedang Dipelajari',
            default => 'Terkunci',
        };
    }

    private function toIsoString(mixed $date): ?string
    {
        return $date ? $date->toISOString() : null;
    }
}
