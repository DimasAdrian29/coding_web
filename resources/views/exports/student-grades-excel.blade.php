<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        table { border-collapse: collapse; }
        th { background: #16a34a; color: #ffffff; font-weight: bold; }
        th, td { border: 1px solid #94a3b8; padding: 6px; mso-number-format: "\@"; }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                @foreach($headings as $heading)
                    <th>{{ $heading }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    @foreach($row as $cell)
                        <td>{{ $cell }}</td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ count($headings) }}">Belum ada data nilai untuk diekspor.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
