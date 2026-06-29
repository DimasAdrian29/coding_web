export default function ExerciseSidebar({ data, onNavigate }) {
    return (
        <aside className="flex w-72 flex-col gap-8 border-r border-primary/10 bg-white p-6 dark:bg-background-dark">
            <div className="flex items-center gap-3">
                <div className="size-12 overflow-hidden rounded-full bg-primary/20">
                    <img
                        src={data.profileImage}
                        alt="Teacher profile avatar"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">
                        {data.title}
                    </h1>
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                        {data.role}
                    </p>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                {data.menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={() => onNavigate(item.label)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                            item.active
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-600 hover:bg-primary/10 dark:text-slate-400'
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-sm font-semibold">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="mt-auto rounded-xl border border-primary/10 bg-primary/5 p-4">
                <p className="mb-2 text-xs text-slate-500">{data.storage.title}</p>
                <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                        className="h-full bg-primary"
                        style={{ width: `${data.storage.usedPercent}%` }}
                    />
                </div>
                <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    {data.storage.usedLabel}
                </p>
            </div>
        </aside>
    );
}
