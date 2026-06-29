<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Materi extends Model
{
    use HasFactory;

    protected $table = 'materi';

    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'status',
    ];

    public function chapters(): HasMany
    {
        return $this->hasMany(Bab::class, 'material_id')
            ->orderByRaw('COALESCE(NULLIF(order_number, 0), NULLIF(chapter_order, 0), id) asc')
            ->orderBy('id');
    }

    public function quiz(): HasOne
    {
        return $this->hasOne(Kuis::class, 'material_id');
    }

    public function finalExam(): HasOne
    {
        return $this->hasOne(Latihan::class, 'material_id')
            ->where('type', 'final_exam');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(PengumpulanSiswa::class, 'material_id');
    }
}
