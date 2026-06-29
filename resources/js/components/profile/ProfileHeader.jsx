export default function ProfileHeader({ teacher, onAction }) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 dark:border-slate-800 dark:bg-background-dark">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_circle</span>
                <h2 className="text-lg font-bold">Profil Guru</h2>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => onAction('Notifikasi')}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button
                    type="button"
                    onClick={() => onAction('Pengaturan')}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                    <span className="material-symbols-outlined">settings</span>
                </button>
                <div className="mx-2 h-6 w-px bg-slate-200 dark:bg-slate-700" />
                <div
                    className="h-10 w-10 rounded-full border-2 border-primary/20 bg-cover bg-center"
                    style={{ backgroundImage: `url("${teacher.headerAvatar}")` }}
                />
            </div>
        </header>
    );
}
