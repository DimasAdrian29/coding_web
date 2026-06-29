<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiLearningHelpers;
use App\Http\Controllers\Controller;
use App\Models\PengumpulanLatihan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TeacherSubmissionController extends Controller
{
    use ApiLearningHelpers;

    public function index(): JsonResponse
    {
        $submissions = PengumpulanLatihan::with(['user', 'exercise.chapter', 'answers.question'])
            ->latest('submitted_at')
            ->get();

        return $this->ok([
            'submissions' => $submissions->map(fn (PengumpulanLatihan $submission) => $this->row($submission)),
            'stats' => [
                'pending' => $submissions->where('status', 'pending_review')->count(),
                'graded' => $submissions->where('status', 'graded')->count(),
                'averageScore' => round((float) $submissions->where('status', 'graded')->avg('score'), 1),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $submission = PengumpulanLatihan::with(['user', 'exercise.chapter', 'answers.question'])->find($id);

        return $submission ? $this->ok($this->row($submission)) : $this->fail('Data jawaban tidak ditemukan', null, 404);
    }

    public function grade(Request $request, int $id): JsonResponse
    {
        $teacher = $this->currentTeacher();
        $submission = PengumpulanLatihan::find($id);

        if (! $submission) {
            return $this->fail('Data jawaban tidak ditemukan', null, 404);
        }

        $validated = $request->validate([
            'score' => ['required', 'numeric', 'min:0', 'max:100'],
            'feedback' => ['required', 'string'],
        ]);

        $submission->update([
            'score' => (int) $validated['score'],
            'feedback' => $validated['feedback'],
            'status' => 'graded',
            'graded_by' => $teacher?->id,
            'graded_at' => Carbon::now(),
        ]);

        return $this->ok($this->row($submission->fresh(['user', 'exercise.chapter', 'answers.question'])), 'Nilai berhasil disimpan');
    }

    private function row(PengumpulanLatihan $submission): array
    {
        return [
            'id' => $submission->id,
            'studentName' => $submission->user?->name ?? '-',
            'exerciseTitle' => $submission->exercise?->chapter?->title
                ? 'BabLama: ' . $submission->exercise?->chapter?->title
                : ($submission->exercise?->title ?? '-'),
            'submittedAt' => optional($submission->submitted_at)->format('d M Y, H:i') ?? '-',
            'status' => $submission->status === 'graded' ? 'graded' : 'pending',
            'score' => $submission->score,
            'feedback' => $submission->feedback,
            'answers' => $submission->answers->map(fn ($answer) => [
                'question' => $answer->question?->question_text ?? '-',
                'answer' => $answer->answer_text ?: $answer->selected_option,
                'type' => $answer->question?->question_type ?? 'essay',
            ]),
        ];
    }
}
