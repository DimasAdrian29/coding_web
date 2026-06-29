export default function LockOverlay({ message = 'Selesaikan BAB sebelumnya untuk membuka' }) {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.75rem] bg-white/75 p-6 backdrop-blur-sm dark:bg-slate-950/75">
            <div className="max-w-xs text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <span className="material-symbols-outlined">lock</span>
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-100">BAB Terkunci</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {message}
                </p>
            </div>
        </div>
    );
}
