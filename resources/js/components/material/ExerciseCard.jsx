export default function ExerciseCard({
    activeChapter,
    exercises,
    onAddExercise,
    onEditExercise,
    onDeleteExercise,
}) {
    return (
        <section className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        Latihan Per BAB
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                        {activeChapter ? `Latihan untuk ${activeChapter.title}` : 'Pilih BAB terlebih dahulu'}
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={onAddExercise}
                    disabled={!activeChapter}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-base">add</span>
                    Tambah Latihan
                </button>
            </div>

            {!activeChapter ? (
                <div className="rounded-[1.4rem] border border-dashed border-primary/20 bg-background-light px-5 py-10 text-center text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    Pilih BAB untuk melihat latihan yang terkait pada materi ini.
                </div>
            ) : (
                <div className="space-y-4">
                    {exercises.length === 0 ? (
                        <div className="rounded-[1.4rem] border border-dashed border-primary/20 bg-background-light px-5 py-8 text-center text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                            Belum ada latihan pada BAB ini.
                        </div>
                    ) : null}
                    {exercises.map((exercise, index) => (
                        <div
                            key={exercise.id}
                            className="rounded-[1.4rem] border border-primary/10 bg-background-light p-4 dark:bg-slate-950"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                                        Latihan {index + 1}
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                                        {exercise.question}
                                    </p>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                        {[
                                            ['A', exercise.option_a],
                                            ['B', exercise.option_b],
                                            ['C', exercise.option_c],
                                            ['D', exercise.option_d],
                                        ].map(([key, value]) => (
                                            <div
                                                key={key}
                                                className={`rounded-xl px-3 py-2 text-xs ${
                                                    key === exercise.correct_answer
                                                        ? 'bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                        : 'bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                                                }`}
                                            >
                                                {key}. {value}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEditExercise(exercise)}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-primary/10 hover:text-primary"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteExercise(exercise)}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
