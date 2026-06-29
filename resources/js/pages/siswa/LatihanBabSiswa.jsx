import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  FileText,
  Info,
} from "lucide-react";
import SidebarSiswa, { MobileMenuSiswa } from "../../components/layout/SidebarSiswa";
import { studentService } from "../../services/layananSiswa";

function chapterOrderValue(chapter) {
  const order = Number(chapter.order ?? chapter.order_number ?? chapter.id);
  return Number.isFinite(order) && order > 0 ? order : chapter.id;
}


function PageHeader() {
  return (
    <header className="flex items-center gap-4">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
        <FileText size={27} />
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-normal text-slate-900">Latihan Per Bab</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Pilih materi dan kerjakan latihan per bab yang tersedia.</p>
      </div>
    </header>
  );
}

function FilterSelector({ materis, chapters, selectedMateri, selectedBab, onMateriChange, onBabChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Pilih Materi</span>
          <select
            value={selectedMateri}
            onChange={(event) => onMateriChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:w-96"
          >
            <option value="">Pilih Materi</option>
            {materis.map((materi) => (
              <option key={materi.id} value={String(materi.id)}>
                {materi.nama_materi ?? materi.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Pilih Bab</span>
          <select
            value={selectedBab}
            onChange={(event) => onBabChange(event.target.value)}
            disabled={!selectedMateri}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400 md:w-96"
          >
            <option value="">{selectedMateri ? "Semua Bab" : "Pilih materi terlebih dahulu"}</option>
            {chapters.map((bab) => (
              <option key={bab.id} value={String(bab.id)}>
                {bab.judul_bab ?? bab.title ?? bab.nama_bab}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

function InfoCard() {
  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-blue-700">
      <div className="flex gap-4">
        <Info className="mt-0.5 shrink-0 text-blue-600" size={22} />
        <div>
          <h3 className="font-extrabold">Tentang Latihan Per Bab</h3>
          <p className="mt-2 text-sm leading-6">
            Latihan dapat dikerjakan berkali-kali. Nilai dihitung otomatis dari kunci jawaban dan setiap percobaan tersimpan sebagai riwayat.
          </p>
        </div>
      </div>
    </section>
  );
}

function ExerciseCard({ exercise }) {
  const navigate = useNavigate();
  const locked = exercise.status === "locked";
  const attempted = exercise.attemptCount > 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${locked ? "bg-slate-100 text-slate-400" : "bg-blue-100 text-blue-600"}`}>
            {attempted ? <CheckCircle size={24} /> : <FileText size={24} />}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-slate-900">{exercise.title}</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">{exercise.materialTitle} - {exercise.chapterTitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge text={`${exercise.questionCount} Soal PG`} />
              <Badge text={`${exercise.attemptCount} Percobaan`} />
              <Badge text={`Nilai Terakhir: ${exercise.lastScore ?? "-"}`} />
              <Badge text={`Nilai Tertinggi: ${exercise.highestScore ?? "-"}`} />
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={locked}
          onClick={() => navigate(`/siswa/latihan-bab/${exercise.id}`)}
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 lg:w-auto"
        >
          {locked ? "Selesaikan Materi Dulu" : attempted ? "Kerjakan Lagi" : "Mulai Latihan"}
        </button>
      </div>
    </article>
  );
}

function Badge({ text }) {
  return <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{text}</span>;
}

function StudentChapterExercisesPage() {
  const [materis, setMateris] = useState([]);
  const [selectedMateri, setSelectedMateri] = useState("");
  const [selectedBab, setSelectedBab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await studentService.getLearningFlow();
        setMateris((response.materials ?? []).map((materi) => ({
          ...materi,
          chapters: [...(materi.chapters ?? [])].sort((a, b) => {
            const orderA = chapterOrderValue(a);
            const orderB = chapterOrderValue(b);
            return orderA - orderB || a.id - b.id;
          })
        })));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat latihan.");
      } finally {
        setLoading(false);
      }
    };
    void loadExercises();
  }, []);

  const selectedMaterial = useMemo(() => {
    if (!selectedMateri) return null;
    return materis.find((materi) => String(materi.id) === String(selectedMateri)) ?? null;
  }, [materis, selectedMateri]);
  const daftarBab = useMemo(() => selectedMaterial?.chapters ?? [], [selectedMaterial]);

  const exercises = useMemo(() => {
    if (!selectedMaterial) return [];
    return (selectedMaterial.chapters ?? []).filter((chapter) => (!selectedBab || String(chapter.id) === String(selectedBab)) && chapter.exercise).map((chapter) => ({
      id: chapter.exercise.id,
      title: chapter.exercise.title,
      materialTitle: selectedMaterial.title ?? chapter.material_title,
      chapterTitle: chapter.title,
      questionCount: chapter.exercise.total_questions,
      status: !chapter.exercise.unlocked ? "locked" : "open",
      attemptCount: chapter.exercise.attempt_count ?? (chapter.exercise.submitted ? 1 : 0),
      lastScore: chapter.exercise.last_score ?? chapter.exercise.score ?? null,
      highestScore: chapter.exercise.highest_score ?? chapter.exercise.score ?? null
    }));
  }, [selectedBab, selectedMaterial]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 lg:flex">
      <SidebarSiswa />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-6">
          <MobileMenuSiswa />
          <PageHeader />
          {loading ? (
            <StateCard text="Memuat data..." />
          ) : error ? (
            <StateCard text={error} danger />
          ) : (
            <>
              <InfoCard />
              <FilterSelector
                materis={materis}
                chapters={daftarBab}
                selectedMateri={selectedMateri}
                selectedBab={selectedBab}
                onMateriChange={(value) => {
                  setSelectedMateri(value);
                  setSelectedBab("");
                }}
                onBabChange={setSelectedBab}
              />
              {!selectedMateri ? (
                <StateCard text="Silakan pilih materi terlebih dahulu." />
              ) : exercises.length === 0 ? (
                <StateCard text={selectedBab ? "Belum ada data pada bab ini." : "Belum ada data pada materi ini."} />
              ) : (
                <section className="space-y-5">
                  {exercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StateCard({ text, danger = false }) {
  return (
    <div className={`rounded-2xl border bg-white p-6 text-sm font-semibold shadow-sm ${danger ? "border-red-200 text-red-600" : "border-slate-200 text-slate-500"}`}>
      {text}
    </div>
  );
}

export {
  StudentChapterExercisesPage as default
};
