<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressBab extends Model
{
    use HasFactory;

    protected $table = 'progress_bab';

    protected $fillable = [
        'user_id',
        'chapter_id',
        'status',
        'progress_percentage',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'progress_percentage' => 'integer',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class);
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Bab::class);
    }
}
