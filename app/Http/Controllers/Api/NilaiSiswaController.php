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
use App\Models\PengumpulanLatihan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class NilaiSiswaController extends Controller
{
    use ApiLearningHelpers;

    public function scores(Request $request): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $materialId = $request->query('materi_id');
        $babId = $request->query('bab_id');

        $materials = Materi::query()
            ->whereIn('status', ['publish', 'published', 'active'])
            ->orderBy('title')
            ->get(['id', 'title']);
        $chapters = $materialId
            ? Bab::query()
                ->where(function ($query) use ($materialId) {
                    $query->where('material_id', $materialId)
                        ->orWhere('materi_id', $materialId);
                })
                ->whereIn('status', ['published', 'active'])
                ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
                ->orderBy('id')
                ->get(['id', 'title', 'order_number', 'chapter_order'])
            : collect();

        $chapterAttempts = RiwayatLatihan::with(['exercise.chapter.material'])
            ->where('user_id', $student->id)
            ->whereNotNull('submitted_at')
            ->whereHas('exercise', function ($query) use ($materialId, $babId) {
                $query->where(function ($typeQuery) {
                    $typeQuery->where('type', 'chapter')
                        ->orWhereNull('type')
                        ->orWhereHas('chapter');
                });

                if ($materialId) {
                    $query->whereHas('chapter', function ($chapterQuery) use ($materialId, $babId) {
                        $chapterQuery->where(function ($materialQuery) use ($materialId) {
                            $materialQuery->where('material_id', $materialId)
                                ->orWhere('materi_id', $materialId);
                        });

                        if ($babId) {
                            $chapterQuery->where('id', $babId);
                        }
                    });
                }
            })
            ->orderBy('submitted_at')
            ->get();

        $finalResults = HasilLatihanAkhir::with(['exercise.material', 'exercise.chapter.material'])
            ->where('user_id', $student->id)
            ->whereHas('exercise', function ($query) use ($materialId) {
                $query->where('type', 'final_exam');

                if ($materialId) {
                    $query->where(function ($materialQuery) use ($materialId) {
                        $materialQuery->where('material_id', $materialId)
                            ->orWhereHas('chapter', function ($chapterQuery) use ($materialId) {
                                $chapterQuery->where('material_id', $materialId)
                                    ->orWhere('materi_id', $materialId);
                            });
                    });
                }
            })
            ->orderBy('submitted_at')
            ->get();

        $chapterRows = $this->chapterScoreRows($chapterAttempts);
        $finalRows = $this->finalScoreRows($finalResults);
        $allRows = $chapterRows->merge($finalRows);
        $scores = $allRows->pluck('score')->filter(fn ($score) => $score !== null);

        return $this->ok([
            'materials' => $materials,
            'chapters' => $chapters->map(fn (Bab $Bab) => [
                'id' => $Bab->id,
                'title' => $Bab->title,
                'order_number' => $Bab->order_number ?? $Bab->chapter_order ?? $Bab->id,
            ])->values(),
            'selected_material_id' => $materialId ? (int) $materialId : null,
            'selected_bab_id' => $babId ? (int) $babId : null,
            'summary' => [
                'total_attempts' => $allRows->count(),
                'average_score' => $scores->count() ? round((float) $scores->avg(), 2) : 0,
                'highest_score' => $scores->count() ? round((float) $scores->max(), 2) : null,
                'materials_count' => $allRows->pluck('material_id')->filter()->unique()->count(),
            ],
            'chapter_scores' => $chapterRows->sortByDesc('submitted_at_raw')->values()->map(function (array $row) {
                unset($row['submitted_at_raw']);
                return $row;
            }),
            'final_scores' => $finalRows->sortByDesc('submitted_at_raw')->values()->map(function (array $row) {
                unset($row['submitted_at_raw']);
                return $row;
            }),
        ]);
    }

    public function __invoke(): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $submissions = PengumpulanLatihan::with('exercise.chapter')
            ->where('user_id', $student->id)
            ->where('status', 'graded')
            ->orderBy('graded_at')
            ->get();
        $finalExam = HasilLatihanAkhir::with('exercise')
            ->where('user_id', $student->id)
            ->latest('submitted_at')
            ->first();
        $scores = $submissions->pluck('score')->merge($finalExam ? [$finalExam->score] : []);
        $totalChapters = $this->orderedChapters()->where('status', 'published')->count();
        $completedChapters = ProgressBab::where('user_id', $student->id)->where('status', 'completed')->count();

        return $this->ok([
            'summary' => [
                'averageScore' => round((float) $scores->avg(), 1),
                'completedChapters' => $completedChapters,
                'totalChapters' => $totalChapters,
                'gradedExercises' => $submissions->count(),
                'totalProgress' => $totalChapters > 0 ? (int) round(($completedChapters / $totalChapters) * 100) : 0,
            ],
            'chartData' => $submissions->values()->map(fn (PengumpulanLatihan $submission, int $index) => [
                'BabLama' => 'BabLama ' . ($index + 1),
                'nilai' => $submission->score,
            ]),
            'gradeHistory' => $submissions->map(fn (PengumpulanLatihan $submission) => [
                'chapter' => $submission->exercise?->chapter?->title ?? $submission->exercise?->title,
                'date' => optional($submission->graded_at)->format('d M Y') ?? '-',
                'score' => $submission->score,
                'maxScore' => 100,
                'feedback' => $submission->feedback,
                'status' => ($submission->score ?? 0) >= 75 ? 'Lulus' : 'Perlu Perbaikan',
                'predicate' => ($submission->score ?? 0) >= 85 ? 'Nilai Sangat Baik' : null,
            ]),
            'finalExam' => $finalExam ? [
                'title' => 'Ujian Akhir',
                'subtitle' => $finalExam->exercise?->title,
                'score' => $finalExam->score,
                'correct' => "{$finalExam->total_correct}/{$finalExam->total_questions}",
                'duration' => "{$finalExam->duration_used_minutes} min",
                'status' => strtoupper($finalExam->status),
            ] : null,
        ]);
    }

    private function chapterScoreRows(Collection $attempts): Collection
    {
        $grouped = $attempts->groupBy(fn (RiwayatLatihan $attempt) => $attempt->user_id . '-' . $attempt->exercise_id);

        return $attempts->map(function (RiwayatLatihan $attempt) use ($grouped) {
            $Latihan = $attempt->exercise;
            $Bab = $Latihan?->chapter;
            $Materi = $Bab?->material ?? $Bab?->materi;
            $group = $grouped->get($attempt->user_id . '-' . $attempt->exercise_id, collect())->values();
            $attemptNumber = $group->search(fn (RiwayatLatihan $item) => $item->id === $attempt->id);

            return [
                'id' => $attempt->id,
                'material_id' => $Materi?->id,
                'material_title' => $Materi?->title ?? '-',
                'chapter_id' => $Bab?->id,
                'chapter_title' => $Bab?->title ?? '-',
                'exercise_id' => $Latihan?->id,
                'exercise_title' => $Latihan?->title ?? '-',
                'attempt_number' => $attemptNumber === false ? 1 : $attemptNumber + 1,
                'correct_answers' => $attempt->correct_answers,
                'wrong_answers' => $attempt->wrong_answers,
                'score' => (float) $attempt->score,
                'submitted_at' => optional($attempt->submitted_at)->format('d M Y, H:i') ?? '-',
                'submitted_at_raw' => $attempt->submitted_at,
            ];
        });
    }

    private function finalScoreRows(Collection $results): Collection
    {
        $grouped = $results->groupBy(fn (HasilLatihanAkhir $result) => $result->user_id . '-' . $result->exercise_id);

        return $results->map(function (HasilLatihanAkhir $result) use ($grouped) {
            $Latihan = $result->exercise;
            $Materi = $Latihan?->material ?? $Latihan?->materi ?? $Latihan?->chapter?->material ?? $Latihan?->chapter?->materi;
            $group = $grouped->get($result->user_id . '-' . $result->exercise_id, collect())->values();
            $attemptNumber = $group->search(fn (HasilLatihanAkhir $item) => $item->id === $result->id);
            $wrongAnswers = max((int) $result->total_questions - (int) $result->total_correct, 0);

            return [
                'id' => $result->id,
                'material_id' => $Materi?->id,
                'material_title' => $Materi?->title ?? '-',
                'exercise_id' => $Latihan?->id,
                'exercise_title' => $Latihan?->title ?? 'Latihan Akhir',
                'attempt_number' => $attemptNumber === false ? 1 : $attemptNumber + 1,
                'correct_answers' => $result->total_correct,
                'wrong_answers' => $wrongAnswers,
                'score' => (float) $result->score,
                'submitted_at' => optional($result->submitted_at)->format('d M Y, H:i') ?? '-',
                'submitted_at_raw' => $result->submitted_at,
            ];
        });
    }
}
