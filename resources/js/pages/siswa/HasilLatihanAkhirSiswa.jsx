import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, FileText, Trophy, XCircle } from "lucide-react";
import { studentService } from "../../services/layananSiswa";
function StudentFinalExamResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadResult = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const response = await studentService.getFinalExamResult(id);
        setResult(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    void loadResult();
  }, [id]);
  const passed = result?.status === "passed";
  return <div className="min-h-screen bg-slate-50 p-6 font-sans text-[#0F172A]">
            <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl items-center justify-center">
            {loading ? <StateCard text="Memuat data..." /> : error ? <StateCard text="Gagal memuat data." danger /> : !result ? <StateCard text="Hasil latihan akhir tidak ditemukan." /> : <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-blue-600 px-8 py-7 text-center text-white">
                    <div className={`mx-auto flex size-16 items-center justify-center rounded-full ${passed ? "bg-white text-blue-600" : "bg-red-100 text-red-600"}`}>
                        {passed ? <Trophy size={32} /> : <XCircle size={32} />}
                    </div>
                    <h1 className="mt-5 text-2xl font-extrabold">
                        Hasil Latihan Akhir
                    </h1>
                    <p className="mt-2 text-sm font-medium leading-6 text-blue-100">
                        {result.exam?.title ?? "Latihan Akhir"}
                    </p>
                    </div>

                    <div className="p-8">
                    <div className="rounded-2xl bg-blue-50 p-6 text-center">
                        <p className="text-sm font-bold text-blue-700">Nilai Akhir</p>
                        <p className="mt-2 text-6xl font-black text-blue-700">{result.score}</p>
                        <span className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-extrabold ${passed ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                            {passed ? "LULUS" : "BELUM LULUS"}
                        </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
                        <InfoCard icon={<CheckCircle size={20} />} label="Jawaban Benar" value={`${result.total_correct}/${result.total_questions}`} />
                        <InfoCard icon={<FileText size={20} />} label="Total Soal" value={`${result.total_questions} Soal`} />
                        <InfoCard icon={<Clock size={20} />} label="Durasi" value={`${result.duration_used_minutes} Menit`} />
                        <InfoCard icon={<CheckCircle size={20} />} label="Status" value="Selesai" />
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
      type="button"
      onClick={() => navigate("/siswa/latihan-akhir")}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
    >
                            <ArrowLeft size={17} />
                            Kembali ke Latihan Akhir
                        </button>
                        <button
      type="button"
      onClick={() => navigate("/siswa/nilai-progress")}
      className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
    >
                            Lihat Nilai
                        </button>
                    </div>
                    </div>
                </div>}
            </main>
        </div>;
}
function InfoCard({ icon, label, value }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#94A3B8]">{label}</p>
                    <p className="mt-1 text-sm font-extrabold text-[#0F172A]">{value}</p>
                </div>
            </div>
        </article>;
}
function StateCard({ text, danger = false }) {
  return <div className={`w-full max-w-xl rounded-2xl border bg-white p-6 text-center text-sm font-semibold shadow-sm ${danger ? "border-red-200 text-red-600" : "border-slate-200 text-[#64748B]"}`}>
            {text}
        </div>;
}
export {
  StudentFinalExamResult as default
};
