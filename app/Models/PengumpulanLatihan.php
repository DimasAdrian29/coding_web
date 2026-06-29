<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PengumpulanLatihan extends Model
{
    use HasFactory;

    protected $table = 'pengumpulan_latihan';

    protected $fillable = [
        'user_id',
        'exercise_id',
        'status',
        'score',
        'feedback',
        'submitted_at',
        'graded_by',
        'graded_at',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'submitted_at' => 'datetime',
            'graded_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'user_id');
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Latihan::class, 'exercise_id');
    }

    public function grader(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'graded_by');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(JawabanPengumpulanLatihan::class, 'submission_id');
    }
}
