export default function TeacherMaterialTopbar({ title, searchPlaceholder, profileAvatar, onSearch, onNotification }) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-primary/10 bg-white/80 px-8 backdrop-blur-md dark:bg-background-dark/80">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        onChange={onSearch}
                        className="w-64 rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary dark:bg-slate-800"
                    />
                </div>

                <button
                    type="button"
                    onClick={onNotification}
                    className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                    <span className="material-symbols-outlined">notifications</span>
                </button>

                <div className="size-10 overflow-hidden rounded-full border-2 border-primary/20 bg-slate-200 dark:bg-slate-800">
                    <img
                        src={profileAvatar}
                        alt="Profil guru"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
