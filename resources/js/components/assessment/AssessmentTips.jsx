export default function AssessmentTips({ title, description }) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/10 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-2xl">lightbulb</span>
            </div>
            <div>
                <h4 className="text-sm font-bold">{title}</h4>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{description}</p>
            </div>
        </div>
    );
}
