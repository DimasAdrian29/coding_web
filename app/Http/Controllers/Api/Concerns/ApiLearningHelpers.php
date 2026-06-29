<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Models\Bab;
use App\Models\Materi;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

trait ApiLearningHelpers
{
    protected function ok(mixed $data = null, string $message = 'Data berhasil diambil'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }

    protected function fail(string $message, mixed $errors = null, int $status = 422): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    protected function currentStudent(): ?Pengguna
    {
        $request = request();
        $Pengguna = Auth::guard('web')->user() ?? Auth::user() ?? $request->user();

        if ($Pengguna && in_array(strtolower((string) $Pengguna->role), ['siswa', 'student'], true)) {
            return $Pengguna;
        }

        $userId = $request->header('X-User-Id')
            ?? $request->header('X-Student-Id')
            ?? $request->query('user_id')
            ?? $request->query('student_id');

        if (! $userId) {
            return null;
        }

        return Pengguna::whereIn('role', ['siswa', 'student', 'Siswa', 'Student'])
            ->whereKey($userId)
            ->first();
    }

    protected function currentTeacher(): ?Pengguna
    {
        $request = request();
        $Pengguna = Auth::guard('web')->user() ?? Auth::user() ?? $request->user();

        if ($Pengguna && in_array($Pengguna->role, ['guru', 'teacher', 'admin'], true)) {
            return $Pengguna;
        }

        $userId = $request->header('X-User-Id')
            ?? $request->header('X-Teacher-Id')
            ?? $request->query('user_id')
            ?? $request->query('teacher_id');

        if (! $userId) {
            return null;
        }

        return Pengguna::whereIn('role', ['guru', 'teacher', 'admin'])
            ->whereKey($userId)
            ->first();
    }

    protected function defaultMaterialId(): int
    {
        $Materi = Materi::query()->firstOrCreate(
            ['title' => 'Python'],
            ['description' => 'MateriLama pembelajaran Python', 'status' => 'publish'],
        );

        return $Materi->id;
    }

    protected function chapterOrderColumn(): string
    {
        return Schema::hasColumn('bab', 'order_number') ? 'order_number' : 'chapter_order';
    }

    protected function orderedChapters()
    {
        return Bab::query()
            ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
            ->orderBy('id');
    }
}
