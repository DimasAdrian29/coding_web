<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bab extends Model
{
    use HasFactory;

    protected $table = 'bab';

    protected $fillable = [
        'material_id',
        'materi_id',
        'title',
        'description',
        'content',
        'video_type',
        'video_url',
        'video_file',
        'code_example',
        'judul_contoh_kode',
        'bahasa_pemrograman',
        'contoh_kode',
        'penjelasan_kode',
        'order_number',
        'duration_minutes',
        'status',
        'created_by',
        'chapter_order',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'material_id');
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(Latihan::class, 'chapter_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(ProgressBab::class, 'chapter_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'created_by');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(PengumpulanSiswa::class, 'chapter_id');
    }
}
