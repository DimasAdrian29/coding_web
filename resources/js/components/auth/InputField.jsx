export default function InputField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    icon,
    disabled = false,
    autoComplete,
    inputMode,
    pattern,
    inputClassName = '',
}) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
            <div className="relative">
                {icon ? (
                    <span className="material-symbols-outlined absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
                        {icon}
                    </span>
                ) : null}
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    pattern={pattern}
                    className={`w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 ${
                        icon ? 'pl-12' : ''
                    } ${disabled ? 'cursor-not-allowed opacity-70' : ''} ${inputClassName}`}
                />
            </div>
            {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
        </label>
    );
}
