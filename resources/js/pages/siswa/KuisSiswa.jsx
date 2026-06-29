import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import LockedContentCard from '../../components/student/LockedContentCard';

function getMaterialIdFromPath() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const materialIndex = segments.findIndex((segment) => segment === 'materi');
    return materialIndex >= 0 ? segments[materialIndex + 1] : null;
}

export default function KuisSiswa() {
    const materialId = useMemo(() => getMaterialIdFromPath(), []);
    const [payload, setPayload] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const { data } = await axios.get(`/api/student/materials/${materialId}/quiz`);
                setPayload(data);
            } catch (error) {
                setMessage(error.response?.data?.message ?? 'Quiz akhir belum dapat dimuat.');
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [materialId]);

    const handleSelect = (questionId, optionKey) => {
        setAnswers((current) => ({
            ...current,
            [questionId]: optionKey,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const formattedAnswers = Object.entries(answers).map(([question_id, answer]) => ({
                question_id: Number(question_id),
                answer,
            }));

            const { data } = await axios.post(`/api/student/materials/${materialId}/quiz/submit`, {
                answers: formattedAnswers,
            });

            setResult(data.result);
            setMessage(data.message);
            setPayload((current) =>
                current
                    ? {
                        ...current,
                        material: data.material,
                        progress: data.progress,
                        quiz: {
                            ...current.quiz,
                            ...data.quiz,
                        },
                    }
                    : current,
            );
        } catch (error) {
            setMessage(error.response?.data?.message ?? 'Quiz akhir gagal dikirim.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="h-96 animate-pulse rounded-[2rem] bg-white dark:bg-slate-900" />;
    }

    if (!payload) {
        return (
            <LockedContentCard
                title="Quiz Akhir Masih Terkunci"
                message={message || 'Selesaikan semua BAB dan latihan wajib untuk membuka quiz akhir.'}
                actionHref={`/siswa/materi/${materialId}`}
                actionLabel="Kembali ke Materi"
            />
        );
    }

    const canSubmit = payload.quiz.questions.length > 0
        && Object.keys(answers).length === payload.quiz.questions.length;

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                            {payload.material.title}
                        </p>
                        <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            {payload.quiz.title}
                        </h3>
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Quiz akhir terbuka karena semua BAB dan latihan wajib pada materi ini sudah selesai.
                        </p>
                    </div>
                    <a
                        href={`/siswa/materi/${payload.material.id}`}
                        className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold text-primary"
                    >
                        Kembali ke Detail Materi
                    </a>
                </div>
            </section>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {payload.quiz.questions.map((question, index) => (
                    <section
                        key={question.id}
                        className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm dark:bg-slate-900"
                    >
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                            Soal {index + 1}
                        </p>
                        <h4 className="mt-3 text-lg font-bold leading-8 text-slate-800 dark:text-slate-100">
                            {question.question}
                        </h4>

                        <div className="mt-5 grid gap-3">
                            {question.options.map((option) => {
                                const isSelected = answers[question.id] === option.key;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => handleSelect(question.id, option.key)}
                                        className={`flex items-center gap-3 rounded-[1.25rem] border px-4 py-4 text-left text-sm transition-all ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-primary/10 bg-background-light hover:border-primary/30 hover:bg-primary/5 dark:bg-slate-950'
                                        }`}
                                    >
                                        <span
                                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                                isSelected
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white text-slate-500 dark:bg-slate-900'
                                            }`}
                                        >
                                            {option.key}
                                        </span>
                                        <span>{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {message ? (
                    <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {message}
                    </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Nilai minimal kelulusan quiz akhir adalah 75.
                    </p>
                    <button
                        type="submit"
                        disabled={isSubmitting || !canSubmit}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-base">task_alt</span>
                        {isSubmitting ? 'Memeriksa Quiz...' : 'Kirim Quiz Akhir'}
                    </button>
                </div>
            </form>

            {result ? (
                <section className="rounded-[2rem] border border-primary/10 bg-slate-900 p-8 shadow-sm">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Hasil Quiz Akhir</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl bg-white/5 p-5">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Skor</p>
                            <p className="mt-2 text-3xl font-black text-white">{result.score}</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-5">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Benar</p>
                            <p className="mt-2 text-3xl font-black text-white">{result.correct_answers}</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-5">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total Soal</p>
                            <p className="mt-2 text-3xl font-black text-white">{result.total_questions}</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-5">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</p>
                            <p className={`mt-2 text-xl font-black ${result.passed ? 'text-blue-400' : 'text-amber-300'}`}>
                                {result.passed ? 'Lulus' : 'Belum Lulus'}
                            </p>
                        </div>
                    </div>

                    {result.passed ? (
                        <a
                            href={`/siswa/materi/${payload.material.id}`}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white"
                        >
                            <span className="material-symbols-outlined text-sm">task_alt</span>
                            Lihat Progress Materi
                        </a>
                    ) : null}

                    <div className="mt-6 space-y-3 text-sm text-slate-300">
                        {result.review.map((item, index) => (
                            <div key={item.question_id} className="rounded-2xl bg-white/5 p-4">
                                <p className="font-semibold">Soal {index + 1}</p>
                                <p className="mt-1">
                                    Jawaban Anda: <span className="font-bold">{item.selected_answer || '-'}</span>
                                </p>
                                <p>
                                    Kunci: <span className="font-bold">{item.correct_answer}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
