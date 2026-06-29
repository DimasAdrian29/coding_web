<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BabLama extends Model
{
    use HasFactory;

    protected $table = 'bab_lama';

    protected $fillable = [
        'materi_id',
        'title',
        'slug',
        'description',
        'content',
        'code_example',
        'code_language',
        'exercise_title',
        'exercise_prompt',
        'exercise_answer',
        'exercise_questions',
        'quiz_title',
        'quiz_questions',
        'order_number',
    ];

    protected function casts(): array
    {
        return [
            'exercise_questions' => 'array',
            'quiz_questions' => 'array',
        ];
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(MateriLama::class);
    }

    public function progresses(): HasMany
    {
        return $this->hasMany(ProgressLama::class, 'bab_id');
    }
}
