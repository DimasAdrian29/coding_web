import { Outlet } from 'react-router-dom';
import SidebarSiswa from '../components/layout/SidebarSiswa';
import { useAuth } from '../context/KonteksAuth';

export default function StudentLayout({ title, subtitle, children }) {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-50 font-display text-slate-900">
            <SidebarSiswa />

            <div className="min-h-screen min-w-0 flex-1">
                <header className="sticky top-0 z-20 border-b border-primary/10 bg-white/80 px-8 py-5 backdrop-blur-md dark:bg-background-dark/80">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                                Area Siswa
                            </p>
                            <h2 className="mt-1 text-3xl font-black tracking-tight">{title}</h2>
                            {subtitle ? (
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                </p>
                            ) : null}
                        </div>

                        <div className="flex items-center gap-3 rounded-full bg-primary/5 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary">account_circle</span>
                            {user?.name ?? 'Siswa'}
                        </div>
                    </div>
                </header>

                <div className="p-8">{children ?? <Outlet />}</div>
            </div>
        </div>
    );
}
