export default function RichTextEditorPlaceholder({ toolbarItems, content, onToolbarClick }) {
    return (
        <div className="block">
            <span className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">Isi Materi</span>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                    {toolbarItems.slice(0, 4).map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => onToolbarClick(item)}
                            className="rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </button>
                    ))}

                    <div className="mx-1 h-6 w-px self-center bg-slate-300 dark:bg-slate-600" />

                    {toolbarItems.slice(4).map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => onToolbarClick(item)}
                            className="rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </button>
                    ))}
                </div>

                <div
                    className="editor-min-height prose max-w-none bg-white p-6 text-slate-600 outline-none dark:prose-invert dark:bg-slate-900 dark:text-slate-400"
                    contentEditable
                    suppressContentEditableWarning
                >
                    {content}
                </div>
            </div>
        </div>
    );
}
