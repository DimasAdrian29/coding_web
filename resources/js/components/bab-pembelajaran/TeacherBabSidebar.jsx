export default function TeacherBabSidebar({ menuItems, helpCard, onNavigate, onReadDocs }) {
    return (
        <aside className="w-full space-y-8 border-r border-primary/10 bg-white p-6 dark:bg-slate-900 lg:w-64">
            <div className="space-y-1">
                <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Main Menu
                </p>

                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={() => onNavigate(item.label)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                            item.active
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'hover:bg-primary/10'
                        }`}
                    >
                        <span
                            className={`material-symbols-outlined ${
                                item.active ? 'text-white' : 'text-slate-500'
                            }`}
                        >
                            {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                    </a>
                ))}
            </div>

            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                <p className="mb-1 text-sm font-semibold text-primary">{helpCard.title}</p>
                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{helpCard.description}</p>
                <button
                    type="button"
                    onClick={onReadDocs}
                    className="text-xs font-bold text-primary hover:underline"
                >
                    {helpCard.actionLabel}
                </button>
            </div>
        </aside>
    );
}
