import BabTable from './BabTable';

export default function BabGroupSection({ group, onEdit, onDelete }) {
    return (
        <section>
            <div className="mb-4 flex items-center gap-3">
                <div className={`flex size-8 items-center justify-center rounded-lg ${group.iconClassName}`}>
                    <span className="material-symbols-outlined text-lg">{group.icon}</span>
                </div>
                <h3 className="text-lg font-bold">{group.title}</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800">
                    {group.totalLabel}
                </span>
            </div>

            <BabTable items={group.items} onEdit={onEdit} onDelete={onDelete} />
        </section>
    );
}
