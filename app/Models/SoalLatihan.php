<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SoalLatihan extends Model
{
    use HasFactory;

    protected $table = 'soal_latihan';

    protected $fillable = [
        'exercise_id',
        'question_text',
        'question_type',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
        'score',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
        ];
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Latihan::class);
    }

    public function submissionAnswers(): HasMany
    {
        return $this->hasMany(JawabanPengumpulanLatihan::class, 'question_id');
    }

    public function attemptAnswers(): HasMany
    {
        return $this->hasMany(JawabanRiwayatLatihan::class, 'exercise_question_id');
    }
}
