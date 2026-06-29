export default function MaterialTableRow({ item, onEdit, onDelete, editHref = '#' }) {
    return (
        <tr className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                </div>
            </td>
            <td className="px-6 py-5 text-slate-600 dark:text-slate-400">{item.chapterCount} BAB</td>
            <td className="px-6 py-5 text-slate-600 dark:text-slate-400">{item.createdAt}</td>
            <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-2">
                    <a
                        href={editHref}
                        onClick={() => onEdit(item)}
                        className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-primary/10 hover:text-primary"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </a>
                    <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}
