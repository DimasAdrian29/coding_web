<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\ProgressBab;
use App\Models\RiwayatLatihan;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfilSiswaController extends Controller
{
    use ApiLearningHelpers;

    public function __invoke(): JsonResponse
    {
        return $this->show();
    }

    public function show(): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        $publishedChapterIds = Bab::query()
            ->whereIn('status', ['published', 'active'])
            ->where(function ($query) {
                $query->whereHas('material', fn ($materiQuery) => $materiQuery->whereIn('status', ['publish', 'published', 'active']))
                    ->orWhereHas('materi', fn ($materiQuery) => $materiQuery->whereIn('status', ['publish', 'published', 'active']));
            })
            ->pluck('id');
        $totalChapters = $publishedChapterIds->count();
        $completed = ProgressBab::where('user_id', $student->id)
            ->whereIn('chapter_id', $publishedChapterIds)
            ->where('status', 'completed')
            ->count();
        $attemptQuery = RiwayatLatihan::where('user_id', $student->id)
            ->whereNotNull('submitted_at')
            ->whereNotNull('score');
        $completedExercises = (clone $attemptQuery)->distinct('exercise_id')->count('exercise_id');
        $average = (clone $attemptQuery)->avg('score');
        $finalExamScore = (clone $attemptQuery)
            ->whereHas('exercise', fn ($query) => $query->where('type', 'final_exam'))
            ->max('score');

        return $this->ok([
            'profile' => [
                'id' => $student->id,
                'name' => $student->name,
                'initials' => $this->initials($student->name),
                'email' => $student->email,
                'phone' => $student->phone,
                'role' => $student->role,
                'nisn' => $student->nisn,
                'class_name' => $student->class_name,
                'major' => $student->major,
                'school_name' => $student->school_name,
                'status' => $student->status ?: 'active',
                'joined_at' => optional($student->created_at)->format('d M Y'),
                'last_login_at' => optional($student->last_login_at)->format('d M Y, H:i'),
            ],
            'learning_summary' => [
                'total_chapters' => $totalChapters,
                'completed_chapters' => $completed,
                'graded_exercises' => $completedExercises,
                'average_score' => $average === null ? null : round((float) $average, 1),
                'final_exam_score' => $finalExamScore === null ? null : round((float) $finalExamScore, 1),
            ],
        ], 'Profil siswa berhasil diambil');
    }

    public function update(Request $request): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        if (! in_array($student->role, [Pengguna::ROLE_SISWA, 'student'], true)) {
            return $this->fail('Anda tidak memiliki akses untuk mengubah profil siswa', null, 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('pengguna', 'email')->ignore($student->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'nisn' => ['nullable', 'regex:/^[0-9]+$/', Rule::unique('pengguna', 'nisn')->ignore($student->id)],
            'kelas' => ['nullable', 'string', 'max:50'],
            'school_name' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'confirmed', 'min:8'],
        ]);

        $student->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'nisn' => $validated['nisn'] ?? null,
            'class_name' => $validated['kelas'] ?? null,
            'school_name' => $validated['school_name'] ?? null,
        ]);

        if (! empty($validated['password'])) {
            $student->password = $validated['password'];
        }

        $student->save();

        return $this->ok([
            'profile' => [
                'id' => $student->id,
                'name' => $student->name,
                'initials' => $this->initials($student->name),
                'email' => $student->email,
                'phone' => $student->phone,
                'role' => $student->role,
                'nisn' => $student->nisn,
                'class_name' => $student->class_name,
                'major' => $student->major,
                'school_name' => $student->school_name,
                'status' => $student->status ?: 'active',
                'joined_at' => optional($student->created_at)->format('d M Y'),
                'last_login_at' => optional($student->last_login_at)->format('d M Y, H:i'),
            ],
        ], 'Profil siswa berhasil diperbarui');
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $student = $this->currentStudent();

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan', null, 404);
        }

        if (! in_array($student->role, [Pengguna::ROLE_SISWA, 'student'], true)) {
            return $this->fail('Anda tidak memiliki akses untuk mengubah password siswa', null, 403);
        }

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (! Hash::check($validated['current_password'], $student->password)) {
            return $this->fail('Password lama tidak sesuai', [
                'current_password' => ['Password lama tidak sesuai.'],
            ]);
        }

        $student->update([
            'password' => $validated['new_password'],
        ]);

        return $this->ok(null, 'Password siswa berhasil diperbarui');
    }

    private function initials(string $name): string
    {
        $parts = collect(preg_split('/\s+/', trim($name)) ?: [])
            ->filter()
            ->values();

        if ($parts->isEmpty()) {
            return '-';
        }

        return $parts
            ->take(2)
            ->map(fn (string $part) => mb_strtoupper(mb_substr($part, 0, 1)))
            ->implode('');
    }
}
