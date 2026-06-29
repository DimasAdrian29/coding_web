<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressLatihanSiswa extends Model
{
    use HasFactory;

    public const STATUS_LOCKED = 'locked';

    public const STATUS_UNLOCKED = 'unlocked';

    public const STATUS_COMPLETED = 'completed';

    protected $table = 'progress_latihan_siswa';

    protected $fillable = [
        'student_id',
        'exercise_id',
        'status',
        'score',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'completed_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'student_id');
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Latihan::class, 'exercise_id');
    }
}
