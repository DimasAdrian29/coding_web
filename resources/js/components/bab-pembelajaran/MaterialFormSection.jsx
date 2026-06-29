import CodePreviewPanel from './CodePreviewPanel';
import InteractiveCodeEditor from './InteractiveCodeEditor';
import RichTextEditorPlaceholder from './RichTextEditorPlaceholder';

export default function MaterialFormSection({
    formData,
    toolbarItems,
    codeExample,
    previewOutput,
    onFieldChange,
    onToolbarClick,
    onCodeChange,
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
                    <label className="mb-6 block">
                        <span className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
                            Judul Materi
                        </span>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(event) => onFieldChange('title', event.target.value)}
                            placeholder="Contoh: Pengenalan Array di JavaScript"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800"
                        />
                    </label>

                    <label className="mb-6 block">
                        <span className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
                            Deskripsi Materi
                        </span>
                        <textarea
                            rows="3"
                            value={formData.description}
                            onChange={(event) => onFieldChange('description', event.target.value)}
                            placeholder="Berikan ringkasan materi untuk siswa..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800"
                        />
                    </label>

                    <label className="mb-6 block">
                        <span className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
                            Link Video Pembelajaran (YouTube URL)
                        </span>
                        <input
                            type="url"
                            value={formData.videoUrl}
                            onChange={(event) => onFieldChange('videoUrl', event.target.value)}
                            placeholder="Masukkan link video YouTube..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800"
                        />
                    </label>

                    <RichTextEditorPlaceholder
                        toolbarItems={toolbarItems}
                        content={formData.editorContent}
                        onToolbarClick={onToolbarClick}
                    />
                </div>

                <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">terminal</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Contoh Kode Interaktif
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <InteractiveCodeEditor
                            fileName={codeExample.fileName}
                            language={codeExample.language}
                            code={codeExample.code}
                            onCodeChange={onCodeChange}
                        />

                        <CodePreviewPanel
                            title={previewOutput.title}
                            consoleLabel={previewOutput.consoleLabel}
                            lines={previewOutput.lines}
                        />
                    </div>

                    <p className="mt-4 text-sm italic text-slate-500">{previewOutput.note}</p>
                </div>
            </div>
        </div>
    );
}
