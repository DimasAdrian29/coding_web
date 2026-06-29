export default function MaterialPageHeader({
    title,
    description,
    actionLabel,
    onAdd,
    addHref = '#',
    secondaryActionLabel,
    secondaryActionHref = '#',
    onSecondaryAction,
}) {
    return (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                    {title}
                </h3>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
                {secondaryActionLabel ? (
                    <a
                        href={secondaryActionHref}
                        onClick={onSecondaryAction}
                        className="rounded-xl border border-primary/20 px-5 py-2.5 font-bold text-primary transition-all hover:bg-primary/5"
                    >
                        {secondaryActionLabel}
                    </a>
                ) : null}
                <a
                    href={addHref}
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                >
                    <span className="material-symbols-outlined">add</span>
                    {actionLabel}
                </a>
            </div>
        </div>
    );
}
