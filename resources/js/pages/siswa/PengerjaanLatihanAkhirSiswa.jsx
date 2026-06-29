import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Send, Target } from "lucide-react";
import { studentService } from "../../services/layananSiswa";
import QuestionTextBlock from "../../components/siswa/QuestionTextBlock";
function StudentFinalExamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [access, setAccess] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [serverOffsetMs, setServerOffsetMs] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const autoSubmittedRef = useRef(false);
  const answersRef = useRef({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    const loadExam = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const response = await studentService.getFinalExamDetail(id);
        if (response.submitted) {
          navigate(`/siswa/latihan-akhir/${id}/hasil`);
          return;
        }
        setExam(response.exam);
        setAccess(response.access);
        setAttempt(response.attempt ?? null);
        if (response.serverNow) {
          setServerOffsetMs(new Date(response.serverNow).getTime() - Date.now());
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    void loadExam();
  }, [id, navigate]);

  useEffect(() => {
    if (!attempt?.expiresAt && !attempt?.expires_at) return;
    const expiresAt = new Date(attempt.expiresAt ?? attempt.expires_at).getTime();

    const tick = () => {
      const now = Date.now() + serverOffsetMs;
      setRemainingSeconds(Math.max(0, Math.ceil((expiresAt - now) / 1000)));
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [attempt, serverOffsetMs]);

  useEffect(() => {
    if (remainingSeconds !== 0 || autoSubmittedRef.current || !exam || !id) return;
    autoSubmittedRef.current = true;
    void submitAnswers("auto_timeout", true);
  }, [remainingSeconds, exam, id]);

  const answeredCount = useMemo(() => {
    if (!exam) return 0;
    return exam.questions.filter((question) => Boolean(answers[question.id])).length;
  }, [answers, exam]);
  const totalQuestions = exam?.questions.length ?? 0;
  const progress = totalQuestions > 0 ? Math.round(answeredCount / totalQuestions * 100) : 0;
  const canSubmit = totalQuestions > 0 && answeredCount === totalQuestions;
  const submitAnswers = async (method = "manual", force = false) => {
    if (!id || !exam) return;
    if (!force && !canSubmit) return;
    setSubmitting(true);
    try {
      await studentService.submitFinalExam(id, {
        duration_used_minutes: exam.durationMinutes ?? 0,
        attempt_id: attempt?.id,
        submit_method: method,
        answers: exam.questions.map((question) => ({
          question_id: question.id,
          selected_option: answersRef.current[question.id] ?? null
        }))
      });
      navigate(`/siswa/latihan-akhir/${id}/hasil`);
    } catch (submitError) {
      window.alert(submitError instanceof Error ? submitError.message : "Gagal mengumpulkan latihan akhir.");
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };
  return <div className="min-h-screen bg-slate-50 px-4 py-6 font-sans text-[#0F172A] sm:px-6 lg:px-8 lg:py-8">
            <main className="mx-auto max-w-6xl space-y-6">
                <button
    type="button"
    onClick={() => navigate("/siswa/latihan-akhir")}
    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#2563EB] shadow-sm transition hover:bg-[#EFF6FF]"
  >
                    <ArrowLeft size={18} />
                    Kembali ke Latihan Akhir
                </button>

                {loading ? <StateCard text="Memuat data..." /> : error ? <StateCard text="Gagal memuat data." danger /> : !exam ? <StateCard text="Latihan akhir tidak ditemukan." /> : access && !access.unlocked ? <StateCard text={access.reason ?? "Latihan akhir belum terbuka."} /> : <>
                        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                                    <Target size={24} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-3xl font-extrabold tracking-normal text-[#0F172A]">
                                        {exam.title}
                                    </h1>
                                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                                        {exam.description || "Pilih jawaban yang paling tepat untuk setiap soal."}
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Badge icon={<CheckCircle size={15} />} text={`${exam.questions.length} Soal`} />
                                        <Badge icon={<Clock size={15} />} text={`${exam.durationMinutes ?? "-"} Menit`} />
                                    </div>
                                </div>
                            </div>
                        </header>

                        <TimerCard remainingSeconds={remainingSeconds} />

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                            <section className="space-y-5">
                                {exam.questions.length === 0 ? <StateCard text="Belum ada soal pada latihan akhir ini." /> : exam.questions.map((question, index) => <QuestionCard
    key={question.id}
    index={index}
    question={question}
    selected={answers[question.id] ?? ""}
    onSelect={(questionId, value) => setAnswers((current) => ({ ...current, [questionId]: value }))}
  />)}
                            </section>

                            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                                <h2 className="text-lg font-extrabold text-[#0F172A]">Ringkasan</h2>
                                <div className="mt-5 space-y-3 text-sm font-semibold text-[#64748B]">
                                    <SummaryLine label="Total Soal" value={String(totalQuestions)} />
                                    <SummaryLine label="Sudah Dijawab" value={String(answeredCount)} />
                                    <SummaryLine label="Belum Dijawab" value={String(Math.max(totalQuestions - answeredCount, 0))} />
                                </div>
                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${progress}%` }} />
                                </div>
                                <button
    type="button"
    disabled={!canSubmit || submitting}
    onClick={() => setConfirmOpen(true)}
    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
  >
                                    <Send size={17} />
                                    Submit Latihan Akhir
                                </button>
                            </aside>
                        </div>
                    </>}
            </main>

            {confirmOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-xl font-extrabold text-[#0F172A]">Kumpulkan latihan akhir?</h3>
                        <p className="mt-2 text-sm leading-6 text-[#64748B]">
                            Jawaban akan dinilai otomatis oleh sistem setelah dikumpulkan.
                        </p>
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => setConfirmOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#0F172A] hover:bg-slate-50">
                                Batal
                            </button>
                            <button type="button" onClick={() => void submitAnswers("manual")} className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8]">
                                Ya, Kumpulkan
                            </button>
                        </div>
                    </div>
                </div> : null}
        </div>;
}

function TimerCard({ remainingSeconds }) {
  const seconds = Math.max(remainingSeconds ?? 0, 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remaining = seconds % 60;
  const display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  const danger = seconds <= 300;

  return <section className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-blue-700">Sisa Waktu</p>
                <p className={`text-2xl font-black tabular-nums ${danger ? "text-red-600" : "text-blue-700"}`}>
                    {remainingSeconds === null ? "--:--:--" : display}
                </p>
            </div>
        </section>;
}
function QuestionCard({ index, question, selected, onSelect }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-[#2563EB]">Soal {index + 1}</p>
            <QuestionTextBlock text={question.questionText} className="mt-3" />

            <div className="mt-5 grid gap-3">
                {question.options.map((option) => {
    const isSelected = selected === option.key;
    return <button
      key={option.key}
      type="button"
      onClick={() => onSelect(question.id, option.key)}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold transition ${isSelected ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-slate-200 bg-white text-[#334155] hover:bg-slate-50"}`}
    >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-current font-extrabold">
                                {option.key}
                            </span>
                            {option.text}
                        </button>;
  })}
            </div>
        </article>;
}
function Badge({ icon, text }) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">
            {icon}
            {text}
        </span>;
}
function SummaryLine({ label, value }) {
  return <div className="flex items-center justify-between">
            <span>{label}</span>
            <span className="font-extrabold text-[#0F172A]">{value}</span>
        </div>;
}
function StateCard({ text, danger = false }) {
  return <div className={`rounded-2xl border bg-white p-6 text-sm font-semibold shadow-sm ${danger ? "border-red-200 text-red-600" : "border-slate-200 text-[#64748B]"}`}>
            {text}
        </div>;
}
export {
  StudentFinalExamDetail as default
};
