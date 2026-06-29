export default function TeacherMaterialSidebar({ menuItems, footerItem, onNavigate }) {
    return (
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-primary/10 bg-white md:flex dark:bg-background-dark/50">
            <div className="p-6">
                <a href="/" className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold leading-tight">Guru Dashboard</h1>
                        <p className="text-xs text-slate-500">Panel Pengajar</p>
                    </div>
                </a>
            </div>

            <nav className="flex-1 space-y-1 px-4">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={() => onNavigate(item.label)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                            item.active
                                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                                : 'text-slate-600 hover:bg-primary/5 dark:text-slate-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="border-t border-primary/10 p-4">
                <a
                    href={footerItem.href}
                    onClick={() => onNavigate(footerItem.label)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-primary/5 dark:text-slate-400"
                >
                    <span className="material-symbols-outlined text-[24px]">{footerItem.icon}</span>
                    <span className="text-sm font-medium">{footerItem.label}</span>
                </a>
            </div>
        </aside>
    );
}
