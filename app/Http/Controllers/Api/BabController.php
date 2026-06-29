<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\Materi;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BabController extends Controller
{
    public function store(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Materi = Materi::with(['chapters.exercises', 'quiz.questions'])->findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:255'],
            'judul_contoh_kode' => ['nullable', 'string', 'max:255'],
            'bahasa_pemrograman' => ['nullable', 'string', 'max:50'],
            'contoh_kode' => ['nullable', 'string'],
            'penjelasan_kode' => ['nullable', 'string'],
            'order_number' => ['nullable', 'integer', 'min:1'],
            'chapter_order' => ['required', 'integer', 'min:1'],
            'status' => ['nullable', 'in:draft,published'],
        ]);

        $Materi->chapters()->create([
            ...$validated,
            'order_number' => $validated['order_number'] ?? $validated['chapter_order'],
            'status' => $validated['status'] ?? 'draft',
        ]);

        return response()->json([
            'message' => 'BabLama berhasil dibuat.',
            'material' => MateriController::transformMaterial($Materi->fresh(['chapters.exercises', 'quiz.questions'])),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Bab = Bab::with('material')->findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:255'],
            'judul_contoh_kode' => ['nullable', 'string', 'max:255'],
            'bahasa_pemrograman' => ['nullable', 'string', 'max:50'],
            'contoh_kode' => ['nullable', 'string'],
            'penjelasan_kode' => ['nullable', 'string'],
            'order_number' => ['nullable', 'integer', 'min:1'],
            'chapter_order' => ['required', 'integer', 'min:1'],
            'status' => ['nullable', 'in:draft,published'],
        ]);

        $Bab->update([
            ...$validated,
            'order_number' => $validated['order_number'] ?? $validated['chapter_order'],
            'status' => $validated['status'] ?? $Bab->status,
        ]);

        return response()->json([
            'message' => 'BabLama berhasil diperbarui.',
            'material' => MateriController::transformMaterial($Bab->material->fresh(['chapters.exercises', 'quiz.questions'])),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Bab = Bab::with('material')->findOrFail($id);
        $Materi = $Bab->material;
        $Bab->delete();

        return response()->json([
            'message' => 'BabLama berhasil dihapus.',
            'material' => MateriController::transformMaterial($Materi->fresh(['chapters.exercises', 'quiz.questions'])),
        ]);
    }

    private function ensureTeacher(Request $request): void
    {
        /** @var Pengguna|null $Pengguna */
        $Pengguna = $request->user();

        abort_unless($Pengguna && $Pengguna->isGuru(), 403, 'Akses khusus guru.');
    }
}
