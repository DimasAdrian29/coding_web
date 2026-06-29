<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Latihan extends Model
{
    use HasFactory;

    protected $table = 'latihan';

    protected $fillable = [
        'chapter_id',
        'material_id',
        'title',
        'description',
        'type',
        'total_questions',
        'duration_minutes',
        'status',
        'created_by',
        'question',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
    ];

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Bab::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Materi::class);
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'material_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'created_by');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(SoalLatihan::class, 'exercise_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(PengumpulanLatihan::class, 'exercise_id');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(RiwayatLatihan::class, 'exercise_id');
    }
}
