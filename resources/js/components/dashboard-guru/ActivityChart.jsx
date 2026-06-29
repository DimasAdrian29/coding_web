export default function ActivityChart({ data }) {
    return (
        <section className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-800 lg:col-span-2">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Statistik Aktivitas Siswa
                </h3>
            </div>

            <div className="flex h-64 items-end justify-between gap-4 px-2">
                {data.items.map((item) => (
                    <div key={item.day} className="flex flex-1 flex-col items-center gap-3">
                        <div
                            className={`w-full rounded-t-lg transition-all ${item.tone}`}
                            style={{ height: `${item.value}%` }}
                            title={`${item.day}: ${item.value}%`}
                        />
                        <span className="text-xs font-bold text-slate-400">{item.day}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
