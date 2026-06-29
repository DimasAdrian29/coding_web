export default function TeacherBabPageHeader({
    title,
    description,
    primaryActionLabel,
    secondaryActionLabel,
    secondaryActionHref = '#',
    onPrimaryAction,
    onSecondaryAction,
}) {
    return (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{description}</p>
            </div>

            <div className="flex gap-3">
                <a
                    href={secondaryActionHref}
                    onClick={onSecondaryAction}
                    className="rounded-xl border border-slate-300 px-6 py-2.5 font-semibold transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                    {secondaryActionLabel}
                </a>
                <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-2.5 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
                >
                    <span className="material-symbols-outlined text-sm">save</span>
                    {primaryActionLabel}
                </button>
            </div>
        </div>
    );
}
