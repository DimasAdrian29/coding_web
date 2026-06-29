export default function MaterialPagination({ pagination, onPageChange, onPrevious, onNext }) {
    return (
        <div className="flex items-center justify-between border-t border-primary/10 bg-slate-50 px-6 py-4 dark:bg-slate-800/50">
            <p className="text-sm text-slate-500 dark:text-slate-400">{pagination.summary}</p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={!pagination.hasPrevious}
                    onClick={onPrevious}
                    className="flex size-9 items-center justify-center rounded-lg border border-primary/10 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-700"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {pagination.pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`flex size-9 items-center justify-center rounded-lg text-sm font-medium ${
                            page === pagination.currentPage
                                ? 'bg-primary font-bold text-white'
                                : 'border border-primary/10 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={!pagination.hasNext}
                    onClick={onNext}
                    className="flex size-9 items-center justify-center rounded-lg border border-primary/10 hover:bg-white disabled:opacity-50 dark:hover:bg-slate-700"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
