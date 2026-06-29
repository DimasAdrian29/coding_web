export default function ExerciseTable({ items, onEdit, onDelete }) {
    return (
        <div className="mb-8 overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm dark:bg-background-dark">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-primary/10 bg-primary/5">
                            <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                Soal
                            </th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                Materi Terkait
                            </th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                Kunci Jawaban
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                        {items.map((item) => (
                            <tr
                                key={item.id}
                                className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                <td className="px-6 py-4">
                                    <p className="max-w-[300px] truncate text-sm font-medium">{item.question}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                        {item.subject}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {item.answer}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item)}
                                            className="p-2 text-slate-400 transition-colors hover:text-primary"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(item)}
                                            className="p-2 text-slate-400 transition-colors hover:text-red-500"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
