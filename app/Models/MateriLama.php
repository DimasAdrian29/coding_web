<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MateriLama extends Model
{
    use HasFactory;

    protected $table = 'materi_lama';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'estimated_duration',
    ];

    public function babs(): HasMany
    {
        return $this->hasMany(BabLama::class, 'materi_id')->orderBy('order_number');
    }
}
