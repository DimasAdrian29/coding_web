export default function AssessmentPagination({ data, onPageChange, onPrevious, onNext }) {
    return (
        <div className="flex items-center justify-between border-t border-primary/10 bg-primary/5 p-4 text-xs font-medium text-slate-500">
            <p>{data.summary}</p>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={!data.hasPrevious}
                    className="flex size-8 items-center justify-center rounded border border-primary/20 bg-white transition-colors hover:bg-primary/10 disabled:opacity-50 dark:bg-background-dark"
                >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {data.pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`flex size-8 items-center justify-center rounded border border-primary/20 ${
                            page === data.currentPage
                                ? 'bg-primary text-white'
                                : 'bg-white hover:bg-primary/10 dark:bg-background-dark'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!data.hasNext}
                    className="flex size-8 items-center justify-center rounded border border-primary/20 bg-white transition-colors hover:bg-primary/10 disabled:opacity-50 dark:bg-background-dark"
                >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
