<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\ProgressBab;
use App\Models\Latihan;
use App\Models\Materi;
use App\Models\RiwayatLatihan;
use Illuminate\Http\JsonResponse;

class DashboardSiswaController extends Controller
{
    use ApiLearningHelpers;

    public function __invoke(): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $activeStatus = ['publish', 'published', 'active'];
        $materials = Materi::whereIn('status', $activeStatus)
            ->orderBy('title')
            ->get(['id', 'title', 'status']);
        $materialIds = $materials->pluck('id');
        $chapters = Bab::query()
            ->whereIn('status', ['published', 'active'])
            ->where(function ($query) use ($materialIds) {
                $query->whereIn('material_id', $materialIds)
                    ->orWhereIn('materi_id', $materialIds);
            })
            ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
            ->orderBy('id')
            ->get();
        $chapterIds = $chapters->pluck('id');

        $completedProgress = ProgressBab::with(['chapter.material', 'chapter.materi'])
            ->where('user_id', $student->id)
            ->whereIn('chapter_id', $chapterIds)
            ->where('status', 'completed')
            ->orderByDesc('completed_at')
            ->orderByDesc('updated_at')
            ->get();
        $completed = $completedProgress->count();
        $total = $chapters->count();

        $latestAttempt = RiwayatLatihan::with(['exercise.chapter.material', 'exercise.chapter.materi', 'exercise.material'])
            ->where('user_id', $student->id)
            ->whereNotNull('submitted_at')
            ->latest('submitted_at')
            ->latest('id')
            ->first();
        $latestProgress = $completedProgress->first();
        $currentMaterial = $latestAttempt?->exercise?->material
            ?? $latestAttempt?->exercise?->chapter?->material
            ?? $latestAttempt?->exercise?->chapter?->materi
            ?? $latestProgress?->chapter?->material
            ?? $latestProgress?->chapter?->materi
            ?? $materials->first();

        $activeChapterExercises = Latihan::with('chapter')
            ->where('type', 'chapter')
            ->where('status', 'active')
            ->whereIn('chapter_id', $chapterIds)
            ->orderBy('chapter_id')
            ->orderBy('id')
            ->get();
        $activeChapterExerciseIds = $activeChapterExercises->pluck('id');
        $submittedExerciseIds = RiwayatLatihan::where('user_id', $student->id)
            ->whereIn('exercise_id', $activeChapterExerciseIds)
            ->whereNotNull('submitted_at')
            ->pluck('exercise_id')
            ->unique();
        $completedExercises = $submittedExerciseIds->count();
        $pendingExercises = $activeChapterExerciseIds->diff($submittedExerciseIds)->count();
        $finalExams = Latihan::where('type', 'final_exam')
            ->where('status', 'active')
            ->whereIn('material_id', $materialIds)
            ->orderBy('id')
            ->get();
        $submittedFinalExamIds = RiwayatLatihan::where('user_id', $student->id)
            ->whereIn('exercise_id', $finalExams->pluck('id'))
            ->whereNotNull('submitted_at')
            ->pluck('exercise_id')
            ->unique();
        $attempts = RiwayatLatihan::with(['exercise.chapter', 'exercise.material'])
            ->where('user_id', $student->id)
            ->whereNotNull('submitted_at')
            ->whereNotNull('score')
            ->latest('submitted_at')
            ->latest('id')
            ->get();
        $scores = $attempts->pluck('score');
        $averageScore = round((float) $scores->avg(), 1);
        $finalExamScore = $attempts
            ->filter(fn (RiwayatLatihan $attempt) => $attempt->exercise?->type === 'final_exam')
            ->max('score');
        $progressPercentage = $total > 0 ? (int) round(($completed / $total) * 100) : 0;

        $completedChapterIds = $completedProgress->pluck('chapter_id')->unique();
        $hasLearningActivity = $completedProgress->isNotEmpty() || $latestAttempt !== null;

        $materialStates = $materials->map(function (Materi $material) use ($chapters, $completedChapterIds, $activeChapterExercises, $submittedExerciseIds, $finalExams, $submittedFinalExamIds) {
            $materialChapters = $chapters
                ->filter(fn (Bab $chapter) => (int) $chapter->material_id === (int) $material->id || (int) $chapter->materi_id === (int) $material->id)
                ->values();
            $materialChapterIds = $materialChapters->pluck('id');
            $materialExercises = $activeChapterExercises
                ->filter(fn (Latihan $exercise) => $materialChapterIds->contains($exercise->chapter_id))
                ->values();
            $finalExam = $finalExams->firstWhere('material_id', $material->id);
            $allChaptersCompleted = $materialChapters->isNotEmpty()
                && $materialChapters->every(fn (Bab $chapter) => $completedChapterIds->contains($chapter->id));
            $allChapterExercisesSubmitted = $materialExercises->isEmpty()
                || $materialExercises->every(fn (Latihan $exercise) => $submittedExerciseIds->contains($exercise->id));
            $finalExamSubmitted = ! $finalExam || $submittedFinalExamIds->contains($finalExam->id);

            return [
                'material' => $material,
                'chapters' => $materialChapters,
                'exercises' => $materialExercises,
                'final_exam' => $finalExam,
                'all_chapters_completed' => $allChaptersCompleted,
                'all_chapter_exercises_submitted' => $allChapterExercisesSubmitted,
                'completed' => $allChaptersCompleted && $allChapterExercisesSubmitted && $finalExamSubmitted,
            ];
        });

