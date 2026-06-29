<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressBabSiswa extends Model
{
    use HasFactory;

    public const STATUS_LOCKED = 'locked';

    public const STATUS_UNLOCKED = 'unlocked';

    public const STATUS_COMPLETED = 'completed';

    protected $table = 'progress_bab_siswa';

    protected $fillable = [
        'student_id',
        'chapter_id',
        'status',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'student_id');
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Bab::class, 'chapter_id');
    }
}
