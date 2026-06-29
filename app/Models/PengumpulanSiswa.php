<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PengumpulanSiswa extends Model
{
    use HasFactory;

    protected $table = 'pengumpulan_siswa';

    public const TYPE_EXERCISE = 'exercise';

    public const TYPE_QUIZ = 'quiz';

    public const STATUS_PENDING = 'pending';

    public const STATUS_GRADED = 'graded';

    protected $fillable = [
        'student_id',
        'material_id',
        'chapter_id',
        'quiz_id',
        'type',
        'title',
        'score',
        'teacher_score',
        'teacher_feedback',
        'teacher_id',
        'status',
        'submitted_at',
        'graded_at',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'teacher_score' => 'integer',
            'submitted_at' => 'datetime',
            'graded_at' => 'datetime',
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

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Bab::class, 'chapter_id');
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Kuis::class, 'quiz_id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'teacher_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(JawabanPengumpulanSiswa::class, 'student_submission_id');
    }

    public function finalScore(): ?int
    {
        return $this->teacher_score ?? $this->score;
    }
}
