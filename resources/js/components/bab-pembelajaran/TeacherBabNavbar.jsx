export default function TeacherBabNavbar({ title, searchPlaceholder, onSearch, onNotification, onAccount }) {
    return (
        <header className="flex items-center justify-between border-b border-primary/10 bg-white px-6 py-4 dark:bg-slate-900 lg:px-20">
            <div className="flex items-center gap-4">
                <a
                    href="/dashboard-guru"
                    className="flex size-10 items-center justify-center rounded-lg bg-primary text-white"
                >
                    <span className="material-symbols-outlined">school</span>
                </a>
                <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            </div>

            <div className="flex flex-1 justify-end gap-4">
                <label className="relative hidden w-full max-w-sm items-center md:flex">
                    <span className="material-symbols-outlined absolute left-3 text-slate-400">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        onChange={onSearch}
                        className="w-full rounded-xl border-none bg-slate-100 py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 dark:bg-slate-800"
                    />
                </label>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onNotification}
                        className="flex size-10 items-center justify-center rounded-xl bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button
                        type="button"
                        onClick={onAccount}
                        className="flex size-10 items-center justify-center rounded-xl bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800"
                    >
                        <span className="material-symbols-outlined">account_circle</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
