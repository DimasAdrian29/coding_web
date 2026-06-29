<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RiwayatLatihan extends Model
{
    use HasFactory;

    protected $table = 'riwayat_latihan';

    protected $fillable = [
        'user_id',
        'exercise_id',
        'total_questions',
        'correct_answers',
        'wrong_answers',
        'score',
        'started_at',
        'expires_at',
        'submitted_at',
        'submit_method',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'decimal:2',
            'started_at' => 'datetime',
            'expires_at' => 'datetime',
            'submitted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Latihan::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(JawabanRiwayatLatihan::class, 'exercise_attempt_id');
    }
}
