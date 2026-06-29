export default function StatsHeader({ title, searchPlaceholder, user, onSearch, onNotification }) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-primary/10 bg-white px-8 dark:bg-background-dark">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden max-w-md md:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        onChange={onSearch}
                        className="w-64 rounded-xl border-none bg-primary/5 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button
                    type="button"
                    onClick={onNotification}
                    className="relative rounded-xl bg-primary/5 p-2 text-slate-600"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
                </button>
                <div className="hidden text-right sm:block">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name ?? 'Guru'}</p>
                    <p className="text-[10px] font-medium text-primary">{user?.role ?? 'guru'}</p>
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">account_circle</span>
                </div>
            </div>
        </header>
    );
}
