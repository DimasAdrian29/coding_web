<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JawabanPengumpulanLatihan extends Model
{
    use HasFactory;

    protected $table = 'jawaban_pengumpulan_latihan';

    protected $fillable = [
        'submission_id',
        'question_id',
        'answer_text',
        'selected_option',
        'is_correct',
        'score_awarded',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'score_awarded' => 'integer',
        ];
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(PengumpulanLatihan::class, 'submission_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(SoalLatihan::class, 'question_id');
    }
}
