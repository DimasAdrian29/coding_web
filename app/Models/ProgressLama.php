<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressLama extends Model
{
    use HasFactory;

    protected $table = 'progress_lama';

    protected $fillable = [
        'user_id',
        'bab_id',
        'is_completed',
        'exercise_attempts',
        'exercise_last_score',
        'exercise_completed_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'exercise_attempts' => 'integer',
            'exercise_last_score' => 'integer',
            'exercise_completed_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class);
    }

    public function bab(): BelongsTo
    {
        return $this->belongsTo(BabLama::class);
    }
}
