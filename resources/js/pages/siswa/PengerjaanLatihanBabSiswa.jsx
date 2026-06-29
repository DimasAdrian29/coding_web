import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BarChart3, CheckCircle, FileText, Send, Trophy } from "lucide-react";
import { studentService } from "../../services/layananSiswa";
import QuestionTextBlock from "../../components/siswa/QuestionTextBlock";

function StudentExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [access, setAccess] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadExercise = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const response = await studentService.getExerciseDetail(id);
      setExercise(response.exercise);
      setAccess(response.access);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat latihan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadExercise();
  }, [id]);

  const answeredCount = useMemo(() => {
    if (!exercise) return 0;
    return exercise.questions.filter((question) => Boolean(answers[question.id])).length;
  }, [answers, exercise]);

  const totalQuestions = exercise?.questions.length ?? 0;
  const canSubmit = totalQuestions > 0 && answeredCount === totalQuestions;
  const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const submitAnswers = async () => {
    if (!id || !exercise || !canSubmit) return;
    setSubmitting(true);
    try {
      const response = await studentService.submitExercise(id, {
        answers: exercise.questions.map((question) => ({
          question_id: question.id,
          selected_option: answers[question.id]
        }))
      });
      setResult(response);
      setAnswers({});
      await loadExercise();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      window.alert(submitError instanceof Error ? submitError.message : "Gagal mengumpulkan jawaban.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 font-sans text-slate-900 sm:px-6 lg:px-8 lg:py-8">
      <main className="mx-auto max-w-6xl space-y-6">
        <button
          type="button"
          onClick={() => navigate("/siswa/latihan-bab")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
        >
          <ArrowLeft size={18} />
          Kembali ke Latihan
        </button>

        {loading ? (
          <StateCard text="Memuat data..." />
        ) : error ? (
          <StateCard text={error} danger />
        ) : !exercise ? (
          <StateCard text="Latihan tidak ditemukan." />
        ) : access && !access.unlocked ? (
          <StateCard text={access.reason ?? "Latihan belum terbuka. Selesaikan materi bab ini terlebih dahulu."} />
        ) : (
          <>
            <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-blue-600">{exercise.materialTitle ?? "Materi"} - {exercise.chapterTitle ?? "Bab"}</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-normal text-slate-900">{exercise.title}</h1>
              <p className="mt-2 text-sm font-medium text-slate-500">{exercise.description || "Kerjakan semua soal pilihan ganda berikut."}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <SummaryCard icon={<FileText size={18} />} label="Jumlah Soal" value={String(totalQuestions)} />
                <SummaryCard icon={<BarChart3 size={18} />} label="Nilai Terakhir" value={String(exercise.lastScore ?? "-")} />
                <SummaryCard icon={<Trophy size={18} />} label="Nilai Tertinggi" value={String(exercise.highestScore ?? "-")} />
                <SummaryCard icon={<CheckCircle size={18} />} label="Percobaan" value={String(exercise.attemptCount ?? 0)} />
              </div>
            </header>

            {result ? <ResultCard result={result} onNavigate={navigate} /> : null}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <section className="space-y-5">
                {exercise.questions.length === 0 ? (
                  <StateCard text="Belum ada soal pada latihan ini." />
                ) : (
                  exercise.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      index={index}
                      question={question}
                      selected={answers[question.id]}
                      onSelect={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                    />
                  ))
                )}
              </section>

              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                <h2 className="text-lg font-extrabold text-slate-900">Ringkasan</h2>
                <div className="mt-5 space-y-3 text-sm font-semibold text-slate-500">
                  <SummaryLine label="Total Soal" value={String(totalQuestions)} />
                  <SummaryLine label="Sudah Dijawab" value={String(answeredCount)} />
                  <SummaryLine label="Belum Dijawab" value={String(Math.max(totalQuestions - answeredCount, 0))} />
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
                </div>
                <button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={() => void submitAnswers()}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={17} />
                  {submitting ? "Mengirim..." : "Submit Latihan"}
                </button>
              </aside>
            </div>

            <AttemptHistory attempts={exercise.attempts ?? []} />
          </>
        )}
      </main>
    </div>
  );
}

function ResultCard({ result, onNavigate }) {
  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-800">
      <h2 className="text-xl font-extrabold">Hasil Latihan</h2>
      <p className="mt-2 text-sm font-semibold">
        Latihan selesai. Nilai otomatis sudah tersimpan.
        {result.next_chapter_id ? " Bab berikutnya telah terbuka." : ""}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ResultMetric label="Nilai" value={String(result.score ?? "-")} />
        <ResultMetric label="Jawaban Benar" value={String(result.correctAnswers ?? 0)} />
        <ResultMetric label="Jawaban Salah" value={String(result.wrongAnswers ?? 0)} />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {result.next_chapter_id ? (
          <button
            type="button"
            onClick={() => onNavigate(`/siswa/materi/${result.next_chapter_id}`)}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Lanjut ke Bab Berikutnya
          </button>
        ) : null}
        {result.final_exam_unlocked ? (
          <button
            type="button"
            onClick={() => onNavigate("/siswa/latihan-akhir")}
            className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
          >
            Lanjut ke Latihan Akhir
          </button>
        ) : null}
      </div>
    </section>
  );
}

function ResultMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-white/80 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-blue-800">{value}</p>
    </div>
  );
}

function QuestionCard({ index, question, selected, onSelect }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-blue-600">Soal {index + 1}</p>
      <QuestionTextBlock text={question.questionText} className="mt-3" />
      <div className="mt-5 grid gap-3">
        {(question.options ?? []).map((option) => (
          <label
            key={option.key}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold transition ${selected === option.key ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.key}
              checked={selected === option.key}
              onChange={() => onSelect(option.key)}
              className="size-4 border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-current font-extrabold">{option.key}</span>
            <span>{option.text}</span>
          </label>
        ))}
      </div>
    </article>
  );
}

function AttemptHistory({ attempts }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-extrabold text-slate-900">Riwayat Pengerjaan</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Urutan dari percobaan terbaru ke yang paling lama.</p>
      </div>
      {attempts.length === 0 ? (
        <div className="p-6 text-sm font-semibold text-slate-500">Belum ada riwayat pengerjaan.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["Percobaan", "Tanggal Pengerjaan", "Jumlah Benar", "Jumlah Salah", "Nilai"].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-slate-50">
                  <td className="px-6 py-5 text-sm font-bold text-slate-900">Percobaan {attempt.attemptNumber}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600">{attempt.submittedAt}</td>
                  <td className="px-6 py-5 text-sm font-bold text-blue-700">{attempt.correctAnswers}</td>
                  <td className="px-6 py-5 text-sm font-bold text-red-600">{attempt.wrongAnswers}</td>
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-700">{attempt.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-blue-600">{icon}<span className="text-xs font-bold uppercase tracking-wide">{label}</span></div>
      <p className="mt-2 text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-extrabold text-slate-900">{value}</span>
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
  StudentExerciseDetail as default
};
