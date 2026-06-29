export default function KelolaBabGuruHeader({
    title,
    description,
    actionLabel,
    onAdd,
    actionHref = '#',
}) {
    return (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 className="text-3xl font-black tracking-tight">{title}</h1>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
            <a
                href={actionHref}
                onClick={onAdd}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                <span className="material-symbols-outlined text-lg">add</span>
                {actionLabel}
            </a>
        </div>
    );
}
