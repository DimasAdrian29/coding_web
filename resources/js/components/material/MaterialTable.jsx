import MaterialTableRow from './MaterialTableRow';

export default function MaterialTable({ materials, onEdit, onDelete, editHref = '#' }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-primary/10 bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Judul Materi
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Jumlah BAB
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Tanggal Dibuat
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                    {materials.map((item) => (
                        <MaterialTableRow
                            key={item.id}
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
