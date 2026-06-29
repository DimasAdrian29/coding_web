export default function MaterialInfoCard({
    material,
    onChange,
    onSave,
}) {
    return (
        <section className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        Informasi Materi
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Pengaturan Materi Utama
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                        Kelola identitas utama materi sebagai pusat BAB, latihan, dan quiz akhir.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        Level: {material.level}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Update terakhir: {material.lastUpdated}
                    </span>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
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
                </div>

                <div className="flex flex-col justify-between rounded-[1.5rem] bg-background-light p-5 dark:bg-slate-950">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                Ringkasan
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Materi ini menjadi container utama untuk seluruh struktur pembelajaran.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-2xl border border-primary/10 bg-white px-4 py-4 dark:bg-slate-900">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Kategori
                                </p>
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">
                                    {material.category}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-primary/10 bg-white px-4 py-4 dark:bg-slate-900">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Status
                                </p>
                                <p className="mt-2 text-sm font-semibold text-blue-600">
                                    Siap dikembangkan
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onSave}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                    >
                        <span className="material-symbols-outlined text-base">save</span>
                        Simpan Materi
                    </button>
                </div>
            </div>
        </section>
    );
}
