<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JawabanRiwayatLatihan extends Model
{
    use HasFactory;

    protected $table = 'jawaban_riwayat_latihan';

    protected $fillable = [
        'exercise_attempt_id',
        'exercise_question_id',
        'selected_answer',
        'is_correct',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
        ];
    }

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(RiwayatLatihan::class, 'exercise_attempt_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(SoalLatihan::class, 'exercise_question_id');
    }
}
