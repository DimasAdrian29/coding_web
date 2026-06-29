<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\Latihan;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LatihanController extends Controller
{
    public function store(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Bab = Bab::with('material')->findOrFail($id);

        $validated = $request->validate([
            'question' => ['required', 'string'],
            'option_a' => ['required', 'string', 'max:255'],
            'option_b' => ['required', 'string', 'max:255'],
            'option_c' => ['required', 'string', 'max:255'],
            'option_d' => ['required', 'string', 'max:255'],
            'correct_answer' => ['required', 'in:A,B,C,D'],
        ]);

        $Bab->exercises()->create($validated);

        return response()->json([
            'message' => 'Latihan berhasil dibuat.',
            'material' => MateriController::transformMaterial($Bab->material->fresh(['chapters.exercises', 'quiz.questions'])),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Latihan = Latihan::with('chapter.material')->findOrFail($id);

        $validated = $request->validate([
            'question' => ['required', 'string'],
            'option_a' => ['required', 'string', 'max:255'],
            'option_b' => ['required', 'string', 'max:255'],
            'option_c' => ['required', 'string', 'max:255'],
            'option_d' => ['required', 'string', 'max:255'],
            'correct_answer' => ['required', 'in:A,B,C,D'],
        ]);

        $Latihan->update($validated);

        return response()->json([
            'message' => 'Latihan berhasil diperbarui.',
            'material' => MateriController::transformMaterial($Latihan->chapter->material->fresh(['chapters.exercises', 'quiz.questions'])),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Latihan = Latihan::with('chapter.material')->findOrFail($id);
        $Materi = $Latihan->chapter->material;
        $Latihan->delete();

        return response()->json([
            'message' => 'Latihan berhasil dihapus.',
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
