<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\Latihan;
use App\Models\RiwayatLatihan;
use App\Models\HasilLatihanAkhir;
use App\Models\Materi;
use App\Models\SoalLatihan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class LatihanGuruController extends Controller
{
    use ApiLearningHelpers;

    public function index(): JsonResponse
    {
        $materials = Materi::with(['chapters' => function ($query) {
                $query->whereIn('status', ['published', 'active'])
                    ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
                    ->orderBy('id');
            }])
            ->whereIn('status', ['publish', 'published', 'active'])
            ->orderBy('title')
            ->get();

        $exercises = Latihan::with(['chapter.material', 'material', 'questions', 'attempts'])
            ->whereIn('type', ['chapter', 'final_exam'])
            ->orderBy('chapter_id')
            ->orderBy('id')
            ->get();

        return $this->ok([
            'materials' => $materials->map(fn (Materi $Materi) => [
                'id' => $Materi->id,
                'title' => $Materi->title,
                'chapters' => $Materi->chapters->map(fn ($Bab) => [
                    'id' => $Bab->id,
                    'title' => $Bab->title,
                    'materialId' => $Materi->id,
                ])->values(),
            ])->values(),
            'chapters' => $materials->flatMap(fn (Materi $Materi) => $Materi->chapters->map(fn ($Bab) => [
                'id' => $Bab->id,
                'title' => $Bab->title,
                'materialId' => $Materi->id,
                'materialTitle' => $Materi->title,
            ]))->values(),
            'perBabExercises' => $exercises->where('type', 'chapter')->map(fn (Latihan $Latihan) => $this->row($Latihan))->values(),
            'finalExams' => $exercises->where('type', 'final_exam')->map(fn (Latihan $Latihan) => $this->row($Latihan))->values(),
            'exercises' => $exercises->map(fn (Latihan $Latihan) => $this->row($Latihan))->values(),
        ]);
    }

    public function materi(): JsonResponse
    {
        $materials = Materi::with(['chapters' => function ($query) {
                $query->whereIn('status', ['published', 'active'])
                    ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
                    ->orderBy('id');
            }])
            ->whereIn('status', ['publish', 'published', 'active'])
            ->orderBy('title')
            ->get()
            ->map(fn (Materi $Materi) => [
                'id' => $Materi->id,
                'title' => $Materi->title,
                'chapters' => $Materi->chapters->map(fn ($Bab) => [
                    'id' => $Bab->id,
                    'title' => $Bab->title,
                    'materialId' => $Materi->id,
                ])->values(),
            ])
            ->values();

        return $this->ok([
            'materials' => $materials,
            'materis' => $materials,
        ]);
    }

    public function latihanBabByMateri(int $materiId): JsonResponse
    {
        $materi = Materi::with([
            'chapters' => function ($query) {
                $query->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
                    ->orderBy('id')
                    ->with([
                        'exercises' => fn ($exerciseQuery) => $exerciseQuery
                            ->where('type', 'chapter')
                            ->with(['chapter.material', 'questions', 'attempts'])
                            ->orderBy('id'),
                    ]);
            },
        ])->findOrFail($materiId);

        $exercises = $materi->chapters
            ->flatMap(fn ($chapter) => $chapter->exercises)
            ->map(fn (Latihan $Latihan) => $this->row($Latihan))
            ->values();

        return $this->ok([
            'materi' => [
                'id' => $materi->id,
                'title' => $materi->title,
            ],
            'exercises' => $exercises,
            'perBabExercises' => $exercises,
        ]);
    }

    public function babByMateri(int $materiId): JsonResponse
    {
        $materi = Materi::with(['chapters' => function ($query) {
            $query->whereIn('status', ['published', 'active'])
                ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
                ->orderBy('id');
        }])->findOrFail($materiId);

        $chapters = $materi->chapters->map(fn ($Bab) => [
            'id' => $Bab->id,
            'title' => $Bab->title,
            'judul_bab' => $Bab->title,
            'nama_bab' => $Bab->title,
            'materialId' => $materi->id,
            'materi_id' => $materi->id,
            'order' => $Bab->order_number ?? $Bab->chapter_order ?? $Bab->id,
        ])->values();

        return $this->ok([
            'materi' => [
                'id' => $materi->id,
                'title' => $materi->title,
            ],
            'chapters' => $chapters,
            'babs' => $chapters,
        ]);
    }

    public function latihanAkhirByMateri(int $materiId): JsonResponse
    {
        $materi = Materi::findOrFail($materiId);

        $exercises = Latihan::with(['material', 'questions', 'attempts'])
            ->where('material_id', $materi->id)
            ->where('type', 'final_exam')
            ->orderBy('id')
            ->get()
            ->map(fn (Latihan $Latihan) => $this->row($Latihan))
            ->values();

        return $this->ok([
            'materi' => [
                'id' => $materi->id,
                'title' => $materi->title,
            ],
            'exercises' => $exercises,
            'finalExams' => $exercises,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $teacher = $this->currentTeacher();
        $validated = $this->validateExercise($request);
        $type = $validated['type'] ?? 'chapter';

        if ($type === 'final_exam' && $this->finalExamExists((int) $validated['material_id'])) {
            return $this->fail('MateriLama ini sudah memiliki Latihan Akhir.', null, 422);
        }

        $Latihan = Latihan::create([
            'chapter_id' => $type === 'chapter' ? $validated['chapter_id'] : null,
            'material_id' => $type === 'final_exam' ? $validated['material_id'] : null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $type,
            'total_questions' => count($validated['questions'] ?? []),
            'duration_minutes' => $type === 'final_exam' ? ($validated['duration_minutes'] ?? 30) : null,
            'status' => $validated['status'],
            'created_by' => $teacher?->id,
        ]);

        $this->syncQuestions($Latihan, $validated['questions'] ?? []);

        return $this->ok($this->row($Latihan->fresh(['chapter.material', 'material', 'questions', 'attempts'])), 'Latihan berhasil dibuat');
    }

    public function show(int $id): JsonResponse
    {
        $Latihan = Latihan::with(['chapter.material', 'material', 'questions', 'attempts.user'])->find($id);

        return $Latihan ? $this->ok($this->row($Latihan)) : $this->fail('Data latihan tidak ditemukan', null, 404);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $Latihan = Latihan::find($id);

        if (! $Latihan) {
            return $this->fail('Data latihan tidak ditemukan', null, 404);
        }

        $validated = $this->validateExercise($request);
        $type = $validated['type'] ?? 'chapter';

        if ($type === 'final_exam' && $this->finalExamExists((int) $validated['material_id'], $Latihan->id)) {
            return $this->fail('MateriLama ini sudah memiliki Latihan Akhir.', null, 422);
        }

        $Latihan->update([
            'chapter_id' => $type === 'chapter' ? $validated['chapter_id'] : null,
            'material_id' => $type === 'final_exam' ? $validated['material_id'] : null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $type,
            'duration_minutes' => $type === 'final_exam' ? ($validated['duration_minutes'] ?? $Latihan->duration_minutes ?? 30) : null,
            'status' => $validated['status'],
        ]);

        $this->syncQuestions($Latihan, $validated['questions'] ?? []);

        return $this->ok($this->row($Latihan->fresh(['chapter.material', 'material', 'questions', 'attempts'])), 'Latihan berhasil diperbarui');
    }

    public function destroy(int $id): JsonResponse
    {
        $Latihan = Latihan::whereIn('type', ['chapter', 'final_exam'])->find($id);

        if (! $Latihan) {
            return $this->fail('Data latihan tidak ditemukan', null, 404);
        }

        $Latihan->delete();

        return $this->ok(null, 'Latihan berhasil dihapus');
    }

    public function questions(int $exerciseId): JsonResponse
    {
        $Latihan = Latihan::with('questions')->where('type', 'chapter')->find($exerciseId);

        if (! $Latihan) {
            return $this->fail('Data latihan tidak ditemukan', null, 404);
        }

        return $this->ok([
            'questions' => $Latihan->questions->map(fn (SoalLatihan $SoalLatihan) => $this->questionRow($SoalLatihan))->values(),
        ]);
    }

    public function storeQuestion(Request $request, int $exerciseId): JsonResponse
    {
        $Latihan = Latihan::where('type', 'chapter')->find($exerciseId);

        if (! $Latihan) {
            return $this->fail('Data latihan tidak ditemukan', null, 404);
        }

        $SoalLatihan = $Latihan->questions()->create($this->validatedQuestion($request));
        $Latihan->update(['total_questions' => $Latihan->questions()->count()]);

        return $this->ok($this->questionRow($SoalLatihan), 'Soal berhasil ditambahkan');
    }

    public function updateQuestion(Request $request, int $id): JsonResponse
    {
        $SoalLatihan = SoalLatihan::whereHas('exercise', fn ($query) => $query->where('type', 'chapter'))->find($id);

        if (! $SoalLatihan) {
            return $this->fail('Data soal tidak ditemukan', null, 404);
        }

        $SoalLatihan->update($this->validatedQuestion($request));

        return $this->ok($this->questionRow($SoalLatihan->fresh()), 'Soal berhasil diperbarui');
    }

    public function destroyQuestion(int $id): JsonResponse
    {
        $SoalLatihan = SoalLatihan::whereHas('exercise', fn ($query) => $query->where('type', 'chapter'))->find($id);

        if (! $SoalLatihan) {
            return $this->fail('Data soal tidak ditemukan', null, 404);
        }

        $Latihan = $SoalLatihan->exercise;
        $SoalLatihan->delete();
        $Latihan?->update(['total_questions' => $Latihan->questions()->count()]);

        return $this->ok(null, 'Soal berhasil dihapus');
    }

    public function attempts(): JsonResponse
    {
        $attempts = RiwayatLatihan::with(['user', 'exercise.chapter.material'])
            ->whereHas('exercise', fn ($query) => $query->where('type', 'chapter'))
            ->orderByDesc('submitted_at')
            ->orderByDesc('id')
            ->get();

        return $this->ok([
            'attempts' => $attempts->map(fn (RiwayatLatihan $attempt) => $this->attemptRow($attempt))->values(),
        ]);
    }

    public function destroyAttempt(int $attemptId): JsonResponse
    {
        $teacher = $this->currentTeacher();

        if (! $teacher) {
            return $this->fail('Akses guru diperlukan untuk menghapus riwayat latihan.', null, 403);
        }

        $attempt = RiwayatLatihan::with('exercise')->find($attemptId);

        if (! $attempt) {
            return $this->fail('Riwayat latihan tidak ditemukan.', null, 404);
        }

        DB::transaction(function () use ($attempt) {
            if ($attempt->exercise?->type === 'final_exam') {
                HasilLatihanAkhir::where('user_id', $attempt->user_id)
                    ->where('exercise_id', $attempt->exercise_id)
                    ->when($attempt->submitted_at, fn ($query) => $query->where('submitted_at', $attempt->submitted_at))
                    ->delete();
            }

            $attempt->answers()->delete();
            $attempt->delete();
        });

        return $this->ok(null, 'Riwayat latihan berhasil dihapus.');
    }


    private function validateExercise(Request $request): array
    {
        return $request->validate([
            'chapter_id' => ['nullable', 'required_if:type,chapter', 'integer', 'exists:bab,id'],
            'material_id' => ['nullable', 'required_if:type,final_exam', 'integer', 'exists:materi,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', 'in:chapter,final_exam'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', 'in:draft,active,inactive'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.option_a' => ['required', 'string'],
            'questions.*.option_b' => ['required', 'string'],
            'questions.*.option_c' => ['required', 'string'],
            'questions.*.option_d' => ['required', 'string'],
            'questions.*.correct_answer' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
        ]);
    }

    private function finalExamExists(int $materialId, ?int $ignoreId = null): bool
    {
        return Latihan::where('type', 'final_exam')
            ->where('material_id', $materialId)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists();
    }

    private function validatedQuestion(Request $request): array
    {
        $validated = $request->validate([
            'question_text' => ['required', 'string'],
            'option_a' => ['required', 'string'],
            'option_b' => ['required', 'string'],
            'option_c' => ['required', 'string'],
            'option_d' => ['required', 'string'],
            'correct_answer' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
        ]);

        return [
            ...$validated,
            'question_type' => 'multiple_choice',
            'score' => 1,
        ];
    }

    private function syncQuestions(Latihan $Latihan, array $questions): void
    {
        $Latihan->questions()->delete();

        foreach ($questions as $SoalLatihan) {
            $Latihan->questions()->create([
                'question_text' => $SoalLatihan['question_text'],
                'question_type' => 'multiple_choice',
                'option_a' => $SoalLatihan['option_a'],
                'option_b' => $SoalLatihan['option_b'],
                'option_c' => $SoalLatihan['option_c'],
                'option_d' => $SoalLatihan['option_d'],
                'correct_answer' => $SoalLatihan['correct_answer'],
                'score' => 1,
            ]);
        }

        $Latihan->update(['total_questions' => count($questions)]);
    }

    private function row(Latihan $Latihan): array
    {
        $questions = $Latihan->questions->map(fn (SoalLatihan $SoalLatihan) => $this->questionRow($SoalLatihan))->values();

        return [
            'id' => $Latihan->id,
            'materialId' => $Latihan->type === 'final_exam' ? $Latihan->material_id : $Latihan->chapter?->material?->id,
            'materialTitle' => $Latihan->type === 'final_exam' ? $Latihan->material?->title : $Latihan->chapter?->material?->title,
            'babId' => $Latihan->chapter_id,
            'chapter_id' => $Latihan->chapter_id,
            'babTitle' => $Latihan->chapter?->title,
            'chapterTitle' => $Latihan->chapter?->title,
            'title' => $Latihan->title ?: ('Latihan ' . ($Latihan->chapter?->title ?? '#' . $Latihan->id)),
            'description' => $Latihan->description,
            'multipleChoiceCount' => $questions->count(),
            'totalQuestions' => $questions->count(),
            'submittedStudents' => $Latihan->attempts->pluck('user_id')->unique()->count(),
            'totalParticipants' => $Latihan->attempts->count(),
            'status' => $Latihan->status,
            'type' => $Latihan->type,
            'createdAt' => optional($Latihan->created_at)->format('d M Y'),
            'updatedAt' => optional($Latihan->updated_at)->format('d M Y'),
            'duration' => $Latihan->duration_minutes,
            'durationMinutes' => $Latihan->duration_minutes,
            'questions' => $questions,
        ];
    }

    private function questionRow(SoalLatihan $SoalLatihan): array
    {
        return [
            'id' => $SoalLatihan->id,
            'question_text' => $SoalLatihan->question_text,
            'questionText' => $SoalLatihan->question_text,
            'option_a' => $SoalLatihan->option_a,
            'option_b' => $SoalLatihan->option_b,
            'option_c' => $SoalLatihan->option_c,
            'option_d' => $SoalLatihan->option_d,
            'correct_answer' => $SoalLatihan->correct_answer,
            'correctAnswer' => $SoalLatihan->correct_answer,
        ];
    }

    private function attemptRow(RiwayatLatihan $attempt): array
    {
        return [
            'id' => $attempt->id,
            'studentName' => $attempt->user?->name ?? '-',
            'materialTitle' => $attempt->exercise?->chapter?->material?->title ?? '-',
            'chapterTitle' => $attempt->exercise?->chapter?->title ?? '-',
            'exerciseTitle' => $attempt->exercise?->title ?? '-',
            'attemptNumber' => RiwayatLatihan::where('user_id', $attempt->user_id)
                ->where('exercise_id', $attempt->exercise_id)
                ->where('id', '<=', $attempt->id)
                ->count(),
            'correctAnswers' => $attempt->correct_answers,
            'wrongAnswers' => $attempt->wrong_answers,
            'score' => (float) $attempt->score,
            'submittedAt' => optional($attempt->submitted_at)->format('d M Y, H:i'),
        ];
    }
}
