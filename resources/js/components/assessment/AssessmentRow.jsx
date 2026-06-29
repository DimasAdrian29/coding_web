export default function AssessmentRow({
    item,
    onViewAnswer,
}) {
    return (
        <tr className="group transition-colors hover:bg-primary/5">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="size-8 overflow-hidden rounded-full bg-slate-200">
                        <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.lesson}</span>
                    <span className="text-[10px] text-slate-400">
                        {item.task} - {item.date}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        item.status === 'graded'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                >
                    {item.status_label}
                </span>
            </td>
            <td className="px-6 py-4 text-center">
                <button
                    type="button"
                    onClick={() => onViewAnswer(item.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Lihat Jawaban
                </button>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm font-bold text-primary">{item.teacher_score ?? item.score ?? '-'}</span>
            </td>
        </tr>
    );
}
