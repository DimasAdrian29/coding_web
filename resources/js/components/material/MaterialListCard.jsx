export default function MaterialListCard({
    materials,
    selectedMaterialId,
    onSelectMaterial,
    loading = false,
}) {
    return (
        <section className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-4">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                    Daftar Materi
                </p>
                <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Pilih materi yang ingin dikelola
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Klik salah satu materi untuk menjadikannya materi aktif. Card informasi,
                    BAB, latihan, dan quiz akan mengikuti materi yang sedang dipilih.
                </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-28 animate-pulse rounded-2xl border border-primary/10 bg-background-light dark:bg-slate-950"
                        />
                    ))
                    : materials.map((material) => {
                        const isActive = material.id === selectedMaterialId;

                        return (
                            <button
                                key={material.id}
                                type="button"
                                onClick={() => onSelectMaterial(material.id)}
                                className={`rounded-2xl border p-4 text-left transition-all ${
                                    isActive
                                        ? 'border-primary bg-primary/10 shadow-sm shadow-primary/10'
                                        : 'border-primary/10 bg-background-light hover:border-primary/30 hover:bg-primary/5 dark:bg-slate-950'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div
                                            className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                                                isActive
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white text-primary dark:bg-slate-900'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                menu_book
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p
                                                className={`truncate text-sm font-black ${
                                                    isActive
                                                        ? 'text-primary'
                                                        : 'text-slate-900 dark:text-white'
                                                }`}
                                            >
                                                {material.title}
                                            </p>
                                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                                                {material.status}
                                            </p>
                                        </div>
                                    </div>

                                    {isActive ? (
                                        <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                                            Aktif
                                        </span>
                                    ) : null}
                                </div>

                                <p className="mt-4 line-clamp-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                                    {material.description || 'Materi ini belum memiliki deskripsi.'}
                                </p>

                                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    <span>{material.chapter_count} BAB</span>
                                    <span className={isActive ? 'text-primary' : ''}>
                                        {isActive ? 'Sedang dikelola' : 'Pilih materi'}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
            </div>

            {!loading && materials.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-primary/20 px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                    Belum ada materi. Gunakan card "Informasi Materi" untuk membuat materi baru.
                </div>
            ) : null}
        </section>
    );
}
