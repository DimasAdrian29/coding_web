export default function TopStudentsTable({ students }) {
    return (
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-white dark:bg-background-dark">
            <div className="flex items-center justify-between border-b border-primary/10 p-6">
                <h3 className="text-lg font-bold">Siswa Berprestasi</h3>
                <button type="button" className="text-sm font-bold text-primary hover:underline">
                    Lihat Semua
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-primary/5 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Siswa</th>
                            <th className="px-6 py-4">Progress Belajar</th>
                            <th className="px-6 py-4">Rata-rata Nilai</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                        {students.map((student) => (
                            <tr key={student.name} className="transition-colors hover:bg-primary/5">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="size-9 rounded-full bg-slate-200 bg-cover bg-center"
                                            style={{ backgroundImage: `url('${student.avatar}')` }}
                                            title={`Foto ${student.name}`}
                                        />
                                        <div>
                                            <p className="text-sm font-bold">{student.name}</p>
                                            <p className="text-[10px] text-slate-500">{student.className}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex w-full max-w-xs items-center gap-3">
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{ width: `${student.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold">{student.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold">{student.score}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${student.statusClassName}`}
                                    >
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
