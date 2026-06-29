export default function CodePreviewPanel({ title, consoleLabel, lines }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center rounded-t-xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {title}
            </div>
            <div className="h-80 w-full overflow-auto rounded-b-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <div className="mb-2 italic text-slate-400">{consoleLabel}</div>
                <div className="space-y-1">
                    {lines.map((line, index) => (
                        <p key={`${line}-${index}`}>{line}</p>
                    ))}
                    <div className="ml-1 inline-block h-4 w-2 animate-pulse align-middle bg-primary" />
                </div>
            </div>
        </div>
    );
}
