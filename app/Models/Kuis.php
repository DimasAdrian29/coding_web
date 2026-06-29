<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kuis extends Model
{
    use HasFactory;

    protected $table = 'kuis';

    protected $fillable = [
        'material_id',
        'title',
        'duration_minutes',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'material_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(SoalKuis::class, 'quiz_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(PengumpulanSiswa::class, 'quiz_id');
    }
}
