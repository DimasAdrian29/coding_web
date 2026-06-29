export default function TeacherSidebar({ menuItems, actionItems, onAction }) {
    return (
        <aside className="fixed flex h-full w-64 flex-col overflow-y-auto border-r border-primary/10 bg-white dark:bg-background-dark/50">
            <a href="/" className="flex items-center gap-3 p-6">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                    <span className="material-symbols-outlined">terminal</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-base leading-none font-bold text-slate-900 dark:text-white">
                        Guru Coding
                    </h1>
                    <p className="text-xs font-medium text-primary">Media Pembelajaran</p>
                </div>
            </a>

            <nav className="flex-1 space-y-1 px-4">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href ?? '#'}
                        onClick={(event) => {
                            if (!item.href || item.href === '#') {
                                event.preventDefault();
                            }

                            onAction(item.label);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                            item.active
                                ? 'bg-primary/10 font-semibold text-primary'
                                : 'text-slate-600 hover:bg-primary/5 hover:text-primary dark:text-slate-400'
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="space-y-1 border-t border-primary/10 p-4">
                {actionItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href ?? '#'}
                        onClick={(event) => {
                            if (!item.href || item.href === '#') {
                                event.preventDefault();
                            }

                            onAction(item.label);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                            item.variant === 'danger'
                                ? 'text-red-500 hover:bg-red-50'
                                : 'text-slate-600 hover:bg-primary/5 hover:text-primary dark:text-slate-400'
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </a>
                ))}
            </div>
        </aside>
    );
}
