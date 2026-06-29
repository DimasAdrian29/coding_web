export default function TeacherBabFilterTabs({ tabs, onTabClick }) {
    return (
        <div className="no-scrollbar mb-6 flex overflow-x-auto border-b border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => (
                <button
                    key={tab.label}
                    type="button"
                    onClick={() => onTabClick(tab)}
                    className={`whitespace-nowrap px-6 py-4 text-sm ${
                        tab.active
                            ? 'border-b-2 border-primary font-bold text-primary'
                            : 'font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
