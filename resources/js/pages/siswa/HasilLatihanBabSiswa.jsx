import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { studentService } from "../../services/layananSiswa";

function StudentExerciseResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResult = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const response = await studentService.getExerciseAttempts(id);
        setPayload(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat hasil latihan.");
      } finally {
        setLoading(false);
      }
    };
    void loadResult();
  }, [id]);

  const latestAttempt = payload?.attempts?.[0];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans text-slate-900">
      {loading ? (
        <StatusCard text="Memuat data..." />
      ) : error ? (
        <StatusCard text={error} danger />
      ) : !latestAttempt ? (
        <StatusCard text="Belum ada riwayat pengerjaan latihan." />
      ) : (
        <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CheckCircle size={32} />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">Hasil Latihan Otomatis</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Nilai dihitung otomatis berdasarkan kunci jawaban pilihan ganda.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Nilai Terakhir" value={String(payload.lastScore ?? latestAttempt.score)} />
            <Metric label="Nilai Tertinggi" value={String(payload.highestScore ?? latestAttempt.score)} />
            <Metric label="Percobaan" value={String(payload.attemptCount ?? 1)} />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">
            <p className="text-sm font-bold text-slate-500">Percobaan Terbaru</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoLine label="Jumlah Benar" value={String(latestAttempt.correctAnswers)} />
              <InfoLine label="Jumlah Salah" value={String(latestAttempt.wrongAnswers)} />
              <InfoLine label="Nilai" value={String(latestAttempt.score)} />
              <InfoLine label="Tanggal" value={latestAttempt.submittedAt} />
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button type="button" onClick={() => navigate(`/siswa/latihan-bab/${id}`)} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
              Kerjakan Lagi
            </button>
            <button type="button" onClick={() => navigate("/siswa/latihan-bab")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50">
              Kembali ke Latihan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-blue-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-blue-700">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-slate-900">{value || "-"}</p>
    </div>
  );
}

function StatusCard({ text, danger = false }) {
  return (
    <div className={`w-full max-w-xl rounded-2xl border bg-white p-6 text-center text-sm font-semibold shadow-sm ${danger ? "border-red-200 text-red-600" : "border-slate-200 text-slate-500"}`}>
      {text}
    </div>
  );
}

export {
  StudentExerciseResult as default
};
