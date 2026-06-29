import { useEffect, useState } from 'react';

const emptyChapterForm = {
    title: '',
    content: '',
    chapter_order: 1,
};

export default function ChapterFormModal({
    open,
    chapter,
    defaultOrder = 1,
    onClose,
    onSave,
    isSaving = false,
}) {
    const [form, setForm] = useState(emptyChapterForm);

    useEffect(() => {
        if (!open) {
            return;
        }

        setForm(
            chapter
                ? {
                    title: chapter.title ?? '',
                    content: chapter.content ?? '',
                    chapter_order: chapter.chapter_order ?? defaultOrder,
                }
                : {
                    title: '',
                    content: '',
                    chapter_order: defaultOrder,
                },
        );
    }, [chapter, defaultOrder, open]);

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
            title: form.title.trim(),
            content: form.content.trim(),
            chapter_order: Number(form.chapter_order),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-[1.75rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                            Form BAB
                        </p>
                        <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                            {chapter ? `Edit ${chapter.title}` : 'Tambah BAB Baru'}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Tambahkan BAB baru langsung dari dashboard tanpa keluar dari alur kelola materi.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Judul BAB
                        </span>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(event) => handleChange('title', event.target.value)}
                            className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                            placeholder="Contoh: Variabel dan Tipe Data"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Ringkasan / Isi BAB
                        </span>
                        <textarea
                            rows="4"
                            value={form.content}
                            onChange={(event) => handleChange('content', event.target.value)}
                            className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                            placeholder="Tulis ringkasan isi BAB agar guru lebih mudah mengenali konten yang sedang dikelola."
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Urutan BAB
                        </span>
                        <input
                            type="number"
                            min="1"
                            value={form.chapter_order}
                            onChange={(event) => handleChange('chapter_order', event.target.value)}
                            className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                        />
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? 'Menyimpan...' : chapter ? 'Update BAB' : 'Simpan BAB'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
