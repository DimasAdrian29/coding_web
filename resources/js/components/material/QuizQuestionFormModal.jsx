import { useEffect, useState } from 'react';

const emptyQuestionForm = {
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
};

export default function QuizQuestionFormModal({
    open,
    question,
    onClose,
    onSave,
    isSaving = false,
}) {
    const [form, setForm] = useState(emptyQuestionForm);

    useEffect(() => {
        if (!open) {
            return;
        }

        setForm(
            question
                ? {
                    question: question.question ?? '',
                    option_a: question.option_a ?? '',
                    option_b: question.option_b ?? '',
                    option_c: question.option_c ?? '',
                    option_d: question.option_d ?? '',
                    correct_answer: question.correct_answer ?? 'A',
                }
                : emptyQuestionForm,
        );
    }, [open, question]);

    if (!open) {
        return null;
    }

    const handleChange = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            question: form.question.trim(),
            option_a: form.option_a.trim(),
            option_b: form.option_b.trim(),
            option_c: form.option_c.trim(),
            option_d: form.option_d.trim(),
            correct_answer: form.correct_answer,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[1.75rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                            Form Soal Quiz
                        </p>
                        <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                            {question ? 'Edit Soal Quiz' : 'Tambah Soal Quiz'}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Pertanyaan
                        </span>
                        <textarea
                            rows="4"
                            value={form.question}
                            onChange={(event) => handleChange('question', event.target.value)}
                            className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                        />
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Opsi A
                            </span>
                            <input
                                type="text"
                                value={form.option_a}
                                onChange={(event) => handleChange('option_a', event.target.value)}
                                className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Opsi B
                            </span>
                            <input
                                type="text"
                                value={form.option_b}
                                onChange={(event) => handleChange('option_b', event.target.value)}
                                className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Opsi C
                            </span>
                            <input
                                type="text"
                                value={form.option_c}
                                onChange={(event) => handleChange('option_c', event.target.value)}
                                className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Opsi D
                            </span>
                            <input
                                type="text"
                                value={form.option_d}
                                onChange={(event) => handleChange('option_d', event.target.value)}
                                className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Jawaban Benar
                        </span>
                        <select
                            value={form.correct_answer}
                            onChange={(event) => handleChange('correct_answer', event.target.value)}
                            className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                        >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? 'Menyimpan...' : question ? 'Update Soal' : 'Simpan Soal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
