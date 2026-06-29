<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressKuisSiswa extends Model
{
    use HasFactory;

    public const STATUS_LOCKED = 'locked';

    public const STATUS_UNLOCKED = 'unlocked';

    public const STATUS_COMPLETED = 'completed';

    protected $table = 'progress_kuis_siswa';

    protected $fillable = [
        'student_id',
        'quiz_id',
        'status',
        'score',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'student_id');
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Kuis::class, 'quiz_id');
    }
}
