export default function LineChart({ data }) {
    return (
        <div className="rounded-xl border border-primary/10 bg-white p-6 dark:bg-background-dark lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold">{data.title}</h3>
                <select className="rounded-lg border-none bg-primary/5 px-3 py-1 text-xs font-bold">
                    {data.filterOptions.map((option) => (
                        <option key={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="flex h-64 flex-col">
                <svg className="h-full w-full flex-1" viewBox="0 0 500 200" preserveAspectRatio="none" fill="none">
                    <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" strokeOpacity="0.05" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeOpacity="0.05" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="currentColor" strokeOpacity="0.05" />
                    <path d={data.areaPath} fill="url(#chartGradient)" />
                    <path
                        d={data.path}
                        fill="none"
                        stroke="#71ab54"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#71ab54', stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: '#71ab54', stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="mt-4 flex justify-between px-2">
                    {data.months.map((month) => (
                        <span key={month} className="text-xs font-bold text-slate-400">
                            {month}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
