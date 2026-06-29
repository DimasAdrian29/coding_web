import { useEffect, useState } from 'react';

const emptyQuizForm = {
    title: '',
    duration_minutes: 30,
};

export default function QuizFormModal({ open, quiz, onClose, onSave, isSaving = false }) {
    const [form, setForm] = useState(emptyQuizForm);

    useEffect(() => {
        if (!open) {
            return;
        }

        setForm(
            quiz
                ? {
                    title: quiz.title ?? '',
                    duration_minutes: quiz.duration_minutes ?? 30,
                }
                : {
                    title: 'Quiz Akhir Materi',
                    duration_minutes: 30,
                },
        );
    }, [open, quiz]);

    if (!open) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            title: form.title.trim(),
            duration_minutes: Number(form.duration_minutes),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-[1.75rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                            Form Quiz Akhir
                        </p>
                        <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                            {quiz ? 'Edit Quiz Akhir' : 'Buat Quiz Akhir'}
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
                            Judul Quiz
                        </span>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                            className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Durasi (Menit)
                        </span>
                        <input
                            type="number"
                            min="1"
                            value={form.duration_minutes}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    duration_minutes: event.target.value,
                                }))
                            }
                            className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                        />
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
                            {isSaving ? 'Menyimpan...' : quiz ? 'Update Quiz' : 'Simpan Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
