export default function AssessmentTabs({ tabs, onTabClick, onSearch }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-primary/10">
            <div className="flex flex-wrap gap-5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id ?? tab.label}
                        type="button"
                        onClick={() => onTabClick(tab)}
                        className={`flex items-center gap-2 px-2 pb-4 text-sm ${
                            tab.active
                                ? 'border-b-2 border-primary font-bold text-primary'
                                : 'border-b-2 border-transparent font-medium text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab.label}
                        {tab.count ? (
                            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-white">
                                {tab.count}
                            </span>
                        ) : null}
                    </button>
                ))}
            </div>

            <div className="pb-3">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Cari siswa..."
                        onChange={onSearch}
                        className="w-full rounded-lg border border-primary/20 bg-white py-1.5 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary dark:bg-background-dark sm:w-64"
                    />
                </div>
            </div>
        </div>
    );
}
