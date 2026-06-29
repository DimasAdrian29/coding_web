<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HasilLatihanAkhir extends Model
{
    use HasFactory;

    protected $table = 'hasil_latihan_akhir';

    protected $fillable = [
        'user_id',
        'exercise_id',
        'score',
        'total_correct',
        'total_questions',
        'duration_used_minutes',
        'status',
        'submit_method',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'total_correct' => 'integer',
            'total_questions' => 'integer',
            'duration_used_minutes' => 'integer',
            'submitted_at' => 'datetime',
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
}
