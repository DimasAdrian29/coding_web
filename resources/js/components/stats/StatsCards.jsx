export default function StatsCards({ items }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <article
                    key={item.label}
                    className="flex flex-col gap-1 rounded-xl border border-primary/10 bg-white p-6 dark:bg-background-dark"
                >
                    <span className="text-sm font-medium text-slate-500">{item.label}</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{item.value}</span>
                        <span className={`flex items-center text-xs font-bold ${item.trendClassName}`}>
                            <span className="material-symbols-outlined text-xs">{item.trendIcon}</span>
                            {item.trend}
                        </span>
                    </div>
                </article>
            ))}
        </div>
    );
}
