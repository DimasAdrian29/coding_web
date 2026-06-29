import {
    BookOpen,
    ClipboardCheck,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    Trophy,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoSmk5 from '../../assets/images/logo-smk5.jfif';
import { useAuth } from '../../context/KonteksAuth';
import { logoutUser } from '../../utils/auth';

const menuItems = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/siswa/dashboard',
    },
    {
        label: 'Materi Pembelajaran',
        icon: BookOpen,
        href: '/siswa/materi',
    },
    {
        label: 'Latihan Per Bab',
        icon: FileText,
        href: '/siswa/latihan-bab',
    },
    {
        label: 'Latihan Akhir',
        icon: ClipboardCheck,
        href: '/siswa/latihan-akhir',
    },
    {
        label: 'Nilai',
        icon: Trophy,
        href: '/siswa/nilai-progress',
    },
    {
        label: 'Profil Saya',
        icon: User,
        href: '/siswa/profil',
    },
];

function getInitials(name) {
    return (name || 'Siswa')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
}

export default function SidebarSiswa({ mobile = false }) {
    const { user } = useAuth();
    const displayName = user?.name || 'Siswa';
    const displayEmail = user?.email || '-';
    const initials = getInitials(displayName) || 'S';

    return (
        <aside
            className={`flex flex-col overflow-y-auto bg-blue-600 p-5 text-white ${
                mobile
                    ? 'max-h-[calc(100vh-2rem)] rounded-2xl shadow-sm'
                    : 'sticky top-0 hidden h-screen w-72 shrink-0 lg:flex'
            }`}
        >
            <a href="/siswa/dashboard" className="flex items-start gap-3 border-b border-white/15 pb-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white p-1.5 shadow-sm">
                    <img
                        src={logoSmk5}
                        alt="Logo SMK Negeri 5 Pekanbaru"
                        className="h-full w-full object-contain"
                    />
                </div>
                <div className="min-w-0">
                    <h1 className="truncate text-base font-extrabold text-white">
                        SMK 5 Pekanbaru
                    </h1>
                    <span className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                        Siswa
                    </span>
                </div>
            </a>

            <nav className="mt-6 flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.label}
                            to={item.href}
                            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                isActive
                                    ? 'bg-blue-700 text-white [&_svg]:text-white'
                                    : 'text-white/85 hover:bg-blue-500 hover:text-white'
                            }`}
                        >
                            <Icon size={19} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-white/15 pt-5">
                <div className="mb-3 rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                        Akun Siswa
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-blue-600">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-white">
                                {displayName}
                            </p>
                            <p className="truncate text-xs font-medium text-white/70">
                                {displayEmail}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={logoutUser}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export function MobileMenuSiswa() {
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="mb-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm"
            >
                <span>Menu Siswa</span>
                {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            {open ? <SidebarSiswa mobile /> : null}
        </div>
    );
}
