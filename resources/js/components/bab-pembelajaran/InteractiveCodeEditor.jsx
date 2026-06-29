export default function InteractiveCodeEditor({ fileName, language, code, onCodeChange }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between rounded-t-xl bg-slate-800 px-4 py-2 font-mono text-xs text-slate-400">
                <span>{fileName}</span>
                <span className="text-primary">{language}</span>
            </div>
            <textarea
                value={code}
                onChange={onCodeChange}
                spellCheck={false}
                className="h-80 w-full resize-none rounded-b-xl border-none bg-slate-900 p-4 font-mono text-sm text-blue-400 outline-none focus:ring-0"
            />
        </div>
    );
}
