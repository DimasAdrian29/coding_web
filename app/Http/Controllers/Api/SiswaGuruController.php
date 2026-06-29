<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

class SiswaGuruController extends Controller
{
    use ApiLearningHelpers;

    public function index(Request $request): JsonResponse
    {
        if (! $this->currentTeacher()) {
            return $this->fail('Akses khusus guru.', null, 403);
        }

        $search = trim((string) $request->query('search', ''));

        $students = Pengguna::query()
            ->where('role', Pengguna::ROLE_SISWA)
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($studentQuery) use ($search) {
                    $studentQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->get()
            ->map(fn (Pengguna $student) => $this->studentPayload($student))
            ->values();

        return $this->ok([
            'students' => $students,
            'total' => $students->count(),
        ], 'Daftar siswa berhasil diambil');
    }

    public function update(Request $request, int $studentId): JsonResponse
    {
        if (! $this->currentTeacher()) {
            return $this->fail('Akses khusus guru.', null, 403);
        }

        $student = $this->findStudent($studentId);

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan.', null, 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('pengguna', 'email')->ignore($student->id)],
            'nisn' => ['required', 'string', 'max:30', Rule::unique('pengguna', 'nisn')->ignore($student->id)],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $student->update($validated);

        return $this->ok([
            'student' => $this->studentPayload($student->fresh()),
        ], 'Data siswa berhasil diperbarui');
    }

    public function resetPassword(int $studentId): JsonResponse
    {
        if (! $this->currentTeacher()) {
            return $this->fail('Akses khusus guru.', null, 403);
        }

        $student = $this->findStudent($studentId);

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan.', null, 404);
        }

        $student->update([
            'password' => Hash::make('12345678'),
        ]);

        return $this->ok(null, 'Password siswa berhasil direset.');
    }

    public function destroy(int $studentId): JsonResponse
    {
        if (! $this->currentTeacher()) {
            return $this->fail('Akses khusus guru.', null, 403);
        }

        $student = $this->findStudent($studentId);

        if (! $student) {
            return $this->fail('Data siswa tidak ditemukan.', null, 404);
        }

        DB::transaction(function () use ($student) {
            $this->deleteRelatedStudentData($student->id);
            $student->delete();
        });

        return $this->ok(null, 'Akun siswa berhasil dihapus.');
    }

    private function findStudent(int $studentId): ?Pengguna
    {
        return Pengguna::where('role', Pengguna::ROLE_SISWA)
            ->whereKey($studentId)
            ->first();
    }

    private function studentPayload(Pengguna $student): array
    {
        return [
            'id' => $student->id,
            'name' => $student->name,
            'nisn' => $student->nisn,
            'email' => $student->email,
            'phone' => $student->phone,
            'class_name' => $student->class_name,
            'status' => $student->status ?: 'active',
            'created_at' => optional($student->created_at)->toDateTimeString(),
        ];
    }

    private function deleteRelatedStudentData(int $studentId): void
    {
        if (Schema::hasTable('riwayat_latihan')) {
            $attemptIds = DB::table('riwayat_latihan')
                ->where('user_id', $studentId)
                ->pluck('id');

            if ($attemptIds->isNotEmpty() && Schema::hasTable('jawaban_riwayat_latihan')) {
                DB::table('jawaban_riwayat_latihan')
                    ->whereIn('exercise_attempt_id', $attemptIds)
                    ->delete();
            }

            DB::table('riwayat_latihan')
                ->where('user_id', $studentId)
                ->delete();
        }

        if (Schema::hasTable('pengumpulan_siswa')) {
            $submissionIds = DB::table('pengumpulan_siswa')
                ->where('student_id', $studentId)
                ->pluck('id');

            if ($submissionIds->isNotEmpty() && Schema::hasTable('jawaban_pengumpulan_siswa')) {
                DB::table('jawaban_pengumpulan_siswa')
                    ->whereIn('student_submission_id', $submissionIds)
                    ->delete();
            }

            DB::table('pengumpulan_siswa')
                ->where('student_id', $studentId)
                ->delete();
        }

        $userTables = [
            'progress_bab',
            'hasil_latihan_akhir',
            'pengumpulan_latihan',
            'progress_lama',
        ];

        foreach ($userTables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'user_id')) {
                DB::table($table)->where('user_id', $studentId)->delete();
            }
        }

        $studentTables = [
            'progress_materi_siswa',
            'progress_bab_siswa',
            'progress_latihan_siswa',
            'progress_kuis_siswa',
        ];

        foreach ($studentTables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'student_id')) {
                DB::table($table)->where('student_id', $studentId)->delete();
            }
        }
    }
}
