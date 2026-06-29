<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\ProgressBab;
use App\Models\PengumpulanLatihan;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;

class TeacherStatisticsController extends Controller
{
    use ApiLearningHelpers;

    public function __invoke(): JsonResponse
    {
        $students = Pengguna::whereIn('role', ['siswa', 'student'])->get();
        $totalChapters = max(Bab::where('status', 'published')->count(), 1);
        $graded = PengumpulanLatihan::where('status', 'graded')->whereNotNull('score')->get();
        $averageScore = round((float) $graded->avg('score'), 1);
        $studentRows = $students->map(function (Pengguna $student) use ($totalChapters) {
            $completed = ProgressBab::where('user_id', $student->id)->where('status', 'completed')->count();
            $ProgressLama = (int) round(($completed / $totalChapters) * 100);
            $average = round((float) PengumpulanLatihan::where('user_id', $student->id)->where('status', 'graded')->avg('score'), 1);

            return [
                'id' => $student->id,
                'name' => $student->name,
                'completedChapters' => $completed,
                'totalChapters' => $totalChapters,
                'progress' => $ProgressLama,
                'averageScore' => $average,
                'status' => $this->status($average, $ProgressLama),
            ];
        });

        $completionRate = $students->count() > 0
            ? (int) round(($studentRows->where('progress', '>=', 80)->count() / $students->count()) * 100)
            : 0;

        $chapterStudentData = $this->orderedChapters()->where('status', 'published')->get()->map(fn (Bab $Bab) => [
            'BabLama' => 'BabLama ' . ($Bab->order_number ?? $Bab->chapter_order ?? $Bab->id),
            'siswa' => ProgressBab::where('chapter_id', $Bab->id)->where('status', 'completed')->count(),
        ]);
        $scoreDistributionData = [
            ['range' => '90-100', 'jumlah' => $graded->whereBetween('score', [90, 100])->count()],
            ['range' => '80-89', 'jumlah' => $graded->whereBetween('score', [80, 89])->count()],
            ['range' => '70-79', 'jumlah' => $graded->whereBetween('score', [70, 79])->count()],
            ['range' => '60-69', 'jumlah' => $graded->whereBetween('score', [60, 69])->count()],
            ['range' => '<60', 'jumlah' => $graded->where('score', '<', 60)->count()],
        ];

        return $this->ok([
            'stats' => [
                'completionRate' => $completionRate,
                'averageScore' => $averageScore,
                'averageProgress' => round($studentRows->avg('completedChapters'), 1),
                'activeThisWeek' => $students->where('updated_at', '>=', now()->subWeek())->count(),
            ],
            'chapterStudentData' => $chapterStudentData,
            'scoreDistributionData' => $scoreDistributionData,
            'students' => $studentRows,
            'students_per_chapter' => $chapterStudentData,
            'score_distribution' => $scoreDistributionData,
            'student_progress' => $studentRows,
        ]);
    }

    private function status(float $score, int $ProgressLama): string
    {
        if ($score >= 85 && $ProgressLama >= 80) {
            return 'Excellent';
        }

        if ($score >= 70) {
            return 'Good';
        }

        if ($ProgressLama > 0) {
            return 'Need Improvement';
        }

        return 'At Risk';
    }
}
