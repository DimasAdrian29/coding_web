export default function TeacherHeader({ profile, onNotification, onProfile, primaryLink }) {
    const displayName = profile?.name ?? 'Guru';
    const roleLabel = profile?.role ?? 'Guru Coding';
    const avatar = profile?.avatar;

    return (
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Selamat Datang, {displayName}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Ringkasan aktivitas pembelajaran coding hari ini.
                </p>
            </div>

            <div className="flex items-center gap-4">
                {primaryLink ? (
                    <a
                        href={primaryLink.href}
                        className="hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 md:block"
                    >
                        {primaryLink.label}
                    </a>
                ) : null}

                <button
                    type="button"
                    onClick={onNotification}
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                    <span className="material-symbols-outlined">notifications</span>
                </button>

                <button
                    type="button"
                    onClick={onProfile}
                    className="flex items-center gap-3 border-l border-slate-200 pl-4 text-left dark:border-slate-700"
                >
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{displayName}</p>
                        <p className="text-xs font-medium text-primary">{roleLabel}</p>
                    </div>
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={`Avatar ${displayName}`}
                            className="size-10 rounded-full border-2 border-primary/20 object-cover"
                        />
                    ) : (
                        <div className="flex size-10 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-primary">
                            <span className="material-symbols-outlined">account_circle</span>
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
}
