<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\ProgressBab;
use App\Models\Latihan;
use App\Models\Materi;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class DashboardGuruController extends Controller
{
    use ApiLearningHelpers;

    public function __invoke(): JsonResponse
    {
        $teacher = $this->currentTeacher();

        if (! $teacher) {
            return $this->fail('Data guru tidak ditemukan', null, 404);
        }

        $visits = collect(range(6, 0))->map(function (int $offset) {
            $day = Carbon::now()->subDays($offset);

            return [
                'hari' => $day->locale('id')->translatedFormat('D'),
                'kunjungan' => ProgressBab::whereDate('updated_at', $day->toDateString())->count(),
            ];
        });

        $ProgressLama = $this->orderedChapters()->where('status', 'published')->limit(5)->get()
            ->map(fn (Bab $Bab) => [
                'BabLama' => 'BabLama ' . ($Bab->order_number ?? $Bab->chapter_order ?? $Bab->id),
                'selesai' => ProgressBab::where('chapter_id', $Bab->id)->where('status', 'completed')->count(),
                'sedangBelajar' => ProgressBab::where('chapter_id', $Bab->id)->where('status', 'in_progress')->count(),
            ]);

        return $this->ok([
            'teacherName' => $teacher->name,
            'stats' => [
                'totalMateri' => Materi::count(),
                'materiAktif' => Materi::whereIn('status', ['publish', 'published', 'active'])->count(),
                'totalBab' => Bab::count(),
                'babPublished' => Bab::whereIn('status', ['published', 'active'])->count(),
                'totalSiswa' => Pengguna::whereIn('role', ['siswa', 'student'])->count(),
                'siswaAktif' => Pengguna::whereIn('role', ['siswa', 'student'])->where('updated_at', '>=', now()->subWeek())->count(),
                'totalLatihan' => Latihan::count(),
                'latihanPerBab' => Latihan::where('type', 'chapter')->count(),
            ],
            'studentVisits' => $visits,
            'ProgressBab' => $ProgressLama,
            'student_visits_chart' => $visits,
            'chapter_progress_chart' => $ProgressLama,
        ]);
    }
}
