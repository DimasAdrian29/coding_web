import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Edit3, KeyRound, Search, Trash2, UserRound, Users, X } from "lucide-react";
import { teacherService } from "../../services/layananGuru";

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function statusLabel(status) {
  if (status === "active" || status === "aktif") return "Aktif";
  if (status === "inactive" || status === "nonaktif") return "Tidak Aktif";
  return displayValue(status);
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

export default function KelolaSiswa() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);

  const loadStudents = async (keyword = search) => {
    setLoading(true);
    setError("");

    try {
      const response = await teacherService.getStudents({ search: keyword });
      setStudents(response.students ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data siswa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadStudents(search);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const totalActive = useMemo(() => {
    return students.filter((student) => ["active", "aktif"].includes(String(student.status ?? "").toLowerCase())).length;
  }, [students]);

  const handleSave = async (form, setErrors) => {
    if (!editingStudent) return;

    setActionLoading(true);
    setErrors({});

    try {
      await teacherService.updateStudent(editingStudent.id, form);
      setEditingStudent(null);
      await loadStudents(search);
      showToast("Data siswa berhasil diperbarui.");
    } catch (saveError) {
      if (saveError?.errors) {
        setErrors(saveError.errors);
      }
      showToast(saveError instanceof Error ? saveError.message : "Gagal memperbarui data siswa.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (student) => {
    setConfirmAction({
      type: "reset",
      student,
      title: "Reset Password Siswa",
      message: `Password akun ${student.name ?? "siswa"} akan diubah menjadi 12345678.`,
      confirmLabel: "Ya, Reset Password",
      tone: "blue"
    });
  };

  const handleDelete = async (student) => {
    setConfirmAction({
      type: "delete",
      student,
      title: "Hapus Akun Siswa",
      message: `Data akun ${student.name ?? "siswa"} akan dihapus. Data yang dihapus tidak dapat dikembalikan.`,
      confirmLabel: "Ya, Hapus Akun",
      tone: "red"
    });
  };

  const executeConfirmedAction = async () => {
    if (!confirmAction?.student) return;

    const { type, student } = confirmAction;
    setActionLoading(true);

    try {
      if (type === "reset") {
        await teacherService.resetStudentPassword(student.id);
        showToast("Password siswa berhasil direset.");
      }

      if (type === "delete") {
        await teacherService.deleteStudent(student.id);
        await loadStudents(search);
        showToast("Akun siswa berhasil dihapus.");
      }

      setConfirmAction(null);
    } catch (actionError) {
      showToast(actionError instanceof Error ? actionError.message : "Aksi gagal diproses.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Kelola Siswa</h1>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SummaryCard icon={<Users size={24} />} label="Total Siswa" value={students.length} />
        <SummaryCard icon={<UserRound size={24} />} label="Siswa Aktif" value={totalActive} />
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama, NISN, atau email siswa"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-extrabold text-slate-900">Daftar Akun Siswa</h2>
        </div>

        {loading ? (
          <StateCard text="Memuat data siswa..." />
        ) : error ? (
          <StateCard text={error} danger />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  {["No", "Nama", "NISN", "Email", "Kelas", "Status Akun", "Tanggal Registrasi", "Aksi"].map((heading) => (
                    <th key={heading} className="whitespace-nowrap px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5 text-sm font-bold text-slate-500">{index + 1}</td>
                    <td className="min-w-[220px] px-6 py-5 text-sm font-extrabold text-slate-900">{displayValue(student.name)}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-600">{displayValue(student.nisn)}</td>
                    <td className="min-w-[220px] px-6 py-5 text-sm font-semibold text-slate-600">{displayValue(student.email)}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-600">{displayValue(student.class_name)}</td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-700">
                        {statusLabel(student.status)}
                      </span>
                    </td>
                    <td className="min-w-[180px] px-6 py-5 text-sm font-semibold text-slate-600">{formatDate(student.created_at)}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingStudent(student)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                        >
                          <Edit3 size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => void handleResetPassword(student)}
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                        >
                          <KeyRound size={15} />
                          Reset Password
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => void handleDelete(student)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {students.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm font-semibold text-slate-500">
                Tidak ada data siswa yang sesuai.
              </div>
            ) : null}
          </div>
        )}
      </section>

      {editingStudent ? (
        <EditStudentModal
          student={editingStudent}
          saving={actionLoading}
          onClose={() => setEditingStudent(null)}
          onSave={handleSave}
        />
      ) : null}

      {confirmAction ? (
        <ConfirmDialog
          action={confirmAction}
          loading={actionLoading}
          onClose={() => setConfirmAction(null)}
          onConfirm={executeConfirmedAction}
        />
      ) : null}

      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <article className="flex min-h-[110px] items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
      </div>
    </article>
  );
}

function StateCard({ text, danger = false }) {
  return (
    <div className={`p-8 text-center text-sm font-semibold ${danger ? "text-red-600" : "text-slate-500"}`}>
      {text}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  const success = type !== "error";

  return (
    <div className="fixed right-6 top-6 z-[60] w-[calc(100%-3rem)] max-w-md">
      <div className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${success ? "border-blue-200" : "border-red-200"}`}>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${success ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"}`}>
          {success ? <CheckCircle2 size={21} /> : <AlertTriangle size={21} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-extrabold ${success ? "text-blue-700" : "text-red-600"}`}>
            {success ? "Berhasil" : "Gagal"}
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}

function ConfirmDialog({ action, loading, onClose, onConfirm }) {
  const danger = action.tone === "red";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className={`flex size-14 items-center justify-center rounded-2xl ${danger ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"}`}>
          {danger ? <Trash2 size={27} /> : <KeyRound size={27} />}
        </div>

        <h2 className="mt-5 text-2xl font-extrabold text-slate-900">{action.title}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{action.message}</p>

        {action.type === "reset" ? (
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-500">Password Baru</p>
            <p className="mt-1 font-mono text-lg font-black text-blue-800">12345678</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Memproses..." : action.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditStudentModal({ student, saving, onClose, onSave }) {
  const [form, setForm] = useState({
    name: student.name ?? "",
    email: student.email ?? "",
    nisn: student.nisn ?? "",
    phone: student.phone ?? ""
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: field === "nisn" || field === "phone" ? value.replace(/\D/g, "") : value
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    void onSave(form, setErrors);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Edit Data Siswa</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-6">
          <TextInput label="Nama" value={form.name} onChange={(value) => updateField("name", value)} error={errors.name} />
          <TextInput label="Email" type="email" value={form.email} onChange={(value) => updateField("email", value)} error={errors.email} />
          <TextInput label="NISN" value={form.nisn} onChange={(value) => updateField("nisn", value)} error={errors.nisn} inputMode="numeric" />
          <TextInput label="Nomor HP" value={form.phone} onChange={(value) => updateField("phone", value)} error={errors.phone} inputMode="numeric" />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TextInput({ label, type = "text", value, onChange, error, inputMode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
      {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error[0]}</p> : null}
    </label>
  );
}
