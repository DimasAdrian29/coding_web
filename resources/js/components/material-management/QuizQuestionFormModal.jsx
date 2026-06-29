export default function QuizQuestionFormModal({ open, onClose, onSave }) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-[1.75rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                            Form Soal Quiz
                        </p>
                        <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                            Tambah atau Edit Soal Quiz Akhir
                        </h3>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                    <p>Modal ini disiapkan untuk CRUD soal quiz akhir materi.</p>
                    <p>Field lanjutan: pertanyaan, opsi A-D, jawaban benar, dan urutan soal.</p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                        Batal
                    </button>
                    <button type="button" onClick={onSave} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white">
                        Simpan Soal Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}
