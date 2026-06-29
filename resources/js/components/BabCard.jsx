import LockOverlay from './LockOverlay';

const badgeTone = {
    completed: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    current: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    locked: 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-300',
};

const badgeLabel = {
    completed: 'Selesai',
    current: 'Sedang Dipelajari',
    locked: 'Terkunci',
};

export default function BabCard({ bab, highlightUnlocked = false }) {
    const isLocked = bab.is_locked;

    return (
        <div className="relative">
            {isLocked ? <LockOverlay /> : null}

            <a
                href={isLocked ? undefined : `/siswa/bab/${bab.id}`}
                className={`group block rounded-[1.75rem] border bg-white p-6 shadow-sm transition-all duration-300 dark:bg-slate-900 ${
                    isLocked
                        ? 'pointer-events-none border-slate-200 opacity-75 dark:border-slate-800'
                        : 'border-primary/10 hover:-translate-y-1 hover:border-primary/30'
                } ${highlightUnlocked ? 'ring-2 ring-primary ring-offset-4 ring-offset-background-light animate-pulse dark:ring-offset-background-dark' : ''}`}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">
                            {bab.is_completed ? 'task_alt' : isLocked ? 'lock' : 'auto_stories'}
                        </span>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badgeTone[bab.status]}`}
                    >
                        {badgeLabel[bab.status]}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        <span>{`BAB ${String(bab.order_number).padStart(2, '0')}`}</span>
                    </div>
                    <h3 className="text-xl font-black leading-snug text-slate-900 dark:text-white">
                        {bab.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {bab.description}
                    </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                            bab.exercise_locked
                                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                : bab.exercise_completed
                                    ? 'bg-blue-100 font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-primary/10 font-semibold text-primary'
                        }`}
                    >
                        Latihan: {bab.exercise_locked ? 'Terkunci' : bab.exercise_completed ? 'Selesai' : 'Terbuka'}
                    </div>
                    <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                            bab.quiz_locked
                                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                : 'bg-primary/10 font-semibold text-primary'
                        }`}
                    >
                        Quiz: {bab.quiz_locked ? 'Terkunci' : 'Terbuka'}
                    </div>
                </div>
            </a>
        </div>
    );
}