        $allMaterialsCompleted = $materials->isNotEmpty()
            && $materialStates->every(fn (array $state) => $state['completed']);
        $currentMaterialState = $materialStates->first(fn (array $state) => $currentMaterial && (int) $state['material']->id === (int) $currentMaterial->id)
            ?? $materialStates->first(fn (array $state) => ! $state['completed'])
            ?? $materialStates->first();
        $currentMaterial = $currentMaterialState['material'] ?? $currentMaterial;
        $currentMaterialId = $currentMaterial?->id;
        $currentMaterialChapters = collect($currentMaterialState['chapters'] ?? []);
        $currentChapter = $currentMaterialChapters->first(fn (Bab $chapter) => ! $completedChapterIds->contains($chapter->id));
        $nextExercise = null;

        if (! $currentChapter && $currentMaterialState) {
            $nextExercise = collect($currentMaterialState['exercises'])
                ->first(fn (Latihan $exercise) => ! $submittedExerciseIds->contains($exercise->id));
            $currentChapter = $nextExercise?->chapter ?? $currentMaterialChapters->first();
        }

        $finalExam = $currentMaterialState['final_exam'] ?? null;
        $dashboardSubtitle = 'Silakan pilih materi untuk memulai pembelajaran.';
        $progressText = 'Belum memulai pembelajaran';
        $continueHref = '/siswa/materi';
        $continueLabel = 'Mulai Belajar';

        if ($allMaterialsCompleted) {
            $dashboardSubtitle = 'Seluruh pembelajaran telah selesai. Silakan lihat nilai kamu.';
            $progressText = 'Seluruh materi telah selesai';
            $continueHref = '/siswa/nilai-progress';
            $continueLabel = 'Lihat Nilai';
        } elseif ($hasLearningActivity && $currentMaterial) {
            if ($currentMaterialState['all_chapters_completed'] ?? false) {
                $dashboardSubtitle = "Kamu telah menyelesaikan seluruh Bab pada {$currentMaterial->title}.";
                $progressText = 'Semua Bab pada materi ini telah selesai';

                if ($nextExercise) {
                    $continueHref = "/siswa/latihan-bab/{$nextExercise->id}";
                    $continueLabel = 'Kerjakan Latihan';
                } elseif ($finalExam && ! $submittedFinalExamIds->contains($finalExam->id)) {
                    $continueHref = "/siswa/latihan-akhir/{$finalExam->id}";
                    $continueLabel = 'Kerjakan Latihan Akhir';
                } else {
                    $continueHref = '/siswa/nilai-progress';
                    $continueLabel = 'Lihat Nilai';
                }
            } elseif ($currentChapter) {
                $dashboardSubtitle = "Lanjutkan pembelajaran pada {$currentMaterial->title}.";
                $progressText = 'Kamu sedang di ' . $currentChapter->title;
                $continueHref = "/siswa/bab/{$currentChapter->id}";
                $continueLabel = 'Lanjut Belajar';
            }
        }

        $recentAttempts = $attempts
            ->take(5)
            ->map(fn (RiwayatLatihan $attempt) => [
                'title' => 'Nilai tersedia: ' . ($attempt->exercise?->title ?? 'Latihan'),
                'time' => optional($attempt->submitted_at)->diffForHumans() ?? '-',
            ]);

        return $this->ok([
            'studentName' => $student->name,
            'schoolName' => $student->school_name ?: 'SMK 5 Pekanbaru',
            'platformName' => 'Coding Platform',
            'currentCourse' => $currentMaterial?->title ?? '-',
            'currentMaterialId' => $currentMaterialId,
            'currentMaterialTitle' => $currentMaterial?->title ?? '-',
            'dashboardSubtitle' => $dashboardSubtitle,
            'progressText' => $progressText,
            'continueHref' => $continueHref,
            'continueLabel' => $continueLabel,
            'totalMaterials' => $materials->count(),
            'completedChapters' => $completed,
            'totalChapters' => $total,
            'currentChapter' => $currentChapter ? ($currentChapter->order_number ?? $currentChapter->chapter_order ?? $currentChapter->id) : null,
            'currentChapterId' => $currentChapter?->id,
            'currentChapterTitle' => $currentChapter?->title,
            'completedExercises' => $completedExercises,
            'pendingExercises' => $pendingExercises,
            'averageScore' => $averageScore,
            'finalExamScore' => $finalExamScore === null ? null : round((float) $finalExamScore, 1),
            'progressPercentage' => $progressPercentage,
            'notifications' => [
                [
                    'title' => $pendingExercises > 0 ? "{$pendingExercises} latihan belum dikerjakan" : 'Tidak ada latihan tertunda',
                    'action' => 'Kerjakan Sekarang',
                    'href' => '/siswa/latihan-bab',
                    'type' => $pendingExercises > 0 ? 'warning' : 'success',
                ],
            ],
            'activities' => $recentAttempts,
        ]);
    }
}
