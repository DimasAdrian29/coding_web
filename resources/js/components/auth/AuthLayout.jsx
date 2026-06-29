export default function AuthLayout({
    title,
    subtitle,
    children,
    eyebrow = 'SMKN 5 Coder',
    panelTitle = 'Media Pembelajaran Coding',
    panelDescription = 'Platform belajar coding modern untuk siswa dan guru SMK Negeri 5 Pekanbaru.',
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:bg-background-dark">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(219,234,254,0.9),_transparent_32%)]" />

            <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
                <section className="hidden rounded-2xl border border-slate-200 bg-white/80 p-10 shadow-lg backdrop-blur lg:flex lg:min-h-[680px] lg:flex-col lg:justify-between dark:bg-slate-900/80">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-600">
                            <span className="material-symbols-outlined text-base">terminal</span>
                            {eyebrow}
                        </div>

                        <div className="space-y-4">
                            <h1 className="max-w-xl text-5xl font-black leading-tight text-slate-900 dark:text-white">
                                {panelTitle}
                            </h1>
                            <p className="max-w-lg text-base leading-relaxed text-slate-600 dark:text-slate-300">
                                {panelDescription}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:bg-slate-950/70">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Akses dua peran</p>
                                    <p className="text-xs text-slate-500">Siswa dan guru dalam satu sistem</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Masuk dengan NISN untuk siswa atau email untuk guru/admin.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-slate-100">
                            <div className="mb-3 flex gap-2">
                                <span className="h-3 w-3 rounded-full bg-rose-400" />
                                <span className="h-3 w-3 rounded-full bg-amber-400" />
                                <span className="h-3 w-3 rounded-full bg-blue-400" />
                            </div>
                            <pre className="overflow-hidden text-xs leading-6 text-slate-300">
{`const user = {
  role: "siswa",
  nisn: "1234567890",
  status: "active"
};

console.log("Belajar coding dimulai");`}
                            </pre>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-xl">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg backdrop-blur dark:bg-slate-900/90 sm:p-10">
                        <div className="mb-8">
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                                {eyebrow}
                            </p>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        </div>

                        {children}
                    </div>
                </section>
            </div>
        </div>
    );
}
