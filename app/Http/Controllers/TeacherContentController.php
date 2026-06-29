<?php

namespace App\Http\Controllers;

use App\Models\BabLama;
use App\Models\Bab;
use App\Models\Latihan;
use App\Models\Materi;
use App\Models\MateriLama;
use App\Models\ProgressLama;
use App\Models\Kuis;
use App\Models\ProgressBabSiswa;
use App\Models\ProgressLatihanSiswa;
use App\Models\ProgressMateriSiswa;
use App\Models\ProgressKuisSiswa;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class TeacherContentController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $teacher = $this->ensureTeacher($request);

        $totalMaterials = MateriLama::count();
        $totalBabs = BabLama::count();
        $totalStudents = Pengguna::where('role', Pengguna::ROLE_SISWA)->count();
        $completedExercises = ProgressLama::whereNotNull('exercise_completed_at')->count();

        $stats = [
            [
                'title' => 'Total MateriLama',
                'value' => $totalMaterials,
                'icon' => 'menu_book',
                'tone' => 'default',
            ],
            [
                'title' => 'Total BabLama',
                'value' => $totalBabs,
                'icon' => 'library_books',
                'tone' => 'default',
            ],
            [
                'title' => 'Total Siswa',
                'value' => $totalStudents,
                'icon' => 'group',
                'tone' => 'default',
            ],
            [
                'title' => 'Latihan Selesai',
                'value' => $completedExercises,
                'icon' => 'task_alt',
                'tone' => 'highlight',
            ],
        ];

        $days = collect(range(6, 0))
            ->map(fn (int $offset) => Carbon::now()->subDays($offset))
            ->values();

        $activityCounts = $days->map(function (Carbon $day) {
            return ProgressLama::query()
                ->where(function ($query) use ($day) {
                    $query->whereDate('completed_at', $day->toDateString())
                        ->orWhereDate('exercise_completed_at', $day->toDateString());
                })
                ->count();
        });

        $maxCount = max($activityCounts->max(), 1);
        $weeklyActivity = [
            'items' => $days->map(function (Carbon $day, int $index) use ($activityCounts, $maxCount) {
                $count = $activityCounts[$index];
                $percentage = max(12, (int) round(($count / $maxCount) * 100));
                $isPeak = $count === $activityCounts->max();

                return [
                    'day' => $day->locale('id')->translatedFormat('D'),
                    'value' => $percentage,
                    'tone' => $isPeak
                        ? 'bg-primary'
                        : ($count > 0 ? 'bg-primary/30 hover:bg-primary/40' : 'bg-primary/10 hover:bg-primary/20'),
                ];
            })->all(),
        ];

        $submissionRows = ProgressLama::query()
            ->with(['user', 'bab.materi'])
            ->whereHas('user', fn ($query) => $query->where('role', Pengguna::ROLE_SISWA))
            ->where('exercise_attempts', '>', 0)
            ->orderByDesc('updated_at')
            ->limit(8)
            ->get()
            ->map(function (ProgressLama $ProgressLama) {
                $name = $ProgressLama->user?->name ?? 'Siswa';
                $parts = preg_split('/\s+/', trim($name)) ?: [];
                $initials = collect($parts)
                    ->take(2)
                    ->map(fn (string $part) => Str::upper(Str::substr($part, 0, 1)))
                    ->implode('');

                return [
                    'studentName' => $name,
                    'initials' => $initials ?: 'SW',
                    'material' => $ProgressLama->bab?->materi?->title ?? '-',
                    'submittedAt' => optional($ProgressLama->updated_at)->locale('id')->diffForHumans() ?? '-',
                    'status' => $ProgressLama->exercise_completed_at ? 'Selesai' : 'Perlu Review',
                    'statusTone' => $ProgressLama->exercise_completed_at ? 'success' : 'pending',
                    'actionLabel' => $ProgressLama->exercise_completed_at ? 'Detail' : 'Review',
                    'id' => $ProgressLama->id,
                ];
            })
            ->values()
            ->all();

        return response()->json([
            'profile' => $this->buildTeacherProfile($teacher),
            'stats' => $stats,
            'weeklyActivity' => $weeklyActivity,
            'submissionRows' => $submissionRows,
        ]);
    }

    public function materials(Request $request): JsonResponse
    {
        $this->ensureTeacher($request);

        $materials = MateriLama::withCount('babs')
            ->orderBy('id')
            ->get()
            ->map(function (MateriLama $MateriLama) {
                return [
                    'id' => $MateriLama->id,
                    'title' => $MateriLama->title,
                    'babCount' => "{$MateriLama->babs_count} BabLama",
                    'createdAt' => optional($MateriLama->created_at)->locale('id')->translatedFormat('d M Y') ?? '-',
                    'icon' => $this->iconForMaterial($MateriLama->title),
                ];
            })
            ->values();

        $total = $materials->count();

        return response()->json([
            'topbar' => [
                'title' => 'Kelola MateriLama',
                'searchPlaceholder' => 'Cari MateriLama...',
                'profileAvatar' => $this->avatarFromName($request->user()->name),
            ],
            'pageHeader' => [
                'title' => 'Daftar MateriLama',
                'description' => 'Kelola dan perbarui MateriLama pembelajaran coding yang dipakai guru dan siswa.',
                'actionLabel' => 'Tambah MateriLama',
                'secondaryActionLabel' => 'Kelola BabLama',
            ],
            'materials' => $materials,
            'pagination' => [
                'summary' => "Menampilkan 1 - {$total} dari {$total} MateriLama",
                'pages' => [1],
                'currentPage' => 1,
                'hasPrevious' => false,
                'hasNext' => false,
            ],
        ]);
    }

    public function babs(Request $request): JsonResponse
    {
        $this->ensureTeacher($request);

        $materials = MateriLama::with('babs')->orderBy('title')->get();

        $groups = $materials->map(function (MateriLama $MateriLama) {
            return [
                'id' => $MateriLama->id,
                'icon' => $this->iconForMaterial($MateriLama->title),
                'iconClassName' => $this->iconClassForMaterial($MateriLama->title),
                'title' => "MateriLama: {$MateriLama->title}",
                'totalLabel' => $MateriLama->babs->count() . ' BabLama',
                'items' => $MateriLama->babs
                    ->sortBy('order_number')
                    ->values()
                    ->map(function (BabLama $BabLama) {
                        $isReady = filled($BabLama->content) && filled($BabLama->exercise_answer) && filled($BabLama->quiz_title);

                        return [
                            'id' => $BabLama->id,
                            'order' => str_pad((string) $BabLama->order_number, 2, '0', STR_PAD_LEFT),
                            'title' => $BabLama->title,
                            'description' => $BabLama->description,
                            'status' => $isReady ? 'Publik' : 'Draft',
                            'statusTone' => $isReady ? 'public' : 'draft',
                        ];
                    })
                    ->all(),
            ];
        })->values();

        $filterTabs = collect([
            ['id' => 'all', 'label' => 'Semua MateriLama', 'active' => true],
        ])->merge(
            $materials->map(fn (MateriLama $MateriLama) => [
                'id' => (string) $MateriLama->id,
                'label' => $MateriLama->title,
                'active' => false,
            ])
        )->values();

        return response()->json([
            'header' => [
                'title' => 'Kelola BabLama Pembelajaran',
                'searchPlaceholder' => 'Cari MateriLama atau BabLama...',
                'profileImage' => $this->avatarFromName($request->user()->name),
            ],
            'pageHeader' => [
                'title' => 'Daftar BabLama',
                'description' => 'Kelola struktur kurikulum coding dan urutan pembelajaran yang dipakai siswa.',
                'actionLabel' => 'Tambah BabLama Baru',
                'actionHref' => '/dashboard-guru/materi/bab',
            ],
            'filterTabs' => $filterTabs,
            'groups' => $groups,
            'emptyState' => [
                'title' => 'Ingin membuat MateriLama baru?',
                'description' => 'Setiap MateriLama dapat memiliki banyak BabLama. Mulailah dengan menambahkan BabLama pertama agar siswa bisa belajar bertahap.',
                'actionLabel' => 'Pelajari cara menyusun kurikulum',
            ],
            'footer' => [
                'text' => 'Guru Dashboard © 2026 - Sistem Manajemen Pembelajaran Coding',
            ],
        ]);
    }

    public function exercises(Request $request): JsonResponse
    {
        $this->ensureTeacher($request);

        $babs = BabLama::with('materi')->orderBy('materi_id')->orderBy('order_number')->get();

        $exerciseItems = $babs
            ->filter(fn (BabLama $BabLama) => filled($BabLama->exercise_title) || filled($BabLama->exercise_prompt))
            ->map(function (BabLama $BabLama) {
                $questionCount = is_array($BabLama->exercise_questions) ? count($BabLama->exercise_questions) : 0;

                return [
                    'id' => $BabLama->id,
                    'question' => ($BabLama->exercise_title ?: "Latihan {$BabLama->title}") . " ({$questionCount} soal)",
                    'subject' => $BabLama->materi?->title ?? '-',
                    'answer' => $questionCount > 0 ? "{$questionCount} pilihan ganda" : '-',
                ];
            })
            ->values();

        $avgScore = (int) round((float) ProgressLama::query()
            ->whereNotNull('exercise_last_score')
            ->avg('exercise_last_score'));

        return response()->json([
            'header' => [
                'title' => 'Kelola Latihan',
                'description' => 'Daftar latihan coding yang langsung dipakai siswa setelah menyelesaikan BabLama.',
                'actionLabel' => 'Tambah Latihan',
            ],
            'stats' => [
                ['label' => 'Total Latihan', 'value' => $exerciseItems->count(), 'highlight' => false],
                ['label' => 'Latihan Aktif', 'value' => $exerciseItems->where('answer', '!=', '-')->count(), 'highlight' => true],
                ['label' => 'Rata-rata Nilai', 'value' => $avgScore, 'highlight' => false],
            ],
            'items' => $exerciseItems,
            'form' => [
                'defaultValues' => [
                    'subject' => $exerciseItems->first()['subject'] ?? '',
                    'answer' => 'A',
                    'question' => '',
                    'optionA' => '',
                    'optionB' => '',
                    'optionC' => '',
                    'optionD' => '',
                ],
                'subjects' => MateriLama::orderBy('title')->pluck('title')->values()->all(),
                'answerOptions' => ['A', 'B', 'C', 'D'],
            ],
        ]);
    }

    public function quizzes(Request $request): JsonResponse
    {
        $this->ensureTeacher($request);

        $babs = BabLama::with('materi')->orderBy('materi_id')->orderBy('order_number')->get();

        $quizItems = $babs
            ->filter(fn (BabLama $BabLama) => filled($BabLama->quiz_title) || ! empty($BabLama->quiz_questions))
            ->map(function (BabLama $BabLama) {
                $questionCount = is_array($BabLama->quiz_questions) ? count($BabLama->quiz_questions) : 0;

                return [
                    'id' => $BabLama->id,
                    'title' => $BabLama->quiz_title ?: "Quiz {$BabLama->title}",
                    'material' => $BabLama->materi?->title ?? '-',
                    'babTitle' => $BabLama->title,
                    'questionCount' => $questionCount,
                    'status' => $questionCount > 0 ? 'Aktif' : 'Draft',
                ];
            })
            ->values();

        $totalQuestions = $quizItems->sum('questionCount');
        $activeQuizzes = $quizItems->where('status', 'Aktif')->count();
        $avgQuestions = $quizItems->count() > 0 ? round($totalQuestions / $quizItems->count(), 1) : 0;

        return response()->json([
            'header' => [
                'title' => 'Kelola Quiz',
                'description' => 'Kelola bank soal quiz yang dipakai siswa setelah latihan selesai.',
                'actionLabel' => 'Tambah Quiz',
            ],
            'stats' => [
                ['label' => 'Total Quiz', 'value' => $quizItems->count(), 'highlight' => false],
                ['label' => 'Quiz Aktif', 'value' => $activeQuizzes, 'highlight' => true],
                ['label' => 'Total Soal Quiz', 'value' => $totalQuestions, 'highlight' => false],
                ['label' => 'Rata-rata Soal', 'value' => $avgQuestions, 'highlight' => false],
            ],
            'items' => $quizItems->all(),
            'preview' => $babs
                ->filter(fn (BabLama $BabLama) => ! empty($BabLama->quiz_questions))
                ->take(1)
                ->map(function (BabLama $BabLama) {
                    return [
                        'title' => $BabLama->quiz_title ?: "Quiz {$BabLama->title}",
                        'material' => $BabLama->materi?->title ?? '-',
                        'questions' => collect($BabLama->quiz_questions)->take(5)->values()->all(),
                    ];
                })
                ->first(),
        ]);
    }

    public function studentStats(Request $request): JsonResponse
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
        $legacyProgresses = ProgressLama::whereIn('user_id', $studentIds)->get();

        $allScores = $exerciseProgresses
            ->pluck('score')
            ->merge($quizProgresses->pluck('score'))
            ->merge($legacyProgresses->pluck('exercise_last_score'))
            ->filter(fn ($score) => ! is_null($score));

        $avgScore = round((float) $allScores->avg(), 1);
        $completedTasks = $exerciseProgresses
            ->where('status', 'completed')
            ->count()
            + $legacyProgresses->whereNotNull('exercise_completed_at')->count();

        $progressByStudent = $students->map(function (Pengguna $student) use (
            $materialProgresses,
            $chapterProgresses,
            $exerciseProgresses,
            $quizProgresses,
            $legacyProgresses,
            $totalLearningSteps
        ) {
            $studentMaterialProgresses = $materialProgresses->where('student_id', $student->id);
            $studentChapterProgresses = $chapterProgresses->where('student_id', $student->id);
            $studentExerciseProgresses = $exerciseProgresses->where('student_id', $student->id);
            $studentQuizProgresses = $quizProgresses->where('student_id', $student->id);
            $studentLegacyProgresses = $legacyProgresses->where('user_id', $student->id);
            $studentScores = $studentExerciseProgresses
                ->pluck('score')
                ->merge($studentQuizProgresses->pluck('score'))
                ->merge($studentLegacyProgresses->pluck('exercise_last_score'))
                ->filter(fn ($score) => ! is_null($score));
            $completedSteps = $studentMaterialProgresses->where('is_completed', true)->count()
                + $studentChapterProgresses->where('status', 'completed')->count()
                + $studentExerciseProgresses->where('status', 'completed')->count()
                + $studentQuizProgresses->where('status', 'completed')->count()
                + $studentLegacyProgresses->where('is_completed', true)->count()
                + $studentLegacyProgresses->whereNotNull('exercise_completed_at')->count();
            $score = round((float) $studentScores->avg(), 1);
            $ProgressLama = min(100, (int) round(($completedSteps / $totalLearningSteps) * 100));

            if ($score >= 90 && $ProgressLama >= 80) {
                $status = 'Excellent';
                $statusClassName = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300';
            } elseif ($score >= 75) {
                $status = 'Lulus';
                $statusClassName = 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300';
            } elseif ($ProgressLama > 0) {
                $status = 'Berkembang';
                $statusClassName = 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300';
            } else {
                $status = 'Belum Mulai';
                $statusClassName = 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300';
            }

            return [
                'name' => $student->name,
                'className' => $student->nisn ? "NISN {$student->nisn}" : 'Siswa SMK',
                'progress' => $ProgressLama,
                'score' => $score,
                'status' => $status,
                'statusClassName' => $statusClassName,
                'avatar' => $this->avatarFromName($student->name),
            ];
        });

        $graduationRate = $totalStudents > 0
            ? (int) round(($progressByStudent->filter(fn (array $student) => $student['score'] >= 75)->count() / $totalStudents) * 100)
            : 0;

        $monthlyCounts = collect(range(5, 0))
            ->map(function (int $offset) {
                $month = Carbon::now()->startOfMonth()->subMonths($offset);
                $endOfMonth = $month->copy()->endOfMonth();
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
                    + ProgressLama::where(function ($query) use ($endOfMonth) {
                        $query->whereNotNull('completed_at')
                            ->where('completed_at', '<=', $endOfMonth);
                    })->count()
                    + ProgressLama::where(function ($query) use ($endOfMonth) {
                        $query->whereNotNull('exercise_completed_at')
                            ->where('exercise_completed_at', '<=', $endOfMonth);
                    })->count();

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

        $studentsCompletedAll = $progressByStudent
            ->filter(fn (array $student) => $student['progress'] >= 100)
            ->count();

        $completionPercentage = $totalStudents > 0 ? (int) round(($studentsCompletedAll / $totalStudents) * 100) : 0;

        $topStudents = $progressByStudent
            ->sortByDesc(fn (array $item) => sprintf('%03d%06.2f', $item['progress'], $item['score']))
            ->take(5)
            ->values()
            ->all();
        $topSiswa = collect($topStudents)
            ->map(fn (array $student) => [
                'nama' => $student['name'],
                'kelas' => $student['className'],
                'nilai' => $student['score'],
                'progress' => $student['progress'],
            ])
            ->values()
            ->all();

        return response()->json([
            'total_siswa' => $totalStudents,
            'rata_rata_nilai' => $avgScore,
            'tingkat_kelulusan' => $graduationRate,
            'total_latihan_selesai' => $completedTasks,
            'progress_bulanan' => $monthlyPercentages->all(),
            'top_siswa' => $topSiswa,
            'header' => [
                'title' => 'Statistik Siswa',
                'searchPlaceholder' => 'Cari nama siswa...',
            ],
            'statsCards' => [
                [
                    'label' => 'Total Siswa',
                    'value' => $totalStudents,
                    'trend' => 'Real-time',
                    'trendIcon' => 'database',
                    'trendClassName' => 'text-primary',
                ],
                [
                    'label' => 'Rata-rata Nilai',
                    'value' => $avgScore,
                    'trend' => 'Database',
                    'trendIcon' => 'analytics',
                    'trendClassName' => 'text-primary',
                ],
                [
                    'label' => 'Tingkat Kelulusan',
                    'value' => "{$graduationRate}%",
                    'trend' => 'Nilai >= 75',
                    'trendIcon' => 'verified',
                    'trendClassName' => 'text-emerald-500',
                ],
                [
                    'label' => 'Latihan Selesai',
                    'value' => $completedTasks,
                    'trend' => 'Tuntas',
                    'trendIcon' => 'task_alt',
                    'trendClassName' => 'text-emerald-500',
                ],
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
                    [
                        'label' => 'Tuntas',
                        'value' => "{$studentsCompletedAll} Siswa",
                        'colorClassName' => 'bg-primary',
                    ],
                    [
                        'label' => 'Berjalan',
                        'value' => ($totalStudents - $studentsCompletedAll) . ' Siswa',
                        'colorClassName' => 'bg-slate-300',
                    ],
                ],
            ],
            'topStudents' => $topStudents,
        ]);
    }

    private function ensureTeacher(Request $request): Pengguna
    {
        /** @var Pengguna|null $Pengguna */
        $Pengguna = $request->user();

        abort_unless($Pengguna && $Pengguna->isGuru(), 403, 'Akses khusus guru.');

        return $Pengguna;
    }

    private function buildTeacherProfile(Pengguna $teacher): array
    {
        return [
            'name' => $teacher->name,
            'role' => 'Guru Coding',
            'avatar' => $this->avatarFromName($teacher->name),
        ];
    }

    private function avatarFromName(string $name): string
    {
        return 'https://ui-avatars.com/api/?background=71ab54&color=ffffff&name=' . urlencode($name);
    }

    private function iconForMaterial(string $title): string
    {
        $normalized = Str::lower($title);

        return match (true) {
            str_contains($normalized, 'javascript') => 'code',
            str_contains($normalized, 'html') || str_contains($normalized, 'css') => 'language',
            default => 'menu_book',
        };
    }

    private function iconClassForMaterial(string $title): string
    {
        $normalized = Str::lower($title);

        return match (true) {
            str_contains($normalized, 'javascript') => 'bg-primary/10 text-primary',
            str_contains($normalized, 'html') || str_contains($normalized, 'css') => 'bg-blue-100 text-blue-600 dark:bg-blue-900/20',
            default => 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        };
    }
}
