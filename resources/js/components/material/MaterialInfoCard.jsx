export default function MaterialInfoCard({
    material,
    onChange,
    onSave,
    onCreateNew,
    onDelete,
    isEditing = false,
    isSaving = false,
}) {
    return (
        <section className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        Informasi Materi
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Identitas Materi Utama
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                        Materi menjadi pusat untuk menyusun BAB, latihan per BAB, dan satu quiz akhir.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
                        {material.status === 'publish' ? 'Publish' : 'Draft'}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {isEditing ? 'Mode Edit' : 'Materi Baru'}
                    </span>
                </div>
            </div>

            <div className="space-y-5">
                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Judul Materi
                    </span>
                    <input
                        type="text"
                        value={material.title}
                        onChange={(event) => onChange('title', event.target.value)}
                        className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Deskripsi Materi
                    </span>
                    <textarea
                        rows="5"
                        value={material.description}
                        onChange={(event) => onChange('description', event.target.value)}
                        className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Status Materi
                    </span>
                    <select
                        value={material.status}
                        onChange={(event) => onChange('status', event.target.value)}
                        className="w-full rounded-xl border border-primary/20 bg-background-light px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-950"
                    >
                        <option value="draft">Draft</option>
                        <option value="publish">Publish</option>
                    </select>
                </label>

                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-base">save</span>
                        {isSaving
                            ? 'Menyimpan...'
                            : isEditing
                                ? 'Update Materi'
                                : 'Simpan Materi'}
                    </button>

                    <button
                        type="button"
                        onClick={onCreateNew}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-5 py-3 text-sm font-bold text-primary dark:bg-slate-900"
                    >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        Materi Baru
                    </button>

                    {isEditing ? (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300"
                        >
                            <span className="material-symbols-outlined text-base">delete</span>
                            Hapus Materi
                        </button>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
