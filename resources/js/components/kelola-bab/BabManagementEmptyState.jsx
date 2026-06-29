export default function BabManagementEmptyState({ title, description, actionLabel, onAction }) {
    return (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-4 py-10 text-center dark:border-slate-800">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <span className="material-symbols-outlined text-4xl">folder_zip</span>
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">{title}</h4>
            <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
            <button
                type="button"
                onClick={onAction}
                className="mt-6 text-sm font-bold text-primary hover:underline"
            >
                {actionLabel}
            </button>
        </div>
    );
}
