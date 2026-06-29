const statusStyle = {
    locked: {
        icon: 'lock',
        label: 'Terkunci',
        badge: 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-300',
        card: 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400',
        number: 'bg-white text-slate-400 dark:bg-slate-950',
    },
    unlocked: {
        icon: 'play_circle',
        label: 'Sedang Dipelajari',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
        card: 'border-primary/20 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200',
        number: 'bg-primary/10 text-primary',
    },
    completed: {
        icon: 'task_alt',
        label: 'Selesai',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
        card: 'border-blue-200 bg-white text-slate-700 dark:border-blue-500/20 dark:bg-slate-900 dark:text-slate-200',
        number: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    },
};

export default function ChapterProgressCard({ chapter, onOpen }) {
    const currentStyle = statusStyle[chapter.status] ?? statusStyle.locked;
    const exercise = chapter.exercise ?? {};
    const exerciseLabel = exercise.is_required
        ? exercise.status_label
        : 'Tidak ada latihan wajib';

    return (
        <button
            type="button"
            onClick={() => onOpen(chapter)}
            className={`w-full rounded-[1.4rem] border p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 ${currentStyle.card}`}
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black shadow-sm ${currentStyle.number}`}>
                        {String(chapter.chapter_order).padStart(2, '0')}
                    </span>
                    <div>
                        <h5 className="text-lg font-black text-slate-900 dark:text-white">
                            {chapter.title}
                        </h5>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {chapter.content || 'Isi BAB belum tersedia.'}
                        </p>
                    </div>
                </div>

                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${currentStyle.badge}`}>
                    <span className="material-symbols-outlined text-sm">{currentStyle.icon}</span>
                    {currentStyle.label}
                </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-500 dark:bg-slate-950 dark:text-slate-300">
                    <span className="material-symbols-outlined text-sm">
                        {exercise.is_locked ? 'lock' : exercise.is_completed ? 'task_alt' : 'assignment'}
                    </span>
                    Latihan: {exerciseLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-500 dark:bg-slate-950 dark:text-slate-300">
                    {exercise.question_count ?? chapter.exercise_count ?? 0} soal
                </span>
                {exercise.score !== null && exercise.score !== undefined ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-500 dark:bg-slate-950 dark:text-slate-300">
                        Nilai: {exercise.score}
                    </span>
                ) : null}
            </div>
        </button>
    );
}
