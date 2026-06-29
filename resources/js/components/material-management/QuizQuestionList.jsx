export default function QuizQuestionList({ questions, onEditQuestion, onDeleteQuestion }) {
    return (
        <div className="space-y-4">
            {questions.map((question, index) => (
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
                                {question.options.map((option) => (
                                    <div
                                        key={option.key}
                                        className={`rounded-xl px-3 py-2 text-xs ${
                                            option.key === question.correct_answer
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
            ))}
        </div>
    );
}
