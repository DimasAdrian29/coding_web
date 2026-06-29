import BabManagementRow from './BabManagementRow';

export default function BabManagementTable({ items, onEdit, onDelete, editHref = '#' }) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="w-20 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                            Urutan
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                            Judul BAB
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                            Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items.map((item) => (
                        <BabManagementRow
                            key={`${item.order}-${item.title}`}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            editHref={editHref}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
