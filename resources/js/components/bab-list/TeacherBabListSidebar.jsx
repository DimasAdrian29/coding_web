export default function TeacherBabListSidebar({ menuItems, storage, onNavigate }) {
    return (
        <aside className="fixed flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6">
                <a href="/" className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold leading-none">Guru Dashboard</h1>
                        <p className="mt-1 text-xs text-slate-500">Manajemen Konten</p>
                    </div>
                </a>
            </div>

            <nav className="flex-1 space-y-1 px-4">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={() => onNavigate(item.label)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                            item.active
                                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="mt-auto p-4">
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {storage.title}
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                        <div
                            className="h-full bg-primary"
                            style={{ width: `${storage.usedPercent}%` }}
                        />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-500">{storage.usageLabel}</p>
                </div>
            </div>
        </aside>
    );
}
