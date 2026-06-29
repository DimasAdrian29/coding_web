import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle,
  Edit3,
  FileText,
  KeyRound,
  Trophy,
  User,
  X,
} from "lucide-react";
import SidebarSiswa, { MobileMenuSiswa } from "../../components/layout/SidebarSiswa";
import { studentService } from "../../services/layananSiswa";
import { useAuth } from "../../context/KonteksAuth";
function displayValue(value) {
  if (value === null || value === void 0 || value === "") return "-";
  return String(value);
}
function roleLabel(role) {
  return ["siswa", "student"].includes(role) ? "Siswa" : role;
}
function statusLabel(status) {
  return status === "active" ? "Aktif" : status === "inactive" ? "Tidak Aktif" : displayValue(status);
}
function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}
function PageHeader() {
  return <header className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
                <User size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold tracking-normal text-[#0F172A]">Profil Saya</h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">
                    Kelola informasi akun dan data siswa Anda
                </p>
            </div>
        </header>;
}
function ProfileHero({ profile, onEditProfile, onChangePassword }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-4xl font-extrabold text-white shadow-sm">
                        {displayValue(profile.initials)}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-extrabold text-[#0F172A]">
                                {displayValue(profile.name)}
                            </h3>
                            <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">
                                {roleLabel(profile.role)}
                            </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-[#64748B]">
                            {displayValue(profile.email)}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#64748B]">
                            {displayValue(profile.phone)}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#64748B]">
                            {displayValue(profile.school_name)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
    type="button"
    onClick={onEditProfile}
    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] sm:w-auto"
  >
                        <Edit3 size={17} />
                        Edit Profil
                    </button>
                    <button
    type="button"
    onClick={onChangePassword}
    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-slate-50 sm:w-auto"
  >
                        <KeyRound size={17} />
                        Ubah Password
                    </button>
                </div>
            </div>
        </section>;
}
function InfoRows({ rows, statusBadge = false }) {
  return <div className="mt-5 divide-y divide-slate-100">
            {rows.map(([label, value]) => <div
    key={label}
    className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
  >
                    <p className="text-sm font-medium text-[#64748B]">{label}</p>
                    {statusBadge && label === "Status Akun" ? <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${value === "Aktif" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            {value}
                        </span> : <p className="text-sm font-semibold text-[#0F172A]">{value}</p>}
                </div>)}
        </div>;
}
function InformationCards({ profile }) {
  const studentRows = [
    ["Nama Lengkap", displayValue(profile.name)],
    ["NISN", displayValue(profile.nisn)],
    ["Kelas", displayValue(profile.class_name)],
    ["Jurusan", displayValue(profile.major)],
    ["Sekolah", displayValue(profile.school_name)]
  ];
  const accountRows = [
    ["Email", displayValue(profile.email)],
    ["Nomor Telepon", displayValue(profile.phone)],
    ["Role", roleLabel(profile.role)],
    ["Status Akun", statusLabel(profile.status)],
    ["Bergabung Sejak", displayValue(profile.joined_at)],
    ["Login Terakhir", displayValue(profile.last_login_at)]
  ];
  return <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-[#0F172A]">Informasi Siswa</h3>
                <InfoRows rows={studentRows} />
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-[#0F172A]">Informasi Akun</h3>
                <InfoRows rows={accountRows} statusBadge />
            </article>
        </section>;
}
function LearningSummaryCards({ summary }) {
  const summaryCards = [
    {
      label: "Total Bab",
      value: summary.total_chapters,
      icon: BookOpen,
      iconClass: "bg-[#EFF6FF] text-[#2563EB]"
    },
    {
      label: "Bab Selesai",
      value: `${summary.completed_chapters}/${summary.total_chapters}`,
      icon: CheckCircle,
      iconClass: "bg-[#DBEAFE] text-[#2563EB]"
    },
    {
      label: "Latihan Selesai",
      value: summary.graded_exercises,
      icon: FileText,
      iconClass: "bg-[#F3E8FF] text-[#A855F7]"
    },
    {
      label: "Rata-rata Nilai",
      value: summary.average_score ?? "-",
      icon: Award,
      iconClass: "bg-[#FEF3C7] text-[#F59E0B]"
    },
    {
      label: "Nilai Ujian Akhir",
      value: summary.final_exam_score ?? "-",
      icon: Trophy,
      iconClass: "bg-[#FAF5FF] text-[#A855F7]"
    }
  ];
  return <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((item) => {
    const Icon = item.icon;
    return <article
      key={item.label}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-2xl font-extrabold text-[#0F172A]">{item.value}</p>
                                <p className="mt-2 text-sm font-semibold text-[#64748B]">
                                    {item.label}
                                </p>
                            </div>
                            <div
      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
    >
                                <Icon size={22} />
                            </div>
                        </div>
                    </article>;
  })}
        </section>;
}
function ModalShell({ title, children, footer, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h3 className="text-xl font-extrabold text-[#0F172A]">{title}</h3>
                    <button
      type="button"
      onClick={onClose}
      className="flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50"
    >
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                <div className="border-t border-slate-200 bg-white px-6 py-4">{footer}</div>
            </div>
        </div>;
}

function TextInput({ label, value, onChange, type = "text", inputMode, pattern, error, autoComplete = "off" }) {
  return <label className="block">
            <span className="text-sm font-semibold text-slate-600">{label}</span>
            <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputMode={inputMode}
      pattern={pattern}
      autoComplete={autoComplete}
      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    />
            {error ? <p className="mt-1 text-sm font-medium text-red-600">{error[0]}</p> : null}
        </label>;
}

function ModalFooter({ saving, saveLabel = "Simpan Perubahan", onClose, onSave }) {
  return <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
      type="button"
      onClick={onClose}
      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
    >
                Batal
            </button>
            <button
      type="button"
      disabled={saving}
      onClick={onSave}
      className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
    >
                {saving ? "Menyimpan..." : saveLabel}
            </button>
        </div>;
}

function EditProfileModal({ profile, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    nisn: "",
    kelas: "",
    school_name: ""
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setForm({
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      nisn: profile?.nisn ?? "",
      kelas: profile?.class_name ?? "",
      school_name: profile?.school_name ?? ""
    });
    setErrors({});
    setErrorMessage("");
  }, [profile]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async () => {
    setErrors({});
    setErrorMessage("");
    setSaving(true);

    try {
      await studentService.updateProfile(form);
      await onSaved("Profil siswa berhasil diperbarui.");
      onClose();
    } catch (submitError) {
      setErrors(submitError.errors ?? {});
      setErrorMessage(submitError.message ?? "Profil gagal diperbarui.");
    } finally {
      setSaving(false);
    }
  };

  return <ModalShell
    title="Edit Profil Siswa"
    onClose={onClose}
    footer={<ModalFooter saving={saving} onClose={onClose} onSave={() => void submit()} />}
  >
            <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="Nama Lengkap" value={form.name} onChange={(value) => updateField("name", value)} error={errors.name} autoComplete="name" />
                <TextInput label="Email" type="email" value={form.email} onChange={(value) => updateField("email", value)} error={errors.email} autoComplete="email" />
                <TextInput label="Nomor Telepon" value={form.phone} onChange={(value) => updateField("phone", value)} error={errors.phone} autoComplete="tel" />
                <TextInput label="NISN" value={form.nisn} onChange={(value) => updateField("nisn", onlyNumbers(value))} inputMode="numeric" pattern="[0-9]*" error={errors.nisn} />
                <TextInput label="Kelas" value={form.kelas} onChange={(value) => updateField("kelas", value)} error={errors.kelas} />
                <TextInput label="Sekolah" value={form.school_name} onChange={(value) => updateField("school_name", value)} error={errors.school_name} />
            </div>
            {errorMessage ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {errorMessage}
                </div> : null}
        </ModalShell>;
}

function PasswordModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async () => {
    setErrors({});
    setErrorMessage("");
    setSaving(true);

    try {
      await studentService.updatePassword(form);
      await onSaved("Password siswa berhasil diperbarui.");
      onClose();
    } catch (submitError) {
      setErrors(submitError.errors ?? {});
      setErrorMessage(submitError.message ?? "Password gagal diperbarui.");
    } finally {
      setSaving(false);
    }
  };

  return <ModalShell
    title="Ubah Password Siswa"
    onClose={onClose}
    footer={<ModalFooter saving={saving} onClose={onClose} onSave={() => void submit()} />}
  >
            <div className="grid gap-5">
                <TextInput label="Password Lama" type="password" value={form.current_password} onChange={(value) => updateField("current_password", value)} error={errors.current_password} autoComplete="current-password" />
                <TextInput label="Password Baru" type="password" value={form.new_password} onChange={(value) => updateField("new_password", value)} error={errors.new_password} autoComplete="new-password" />
                <TextInput label="Konfirmasi Password Baru" type="password" value={form.new_password_confirmation} onChange={(value) => updateField("new_password_confirmation", value)} error={errors.new_password} autoComplete="new-password" />
            </div>
            {errorMessage ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {errorMessage}
                </div> : null}
        </ModalShell>;
}

function LoadingCard() {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-[#64748B] shadow-sm">
            Memuat profil siswa...
        </div>;
}
function ErrorCard({ onRetry }) {
  return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-red-600">Gagal memuat profil siswa.</p>
            <button
    type="button"
    onClick={onRetry}
    className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
  >
                Coba Lagi
            </button>
        </div>;
}
function StudentProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await studentService.getProfile();
      setProfile(response.profile);
      setSummary(response.learning_summary);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat profil siswa.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void loadProfile();
  }, [user?.id]);
  const handleProfileSaved = async (message) => {
    await loadProfile();
    await refreshUser();
    setSuccessMessage(message);
  };
  return <div className="min-h-screen bg-slate-50 font-sans text-[#0F172A] lg:flex">
            <SidebarSiswa />

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="space-y-6">
                    <MobileMenuSiswa />
                    <PageHeader />

                    {loading ? <LoadingCard /> : error || !profile || !summary ? <ErrorCard onRetry={() => void loadProfile()} /> : <>
                            {successMessage ? <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700">
                                    {successMessage}
                                </div> : null}
                            <ProfileHero
      profile={profile}
      onEditProfile={() => setEditOpen(true)}
      onChangePassword={() => setPasswordOpen(true)}
    />
                            <InformationCards profile={profile} />
                            <LearningSummaryCards summary={summary} />
                        </>}
                </div>
            </main>

            {editOpen && profile ? <EditProfileModal profile={profile} onClose={() => setEditOpen(false)} onSaved={handleProfileSaved} /> : null}
            {passwordOpen ? <PasswordModal onClose={() => setPasswordOpen(false)} onSaved={handleProfileSaved} /> : null}
        </div>;
}
export {
  StudentProfilePage as default
};
