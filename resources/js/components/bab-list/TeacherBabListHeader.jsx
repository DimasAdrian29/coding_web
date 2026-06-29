export default function TeacherBabListHeader({
    title,
    searchPlaceholder,
    profileImage,
    onSearch,
    onNotification,
}) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        onChange={onSearch}
                        className="w-64 rounded-xl border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary dark:bg-slate-800"
                    />
                </div>

                <button
                    type="button"
                    onClick={onNotification}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <span className="material-symbols-outlined">notifications</span>
                </button>

                <div className="size-8 overflow-hidden rounded-full border-2 border-white bg-primary dark:border-slate-800">
                    <div
                        className="h-full w-full bg-slate-200 bg-cover bg-center"
                        style={{ backgroundImage: `url('${profileImage}')` }}
                        title="Teacher profile picture"
                    />
                </div>
            </div>
        </header>
    );
}
