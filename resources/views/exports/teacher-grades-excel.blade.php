<!doctype html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <table>
        <tr>
            <th colspan="{{ 6 + count($payload['chapters']) }}">Laporan Nilai Siswa</th>
        </tr>
        <tr>
            <td>Materi</td>
            <td colspan="{{ 5 + count($payload['chapters']) }}">{{ $payload['materi']['title'] ?? '-' }}</td>
        </tr>
        <tr>
            <td>Tanggal Export</td>
            <td colspan="{{ 5 + count($payload['chapters']) }}">{{ $printedAt->format('d M Y, H:i') }}</td>
        </tr>
    </table>

    <table border="1">
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>NISN</th>
                @foreach ($payload['chapters'] as $chapter)
                    <th>Nilai Latihan Bab {{ $chapter['order_number'] }}</th>
                @endforeach
                <th>Nilai Latihan Akhir</th>
                <th>Rata-rata</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($payload['students'] as $index => $student)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $student['name'] }}</td>
                    <td>{{ $student['nisn'] ?: '-' }}</td>
                    @foreach ($payload['chapters'] as $chapter)
                        <td>{{ $student['chapter_scores'][(string) $chapter['id']] ?? '-' }}</td>
                    @endforeach
                    <td>{{ $student['final_score'] ?? '-' }}</td>
                    <td>{{ $student['average_score'] ?? '-' }}</td>
                    <td>{{ $student['status'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
