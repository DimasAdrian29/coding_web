export default function Button({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
    disabled = false,
    className = '',
}) {
    const styles =
        variant === 'secondary'
            ? 'border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
            : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
        >
            {children}
        </button>
    );
}
