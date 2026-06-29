export default function AssessmentSidebar({ data, onNavigate, onLogout }) {
    return (
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-primary/10 bg-white md:flex dark:bg-background-dark/50">
            <div className="p-6">
                <div className="mb-8 flex items-center gap-3">
                    <div className="size-10 overflow-hidden rounded-full border border-primary/20 bg-primary/20 text-primary">
                        <img
                            src={data.profile.avatar}
                            alt={`${data.profile.name} Profile`}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-semibold leading-none">{data.profile.name}</h1>
                        <p className="mt-1 text-xs font-medium text-primary">{data.profile.role}</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {data.menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={() => onNavigate(item.label)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                                item.active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-600 hover:bg-primary/10 dark:text-slate-400'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </a>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6">
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-colors hover:bg-red-50"
                >
                    <span className="material-symbols-outlined text-[22px]">{data.logout.icon}</span>
                    <span className="text-sm font-medium">{data.logout.label}</span>
                </button>
            </div>
        </aside>
    );
}
