import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Pencil, Plus, Trash2, X } from "lucide-react";
import { teacherService } from "../services/layananGuru";

const emptyForm = {
  materi_id: "",
  title: "",
  description: "",
  content: "",
  video_type: "",
  video_url: "",
  video_file: null,
  video_file_url: "",
  judul_contoh_kode: "",
  bahasa_pemrograman: "",
  contoh_kode: "",
  penjelasan_kode: "",
  order_number: 1,
  status: "draft"
};

function normalizeStatus(status) {
  return status === "published" ? "Published" : "Draft";
}

export default function KelolaBabGuru() {
  const [materials, setMaterials] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await teacherService.getChapters();
      setMaterials(response.materials ?? []);
      setChapters(response.chapters ?? []);
    } catch (loadError) {
      setError(loadError.message ?? "Gagal memuat data bab.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const stats = useMemo(() => ({
    total: chapters.length,
    published: chapters.filter((chapter) => chapter.status === "published").length,
    draft: chapters.filter((chapter) => chapter.status === "draft").length
  }), [chapters]);

  const groupedChapters = useMemo(() => {
    const groups = new Map();
    chapters.forEach((chapter) => {
      const key = chapter.materialId ?? "none";
      if (!groups.has(key)) {
        groups.set(key, {
          id: key,
          title: chapter.materialTitle || "Tanpa Materi",
          chapters: []
        });
      }
      groups.get(key).chapters.push(chapter);
    });
    return [...groups.values()].map((group) => ({
      ...group,
      chapters: [...group.chapters].sort((a, b) => Number(a.order) - Number(b.order) || a.id - b.id)
    }));
  }, [chapters]);

  const openCreate = () => {
    setSelected(null);
    setForm({
      ...emptyForm,
      materi_id: materials[0]?.id ? String(materials[0].id) : "",
      order_number: chapters.length + 1
    });
    setModal("form");
  };

  const openEdit = (chapter) => {
    setSelected(chapter);
    setForm({
      materi_id: chapter.materiId || chapter.materialId ? String(chapter.materiId ?? chapter.materialId) : "",
      title: chapter.title ?? "",
      description: chapter.description ?? "",
      content: chapter.content ?? "",
      video_type: chapter.videoType ?? chapter.video_type ?? (chapter.videoUrl ? "youtube" : chapter.videoFileUrl ? "upload" : ""),
      video_url: chapter.videoUrl ?? "",
      video_file: null,
      video_file_url: chapter.videoFileUrl ?? chapter.video_file_url ?? "",
      judul_contoh_kode: chapter.judulContohKode ?? chapter.judul_contoh_kode ?? "",
      bahasa_pemrograman: chapter.bahasaPemrograman ?? chapter.bahasa_pemrograman ?? "",
      contoh_kode: chapter.contohKode ?? chapter.contoh_kode ?? "",
      penjelasan_kode: chapter.penjelasanKode ?? chapter.penjelasan_kode ?? "",
      order_number: chapter.order ?? 1,
      status: chapter.status ?? "draft"
    });
    setModal("form");
  };

  const saveChapter = async (event) => {
    event.preventDefault();
    if (!form.materi_id) {
      window.alert("Pilih Materi Induk terlebih dahulu.");
      return;
    }
    setSaving(true);
    const payload = new FormData();
    payload.append("materi_id", String(Number(form.materi_id)));
    payload.append("material_id", String(Number(form.materi_id)));
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("content", form.content.trim());
    payload.append("judul_contoh_kode", form.judul_contoh_kode.trim());
    payload.append("bahasa_pemrograman", form.bahasa_pemrograman);
    payload.append("contoh_kode", form.contoh_kode);
    payload.append("penjelasan_kode", form.penjelasan_kode.trim());
    payload.append("video_type", form.video_type);
    payload.append("video_url", form.video_type === "youtube" ? form.video_url.trim() : "");
    if (form.video_type === "upload" && form.video_file) {
      payload.append("video_file", form.video_file);
    }
    payload.append("order_number", String(Number(form.order_number) || 1));
    payload.append("status", form.status);
    if (selected) {
      payload.append("_method", "PUT");
    }
    try {
      if (selected) {
        await teacherService.updateChapter(selected.id, payload);
      } else {
        await teacherService.createChapter(payload);
      }
      setModal(null);
      await loadData();
    } catch (saveError) {
      window.alert(saveError.message ?? "Gagal menyimpan bab.");
    } finally {
      setSaving(false);
    }
  };

  const deleteChapter = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await teacherService.deleteChapter(selected.id);
      setModal(null);
      await loadData();
    } catch (deleteError) {
      window.alert(deleteError.message ?? "Gagal menghapus bab.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-8 py-8">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-slate-900">Kelola Bab</h1>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={18} />
          Tambah Bab
        </button>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon={BookOpen} value={`${stats.total} Bab`} label="Total Bab" />
        <StatCard icon={FileText} value={`${stats.published} Published`} label="Bab Aktif" />
        <StatCard icon={Pencil} value={`${stats.draft} Draft`} label="Belum Publish" />
      </section>

      <section className="mt-8 space-y-6">
        {loading ? (
          <StateCard text="Memuat data bab..." />
        ) : error ? (
          <StateCard text={error} danger />
        ) : materials.length === 0 ? (
          <StateCard text="Belum ada Materi. Buat Materi terlebih dahulu di menu Kelola Materi." />
        ) : groupedChapters.length === 0 ? (
          <StateCard text="Belum ada Bab. Tambahkan Bab pertama dan hubungkan ke Materi." />
        ) : (
          groupedChapters.map((group) => (
            <article key={group.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-blue-50 px-6 py-5">
                <h2 className="text-lg font-extrabold text-slate-900">{group.title}</h2>
                <p className="mt-1 text-sm font-semibold text-blue-700">{group.chapters.length} Bab</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Urutan", "Judul Bab", "Video Youtube", "Status", "Siswa Selesai", "Aksi"].map((heading) => (
                        <th key={heading} className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {group.chapters.map((chapter) => (
                      <tr key={chapter.id} className="hover:bg-slate-50/70">
                        <td className="whitespace-nowrap px-6 py-5 text-sm font-bold text-slate-500">Bab {chapter.order}</td>
                        <td className="min-w-[300px] px-6 py-5">
                          <p className="text-sm font-extrabold text-slate-900">{chapter.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">{chapter.description || "-"}</p>
                        </td>
                        <td className="min-w-[220px] px-6 py-5 text-sm text-slate-500">
                          {chapter.videoType === "upload" || chapter.video_type === "upload" ? "Upload Video" : chapter.videoUrl ? "YouTube" : "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${chapter.status === "published" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            {normalizeStatus(chapter.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-slate-900">
                          {chapter.completedStudents}/{chapter.totalStudents} siswa
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex items-center gap-2">
                            <IconButton label="Edit bab" onClick={() => openEdit(chapter)} className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                              <Pencil size={17} />
                            </IconButton>
                            <IconButton label="Hapus bab" onClick={() => { setSelected(chapter); setModal("delete"); }} className="bg-red-50 text-red-600 hover:bg-red-100">
                              <Trash2 size={17} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))
        )}
      </section>

      {modal === "form" ? (
        <Modal title={selected ? "Edit Bab" : "Tambah Bab"} onClose={() => setModal(null)}>
          <form onSubmit={saveChapter} className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-600">Materi Induk</span>
              <select
                value={form.materi_id}
                onChange={(event) => setForm({ ...form, materi_id: event.target.value })}
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Pilih Materi</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>{material.title}</option>
                ))}
              </select>
            </label>
            <TextInput label="Judul Bab" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required />
            <TextArea label="Deskripsi Singkat" value={form.description} onChange={(value) => setForm({ ...form, description: value })} rows={3} />
            <TextArea label="Isi Materi" value={form.content} onChange={(value) => setForm({ ...form, content: value })} rows={7} />
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-base font-extrabold text-slate-900">Contoh Kode Program</h4>
              <div className="mt-5 space-y-5">
                <TextInput
                  label="Judul Contoh Kode"
                  value={form.judul_contoh_kode}
                  onChange={(value) => setForm({ ...form, judul_contoh_kode: value })}
                />
                <label className="block">
                  <span className="text-sm font-semibold text-slate-600">Bahasa Pemrograman</span>
                  <select
                    value={form.bahasa_pemrograman}
                    onChange={(event) => setForm({ ...form, bahasa_pemrograman: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Pilih Bahasa</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Pseudocode">Pseudocode</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </label>
                <TextArea
                  label="Contoh Kode Program"
                  value={form.contoh_kode}
                  onChange={(value) => setForm({ ...form, contoh_kode: value })}
                  rows={8}
                  monospace
                />
                <TextArea
                  label="Penjelasan Contoh Kode"
                  value={form.penjelasan_kode}
                  onChange={(value) => setForm({ ...form, penjelasan_kode: value })}
                  rows={4}
                />
              </div>
            </section>
            <label className="block">
              <span className="text-sm font-semibold text-slate-600">Sumber Video</span>
              <select
                value={form.video_type}
                onChange={(event) => setForm({ ...form, video_type: event.target.value, video_url: "", video_file: null })}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Tidak Ada Video</option>
                <option value="youtube">YouTube</option>
                <option value="upload">Upload Video</option>
              </select>
            </label>

            {form.video_type === "youtube" ? <TextInput
              label="Link YouTube"
              type="url"
              value={form.video_url}
              onChange={(value) => setForm({ ...form, video_url: value })}
              placeholder="https://www.youtube.com/watch?v=..."
            /> : null}

            {form.video_type === "upload" ? <label className="block">
              <span className="text-sm font-semibold text-slate-600">Upload File Video</span>
              {form.video_file_url ? <p className="mt-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                Video saat ini sudah tersimpan. Pilih file baru jika ingin mengganti.
              </p> : null}
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(event) => setForm({ ...form, video_file: event.target.files?.[0] ?? null })}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label> : null}
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Order Number" type="number" value={String(form.order_number)} onChange={(value) => setForm({ ...form, order_number: value })} required />
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>
            <ModalActions saving={saving} onCancel={() => setModal(null)} submitLabel="Simpan Bab" />
          </form>
        </Modal>
      ) : null}

      {modal === "delete" && selected ? (
        <Modal title="Hapus Bab" onClose={() => setModal(null)}>
          <p className="text-sm leading-6 text-slate-500">
            Bab <span className="font-bold text-slate-900">{selected.title}</span> akan dihapus. Latihan yang terhubung ke bab ini ikut terdampak.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">Batal</button>
            <button type="button" disabled={saving} onClick={deleteChapter} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">Hapus</button>
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

function StateCard({ text, danger = false }) {
  return <div className={`rounded-2xl border bg-white p-6 text-sm font-semibold shadow-sm ${danger ? "border-red-200 text-red-600" : "border-slate-200 text-slate-500"}`}>{text}</div>;
}

function IconButton({ label, className, onClick, children }) {
  return <button type="button" aria-label={label} onClick={onClick} className={`flex size-9 items-center justify-center rounded-lg transition ${className}`}>{children}</button>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
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

function TextInput({ label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <input
        type={type}
        required={required}
        min={type === "number" ? 1 : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows, monospace = false }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${monospace ? "font-mono" : ""}`}
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
