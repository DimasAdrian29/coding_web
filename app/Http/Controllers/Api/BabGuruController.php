<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\Materi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BabGuruController extends Controller
{
    use ApiLearningHelpers;

    public function index(): JsonResponse
    {
        $chapters = $this->orderedChapters()
            ->with('material')
            ->withCount(['progress as completed_students_count' => fn ($query) => $query->where('status', 'completed')])
            ->get()
            ->map(fn (Bab $Bab) => $this->row($Bab));
        $materials = Materi::withCount('chapters')->orderBy('title')->get();

        return $this->ok([
            'materials' => $materials->map(fn (Materi $Materi) => $this->materialRow($Materi)),
            'chapters' => $chapters,
            'stats' => [
                'total' => $chapters->count(),
                'published' => $chapters->where('status', 'published')->count(),
                'draft' => $chapters->where('status', 'draft')->count(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $teacher = $this->currentTeacher();
        $validated = $this->validateChapter($request);
        $videoData = $this->resolveVideoData($request);
        $Bab = Bab::create([
            'material_id' => $validated['material_id'],
            'materi_id' => $validated['material_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'content' => $validated['content'],
            'video_type' => $videoData['video_type'],
            'video_url' => $videoData['video_url'],
            'video_file' => $videoData['video_file'],
            'code_example' => $validated['code_example'] ?? null,
            'judul_contoh_kode' => $validated['judul_contoh_kode'] ?? null,
            'bahasa_pemrograman' => $validated['bahasa_pemrograman'] ?? null,
            'contoh_kode' => $validated['contoh_kode'] ?? null,
            'penjelasan_kode' => $validated['penjelasan_kode'] ?? null,
            'order_number' => $validated['order_number'],
            'chapter_order' => $validated['order_number'],
            'duration_minutes' => $validated['duration_minutes'] ?? null,
            'status' => $validated['status'],
            'created_by' => $teacher?->id,
        ]);

        return $this->ok($this->row($Bab->fresh('material')), 'BabLama berhasil dibuat');
    }

    public function show(int $id): JsonResponse
    {
        $Bab = Bab::with('material')->find($id);

        return $Bab ? $this->ok($this->row($Bab)) : $this->fail('Data BabLama tidak ditemukan', null, 404);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $Bab = Bab::find($id);

        if (! $Bab) {
            return $this->fail('Data BabLama tidak ditemukan', null, 404);
        }

        $validated = $this->validateChapter($request);
        $videoData = $this->resolveVideoData($request, $Bab);
        $Bab->update([
            'title' => $validated['title'],
            'material_id' => $validated['material_id'],
            'materi_id' => $validated['material_id'],
            'description' => $validated['description'],
            'content' => $validated['content'],
            'video_type' => $videoData['video_type'],
            'video_url' => $videoData['video_url'],
            'video_file' => $videoData['video_file'],
            'code_example' => $validated['code_example'] ?? null,
            'judul_contoh_kode' => $validated['judul_contoh_kode'] ?? null,
            'bahasa_pemrograman' => $validated['bahasa_pemrograman'] ?? null,
            'contoh_kode' => $validated['contoh_kode'] ?? null,
            'penjelasan_kode' => $validated['penjelasan_kode'] ?? null,
            'order_number' => $validated['order_number'],
            'chapter_order' => $validated['order_number'],
            'duration_minutes' => $validated['duration_minutes'] ?? null,
            'status' => $validated['status'],
        ]);

        return $this->ok($this->row($Bab->fresh('material')), 'BabLama berhasil diperbarui');
    }

    public function destroy(int $id): JsonResponse
    {
        $Bab = Bab::find($id);

        if (! $Bab) {
            return $this->fail('Data BabLama tidak ditemukan', null, 404);
        }

        $Bab->delete();

        return $this->ok(null, 'BabLama berhasil dihapus');
    }

    private function validateChapter(Request $request): array
    {
        $request->merge([
            'material_id' => $request->input('material_id', $request->input('materi_id')),
        ]);

        return $request->validate([
            'material_id' => ['required', 'integer', 'exists:materi,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'video_type' => ['nullable', 'in:youtube,upload'],
            'video_url' => ['nullable', 'url', 'max:255'],
            'video_file' => ['nullable', 'file', 'mimes:mp4,webm,mov', 'max:51200'],
            'code_example' => ['nullable', 'string'],
            'judul_contoh_kode' => ['nullable', 'string', 'max:255'],
            'bahasa_pemrograman' => ['nullable', 'string', 'max:50'],
            'contoh_kode' => ['nullable', 'string'],
            'penjelasan_kode' => ['nullable', 'string'],
            'order_number' => ['required', 'integer', 'min:1'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', 'in:draft,published'],
        ]);
    }

    private function row(Bab $Bab): array
    {
        return [
            'id' => $Bab->id,
            'materialId' => $Bab->material_id,
            'materiId' => $Bab->materi_id ?? $Bab->material_id,
            'materi_id' => $Bab->materi_id ?? $Bab->material_id,
            'materialTitle' => $Bab->material?->title ?? '-',
            'order' => $Bab->order_number ?? $Bab->chapter_order ?? $Bab->id,
            'title' => $Bab->title,
            'description' => $Bab->description ?? '',
            'content' => $Bab->content ?? '',
            'videoType' => $Bab->video_type,
            'video_type' => $Bab->video_type,
            'videoUrl' => $Bab->video_url ?? '',
            'video_url' => $Bab->video_url ?? '',
            'videoFile' => $Bab->video_file,
            'video_file' => $Bab->video_file,
            'videoFileUrl' => $Bab->video_file ? asset('storage/' . $Bab->video_file) : null,
            'video_file_url' => $Bab->video_file ? asset('storage/' . $Bab->video_file) : null,
            'codeExample' => $Bab->code_example ?? '',
            'judulContohKode' => $Bab->judul_contoh_kode ?? '',
            'judul_contoh_kode' => $Bab->judul_contoh_kode ?? '',
            'bahasaPemrograman' => $Bab->bahasa_pemrograman ?? '',
            'bahasa_pemrograman' => $Bab->bahasa_pemrograman ?? '',
            'contohKode' => $Bab->contoh_kode ?? '',
            'contoh_kode' => $Bab->contoh_kode ?? '',
            'penjelasanKode' => $Bab->penjelasan_kode ?? '',
            'penjelasan_kode' => $Bab->penjelasan_kode ?? '',
            'duration' => ($Bab->duration_minutes ?: 45) . ' menit',
            'durationMinutes' => $Bab->duration_minutes,
            'status' => $Bab->status ?? 'draft',
            'completedStudents' => $Bab->completed_students_count ?? $Bab->progress()->where('status', 'completed')->count(),
            'totalStudents' => \App\Models\Pengguna::whereIn('role', ['siswa', 'student'])->count(),
            'createdAt' => optional($Bab->created_at)->format('d M Y'),
            'updatedAt' => optional($Bab->updated_at)->format('d M Y'),
            'createdBy' => $Bab->creator?->name ?? '-',
        ];
    }

    private function resolveVideoData(Request $request, ?Bab $Bab = null): array
    {
        $videoType = $request->input('video_type') ?: null;

        if ($videoType === 'youtube') {
            if ($Bab?->video_file) {
                Storage::disk('public')->delete($Bab->video_file);
            }

            return [
                'video_type' => 'youtube',
                'video_url' => $request->input('video_url'),
                'video_file' => null,
            ];
        }

        if ($videoType === 'upload') {
            $videoFile = $Bab?->video_file;

            if ($request->hasFile('video_file')) {
                if ($videoFile) {
                    Storage::disk('public')->delete($videoFile);
                }

                $videoFile = $request->file('video_file')->store('videos/bab', 'public');
            }

            return [
                'video_type' => $videoFile ? 'upload' : null,
                'video_url' => null,
                'video_file' => $videoFile,
            ];
        }

        if ($Bab?->video_file) {
            Storage::disk('public')->delete($Bab->video_file);
        }

        return [
            'video_type' => null,
            'video_url' => null,
            'video_file' => null,
        ];
    }

    private function materialRow(Materi $Materi): array
    {
        return [
            'id' => $Materi->id,
            'title' => $Materi->title,
            'description' => $Materi->description ?? '',
            'thumbnail' => $Materi->thumbnail,
            'status' => $Materi->status,
            'chapterCount' => $Materi->chapters_count ?? 0,
        ];
    }
}
