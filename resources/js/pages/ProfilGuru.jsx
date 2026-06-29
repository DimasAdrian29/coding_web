import { useEffect, useMemo, useState } from 'react';
import {
    BookOpen,
    CheckCircle2,
    ClipboardCheck,
    GraduationCap,
    KeyRound,
    LogOut,
    Pencil,
    School,
    Users,
    X,
} from 'lucide-react';
import { teacherService } from '../services/layananGuru';
import { logoutUser } from '../utils/auth';

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    nip: '',
    subject: '',
    school_name: '',
};

const onlyNumbers = (value) => value.replace(/\D/g, '');

const emptyPasswordForm = {
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
};

function text(value) {
    return value || '-';
}

function Avatar({ profile, size = 'large' }) {
    const sizeClass = size === 'large' ? 'h-28 w-28 text-3xl' : 'h-12 w-12 text-base';

    if (profile?.profile_photo_url) {
        return (
            <img
                src={profile.profile_photo_url}
                alt="Foto profil guru"
                className={`${sizeClass} rounded-full border-4 border-white object-cover shadow-sm`}
            />
        );
    }

    return (
        <div
            className={`${sizeClass} flex items-center justify-center rounded-full border-4 border-white bg-white/20 font-extrabold text-white shadow-sm`}
        >
            {profile?.initials || 'G'}
        </div>
    );
}

export default function TeacherProfilePage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
    const [saving, setSaving] = useState(false);

    const loadProfile = async () => {
        setLoading(true);
        setError('');

        try {
            setData(await teacherService.getTeacherProfile());
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Gagal memuat profil guru.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadProfile();
    }, []);

    useEffect(() => {
        if (!success) return undefined;
        const timer = window.setTimeout(() => setSuccess(''), 3000);
        return () => window.clearTimeout(timer);
    }, [success]);

    const profile = data?.profile;
    const summary = data?.teaching_summary;

    const summaryCards = useMemo(
        () => [
            {
                label: 'Total Bab',
                value: summary?.total_chapters ?? 0,
                icon: BookOpen,
                className: 'bg-blue-50 text-blue-700',
            },
            {
                label: 'Materi Published',
                value: summary?.published_materials ?? summary?.published_chapters ?? 0,
                icon: CheckCircle2,
                className: 'bg-blue-50 text-blue-700',
            },
            {
                label: 'Total Latihan',
                value: summary?.total_exercises ?? 0,
                icon: ClipboardCheck,
                className: 'bg-violet-50 text-violet-700',
            },
            {
                label: 'Pending Penilaian',
                value: summary?.pending_submissions ?? 0,
                icon: KeyRound,
                className: 'bg-amber-50 text-amber-700',
            },
            {
                label: 'Total Siswa',
                value: summary?.total_students ?? 0,
                icon: Users,
                className: 'bg-cyan-50 text-cyan-700',
            },
            {
                label: 'Rata-rata Nilai',
                value: summary?.average_score ?? 0,
                icon: GraduationCap,
                className: 'bg-rose-50 text-rose-700',
            },
        ],
        [summary],
    );

    const openEdit = () => {
        setForm({
            name: profile?.name ?? '',
            email: profile?.email ?? '',
            phone: profile?.phone ?? '',
            nip: profile?.nip ?? '',
            subject: profile?.subject ?? '',
            school_name: profile?.school_name ?? '',
        });
        setEditOpen(true);
    };

    const saveProfile = async () => {
        setSaving(true);

        try {
            await teacherService.updateTeacherProfile(form);
            await loadProfile();
            setEditOpen(false);
            setSuccess('Profil guru berhasil diperbarui.');
        } catch (saveError) {
            window.alert(saveError instanceof Error ? saveError.message : 'Gagal menyimpan profil.');
        } finally {
            setSaving(false);
        }
    };

    const savePassword = async () => {
        setSaving(true);

        try {
            await teacherService.updateTeacherPassword(passwordForm);
            setPasswordForm(emptyPasswordForm);
            setPasswordOpen(false);
            setSuccess('Password berhasil diperbarui.');
        } catch (saveError) {
            window.alert(saveError instanceof Error ? saveError.message : 'Gagal mengubah password.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="px-8 py-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                    <p className="font-bold">Gagal memuat profil guru</p>
                    <p className="mt-1 text-sm">{error}</p>
                    <button
                        type="button"
                        onClick={() => void loadProfile()}
                        className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
                    >
                        Coba lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 py-8">
            <header className="mb-8 flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                    <GraduationCap size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Profil Guru</h1>
                </div>
            </header>

            {success ? (
                <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700">
                    {success}
                </div>
            ) : null}

            <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-600 p-8 text-white shadow-lg">
                <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <Avatar profile={profile} />
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-3xl font-extrabold">{text(profile.name)}</h2>
                                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                                    Guru
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">
                                    {profile.status === 'active' ? 'Aktif' : text(profile.status)}
                                </span>
                            </div>
                            <p className="mt-3 flex items-center gap-2 text-white/90">
                                <BookOpen size={18} />
                                {text(profile.subject)}
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-white/90">
                                <School size={18} />
                                {text(profile.school_name)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <HeroButton onClick={openEdit} icon={Pencil} solid>
                            Edit Profil
                        </HeroButton>
                        <HeroButton onClick={() => setPasswordOpen(true)} icon={KeyRound}>
                            Ubah Password
                        </HeroButton>
                    </div>
                </div>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <InfoCard title="Informasi Pribadi">
                    <InfoRow label="Nama Lengkap" value={profile.name} />
                    <InfoRow label="NIP" value={profile.nip} />
                    <InfoRow label="Email" value={profile.email} />
                    <InfoRow label="Nomor Telepon" value={profile.phone} />
                </InfoCard>
                <InfoCard title="Informasi Mengajar">
                    <InfoRow label="Mata Pelajaran" value={profile.subject} />
                    <InfoRow label="Sekolah" value={profile.school_name} />
                    <InfoRow label="Role" value="Guru" />
                    <InfoRow label="Status Akun" value={profile.status === 'active' ? 'Aktif' : profile.status} />
                    <InfoRow label="Bergabung Sejak" value={profile.joined_at} />
                    <InfoRow label="Login Terakhir" value={profile.last_login_at} />
                </InfoCard>
            </section>

            <section className="mt-8">
                <h2 className="mb-5 text-xl font-extrabold text-slate-900">Ringkasan Mengajar</h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className={`flex size-12 items-center justify-center rounded-xl ${item.className}`}>
                                    <Icon size={23} />
                                </div>
                                <p className="mt-5 text-2xl font-extrabold text-slate-900">{item.value}</p>
                                <p className="mt-1 text-sm font-semibold text-slate-500">{item.label}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">Pengaturan Akun</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <ActionButton onClick={openEdit} icon={Pencil}>Edit Profil</ActionButton>
                    <ActionButton onClick={() => setPasswordOpen(true)} icon={KeyRound}>Ubah Password</ActionButton>
                    <ActionButton onClick={logoutUser} icon={LogOut} danger>Logout</ActionButton>
                </div>
            </section>

            {editOpen ? (
                <EditProfileModal
                    form={form}
                    saving={saving}
                    onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))}
                    onClose={() => setEditOpen(false)}
                    onSave={() => void saveProfile()}
                />
            ) : null}

            {passwordOpen ? (
                <PasswordModal
                    form={passwordForm}
                    saving={saving}
                    onChange={(key, value) => setPasswordForm((current) => ({ ...current, [key]: value }))}
                    onClose={() => setPasswordOpen(false)}
                    onSave={() => void savePassword()}
                />
            ) : null}
        </div>
    );
}

