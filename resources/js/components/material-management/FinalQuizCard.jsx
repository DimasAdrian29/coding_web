import QuizQuestionList from './QuizQuestionList';

export default function FinalQuizCard({
    quiz,
    onManageQuestions,
    onEditQuiz,
    onDeleteQuestion,
    onEditQuestion,
}) {
    return (
        <section className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        Quiz Akhir Materi
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                        {quiz.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {quiz.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onEditQuiz}
                        className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary"
                    >
                        <span className="material-symbols-outlined text-base">edit</span>
                        Edit Quiz
                    </button>
                    <button
                        type="button"
                        onClick={onManageQuestions}
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
                        {quiz.durationMinutes} menit
                    </p>
                </div>
                <div className="rounded-[1.4rem] bg-background-light p-4 dark:bg-slate-950">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Jumlah Soal</p>
                    <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        {quiz.totalQuestions} soal
                    </p>
                </div>
                <div className="rounded-[1.4rem] bg-background-light p-4 dark:bg-slate-950">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Passing Grade</p>
                    <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        {quiz.passingScore}
                    </p>
                </div>
            </div>

            <QuizQuestionList
                questions={quiz.questions}
                onEditQuestion={onEditQuestion}
                onDeleteQuestion={onDeleteQuestion}
            />
        </section>
    );
}
