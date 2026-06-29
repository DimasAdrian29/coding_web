<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; color: #0f172a; font-size: 10px; }
        h1 { margin: 0; font-size: 20px; }
        h2 { margin: 4px 0 0; font-size: 12px; color: #475569; font-weight: normal; }
        .meta { margin-top: 12px; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px; vertical-align: top; }
        th { background: #dcfce7; color: #14532d; font-weight: bold; text-align: left; }
        .footer { position: fixed; bottom: 0; left: 0; right: 0; color: #64748b; font-size: 9px; border-top: 1px solid #cbd5e1; padding-top: 6px; }
        .empty { margin-top: 18px; padding: 12px; border: 1px solid #cbd5e1; background: #f8fafc; }
        .page-break { page-break-inside: avoid; }
    </style>
</head>
<body>
    <header>
        <h1>{{ $title }}</h1>
        <h2>{{ $subtitle }}</h2>
        <div class="meta">
            <div><strong>Nama Guru:</strong> {{ $teacher->name }}</div>
            <div><strong>Tanggal Export:</strong> {{ $printedAt->format('d M Y, H:i') }}</div>
        </div>
    </header>

    @if($rows->isEmpty())
        <div class="empty">Belum ada data nilai untuk diekspor.</div>
    @else
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Kelas</th>
                    <th>Bab</th>
                    <th>Latihan</th>
                    <th>Nilai</th>
                    <th>Feedback</th>
                    <th>Status</th>
                    <th>Submit</th>
                    <th>Dinilai</th>
                    <th>Ujian Akhir</th>
                    <th>Rata-rata</th>
                    <th>Progress</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $row)
                    <tr class="page-break">
                        <td>{{ $row['no'] }}</td>
                        <td>{{ $row['student_name'] }}</td>
                        <td>{{ $row['class_name'] }}</td>
                        <td>{{ $row['chapter'] }}</td>
                        <td>{{ $row['exercise'] }}</td>
                        <td>{{ $row['score'] ?? '-' }}</td>
                        <td>{{ $row['feedback'] }}</td>
                        <td>{{ $row['status'] }}</td>
                        <td>{{ $row['submitted_at'] }}</td>
                        <td>{{ $row['graded_at'] }}</td>
                        <td>{{ $row['final_exam_score'] ?? '-' }}</td>
                        <td>{{ $row['average_score'] ?? '-' }}</td>
                        <td>{{ $row['progress'] }}</td>
                        <td>{{ $row['description'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">
        Dicetak oleh sistem pada {{ $printedAt->format('d M Y, H:i:s') }}
    </div>
</body>
</html>
