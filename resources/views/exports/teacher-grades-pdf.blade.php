<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #0f172a; font-size: 11px; }
        h1 { font-size: 18px; margin: 0 0 4px; }
        p { margin: 0 0 10px; color: #475569; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
        th { background: #dbeafe; color: #1e3a8a; font-weight: bold; }
        .meta { margin-bottom: 14px; }
        .center { text-align: center; }
    </style>
</head>
<body>
    <h1>Laporan Nilai Siswa</h1>
    <div class="meta">
        <p>Materi: {{ $payload['materi']['title'] ?? '-' }}</p>
        <p>Tanggal export: {{ $printedAt->format('d M Y, H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>NISN</th>
                @foreach ($payload['chapters'] as $chapter)
                    <th>Bab {{ $chapter['order_number'] }}</th>
                @endforeach
                <th>Latihan Akhir</th>
                <th>Rata-rata</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($payload['students'] as $index => $student)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td>{{ $student['name'] }}</td>
                    <td>{{ $student['nisn'] ?: '-' }}</td>
                    @foreach ($payload['chapters'] as $chapter)
                        <td class="center">{{ $student['chapter_scores'][(string) $chapter['id']] ?? '-' }}</td>
                    @endforeach
                    <td class="center">{{ $student['final_score'] ?? '-' }}</td>
                    <td class="center">{{ $student['average_score'] ?? '-' }}</td>
                    <td>{{ $student['status'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
