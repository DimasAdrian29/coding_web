export default function DeleteConfirmModal({
    open,
    title = 'Konfirmasi Hapus',
    description = 'Data ini akan dihapus permanen.',
    confirmLabel = 'Hapus',
    onClose,
    onConfirm,
    isDeleting = false,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300">
                        <span className="material-symbols-outlined">delete</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-500">
                            Konfirmasi
                        </p>
                        <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                            {title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting ? 'Menghapus...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
