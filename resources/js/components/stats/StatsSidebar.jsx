export default function StatsSidebar({ data, onNavigate }) {
    return (
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-primary/10 bg-white lg:flex dark:bg-background-dark">
            <div className="flex items-center gap-3 p-6">
                <div className="rounded-lg bg-primary p-2 text-white">
                    <span className="material-symbols-outlined">{data.brand.icon}</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-primary">{data.brand.title}</h2>
            </div>

            <nav className="mt-4 flex-1 space-y-2 px-4">
                {data.menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={() => onNavigate(item.label)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                            item.active
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-600 hover:bg-primary/10 dark:text-slate-400'
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="mt-auto border-t border-primary/10 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4">
                    <div
                        className="size-10 rounded-full border border-primary/20 bg-primary/20 bg-cover bg-center"
                        style={{ backgroundImage: `url('${data.teacher.avatar}')` }}
                        title={`Profil ${data.teacher.name}`}
                    />
                    <div className="flex flex-col overflow-hidden">
                        <p className="truncate text-sm font-bold">{data.teacher.name}</p>
                        <p className="truncate text-xs text-slate-500">{data.teacher.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
