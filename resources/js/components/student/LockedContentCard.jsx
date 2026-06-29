export default function LockedContentCard({
    title = 'Konten Terkunci',
    message = 'Selesaikan tahapan sebelumnya untuk membuka konten ini.',
    actionHref = '/siswa/dashboard',
    actionLabel = 'Kembali',
}) {
    return (
        <section className="rounded-[1.75rem] border border-slate-200 bg-slate-100 p-8 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm dark:bg-slate-950">
                    <span className="material-symbols-outlined">lock</span>
                </div>
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                        Akses Ditahan
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                        {title}
                    </h3>
                </div>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-7">{message}</p>

            <a
                href={actionHref}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white dark:bg-primary"
            >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                {actionLabel}
            </a>
        </section>
    );
}
