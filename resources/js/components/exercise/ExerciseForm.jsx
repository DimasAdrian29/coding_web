import { useState } from 'react';

export default function ExerciseForm({
    defaultValues,
    subjects,
    answerOptions,
    onSubmit,
}) {
    const [formData, setFormData] = useState(defaultValues);

    const updateField = (field, value) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Latihan Baru</h3>

            <div className="rounded-xl border border-primary/10 bg-white p-8 shadow-sm dark:bg-background-dark">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Materi Terkait
                            </label>
                            <select
                                value={formData.subject}
                                onChange={(event) => updateField('subject', event.target.value)}
                                className="form-select w-full rounded-xl border-primary/20 bg-background-light text-sm transition-all focus:border-primary focus:ring-primary dark:bg-background-dark"
                            >
                                {subjects.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Kunci Jawaban (Abjad)
                            </label>
                            <select
                                value={formData.answer}
                                onChange={(event) => updateField('answer', event.target.value)}
                                className="form-select w-full rounded-xl border-primary/20 bg-background-light text-sm transition-all focus:border-primary focus:ring-primary dark:bg-background-dark"
                            >
                                {answerOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Teks Soal
                        </label>
                        <textarea
                            rows="4"
                            value={formData.question}
                            onChange={(event) => updateField('question', event.target.value)}
                            placeholder="Tuliskan pertanyaan latihan di sini..."
                            className="form-textarea w-full rounded-xl border-primary/20 bg-background-light text-sm transition-all placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:bg-background-dark"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Pilihan A
                            </label>
                            <input
                                type="text"
                                value={formData.optionA}
                                onChange={(event) => updateField('optionA', event.target.value)}
                                placeholder="Masukkan pilihan jawaban A"
                                className="form-input w-full rounded-xl border-primary/20 bg-background-light text-sm transition-all focus:border-primary focus:ring-primary dark:bg-background-dark"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Pilihan B
                            </label>
                            <input
                                type="text"
                                value={formData.optionB}
                                onChange={(event) => updateField('optionB', event.target.value)}
                                placeholder="Masukkan pilihan jawaban B"
                                className="form-input w-full rounded-xl border-primary/20 bg-background-light text-sm transition-all focus:border-primary focus:ring-primary dark:bg-background-dark"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Pilihan C
                            </label>
                            <input
                                type="text"
                                value={formData.optionC}
                                onChange={(event) => updateField('optionC', event.target.value)}
                                placeholder="Masukkan pilihan jawaban C"
                                className="form-input w-full rounded-xl border-primary/20 bg-background-light text-sm transition-all focus:border-primary focus:ring-primary dark:bg-background-dark"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Pilihan D
                            </label>
                            <input
                                type="text"
                                value={formData.optionD}
                                onChange={(event) => updateField('optionD', event.target.value)}
                                placeholder="Masukkan pilihan jawaban D"
                                className="form-input w-full rounded-xl border-primary/20 bg-background-light text-sm transition-all focus:border-primary focus:ring-primary dark:bg-background-dark"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-primary/10 pt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <span className="material-symbols-outlined text-sm">save</span>
                            <span>Simpan Soal Latihan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
