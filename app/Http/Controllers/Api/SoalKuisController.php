<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kuis;
use App\Models\SoalKuis;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SoalKuisController extends Controller
{
    public function store(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $quiz = Kuis::with('material')->findOrFail($id);

        $validated = $request->validate([
            'question' => ['required', 'string'],
            'option_a' => ['required', 'string', 'max:255'],
            'option_b' => ['required', 'string', 'max:255'],
            'option_c' => ['required', 'string', 'max:255'],
            'option_d' => ['required', 'string', 'max:255'],
            'correct_answer' => ['required', 'in:A,B,C,D'],
        ]);

        $quiz->questions()->create($validated);

        return response()->json([
            'message' => 'Soal quiz berhasil dibuat.',
            'material' => MateriController::transformMaterial($quiz->material->fresh(['chapters.exercises', 'quiz.questions'])),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $SoalLatihan = SoalKuis::with('quiz.material')->findOrFail($id);

        $validated = $request->validate([
            'question' => ['required', 'string'],
            'option_a' => ['required', 'string', 'max:255'],
            'option_b' => ['required', 'string', 'max:255'],
            'option_c' => ['required', 'string', 'max:255'],
            'option_d' => ['required', 'string', 'max:255'],
            'correct_answer' => ['required', 'in:A,B,C,D'],
        ]);

        $SoalLatihan->update($validated);

        return response()->json([
            'message' => 'Soal quiz berhasil diperbarui.',
            'material' => MateriController::transformMaterial($SoalLatihan->quiz->material->fresh(['chapters.exercises', 'quiz.questions'])),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $SoalLatihan = SoalKuis::with('quiz.material')->findOrFail($id);
        $Materi = $SoalLatihan->quiz->material;
        $SoalLatihan->delete();

        return response()->json([
            'message' => 'Soal quiz berhasil dihapus.',
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
