import AssessmentRow from './AssessmentRow';

export default function AssessmentTable({
    items,
    onViewAnswer,
}) {
    return (
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm shadow-primary/5 dark:bg-background-dark">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-primary/10 bg-primary/5">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                Nama Siswa
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                Tugas
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                Jawaban
                            </th>
                            <th className="w-24 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                Nilai
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <AssessmentRow
                                    key={item.id}
                                    item={item}
                                    onViewAnswer={onViewAnswer}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                    Belum ada hasil latihan atau quiz yang dikirim siswa.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
