export default function ExerciseStats({ items }) {
    return (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((item) => (
                <article
                    key={item.label}
                    className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm dark:bg-background-dark"
                >
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    <p className={`mt-1 text-2xl font-bold ${item.highlight ? 'text-primary' : ''}`}>
                        {item.value}
                    </p>
                </article>
            ))}
        </div>
    );
}
