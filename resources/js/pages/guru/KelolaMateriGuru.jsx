import { useEffect, useMemo, useState } from "react";
import { BookOpen, Pencil, Plus, Trash2, X } from "lucide-react";
import layananMateri from "../../services/layananMateri";

const emptyForm = {
  title: "",
  description: "",
  status: "draft"
};

function statusLabel(status) {
  return status === "publish" ? "Aktif" : "Tidak Aktif";
}

export default function KelolaMateriGuru() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadMaterials = async () => {
    setLoading(true);
    setError("");
    try {
      setMaterials(await layananMateri.getMaterials());
    } catch (loadError) {
      setError(loadError.response?.data?.message ?? loadError.message ?? "Gagal memuat materi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMaterials();
  }, []);

  const stats = useMemo(() => ({
    total: materials.length,
    active: materials.filter((item) => item.status === "publish").length,
    inactive: materials.filter((item) => item.status !== "publish").length
  }), [materials]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (material) => {
    setSelected(material);
    setForm({
      title: material.title ?? "",
      description: material.description ?? "",
      status: material.status ?? "draft"
    });
    setModal("form");
  };

  const saveMaterial = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (selected) {
        await layananMateri.updateMaterial(selected.id, form);
      } else {
        await layananMateri.createMaterial(form);
      }
      setModal(null);
      await loadMaterials();
    } catch (saveError) {
      window.alert(saveError.response?.data?.message ?? saveError.message ?? "Gagal menyimpan materi.");
    } finally {
      setSaving(false);
    }
  };

  const deleteMaterial = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await layananMateri.deleteMaterial(selected.id);
      setModal(null);
      await loadMaterials();
    } catch (deleteError) {
      window.alert(deleteError.response?.data?.message ?? deleteError.message ?? "Gagal menghapus materi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-8 py-8">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-slate-900">Kelola Materi</h1>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={18} />
          Tambah Materi
        </button>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon={BookOpen} value={stats.total} label="Total Materi" />
        <StatCard icon={BookOpen} value={stats.active} label="Materi Aktif" />
        <StatCard icon={BookOpen} value={stats.inactive} label="Tidak Aktif" />
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-extrabold text-slate-900">Daftar Materi</h2>
        </div>

        {loading ? (
          <StateText text="Memuat materi..." />
        ) : error ? (
          <StateText text={error} danger />
        ) : materials.length === 0 ? (
          <StateText text="Belum ada materi. Tambahkan materi pertama untuk mulai menyusun bab." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Materi", "Deskripsi", "Jumlah Bab", "Status", "Aksi"].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-slate-50/70">
                    <td className="min-w-[260px] px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-900">{material.title}</p>
                          <p className="mt-1 text-xs font-medium text-slate-400">
                            Materi pembelajaran
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-[320px] px-6 py-5 text-sm leading-6 text-slate-500">
                      {material.description || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-bold text-slate-900">
                      {material.chapter_count ?? material.chapters_count ?? material.chapters?.length ?? 0} Bab
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <StatusBadge status={material.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="flex items-center gap-2">
                        <IconButton label="Edit materi" onClick={() => openEdit(material)} className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                          <Pencil size={17} />
                        </IconButton>
                        <IconButton label="Hapus materi" onClick={() => { setSelected(material); setModal("delete"); }} className="bg-red-50 text-red-600 hover:bg-red-100">
                          <Trash2 size={17} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal === "form" ? (
        <Modal title={selected ? "Edit Materi" : "Tambah Materi"} onClose={() => setModal(null)}>
          <form onSubmit={saveMaterial} className="space-y-5">
            <TextInput label="Judul Materi" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required />
            <TextArea label="Deskripsi" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
            <label className="block">
              <span className="text-sm font-semibold text-slate-600">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="publish">Aktif</option>
                <option value="draft">Tidak Aktif</option>
              </select>
            </label>
            <ModalActions saving={saving} onCancel={() => setModal(null)} submitLabel="Simpan Materi" />
          </form>
        </Modal>
      ) : null}

      {modal === "delete" && selected ? (
        <Modal title="Hapus Materi" onClose={() => setModal(null)}>
          <p className="text-sm leading-6 text-slate-500">
            Materi <span className="font-bold text-slate-900">{selected.title}</span> akan dihapus beserta bab di dalamnya.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">Batal</button>
            <button type="button" disabled={saving} onClick={deleteMaterial} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">Hapus</button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        <Icon size={24} />
      </div>
      <p className="mt-5 text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </article>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "publish" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
      {statusLabel(status)}
    </span>
  );
}

function IconButton({ label, className, onClick, children }) {
  return <button type="button" aria-label={label} onClick={onClick} className={`flex size-9 items-center justify-center rounded-lg transition ${className}`}>{children}</button>;
}

function StateText({ text, danger = false }) {
  return <div className={`p-6 text-sm font-semibold ${danger ? "text-red-600" : "text-slate-500"}`}>{text}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
          <button type="button" aria-label="Tutup" onClick={onClose} className="flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, required = false }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <input
        type="text"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </label>
  );
}

function ModalActions({ saving, onCancel, submitLabel }) {
  return (
    <div className="flex justify-end gap-3">
      <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">Batal</button>
      <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {saving ? "Menyimpan..." : submitLabel}
      </button>
    </div>
  );
}
