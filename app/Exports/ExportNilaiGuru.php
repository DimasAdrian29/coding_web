<?php

namespace App\Exports;

use Illuminate\Support\Collection;

class ExportNilaiGuru
{
    public function __construct(private readonly Collection $rows)
    {
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Siswa',
            'Kelas',
            'Bab',
            'Latihan',
            'Nilai',
            'Feedback',
            'Status',
            'Tanggal Submit',
            'Tanggal Dinilai',
            'Nilai Ujian Akhir',
            'Rata-rata Nilai',
            'Progress',
            'Keterangan',
        ];
    }

    public function rows(): Collection
    {
        return $this->rows->map(fn (array $row) => [
            $row['no'],
            $row['student_name'],
            $row['class_name'],
            $row['chapter'],
            $row['exercise'],
            $row['score'] ?? '-',
            $row['feedback'],
            $row['status'],
            $row['submitted_at'],
            $row['graded_at'],
            $row['final_exam_score'] ?? '-',
            $row['average_score'] ?? '-',
            $row['progress'],
            $row['description'],
        ]);
    }
}
