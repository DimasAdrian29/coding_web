<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SoalKuis extends Model
{
    use HasFactory;

    protected $table = 'soal_kuis';

    protected $fillable = [
        'quiz_id',
        'question',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Kuis::class, 'quiz_id');
    }
}
