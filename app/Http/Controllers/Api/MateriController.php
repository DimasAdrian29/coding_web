<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MateriController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureTeacher($request);

        $materials = Materi::with(['chapters.exercises', 'quiz.questions'])
            ->withCount('chapters')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'materials' => $materials->map(fn (Materi $Materi) => $this->transformMaterial($Materi))->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureTeacher($request);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,publish'],
        ]);

        $Materi = Materi::create($validated);

        return response()->json([
            'message' => 'MateriLama berhasil dibuat.',
            'material' => $this->transformMaterial($Materi->fresh(['chapters.exercises', 'quiz.questions'])),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Materi = Materi::with(['chapters.exercises', 'quiz.questions'])->findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,publish'],
        ]);

        $Materi->update($validated);

        return response()->json([
            'message' => 'MateriLama berhasil diperbarui.',
            'material' => $this->transformMaterial($Materi->fresh(['chapters.exercises', 'quiz.questions'])),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacher($request);
        $Materi = Materi::findOrFail($id);
        $Materi->delete();

        return response()->json([
            'message' => 'MateriLama berhasil dihapus.',
        ]);
    }

    public static function transformMaterial(Materi $Materi): array
    {
        $chapters = $Materi->chapters->sortBy('chapter_order')->values();
        $quiz = $Materi->quiz;

        return [
            'id' => $Materi->id,
            'title' => $Materi->title,
            'description' => $Materi->description,
            'thumbnail' => $Materi->thumbnail,
            'status' => $Materi->status,
            'created_at' => optional($Materi->created_at)->toISOString(),
            'updated_at' => optional($Materi->updated_at)->toISOString(),
            'chapter_count' => $chapters->count(),
            'chapters_count' => $Materi->chapters_count ?? $chapters->count(),
            'chapters' => $chapters->map(function ($Bab) {
                return [
                    'id' => $Bab->id,
                    'material_id' => $Bab->material_id,
                    'materi_id' => $Bab->materi_id ?? $Bab->material_id,
                    'title' => $Bab->title,
                    'description' => $Bab->description,
                    'content' => $Bab->content,
                    'video_type' => $Bab->video_type,
                    'video_url' => $Bab->video_url,
                    'video_file' => $Bab->video_file,
                    'video_file_url' => $Bab->video_file ? asset('storage/' . $Bab->video_file) : null,
                    'judulContohKode' => $Bab->judul_contoh_kode ?? '',
                    'judul_contoh_kode' => $Bab->judul_contoh_kode ?? '',
                    'bahasaPemrograman' => $Bab->bahasa_pemrograman ?? '',
                    'bahasa_pemrograman' => $Bab->bahasa_pemrograman ?? '',
                    'contohKode' => $Bab->contoh_kode ?? $Bab->code_example ?? '',
                    'contoh_kode' => $Bab->contoh_kode ?? $Bab->code_example ?? '',
                    'penjelasanKode' => $Bab->penjelasan_kode ?? '',
                    'penjelasan_kode' => $Bab->penjelasan_kode ?? '',
                    'order_number' => $Bab->order_number ?? $Bab->chapter_order,
                    'chapter_order' => $Bab->chapter_order,
                    'status' => $Bab->status,
                    'exercise_count' => $Bab->exercises->count(),
                    'exercises' => $Bab->exercises->map(function ($Latihan) {
                        return [
                            'id' => $Latihan->id,
                            'chapter_id' => $Latihan->chapter_id,
                            'question' => $Latihan->question,
                            'option_a' => $Latihan->option_a,
                            'option_b' => $Latihan->option_b,
                            'option_c' => $Latihan->option_c,
                            'option_d' => $Latihan->option_d,
                            'correct_answer' => $Latihan->correct_answer,
                        ];
                    })->values(),
                ];
            })->values(),
            'quiz' => $quiz ? [
                'id' => $quiz->id,
                'material_id' => $quiz->material_id,
                'title' => $quiz->title,
                'duration_minutes' => $quiz->duration_minutes,
                'question_count' => $quiz->questions->count(),
                'questions' => $quiz->questions->map(function ($SoalLatihan) {
                    return [
                        'id' => $SoalLatihan->id,
                        'quiz_id' => $SoalLatihan->quiz_id,
                        'question' => $SoalLatihan->question,
                        'option_a' => $SoalLatihan->option_a,
                        'option_b' => $SoalLatihan->option_b,
                        'option_c' => $SoalLatihan->option_c,
                        'option_d' => $SoalLatihan->option_d,
                        'correct_answer' => $SoalLatihan->correct_answer,
                    ];
                })->values(),
            ] : null,
        ];
    }

    private function ensureTeacher(Request $request): void
    {
        /** @var Pengguna|null $Pengguna */
        $Pengguna = $request->user();

        abort_unless($Pengguna && $Pengguna->isGuru(), 403, 'Akses khusus guru.');
    }
}
