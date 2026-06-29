const statusClassMap = {
    public: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    draft: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};

export default function BabManagementRow({ item, onEdit, onDelete, editHref = '#' }) {
    return (
        <tr className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <td className="px-6 py-4">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold dark:bg-slate-800">
                    {item.order}
                </span>
            </td>
            <td className="px-6 py-4">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
            </td>
            <td className="px-6 py-4">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClassMap[item.statusTone]}`}>
                    {item.status}
                </span>
            </td>
            <td className="space-x-1 px-6 py-4 text-right">
                <a
                    href={editHref}
                    title="Edit"
                    onClick={() => onEdit(item)}
                    className="rounded-lg p-2 text-slate-400 transition-all hover:bg-primary/10 hover:text-primary"
                >
                    <span className="material-symbols-outlined text-xl">edit</span>
                </a>
                <button
                    type="button"
                    title="Delete"
                    onClick={() => onDelete(item)}
                    className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                >
                    <span className="material-symbols-outlined text-xl">delete</span>
                </button>
            </td>
        </tr>
    );
}
