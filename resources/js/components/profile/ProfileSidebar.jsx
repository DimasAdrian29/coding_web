export default function ProfileSidebar({ menuItems, teacher, onAction }) {
    return (
        <aside className="fixed flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
            <div className="flex items-center gap-3 p-6">
                <div className="rounded-lg bg-primary/20 p-2">
                    <span className="material-symbols-outlined text-primary">school</span>
                </div>
                <div>
                    <h1 className="text-base leading-none font-bold text-slate-900 dark:text-slate-100">
                        Guru Dashboard
                    </h1>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Administrator
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-4">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={() => onAction(item.label)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                            item.active
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${item.active ? 'fill-[1]' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center gap-3 p-2">
                    <div
                        className="h-10 w-10 rounded-full bg-slate-200 bg-cover bg-center dark:bg-slate-700"
                        style={{ backgroundImage: `url("${teacher.sidebarAvatar}")` }}
                    />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{teacher.shortName}</p>
                        <p className="truncate text-xs text-slate-500">{`NIP: ${teacher.nipShort}`}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onAction('Logout')}
                        className="text-slate-400 transition-colors hover:text-red-500"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
