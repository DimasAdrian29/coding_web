<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Pengguna extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'pengguna';

    protected static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }

    public const ROLE_SISWA = 'siswa';

    public const ROLE_GURU = 'guru';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'nisn',
        'nip',
        'subject',
        'password',
        'role',
        'class_name',
        'major',
        'school_name',
        'profile_photo',
        'status',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isSiswa(): bool
    {
        return $this->role === self::ROLE_SISWA;
    }

    public function isGuru(): bool
    {
        return $this->role === self::ROLE_GURU;
    }

    public function progresses(): HasMany
    {
        return $this->hasMany(ProgressLama::class, 'user_id');
    }

    public function studentMaterialProgresses(): HasMany
    {
        return $this->hasMany(ProgressMateriSiswa::class, 'student_id');
    }

    public function studentChapterProgresses(): HasMany
    {
        return $this->hasMany(ProgressBabSiswa::class, 'student_id');
    }

    public function chapterProgresses(): HasMany
    {
        return $this->hasMany(ProgressBab::class, 'user_id');
    }

    public function studentExerciseProgresses(): HasMany
    {
        return $this->hasMany(ProgressLatihanSiswa::class, 'student_id');
    }

    public function studentQuizProgresses(): HasMany
    {
        return $this->hasMany(ProgressKuisSiswa::class, 'student_id');
    }

    public function studentPengumpulanLatihans(): HasMany
    {
        return $this->hasMany(PengumpulanSiswa::class, 'student_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(PengumpulanLatihan::class, 'user_id');
    }

    public function exerciseAttempts(): HasMany
    {
        return $this->hasMany(RiwayatLatihan::class, 'user_id');
    }

    public function finalExamResults(): HasMany
    {
        return $this->hasMany(HasilLatihanAkhir::class, 'user_id');
    }

    public function gradedPengumpulanLatihans(): HasMany
    {
        return $this->hasMany(PengumpulanSiswa::class, 'teacher_id');
    }
}
