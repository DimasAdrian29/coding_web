import {
    BarChart3,
    BookOpen,
    ClipboardCheck,
    FileText,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import logoSmk5 from '../../assets/images/logo-smk5.jfif';
import { useAuth } from '../../context/KonteksAuth';
import { teacherService } from '../../services/layananGuru';
import { logoutUser } from '../../utils/auth';

const menuItems = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/guru/dashboard',
        matches: ['/guru/dashboard', '/dashboard-guru'],
    },
    {
        label: 'Kelola Materi',
        icon: BookOpen,
        href: '/guru/kelola-materi',
        matches: ['/guru/kelola-materi', '/guru/materi', '/dashboard-guru/materi'],
    },
    {
        label: 'Kelola Bab',
        icon: FileText,
        href: '/guru/bab',
        matches: ['/guru/bab', '/dashboard-guru/materi/bab', '/dashboard-guru/bab-pembelajaran'],
    },
    {
        label: 'Kelola Latihan',
        icon: ClipboardCheck,
        href: '/guru/kelola-latihan',
        matches: ['/guru/kelola-latihan', '/guru/latihan', '/guru/quiz', '/dashboard-guru/latihan', '/dashboard-guru/quiz'],
    },
    {
        label: 'Statistik Siswa',
        icon: BarChart3,
        href: '/guru/statistik-siswa',
        matches: ['/guru/statistik-siswa', '/guru/statistik', '/guru/penilaian-latihan', '/guru/penilaian', '/dashboard-guru/statistik-siswa', '/dashboard-guru/penilaian'],
    },
    {
        label: 'Kelola Siswa',
        icon: GraduationCap,
        href: '/guru/kelola-siswa',
        matches: ['/guru/kelola-siswa', '/guru/siswa', '/dashboard-guru/kelola-siswa'],
    },
    {
        label: 'Profil Guru',
        icon: User,
        href: '/guru/profil',
        matches: ['/guru/profil', '/dashboard-guru/profil'],
    },
];

function isActive(pathname, item) {
    return item.matches.some((match) => pathname === match || pathname.startsWith(`${match}/`));
}

export default function TeacherSidebar() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const pathname = window.location.pathname;

    useEffect(() => {
        let mounted = true;

        teacherService
            .getTeacherProfile()
            .then((response) => {
                if (mounted) {
                    setProfile(response.profile);
                }
            })
            .catch(() => {
                if (mounted) {
                    setProfile(null);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    const displayName = profile?.name ?? user?.name ?? 'Guru';
    const displayEmail = profile?.email ?? user?.email ?? '';
    const initials = profile?.initials ?? displayName.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('') ?? 'G';

    return (
        <aside className="fixed inset-y-0 left-0 z-30 flex w-72 flex-col overflow-y-auto bg-blue-600 p-5 text-white">
            <a href="/guru/dashboard" className="flex items-start gap-3 border-b border-white/15 pb-6">
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
                        Guru
                    </span>
                </div>
            </a>

            <nav className="mt-6 flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(pathname, item);

                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                active
                                    ? 'bg-blue-700 text-white [&_svg]:text-white'
                                    : 'text-white/85 hover:bg-blue-500 hover:text-white'
                            }`}
                        >
                            <Icon size={19} />
                            <span>{item.label}</span>
                        </a>
                    );
                })}
            </nav>

            <div className="border-t border-white/15 pt-5">
                <div className="mb-3 rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                        Akun Guru
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                        {profile?.profile_photo_url ? (
                            <img
                                src={profile.profile_photo_url}
                                alt="Foto profil guru"
                                className="size-11 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-11 items-center justify-center rounded-full bg-white text-sm font-extrabold text-blue-600">
                                {initials || 'G'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-white">
                                {displayName}
                            </p>
                            {displayEmail ? (
                                <p className="truncate text-xs font-medium text-white/70">
                                    {displayEmail}
                                </p>
                            ) : null}
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
