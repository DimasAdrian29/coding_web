import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error) {
        console.error('React render error:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
                    <section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
                        <h1 className="text-xl font-extrabold text-slate-900">
                            Halaman gagal ditampilkan
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Terjadi kesalahan saat menampilkan halaman. Silakan muat ulang halaman.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            Muat Ulang
                        </button>
                    </section>
                </main>
            );
        }

        return this.props.children;
    }
}
