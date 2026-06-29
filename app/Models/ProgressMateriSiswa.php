<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressMateriSiswa extends Model
{
    use HasFactory;

    protected $table = 'progress_materi_siswa';

    protected $fillable = [
        'student_id',
        'material_id',
        'current_chapter_id',
        'is_completed',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'student_id');
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'material_id');
    }

    public function currentChapter(): BelongsTo
    {
        return $this->belongsTo(Bab::class, 'current_chapter_id');
    }
}
