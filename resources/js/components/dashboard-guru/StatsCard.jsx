export default function StatsCard({ item }) {
    const isHighlight = item.tone === 'highlight';

    return (
        <article
            className={`rounded-xl border p-6 shadow-sm ${
                isHighlight
                    ? 'border-primary/20 bg-primary/5 dark:bg-primary/10'
                    : 'border-primary/10 bg-white dark:bg-slate-800'
            }`}
        >
            <div className="mb-4">
                <div
                    className={`rounded-lg p-2 text-primary ${
                        isHighlight ? 'bg-white shadow-sm dark:bg-slate-800' : 'bg-primary/10'
                    }`}
                >
                    <span className="material-symbols-outlined">{item.icon}</span>
                </div>
            </div>

            <p
                className={`text-sm font-medium ${
                    isHighlight ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                }`}
            >
                {item.title}
            </p>
            <p className={`text-2xl font-black ${isHighlight ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                {item.value}
            </p>
        </article>
    );
}
