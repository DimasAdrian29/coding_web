<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JawabanPengumpulanSiswa extends Model
{
    use HasFactory;

    protected $table = 'jawaban_pengumpulan_siswa';

    protected $fillable = [
        'student_submission_id',
        'question_source',
        'question_id',
        'question_text',
        'options',
        'selected_answer',
        'correct_answer',
        'is_correct',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'is_correct' => 'boolean',
        ];
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(PengumpulanSiswa::class, 'student_submission_id');
    }
}
