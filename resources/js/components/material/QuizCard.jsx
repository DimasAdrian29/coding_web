export default function QuizCard({
    quiz,
    onManageQuestions,
    onEditQuiz,
    onDeleteQuiz,
    onDeleteQuestion,
    onEditQuestion,
}) {
    const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];

    return (
        <section className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        Quiz Akhir Materi
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                        {quiz?.title ?? 'Quiz akhir belum dibuat'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Quiz final mencakup seluruh BAB yang ada di materi ini.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onEditQuiz}
                        className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary"
                    >
                        <span className="material-symbols-outlined text-base">edit</span>
                        {quiz ? 'Edit Quiz' : 'Buat Quiz'}
                    </button>
                    {quiz ? (
                        <button
                            type="button"
                            onClick={onDeleteQuiz}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300"
                        >
                            <span className="material-symbols-outlined text-base">delete</span>
                            Hapus Quiz
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={onManageQuestions}
                        disabled={!quiz}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-base">quiz</span>
                        Kelola Soal Quiz
                    </button>
                </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.4rem] bg-background-light p-4 dark:bg-slate-950">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Durasi</p>
                    <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        {quiz?.duration_minutes ?? 0} menit
                    </p>
                </div>
                <div className="rounded-[1.4rem] bg-background-light p-4 dark:bg-slate-950">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Jumlah Soal</p>
                    <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        {quiz?.question_count ?? questions.length} soal
                    </p>
                </div>
                <div className="rounded-[1.4rem] bg-background-light p-4 dark:bg-slate-950">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Format</p>
                    <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        Pilihan Ganda
                    </p>
                </div>
            </div>

            {!quiz ? (
                <div className="rounded-[1.4rem] border border-dashed border-primary/20 bg-background-light px-5 py-10 text-center text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    Buat quiz akhir terlebih dahulu sebelum menambahkan soal.
                </div>
            ) : null}

            <div className="space-y-4">
                {questions.map((question, index) => {
                    const normalizedOptions = Array.isArray(question.options)
                        ? question.options
                        : Object.entries(question.options ?? {}).map(([key, label]) => ({
                            key: key.toLowerCase(),
                            label,
                        }));
                    const correctAnswer = (question.correct_answer ?? question.correctAnswer ?? '').toLowerCase();

                    return (
                        <div
                            key={question.id}
                            className="rounded-[1.4rem] border border-primary/10 bg-background-light p-4 dark:bg-slate-950"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                                        Soal Quiz {index + 1}
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                                        {question.question}
                                    </p>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                        {normalizedOptions.map((option) => (
                                            <div
                                                key={option.key}
                                                className={`rounded-xl px-3 py-2 text-xs ${
                                                    option.key === correctAnswer
                                                        ? 'bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                        : 'bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                                                }`}
                                            >
                                                {option.key.toUpperCase()}. {option.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEditQuestion(question)}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-primary/10 hover:text-primary"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteQuestion(question)}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
