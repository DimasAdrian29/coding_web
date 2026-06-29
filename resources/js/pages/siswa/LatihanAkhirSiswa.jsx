import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Info,
  Target,
} from "lucide-react";
import SidebarSiswa, { MobileMenuSiswa } from "../../components/layout/SidebarSiswa";
import { studentService } from "../../services/layananSiswa";
function PageHeader() {
  return <header className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
                <Target size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold tracking-normal text-[#0F172A]">
                    Latihan Akhir
                </h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">
                    Selesaikan semua bab dan latihan per bab untuk membuka latihan akhir.
                </p>
            </div>
        </header>;
}
function InfoCard() {
  return <section className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-5 text-blue-700">
            <div className="flex gap-4">
                <Info className="mt-0.5 shrink-0 text-[#2563EB]" size={22} />
                <div>
                    <h3 className="font-extrabold">Tentang Latihan Akhir</h3>
                    <p className="mt-2 text-sm leading-6">
                        Latihan akhir berisi soal pilihan ganda yang dinilai otomatis oleh sistem.
                        Latihan ini hanya terbuka setelah semua bab dan latihan per bab
                        diselesaikan.
                    </p>
                </div>
            </div>
        </section>;
}
function MaterialSelector({ materials, selectedMaterial, onChange }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#64748B]">Pilih Materi</span>
                <select
    value={selectedMaterial}
    onChange={(event) => onChange(event.target.value)}
    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:w-96"
  >
                    <option value="">Pilih Materi</option>
                    {materials.map((material) => <option key={material.id} value={String(material.id)}>
                            {material.title}
                        </option>)}
                </select>
            </label>
        </section>;
}
function ProgressBox({ finalExam }) {
  return <div className="w-full max-w-sm rounded-xl bg-slate-50 p-4 text-left">
            <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-[#0F172A]">Progress Pembelajaran</p>
                <p className="text-sm font-bold text-[#64748B]">
                    {finalExam.completedChapters}/{finalExam.totalChapters} Bab
                </p>
            </div>
            <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-[#0F172A]">Latihan Per Bab</p>
                <p className="text-sm font-bold text-[#64748B]">
                    {finalExam.submittedExercises ?? 0}/{finalExam.totalExercises ?? 0} Latihan
                </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
    className="h-full rounded-full bg-[#2563EB]"
    style={{ width: `${finalExam.progressPercentage}%` }}
  />
            </div>
        </div>;
}
function ExamStatusCard({ finalExam }) {
  const navigate = useNavigate();
  const available = finalExam.finalExamAvailable;
  return <section className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="flex w-full max-w-lg flex-col items-center">
                <div
    className={`flex size-16 items-center justify-center rounded-full ${available ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-slate-100 text-slate-500"}`}
  >
                    {available ? <Target size={32} /> : <AlertTriangle size={32} />}
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-800">
                    {available ? "Latihan Akhir Tersedia" : "Latihan Akhir Belum Tersedia"}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#64748B]">
                    {available ? "Anda telah menyelesaikan semua bab dan latihan per bab. Silakan mulai latihan akhir." : finalExam.reason || "Selesaikan semua materi dan latihan per bab terlebih dahulu untuk membuka latihan akhir."}
                </p>

                {available && finalExam.exam ? <div className="mt-6 grid w-full gap-3 rounded-2xl bg-slate-50 p-4 text-left sm:grid-cols-3">
                        <InfoLine label="Jumlah Soal" value={`${finalExam.exam.totalQuestions ?? 0} Soal`} />
                        <InfoLine label="Durasi" value={`${finalExam.exam.durationMinutes ?? 0} Menit`} />
                        <InfoLine label="Penilaian" value="Otomatis" />
                    </div> : null}

                <div className="mt-6 flex w-full justify-center">
                    <ProgressBox finalExam={finalExam} />
                </div>

                <button
    type="button"
    onClick={() => navigate(available && finalExam.exam ? `/siswa/latihan-akhir/${finalExam.exam.id}` : "/siswa/materi")}
    className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
  >
                    {available ? "Mulai Latihan Akhir" : "Lanjutkan Belajar"}
                </button>
            </div>
        </section>;
}
function InfoLine({ label, value }) {
  return <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#94A3B8]">{label}</p>
            <p className="mt-1 text-sm font-extrabold text-[#0F172A]">{value}</p>
        </div>;
}
function StudentFinalExamPage() {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [finalExam, setFinalExam] = useState(null);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [loadingExam, setLoadingExam] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadMaterials = async () => {
      setLoadingMaterials(true);
      setError("");
      try {
        const response = await studentService.getLearningFlow();
        setMaterials(response.materials ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data. Coba lagi.");
      } finally {
        setLoadingMaterials(false);
      }
    };
    void loadMaterials();
  }, []);
  useEffect(() => {
    if (!selectedMaterial) {
      setFinalExam(null);
      return;
    }

    const loadFinalExam = async () => {
      setLoadingExam(true);
      setError("");
      try {
        const response = await studentService.getMaterialFinalExam(selectedMaterial);
        setFinalExam(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data. Coba lagi.");
      } finally {
        setLoadingExam(false);
      }
    };

    void loadFinalExam();
  }, [selectedMaterial]);
  return <div className="min-h-screen bg-slate-50 font-sans text-[#0F172A] lg:flex">
            <SidebarSiswa />

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="space-y-6">
                    <MobileMenuSiswa />
                    <PageHeader />
                    <InfoCard />
                    {loadingMaterials ? <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-[#64748B] shadow-sm">
                            Memuat data...
                        </div> : error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600 shadow-sm">
                            Gagal memuat data. Coba lagi.
                        </div> : <>
                            <MaterialSelector materials={materials} selectedMaterial={selectedMaterial} onChange={setSelectedMaterial} />
                            {!selectedMaterial ? <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm font-semibold leading-6 text-blue-700 shadow-sm">
                                    Silakan pilih materi terlebih dahulu untuk melihat Latihan Akhir Materi.
                                </div> : loadingExam ? <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-[#64748B] shadow-sm">
                                    Memuat latihan akhir...
                                </div> : finalExam ? <ExamStatusCard finalExam={finalExam} /> : null}
                        </>}
                </div>
            </main>
        </div>;
}
export {
  StudentFinalExamPage as default
};
