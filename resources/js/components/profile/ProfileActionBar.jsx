export default function ProfileActionBar({ onAction }) {
    return (
        <div className="mt-8 flex items-center justify-end gap-4">
            <button
                type="button"
                onClick={() => onAction('Batal')}
                className="rounded-lg px-6 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
            >
                Batal
            </button>
            <button
                type="button"
                onClick={() => onAction('Simpan Perubahan')}
                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
                <span className="material-symbols-outlined text-sm">save</span>
                Simpan Perubahan
            </button>
        </div>
    );
}
