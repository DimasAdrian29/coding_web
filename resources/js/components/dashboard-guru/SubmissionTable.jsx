const statusClassMap = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    success: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function SubmissionTable({ rows, onFilter, onAction }) {
    return (
        <section className="mt-8 overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-primary/10 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Daftar Submisi Latihan
                </h3>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onFilter}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    >
                        <span className="material-symbols-outlined text-sm">filter_list</span>
                        Filter
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Nama Siswa
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Materi
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Waktu Submisi
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {rows.map((row) => (
                            <tr
                                key={`${row.studentName}-${row.material}`}
                                className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/20"
                            >
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                                            {row.initials}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {row.studentName}
                                        </span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {row.material}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {row.submittedAt}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                            statusClassMap[row.statusTone]
                                        }`}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onAction(row)}
                                        className="text-sm font-bold text-primary hover:text-primary/80"
                                    >
                                        {row.actionLabel}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
