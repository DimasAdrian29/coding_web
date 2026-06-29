import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Lock,
} from "lucide-react";
import SidebarSiswa, { MobileMenuSiswa } from "../../components/layout/SidebarSiswa";
import { studentService } from "../../services/layananSiswa";
function chapterOrderValue(chapter) {
  const order = Number(chapter.order ?? chapter.order_number ?? chapter.id);
  return Number.isFinite(order) && order > 0 ? order : chapter.id;
}
function PageHeader() {
  return <header className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
                <BookOpen size={27} />
            </div>
            <div>
                <h2 className="text-2xl font-bold tracking-normal text-[#0F172A]">
                    Materi Pembelajaran
                </h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">
                    Pilih materi dan lanjutkan pembelajaran kamu.
                </p>
            </div>
        </header>;
}
function ProgressSummary({ data }) {
  const percentage = data.progressPercentage;
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-lg font-extrabold text-[#0F172A]">
                        Progress Pembelajaran
                    </h3>
                    <p className="mt-2 text-sm font-medium text-[#64748B]">
                        {data.completedActivities ?? data.completedChapters} dari {data.totalActivities ?? data.totalChapters} aktivitas telah diselesaikan
                    </p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-3xl font-extrabold text-[#2563EB]">{percentage}%</p>
                    <p className="mt-1 text-sm font-semibold text-[#64748B]">Selesai</p>
                </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
    className="h-full rounded-full bg-[#2563EB]"
    style={{ width: `${percentage}%` }}
  />
            </div>
        </section>;
}
function MaterialSelector({ materials, selectedMaterialId, onChange }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
                <div>
                    <h3 className="text-lg font-extrabold text-[#0F172A]">
                        Pilih Materi
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
                        Pilih materi yang ingin dipelajari terlebih dahulu. Sistem akan menampilkan bab yang berada di dalam materi tersebut.
                    </p>
                </div>
                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#64748B]">Materi Pembelajaran</span>
                    <select
      value={selectedMaterialId}
      onChange={(event) => onChange(event.target.value)}
      disabled={materials.length === 0}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20"
    >
                        <option value="">Pilih Materi</option>
                        {materials.map((material) => <option key={material.id} value={String(material.id)}>
                                {material.title}
                            </option>)}
                    </select>
                </label>
            </div>
        </section>;
}
function ChapterCard({ chapter }) {
  const navigate = useNavigate();
  const isUnlocked = chapter.status === "current" || chapter.status === "completed";
  const chapterOrder = chapter.order ?? chapter.id;
  const exerciseSubmitted = Boolean(chapter.exercise?.submitted);
  const canOpenExercise = chapter.status === "completed" && chapter.exercise && !exerciseSubmitted;
  const handleClick = () => {
    if (isUnlocked) {
      navigate(`/siswa/materi/${chapter.id}`);
      return;
    }
    window.alert("Bab ini masih terkunci");
  };
  return <article
    onClick={handleClick}
    className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition ${isUnlocked ? "cursor-pointer hover:border-blue-200 hover:shadow-md" : "cursor-not-allowed"}`}
  >
            <div className={isUnlocked ? "" : "opacity-60"}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div
    className={`flex size-14 shrink-0 items-center justify-center rounded-xl font-extrabold ${isUnlocked ? "bg-[#DBEAFE] text-[#2563EB]" : "bg-slate-100 text-slate-400"}`}
  >
                        {isUnlocked ? chapterOrder : <Lock size={24} />}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold text-[#64748B]">Bab {chapterOrder}</span>
                            <span
    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${chapter.status === "completed" ? "border-blue-200 bg-blue-100 text-blue-700" : isUnlocked ? "border-blue-200 bg-blue-100 text-blue-600" : "border-slate-200 bg-slate-100 text-slate-500"}`}
  >
                                {chapter.status === "completed" ? "Selesai" : isUnlocked ? "Sedang Dipelajari" : "Terkunci"}
                            </span>
                        </div>

                        <h3
    className={`mt-3 text-lg font-extrabold ${isUnlocked ? "text-[#0F172A]" : "text-slate-500"}`}
  >
                            {chapter.title}
                        </h3>
                        <p
    className={`mt-2 text-sm leading-6 ${isUnlocked ? "text-[#64748B]" : "text-slate-400"}`}
  >
                            {chapter.description}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#94A3B8]">
                            <Clock size={16} />
                            {chapter.duration}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {isUnlocked ? <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      navigate(`/siswa/materi/${chapter.id}`);
    }}
    className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
  >
                                    {chapter.status === "completed" ? "Lihat Materi" : "Mulai Belajar"}
                                </button> : <button
    type="button"
    disabled
    onClick={(event) => event.stopPropagation()}
    className="inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-400"
  >
                                    Terkunci
                                </button>}

                            {canOpenExercise ? <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      navigate(`/siswa/latihan-bab/${chapter.exercise?.id}`);
    }}
    className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-[#2563EB] transition hover:bg-blue-100"
  >
                                    Kerjakan Latihan
                                </button> : null}

                            {exerciseSubmitted ? <span
    onClick={(event) => event.stopPropagation()}
    className="inline-flex items-center rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700"
  >
                                    Latihan Dikumpulkan
                                </span> : null}
                        </div>
                    </div>
                </div>
            </div>

            {!isUnlocked && chapter.requirement ? <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                    {chapter.requirement}
                </div> : null}
        </article>;
}
function MaterialList({ materials }) {
  return <section className="space-y-6">
            {materials.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-[#64748B] shadow-sm">
                    Belum ada data.
                </div> : materials.map((material) => <MaterialGroup key={material.id} material={material} />)}
        </section>;
}
function SelectMaterialPrompt() {
  return <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm font-semibold leading-6 text-blue-700 shadow-sm">
            Silakan pilih Materi dari dropdown untuk melihat daftar Bab yang tersedia.
        </section>;
}
function EmptyMaterialState({ material }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#0F172A]">{material.title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#64748B]">
                Materi ini sudah tersedia, tetapi belum memiliki Bab yang dipublikasikan.
            </p>
        </section>;
}
function MaterialGroup({ material }) {
  return <section className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-bold text-[#2563EB]">Materi</p>
                        <h3 className="mt-1 text-xl font-extrabold text-[#0F172A]">
                            {material.title}
                        </h3>
                        {material.description ? <p className="mt-2 text-sm leading-6 text-[#64748B]">
                                {material.description}
                            </p> : null}
                    </div>
                    <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {material.chapters.length} Bab
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {material.chapters.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} />)}
            </div>
        </section>;
}
function StudentMaterialsPage() {
  const [data, setData] = useState(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadChapters = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await studentService.getLearningFlow();
        const sortedFlowChapters = [...response.chapters].sort((a, b) => {
          const orderA = chapterOrderValue(a);
          const orderB = chapterOrderValue(b);
          return orderA - orderB || a.id - b.id;
        });
        const completedChapters = sortedFlowChapters.filter((chapter) => chapter.chapter_status === "completed").length;
        const totalChapters = sortedFlowChapters.length;
        const materials = (response.materials ?? []).map((material) => ({
          ...material,
          chapters: [...(material.chapters ?? [])].sort((a, b) => {
            const orderA = chapterOrderValue(a);
            const orderB = chapterOrderValue(b);
            return orderA - orderB || a.id - b.id;
          }).map((chapter, index) => {
            const chapterUnlocked = index === 0 || chapter.chapter_unlocked === true;
            return {
              id: chapter.id,
              order: chapterOrderValue(chapter),
              title: chapter.title,
              description: chapter.description,
              content: chapter.content,
              codeExample: chapter.codeExample,
              duration: `${chapter.duration_minutes} menit`,
              status: chapter.chapter_status === "completed" ? "completed" : chapterUnlocked ? "current" : "locked",
              requirement: chapterUnlocked ? void 0 : "Selesaikan latihan bab sebelumnya di materi ini untuk membuka bab berikutnya.",
              exercise: chapter.exercise
            };
          })
        }));
        setData({
          completedChapters,
          totalChapters,
          progressPercentage: totalChapters > 0 ? Math.round(completedChapters / totalChapters * 100) : 0,
          materials,
          chapters: sortedFlowChapters.map((chapter, index) => {
            const chapterUnlocked = index === 0 || chapter.chapter_unlocked === true;
            return {
              id: chapter.id,
              order: chapterOrderValue(chapter),
              title: chapter.title,
              description: chapter.description,
              content: chapter.content,
              codeExample: chapter.codeExample,
              duration: `${chapter.duration_minutes} menit`,
              status: chapter.chapter_status === "completed" ? "completed" : chapterUnlocked ? "current" : "locked",
              requirement: chapterUnlocked ? void 0 : "Selesaikan latihan bab sebelumnya untuk membuka bab ini.",
              exercise: chapter.exercise
            };
          })
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data. Coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    void loadChapters();
  }, []);
  const selectedMaterial = useMemo(() => {
    if (!data || !selectedMaterialId) {
      return null;
    }
    return (data.materials ?? []).find((material) => String(material.id) === String(selectedMaterialId)) ?? null;
  }, [data, selectedMaterialId]);
  const selectedProgress = useMemo(() => {
    if (!selectedMaterial) {
      return null;
    }
    const backendProgress = selectedMaterial.progress;
    if (backendProgress) {
      return {
        completedChapters: backendProgress.completed_chapters ?? 0,
        totalChapters: backendProgress.total_chapters ?? 0,
        completedActivities: backendProgress.completed_activities ?? 0,
        totalActivities: backendProgress.total_activities ?? 0,
        progressPercentage: backendProgress.percentage ?? 0
      };
    }
    const completedChapters = selectedMaterial.chapters.filter((chapter) => chapter.status === "completed").length;
    const completedExercises = selectedMaterial.chapters.filter((chapter) => chapter.exercise?.submitted).length;
    const totalChapters = selectedMaterial.chapters.length;
    const totalExercises = selectedMaterial.chapters.filter((chapter) => chapter.exercise).length;
    const totalActivities = totalChapters + totalExercises;
    const completedActivities = completedChapters + completedExercises;
    return {
      completedChapters,
      totalChapters,
      completedActivities,
      totalActivities,
      progressPercentage: totalActivities > 0 ? Math.round(completedActivities / totalActivities * 100) : 0
    };
  }, [selectedMaterial]);
  return <div className="min-h-screen bg-slate-50 font-sans text-[#0F172A] lg:flex">
            <SidebarSiswa />

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="space-y-6">
                    <MobileMenuSiswa />
                    <PageHeader />
                    {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-[#64748B] shadow-sm">
                            Memuat data...
                        </div> : error || !data ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600 shadow-sm">
                            Gagal memuat data. Coba lagi.
                        </div> : <>
                            <MaterialSelector
      materials={data.materials ?? []}
      selectedMaterialId={selectedMaterialId}
      onChange={setSelectedMaterialId}
    />
                            {selectedMaterial && selectedProgress ? <>
                                <ProgressSummary data={selectedProgress} />
                                {selectedMaterial.chapters.length > 0 ? <MaterialList materials={[selectedMaterial]} /> : <EmptyMaterialState material={selectedMaterial} />}
                            </> : <SelectMaterialPrompt />}
                        </>}
                </div>
            </main>
        </div>;
}
export {
  StudentMaterialsPage as default
};