function HeroButton({ icon: Icon, solid = false, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                solid
                    ? 'bg-white text-blue-700 hover:bg-blue-50'
                    : 'border border-white/30 bg-white/10 text-white hover:bg-white/20'
            }`}
        >
            <Icon size={17} />
            {children}
        </button>
    );
}

function InfoCard({ title, children }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
            <div className="mt-5 divide-y divide-slate-100">{children}</div>
        </article>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="text-sm font-bold text-slate-900">{text(value)}</p>
        </div>
    );
}

function ActionButton({ icon: Icon, danger = false, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                danger
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
            <Icon size={18} />
            {children}
        </button>
    );
}

function ModalShell({ title, children, footer, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                <div className="border-t border-slate-200 bg-white px-6 py-4">{footer}</div>
            </div>
        </div>
    );
}

function EditProfileModal({ form, saving, onChange, onClose, onSave }) {
    return (
        <ModalShell
            title="Edit Profil"
            onClose={onClose}
            footer={<ModalFooter saving={saving} onClose={onClose} onSave={onSave} saveLabel="Simpan Perubahan" />}
        >
            <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="Nama Lengkap" value={form.name} onChange={(value) => onChange('name', value)} />
                <TextInput label="Email" type="email" value={form.email} onChange={(value) => onChange('email', value)} />
                <TextInput label="Nomor Telepon" value={form.phone} onChange={(value) => onChange('phone', value)} />
                <TextInput
                    label="NIP"
                    value={form.nip}
                    onChange={(value) => onChange('nip', onlyNumbers(value))}
                    inputMode="numeric"
                    pattern="[0-9]*"
                />
                <TextInput label="Mata Pelajaran" value={form.subject} onChange={(value) => onChange('subject', value)} />
                <TextInput label="Sekolah" value={form.school_name} onChange={(value) => onChange('school_name', value)} />
            </div>
        </ModalShell>
    );
}

function PasswordModal({ form, saving, onChange, onClose, onSave }) {
    return (
        <ModalShell
            title="Ubah Password"
            onClose={onClose}
            footer={<ModalFooter saving={saving} onClose={onClose} onSave={onSave} saveLabel="Simpan Password" />}
        >
            <div className="grid gap-5">
                <TextInput label="Password Saat Ini" type="password" value={form.current_password} onChange={(value) => onChange('current_password', value)} />
                <TextInput label="Password Baru" type="password" value={form.new_password} onChange={(value) => onChange('new_password', value)} />
                <TextInput label="Konfirmasi Password Baru" type="password" value={form.new_password_confirmation} onChange={(value) => onChange('new_password_confirmation', value)} />
            </div>
        </ModalShell>
    );
}

function ModalFooter({ saving, saveLabel, onClose, onSave }) {
    return (
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                Batal
            </button>
            <button
                type="button"
                disabled={saving}
                onClick={onSave}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {saving ? 'Menyimpan...' : saveLabel}
            </button>
        </div>
    );
}

function TextInput({ label, value, onChange, type = 'text', inputMode, pattern }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-600">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                inputMode={inputMode}
                pattern={pattern}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
        </label>
    );
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6 px-8 py-8">
            <div className="h-14 w-80 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-56 animate-pulse rounded-3xl bg-slate-200" />
            <div className="grid gap-6 xl:grid-cols-2">
                <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
                <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            </div>
        </div>
    );
}
