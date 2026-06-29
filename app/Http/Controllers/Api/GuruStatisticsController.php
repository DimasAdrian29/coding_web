<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\Latihan;
use App\Models\Materi;
use App\Models\ProgressLama;
use App\Models\Kuis;
use App\Models\ProgressBabSiswa;
use App\Models\ProgressLatihanSiswa;
use App\Models\ProgressMateriSiswa;
use App\Models\ProgressKuisSiswa;
use App\Models\PengumpulanSiswa;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class GuruStatisticsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureTeacher($request);

        $students = Pengguna::where('role', Pengguna::ROLE_SISWA)->get();
        $studentIds = $students->pluck('id');
        $totalStudents = $students->count();
        $totalMaterials = Materi::where('status', 'publish')->count();
        $totalChapters = Bab::count();
        $totalExercises = Latihan::count();
        $totalQuizzes = Kuis::count();
        $totalLearningSteps = max($totalMaterials + $totalChapters + $totalExercises + $totalQuizzes, 1);
        $totalPossibleSteps = max($totalStudents * $totalLearningSteps, 1);

        $materialProgresses = ProgressMateriSiswa::whereIn('student_id', $studentIds)->get();
        $chapterProgresses = ProgressBabSiswa::whereIn('student_id', $studentIds)->get();
        $exerciseProgresses = ProgressLatihanSiswa::whereIn('student_id', $studentIds)->get();
        $quizProgresses = ProgressKuisSiswa::whereIn('student_id', $studentIds)->get();
        $submissions = PengumpulanSiswa::whereIn('student_id', $studentIds)->get();
        $legacyProgresses = ProgressLama::whereIn('user_id', $studentIds)->get();

        $submissionScores = $submissions
            ->map(fn (PengumpulanSiswa $submission) => $submission->teacher_score ?? $submission->score)
            ->filter(fn ($score) => ! is_null($score));
        $progressScores = $exerciseProgresses
            ->pluck('score')
            ->merge($quizProgresses->pluck('score'))
            ->merge($legacyProgresses->pluck('exercise_last_score'))
            ->filter(fn ($score) => ! is_null($score));
        $allScores = $submissionScores->isNotEmpty() ? $submissionScores : $progressScores;
        $avgScore = round((float) $allScores->avg(), 1);
        $completedTasks = $submissions->count() > 0
            ? $submissions->count()
            : ($exerciseProgresses->where('status', 'completed')->count()
                + $quizProgresses->where('status', 'completed')->count()
                + $legacyProgresses->whereNotNull('exercise_completed_at')->count());

        $progressByStudent = $students->map(function (Pengguna $student) use (
            $materialProgresses,
            $chapterProgresses,
            $exerciseProgresses,
            $quizProgresses,
            $submissions,
            $legacyProgresses,
            $totalLearningSteps
        ) {
            $studentPengumpulanLatihans = $submissions->where('student_id', $student->id);
            $studentPengumpulanLatihanScores = $studentPengumpulanLatihans
                ->map(fn (PengumpulanSiswa $submission) => $submission->teacher_score ?? $submission->score)
                ->filter(fn ($score) => ! is_null($score));
            $studentExerciseProgresses = $exerciseProgresses->where('student_id', $student->id);
            $studentQuizProgresses = $quizProgresses->where('student_id', $student->id);
            $studentLegacyProgresses = $legacyProgresses->where('user_id', $student->id);
            $studentProgressScores = $studentExerciseProgresses
                ->pluck('score')
                ->merge($studentQuizProgresses->pluck('score'))
                ->merge($studentLegacyProgresses->pluck('exercise_last_score'))
                ->filter(fn ($score) => ! is_null($score));
            $studentScores = $studentPengumpulanLatihanScores->isNotEmpty() ? $studentPengumpulanLatihanScores : $studentProgressScores;
            $completedSteps = $materialProgresses->where('student_id', $student->id)->where('is_completed', true)->count()
                + $chapterProgresses->where('student_id', $student->id)->where('status', 'completed')->count()
                + $studentExerciseProgresses->where('status', 'completed')->count()
                + $studentQuizProgresses->where('status', 'completed')->count()
                + $studentLegacyProgresses->where('is_completed', true)->count()
                + $studentLegacyProgresses->whereNotNull('exercise_completed_at')->count();
            $score = round((float) $studentScores->avg(), 1);
            $ProgressLama = min(100, (int) round(($completedSteps / $totalLearningSteps) * 100));

            return [
                'id' => $student->id,
                'nama' => $student->name,
                'kelas' => $student->nisn ? "NISN {$student->nisn}" : 'Siswa SMK',
                'name' => $student->name,
                'className' => $student->nisn ? "NISN {$student->nisn}" : 'Siswa SMK',
                'progress' => $ProgressLama,
                'nilai' => $score,
                'score' => $score,
                'status' => $this->studentStatus($score, $ProgressLama),
                'statusClassName' => $this->studentStatusClass($score, $ProgressLama),
                'avatar' => $this->avatarFromName($student->name),
            ];
        });

        $graduationRate = $totalStudents > 0
            ? (int) round(($progressByStudent->filter(fn (array $student) => $student['nilai'] >= 75)->count() / $totalStudents) * 100)
            : 0;

        $monthlyCounts = collect(range(5, 0))
            ->map(function (int $offset) {
                $month = Carbon::now()->startOfMonth()->subMonths($offset);
                $endOfMonth = $month->copy()->endOfMonth();

                $completedSteps = PengumpulanSiswa::whereNotNull('submitted_at')
                    ->where('submitted_at', '<=', $endOfMonth)
                    ->count();

                if ($completedSteps === 0) {
                    $completedSteps = ProgressMateriSiswa::where('is_completed', true)
                        ->whereNotNull('completed_at')
                        ->where('completed_at', '<=', $endOfMonth)
                        ->count()
                        + ProgressBabSiswa::where('status', 'completed')
                            ->whereNotNull('completed_at')
                            ->where('completed_at', '<=', $endOfMonth)
                            ->count()
                        + ProgressLatihanSiswa::where('status', 'completed')
                            ->whereNotNull('completed_at')
                            ->where('completed_at', '<=', $endOfMonth)
                            ->count()
                        + ProgressKuisSiswa::where('status', 'completed')
                            ->whereNotNull('completed_at')
                            ->where('completed_at', '<=', $endOfMonth)
                            ->count()
                        + ProgressLama::whereNotNull('exercise_completed_at')
                            ->where('exercise_completed_at', '<=', $endOfMonth)
                            ->count();
                }

                return [
                    'label' => $month->locale('id')->translatedFormat('M'),
                    'count' => $completedSteps,
                ];
            })
            ->values();

        $monthlyPercentages = $monthlyCounts
            ->map(fn (array $item) => min(100, (int) round(($item['count'] / $totalPossibleSteps) * 100)))
            ->values();
        $chartPoints = $monthlyPercentages->map(function (int $percentage, int $index) use ($monthlyPercentages) {
            $x = (int) round(($index / max($monthlyPercentages->count() - 1, 1)) * 500);
            $y = 180 - (int) round(($percentage / 100) * 140);

            return ['x' => $x, 'y' => $y];
        });
        $linePath = $chartPoints
            ->map(fn (array $point, int $index) => ($index === 0 ? 'M' : 'L') . $point['x'] . ' ' . $point['y'])
            ->implode(' ');
        $areaPath = $linePath . ' L 500 200 L 0 200 Z';
        $studentsCompletedAll = $progressByStudent->filter(fn (array $student) => $student['progress'] >= 100)->count();
        $completionPercentage = $totalStudents > 0 ? (int) round(($studentsCompletedAll / $totalStudents) * 100) : 0;
        $topStudents = $progressByStudent
            ->sortByDesc(fn (array $item) => sprintf('%03d%06.2f', $item['progress'], $item['nilai']))
            ->take(5)
            ->values();

        return response()->json([
            'total_siswa' => $totalStudents,
            'rata_rata_nilai' => $avgScore,
            'tingkat_kelulusan' => $graduationRate,
            'total_tugas_selesai' => $completedTasks,
            'progress_bulanan' => $monthlyPercentages->all(),
            'top_siswa' => $topStudents
                ->map(fn (array $student) => [
                    'id' => $student['id'],
                    'nama' => $student['nama'],
                    'kelas' => $student['kelas'],
                    'progress' => $student['progress'],
                    'nilai' => $student['nilai'],
                    'status' => $student['status'],
                ])
                ->values(),
            'students' => $progressByStudent->values(),
            'header' => [
                'title' => 'Statistik Siswa',
                'searchPlaceholder' => 'Cari nama siswa...',
            ],
            'statsCards' => [
                ['label' => 'Total Siswa', 'value' => $totalStudents, 'trend' => 'Database', 'trendIcon' => 'database', 'trendClassName' => 'text-primary'],
                ['label' => 'Rata-rata Nilai', 'value' => $avgScore, 'trend' => 'Real', 'trendIcon' => 'analytics', 'trendClassName' => 'text-primary'],
                ['label' => 'Tingkat Kelulusan', 'value' => "{$graduationRate}%", 'trend' => 'Nilai >= 75', 'trendIcon' => 'verified', 'trendClassName' => 'text-emerald-500'],
                ['label' => 'Tugas Selesai', 'value' => $completedTasks, 'trend' => 'Latihan + Quiz', 'trendIcon' => 'task_alt', 'trendClassName' => 'text-emerald-500'],
            ],
            'lineChart' => [
                'title' => 'Progres Belajar (6 Bulan)',
                'filterOptions' => ['Semua Kelas'],
                'months' => $monthlyCounts->pluck('label')->all(),
                'path' => $linePath,
                'areaPath' => $areaPath,
            ],
            'pieChart' => [
                'title' => 'Penyelesaian MateriLama',
                'percentage' => $completionPercentage,
                'centerLabel' => 'Selesai',
                'segments' => [
                    ['label' => 'Tuntas', 'value' => "{$studentsCompletedAll} Siswa", 'colorClassName' => 'bg-primary'],
                    ['label' => 'Berjalan', 'value' => ($totalStudents - $studentsCompletedAll) . ' Siswa', 'colorClassName' => 'bg-slate-300'],
                ],
            ],
            'topStudents' => $topStudents
                ->map(fn (array $student) => [
                    'id' => $student['id'],
                    'name' => $student['name'],
                    'className' => $student['className'],
                    'progress' => $student['progress'],
                    'score' => $student['score'],
                    'status' => $student['status'],
                    'statusClassName' => $student['statusClassName'],
                    'avatar' => $student['avatar'],
                ])
                ->values(),
        ]);
    }

    private function ensureTeacher(Request $request): Pengguna
    {
        /** @var Pengguna|null $Pengguna */
        $Pengguna = $request->user();

        abort_unless($Pengguna && $Pengguna->isGuru(), 403, 'Akses khusus guru.');

        return $Pengguna;
    }

    private function studentStatus(float $score, int $ProgressLama): string
    {
        if ($score >= 90 && $ProgressLama >= 80) {
            return 'Excellent';
        }

        if ($score >= 75) {
            return 'Lulus';
        }

        if ($ProgressLama > 0) {
            return 'Berkembang';
        }

        return 'Belum Mulai';
    }

    private function studentStatusClass(float $score, int $ProgressLama): string
    {
        if ($score >= 90 && $ProgressLama >= 80) {
            return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300';
        }

        if ($score >= 75) {
            return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300';
        }

        if ($ProgressLama > 0) {
            return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300';
        }

        return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300';
    }

    private function avatarFromName(string $name): string
    {
        return 'https://ui-avatars.com/api/?background=71ab54&color=ffffff&name=' . urlencode($name);
    }
}
