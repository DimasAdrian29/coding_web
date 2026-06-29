export default function PieChart({ data }) {
    return (
        <div className="flex flex-col rounded-xl border border-primary/10 bg-white p-6 dark:bg-background-dark">
            <h3 className="mb-6 text-lg font-bold">{data.title}</h3>
            <div className="flex flex-1 flex-col items-center justify-center">
                <div className="relative size-40">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            strokeWidth="4"
                            className="stroke-slate-100 dark:stroke-slate-800"
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${data.percentage}, 100`}
                            className="stroke-primary"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black">{data.percentage}%</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {data.centerLabel}
                        </span>
                    </div>
                </div>

                <div className="mt-8 w-full space-y-3">
                    {data.segments.map((segment) => (
                        <div key={segment.label} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className={`size-2 rounded-full ${segment.colorClassName}`} />
                                <span>{segment.label}</span>
                            </div>
                            <span className="font-bold">{segment.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
