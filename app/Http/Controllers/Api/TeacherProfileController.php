<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\Latihan;
use App\Models\Materi;
use App\Models\PengumpulanLatihan;
use App\Models\Pengguna;
use App\Models\RiwayatLatihan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TeacherProfileController extends Controller
{
    use ApiLearningHelpers;

    public function show(): JsonResponse
    {
        $teacher = $this->currentTeacher();

        if (! $teacher) {
            return $this->fail('Data guru tidak ditemukan', null, 404);
        }

        return $this->ok($this->payload($teacher), 'Profil guru berhasil diambil');
    }

    public function update(Request $request): JsonResponse
    {
        $teacher = $this->currentTeacher();

        if (! $teacher) {
            return $this->fail('Data guru tidak ditemukan', null, 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('pengguna', 'email')->ignore($teacher->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'nip' => ['nullable', 'string', 'max:50', Rule::unique('pengguna', 'nip')->ignore($teacher->id)],
            'subject' => ['nullable', 'string', 'max:255'],
            'school_name' => ['nullable', 'string', 'max:255'],
        ]);

        $teacher->update($validated);

        return $this->ok($this->payload($teacher->fresh()), 'Profil guru berhasil diperbarui');
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $teacher = $this->currentTeacher();

        if (! $teacher) {
            return $this->fail('Data guru tidak ditemukan', null, 404);
        }

        $validated = $request->validate([
            'profile_photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($teacher->profile_photo) {
            Storage::disk('public')->delete($teacher->profile_photo);
        }

        $path = $validated['profile_photo']->store('profile-photos', 'public');
        $teacher->update(['profile_photo' => $path]);

        return $this->ok([
            'profile_photo_url' => asset(Storage::url($path)),
            'profile' => $this->profile($teacher->fresh()),
        ], 'Foto profil berhasil diperbarui');
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $teacher = $this->currentTeacher();

        if (! $teacher) {
            return $this->fail('Data guru tidak ditemukan', null, 404);
        }

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (! Hash::check($validated['current_password'], $teacher->password)) {
            return $this->fail('Password saat ini tidak sesuai', [
                'current_password' => ['Password saat ini tidak sesuai.'],
            ]);
        }

        $teacher->update(['password' => $validated['new_password']]);

        return $this->ok(null, 'Password berhasil diperbarui');
    }

    private function payload(Pengguna $teacher): array
    {
        $publishedMateri = Materi::whereIn('status', ['publish', 'published', 'active'])->count();
        $publishedBab = Bab::whereIn('status', ['published', 'active'])->count();
        $attemptAverage = RiwayatLatihan::whereNotNull('submitted_at')
            ->whereNotNull('score')
            ->avg('score');
        $pendingSubmissions = PengumpulanLatihan::whereIn('status', ['pending', 'pending_review'])->count();

        return [
            'profile' => $this->profile($teacher),
            'teaching_summary' => [
                'total_chapters' => $publishedBab,
                'published_materials' => $publishedMateri,
                'published_chapters' => $publishedMateri,
                'draft_chapters' => Bab::where('status', 'draft')->count(),
                'total_exercises' => Latihan::count(),
                'pending_submissions' => $pendingSubmissions,
                'graded_submissions' => PengumpulanLatihan::where('status', 'graded')->count(),
                'total_students' => Pengguna::whereIn('role', ['siswa', 'student'])->count(),
                'average_score' => $attemptAverage === null ? 0 : round((float) $attemptAverage, 1),
            ],
        ];
    }

    private function profile(Pengguna $teacher): array
    {
        return [
            'id' => $teacher->id,
            'name' => $teacher->name,
            'initials' => $this->initials($teacher->name),
            'email' => $teacher->email,
            'phone' => $teacher->phone,
            'role' => $teacher->role,
            'nip' => $teacher->nip,
            'subject' => $teacher->subject,
            'school_name' => $teacher->school_name,
            'profile_photo_url' => $teacher->profile_photo ? asset(Storage::url($teacher->profile_photo)) : null,
            'status' => $teacher->status ?: 'active',
            'joined_at' => optional($teacher->created_at)->locale('id')->translatedFormat('d M Y'),
            'last_login_at' => $this->lastLogin($teacher),
        ];
    }

    private function initials(?string $name): string
    {
        $words = collect(explode(' ', trim((string) $name)))->filter()->take(2);

        return $words->map(fn (string $word) => mb_substr($word, 0, 1))->implode('') ?: 'G';
    }

    private function lastLogin(Pengguna $teacher): ?string
    {
        if (! $teacher->last_login_at) {
            return null;
        }

        $lastLogin = Carbon::parse($teacher->last_login_at);

        return $lastLogin->isToday()
            ? 'Hari ini'
            : $lastLogin->locale('id')->translatedFormat('d M Y, H:i');
    }
}
