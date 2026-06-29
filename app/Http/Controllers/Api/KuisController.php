<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\Kuis;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KuisController extends Controller
{
    public function store(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Materi = Materi::with(['chapters.exercises', 'quiz.questions'])->findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:300'],
        ]);

        $quiz = $Materi->quiz;
        if ($quiz) {
            $quiz->update($validated);
        } else {
            $Materi->quiz()->create($validated);
        }

        return response()->json([
            'message' => 'Quiz akhir berhasil disimpan.',
            'material' => MateriController::transformMaterial($Materi->fresh(['chapters.exercises', 'quiz.questions'])),
        ], $quiz ? 200 : 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $quiz = Kuis::with('material')->findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:300'],
        ]);

        $quiz->update($validated);

        return response()->json([
            'message' => 'Quiz akhir berhasil diperbarui.',
            'material' => MateriController::transformMaterial($quiz->material->fresh(['chapters.exercises', 'quiz.questions'])),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $quiz = Kuis::with('material')->findOrFail($id);
        $Materi = $quiz->material;
        $quiz->delete();

        return response()->json([
            'message' => 'Quiz akhir berhasil dihapus.',
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
