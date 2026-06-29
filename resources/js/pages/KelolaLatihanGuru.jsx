import { useEffect, useMemo, useState } from "react";
import { BookOpen, ClipboardCheck, Edit3, FileText, Plus, Trash2, X } from "lucide-react";
import { teacherService } from "../services/layananGuru";

const emptyQuestion = () => ({
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A"
});

const emptyForm = () => ({
  type: "chapter",
  material_id: "",
  chapter_id: "",
  title: "",
  description: "",
  duration_minutes: 30,
  status: "draft",
  questions: [emptyQuestion()]
});

function statusLabel(status) {
  if (status === "active") return "Aktif";
  if (status === "inactive") return "Tidak Aktif";
  return "Draft";
}

function TeacherExerciseManagementPage() {
  const [materials, setMaterials] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [finalExams, setFinalExams] = useState([]);
  const [materiLatihanBab, setMateriLatihanBab] = useState("");
  const [babLatihanBab, setBabLatihanBab] = useState("");
  const [materiLatihanAkhir, setMateriLatihanAkhir] = useState("");
  const [activeTab, setActiveTab] = useState("chapter");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const materiTerpilih = activeTab === "chapter" ? materiLatihanBab : materiLatihanAkhir;

  const chapters = useMemo(() => {
    const material = materials.find((item) => String(item.id) === String(form.material_id));
    return material?.chapters ?? [];
  }, [form.material_id, materials]);
  const daftarBabFilter = useMemo(() => {
    const material = materials.find((item) => String(item.id) === String(materiLatihanBab));
    return material?.chapters ?? [];
  }, [materiLatihanBab, materials]);
  const filteredExercises = useMemo(() => {
    if (!materiLatihanBab) return [];
    if (!babLatihanBab) return exercises;
    return exercises.filter((exercise) => String(exercise.babId ?? exercise.chapter_id) === String(babLatihanBab));
  }, [babLatihanBab, exercises, materiLatihanBab]);
  const visibleChapterExercises = activeTab === "chapter" ? filteredExercises : finalExams;

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await teacherService.getMateriGuru();
      setMaterials(response.materials ?? response.materis ?? []);
      setExercises([]);
      setFinalExams([]);
      setBabLatihanBab("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat latihan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    const loadLatihanBab = async () => {
      if (!materiLatihanBab) {
        setExercises([]);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await teacherService.getLatihanBabByMateri(materiLatihanBab);
        setExercises(response.perBabExercises ?? response.exercises ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat latihan per bab.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "chapter") {
      void loadLatihanBab();
    }
  }, [activeTab, materiLatihanBab]);

  useEffect(() => {
    const loadLatihanAkhir = async () => {
      if (!materiLatihanAkhir) {
        setFinalExams([]);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await teacherService.getLatihanAkhirByMateri(materiLatihanAkhir);
        setFinalExams(response.finalExams ?? response.exercises ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat latihan akhir.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "final_exam") {
      void loadLatihanAkhir();
    }
  }, [activeTab, materiLatihanAkhir]);

  const openCreate = (type = activeTab) => {
    const selectedMaterialId = type === "chapter" ? materiLatihanBab : materiLatihanAkhir;
    if (!selectedMaterialId) {
      window.alert(type === "chapter" ? "Pilih Materi terlebih dahulu untuk menambah latihan per bab." : "Pilih Materi terlebih dahulu untuk menambah latihan akhir.");
      return;
    }

    const firstMaterial = materials.find((material) => String(material.id) === String(selectedMaterialId));
    setEditing(null);
    setForm({
      ...emptyForm(),
      type,
      material_id: firstMaterial?.id ?? "",
      chapter_id: type === "chapter" ? (babLatihanBab || firstMaterial?.chapters?.[0]?.id || "") : ""
    });
    setFormOpen(true);
  };

  const openEdit = (exercise) => {
    setEditing(exercise);
    setForm({
      type: exercise.type ?? "chapter",
      material_id: exercise.materialId ?? "",
      chapter_id: exercise.babId ?? exercise.chapter_id ?? "",
      title: exercise.title ?? "",
      description: exercise.description ?? "",
      duration_minutes: exercise.durationMinutes ?? exercise.duration ?? 30,
      status: exercise.status ?? "draft",
      questions: (exercise.questions?.length ? exercise.questions : [emptyQuestion()]).map((question) => ({
        question_text: question.question_text ?? question.questionText ?? "",
        option_a: question.option_a ?? "",
        option_b: question.option_b ?? "",
        option_c: question.option_c ?? "",
        option_d: question.option_d ?? "",
        correct_answer: question.correct_answer ?? question.correctAnswer ?? "A"
      }))
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditing(null);
    setFormOpen(false);
    setForm(emptyForm());
  };

  const updateQuestion = (index, field, value) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question
      )
    }));
  };

  const addQuestion = () => {
    setForm((current) => ({ ...current, questions: [...current.questions, emptyQuestion()] }));
  };

  const removeQuestion = (index) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.length === 1
        ? [emptyQuestion()]
        : current.questions.filter((_, questionIndex) => questionIndex !== index)
    }));
  };

  const saveExercise = async (event) => {
    event.preventDefault();
    if (!form.material_id) {
      window.alert("Materi wajib dipilih.");
      return;
    }

    if (form.type === "chapter" && !form.chapter_id) {
      window.alert("Bab wajib dipilih untuk Latihan Bab.");
      return;
    }

    if (!form.title.trim()) {
      window.alert("Judul Latihan wajib diisi.");
      return;
    }

    const invalidQuestion = form.questions.some((question) =>
      !question.question_text.trim() ||
      !question.option_a.trim() ||
      !question.option_b.trim() ||
      !question.option_c.trim() ||
      !question.option_d.trim() ||
      !question.correct_answer
    );

    if (invalidQuestion) {
      window.alert("Semua pertanyaan, pilihan A-D, dan kunci jawaban wajib diisi.");
      return;
    }

    const payload = {
      type: form.type,
      material_id: Number(form.material_id),
      chapter_id: form.type === "chapter" ? Number(form.chapter_id) : null,
      title: form.title.trim(),
      description: form.description.trim(),
      duration_minutes: form.type === "final_exam" ? Number(form.duration_minutes || 30) : null,
      status: form.status,
      questions: form.questions.map((question) => ({
        question_text: question.question_text.trim(),
        option_a: question.option_a.trim(),
        option_b: question.option_b.trim(),
        option_c: question.option_c.trim(),
        option_d: question.option_d.trim(),
        correct_answer: question.correct_answer
      }))
    };

    setSaving(true);
    try {
      if (editing) {
        await teacherService.updateExercise(editing.id, payload);
      } else {
        await teacherService.createExercise(payload);
      }
      await loadData();
      if (payload.type === "chapter" && payload.material_id) {
        setMateriLatihanBab(String(payload.material_id));
        setBabLatihanBab(String(payload.chapter_id));
        const response = await teacherService.getLatihanBabByMateri(payload.material_id);
        setExercises(response.perBabExercises ?? response.exercises ?? []);
      }
      if (payload.type === "final_exam" && payload.material_id) {
        setMateriLatihanAkhir(String(payload.material_id));
        const response = await teacherService.getLatihanAkhirByMateri(payload.material_id);
        setFinalExams(response.finalExams ?? response.exercises ?? []);
      }
      closeForm();
    } catch (saveError) {
      window.alert(saveError instanceof Error ? saveError.message : "Gagal menyimpan latihan.");
    } finally {
      setSaving(false);
    }
  };

  const deleteExercise = async (exercise) => {
    if (!window.confirm(`Hapus latihan "${exercise.title}"?`)) return;
    try {
      await teacherService.deleteExercise(exercise.id);
      if (exercise.type === "chapter" && materiLatihanBab) {
        const response = await teacherService.getLatihanBabByMateri(materiLatihanBab);
        setExercises(response.perBabExercises ?? response.exercises ?? []);
      } else if (exercise.type === "final_exam" && materiLatihanAkhir) {
        const response = await teacherService.getLatihanAkhirByMateri(materiLatihanAkhir);
        setFinalExams(response.finalExams ?? response.exercises ?? []);
      } else {
        await loadData();
      }
    } catch (deleteError) {
      window.alert(deleteError instanceof Error ? deleteError.message : "Gagal menghapus latihan.");
    }
  };

  return (
    <div className="px-8 py-8">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-slate-900">Kelola Latihan</h1>
        </div>
        <button
          type="button"
          onClick={() => openCreate(activeTab)}
          disabled={!materiTerpilih}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          {activeTab === "chapter" ? "Tambah Latihan Bab" : "Tambah Latihan Akhir"}
        </button>
      </header>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <TabButton active={activeTab === "chapter"} onClick={() => setActiveTab("chapter")} label="Latihan Bab" />
          <TabButton active={activeTab === "final_exam"} onClick={() => setActiveTab("final_exam")} label="Latihan Akhir" />
        </div>
      </div>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Pilih Materi</span>
            <select
              value={materiTerpilih}
              onChange={(event) => {
                if (activeTab === "chapter") {
                  setMateriLatihanBab(event.target.value);
                  setBabLatihanBab("");
                  setExercises([]);
                } else {
                  setMateriLatihanAkhir(event.target.value);
                  setFinalExams([]);
                }
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 md:w-96"
            >
              <option value="">Pilih Materi</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.nama_materi ?? material.title}
                </option>
              ))}
            </select>
          </label>

          {activeTab === "chapter" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Pilih Bab</span>
              <select
                value={babLatihanBab}
                onChange={(event) => setBabLatihanBab(event.target.value)}
                disabled={!materiLatihanBab}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-100 disabled:text-slate-400 md:w-96"
              >
                <option value="">{materiLatihanBab ? "Semua Bab" : "Pilih materi terlebih dahulu"}</option>
                {daftarBabFilter.map((bab) => (
                  <option key={bab.id} value={bab.id}>
                    {bab.judul_bab ?? bab.title ?? bab.nama_bab}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </section>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : null}

      {materiTerpilih ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard icon={<ClipboardCheck size={25} />} value={visibleChapterExercises.length} label={activeTab === "chapter" ? "Total Latihan Bab" : "Total Latihan Akhir"} />
          <StatCard icon={<FileText size={25} />} value={visibleChapterExercises.reduce((sum, item) => sum + (item.totalQuestions ?? 0), 0)} label="Total Soal PG" />
          <StatCard icon={<BookOpen size={25} />} value={visibleChapterExercises.filter((item) => item.status === "active").length} label="Latihan Aktif" />
        </section>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-extrabold text-slate-900">{activeTab === "chapter" ? "Daftar Latihan Bab" : "Daftar Latihan Akhir"}</h2>
        </div>
        {!materiTerpilih ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm font-semibold text-blue-700">
            {activeTab === "chapter"
              ? "Silakan pilih materi terlebih dahulu untuk melihat dan mengelola latihan per bab."
              : "Silakan pilih materi terlebih dahulu untuk melihat latihan akhir."}
          </div>
        ) : loading ? (
          <div className="p-6 text-sm font-semibold text-slate-500">Memuat data...</div>
        ) : visibleChapterExercises.length === 0 ? (
          <div className="p-6 text-sm font-semibold text-slate-500">
            {activeTab === "chapter" && babLatihanBab ? "Belum ada data pada bab ini." : "Belum ada data pada materi ini."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {(activeTab === "chapter" ? ["No", "Materi", "Bab", "Latihan", "Soal", "Status", "Riwayat", "Aksi"] : ["No", "Materi", "Latihan Akhir", "Durasi", "Soal", "Status", "Aksi"]).map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleChapterExercises.map((exercise, index) => (
                  <tr key={exercise.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5 text-sm font-bold text-slate-500">{index + 1}</td>
                    {activeTab === "chapter" ? <>
                      <td className="min-w-[220px] px-6 py-5 text-sm font-semibold text-slate-700">{exercise.materialTitle ?? "-"}</td>
                      <td className="min-w-[220px] px-6 py-5 text-sm font-semibold text-slate-700">{exercise.babTitle ?? "-"}</td>
                    </> : <td className="min-w-[220px] px-6 py-5 text-sm font-semibold text-slate-700">{exercise.materialTitle ?? "-"}</td>}
                    <td className="min-w-[240px] px-6 py-5">
                      <p className="text-sm font-extrabold text-slate-900">{exercise.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">{exercise.description || "-"}</p>
                    </td>
                    {activeTab === "final_exam" ? <td className="px-6 py-5 text-sm font-bold text-slate-700">{exercise.durationMinutes ?? exercise.duration ?? 60} menit</td> : null}
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {exercise.totalQuestions} PG
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {statusLabel(exercise.status)}
                      </span>
                    </td>
                    {activeTab === "chapter" ? <td className="px-6 py-5 text-sm font-bold text-slate-700">{exercise.totalParticipants ?? 0} percobaan</td> : null}
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <IconButton title="Edit" onClick={() => openEdit(exercise)}><Edit3 size={17} /></IconButton>
                        <IconButton title="Hapus" danger onClick={() => void deleteExercise(exercise)}><Trash2 size={17} /></IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {formOpen ? (
        <ExerciseFormModal
          form={form}
          materials={materials}
          chapters={chapters}
          editing={editing}
          saving={saving}
          onClose={closeForm}
          onSubmit={saveExercise}
          setForm={setForm}
          updateQuestion={updateQuestion}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
        />
      ) : null}
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-extrabold transition ${active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}
    >
      {label}
    </button>
  );
}

function ExerciseFormModal({ form, materials, chapters, editing, saving, onClose, onSubmit, setForm, updateQuestion, addQuestion, removeQuestion }) {
  const handleMaterialChange = (materialId) => {
    const selectedMaterial = materials.find((material) => String(material.id) === String(materialId));
    setForm((current) => ({
      ...current,
      material_id: materialId,
      chapter_id: selectedMaterial?.chapters?.[0]?.id ?? ""
    }));
  };
  const handleTypeChange = (type) => {
    const firstMaterial = materials[0];
    const selectedMaterial = materials.find((material) => String(material.id) === String(form.material_id)) ?? firstMaterial;

    setForm((current) => ({
      ...current,
      type,
      material_id: current.material_id || selectedMaterial?.id || "",
      chapter_id: type === "chapter" ? (selectedMaterial?.chapters?.[0]?.id ?? "") : "",
      duration_minutes: type === "final_exam" ? (current.duration_minutes || 30) : 30
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={onSubmit} className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{editing ? "Edit Latihan" : "Tambah Latihan"}</h3>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <SelectInput label="Jenis Latihan" value={form.type} onChange={handleTypeChange}>
            <option value="chapter">Latihan Per Bab</option>
            <option value="final_exam">Latihan Akhir Materi</option>
          </SelectInput>

          {form.type === "chapter" ? (
            <div className="grid gap-5 md:grid-cols-2">
              <SelectInput label="Pilih Materi" value={form.material_id} onChange={handleMaterialChange}>
                <option value="">Pilih Materi</option>
                {materials.map((material) => <option key={material.id} value={material.id}>{material.title}</option>)}
              </SelectInput>
              <SelectInput label="Pilih Bab" value={form.chapter_id} onChange={(value) => setForm((current) => ({ ...current, chapter_id: value }))}>
                <option value="">Pilih Bab</option>
                {chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}
              </SelectInput>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
              <SelectInput label="Pilih Materi" value={form.material_id} onChange={(value) => setForm((current) => ({ ...current, material_id: value }))}>
                <option value="">Pilih Materi</option>
                {materials.map((material) => <option key={material.id} value={material.id}>{material.title}</option>)}
              </SelectInput>
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                Latihan Akhir akan terbuka untuk siswa setelah semua Bab dan Latihan Bab pada Materi ini selesai.
              </div>
            </div>
          )}

          <div className={`grid gap-5 ${form.type === "final_exam" ? "md:grid-cols-[1fr_180px_220px]" : "md:grid-cols-[1fr_220px]"}`}>
            <TextInput label="Judul Latihan" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} />
            {form.type === "final_exam" ? <NumberInput label="Durasi Pengerjaan (Menit)" hint="Masukkan durasi dalam menit." value={String(form.duration_minutes)} onChange={(value) => setForm((current) => ({ ...current, duration_minutes: value }))} /> : null}
            <SelectInput label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))}>
              <option value="draft">Draft</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </SelectInput>
          </div>

          <TextArea label="Deskripsi Latihan" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} rows={3} />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">Soal Pilihan Ganda</h4>
              </div>
              <button type="button" onClick={addQuestion} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100">
                <Plus size={17} />
                Tambah Soal
              </button>
            </div>

            {form.questions.map((question, index) => (
              <QuestionEditor
                key={index}
                index={index}
                question={question}
                onChange={updateQuestion}
                onRemove={() => removeQuestion(index)}
              />
            ))}
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50">Batal</button>
          <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Menyimpan..." : "Simpan Latihan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function QuestionEditor({ index, question, onChange, onRemove }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-extrabold text-slate-900">Soal {index + 1}</p>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100">
          <Trash2 size={15} />
          Hapus
        </button>
      </div>
      <div className="space-y-4">
        <TextArea label="Pertanyaan" value={question.question_text} onChange={(value) => onChange(index, "question_text", value)} rows={3} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Pilihan A" value={question.option_a} onChange={(value) => onChange(index, "option_a", value)} />
          <TextInput label="Pilihan B" value={question.option_b} onChange={(value) => onChange(index, "option_b", value)} />
          <TextInput label="Pilihan C" value={question.option_c} onChange={(value) => onChange(index, "option_c", value)} />
          <TextInput label="Pilihan D" value={question.option_d} onChange={(value) => onChange(index, "option_d", value)} />
        </div>
        <SelectInput label="Kunci Jawaban" value={question.correct_answer} onChange={(value) => onChange(index, "correct_answer", value)}>
          {["A", "B", "C", "D"].map((option) => <option key={option} value={option}>{option}</option>)}
        </SelectInput>
      </div>
    </article>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <article className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
      </div>
    </article>
  );
}

function IconButton({ title, danger = false, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-lg transition ${danger ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
    >
      {children}
    </button>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </label>
  );
}

function NumberInput({ label, hint, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
      {hint ? <span className="mt-1 block text-xs font-medium text-slate-500">{hint}</span> : null}
    </label>
  );
}

function TextArea({ label, value, onChange, rows }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      >
        {children}
      </select>
    </label>
  );
}

export {
  TeacherExerciseManagementPage as default
};
