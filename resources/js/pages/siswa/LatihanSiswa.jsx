import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import LockedContentCard from '../../components/student/LockedContentCard';

function getChapterIdFromPath() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const chapterIndex = segments.findIndex((segment) => segment === 'bab');
    return chapterIndex >= 0 ? segments[chapterIndex + 1] : null;
}

export default function LatihanSiswa() {
    const chapterId = useMemo(() => getChapterIdFromPath(), []);
    const [payload, setPayload] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadExercise = async () => {
            try {
                const { data } = await axios.get(`/api/student/chapters/${chapterId}/exercises`);
                setPayload(data);
            } catch (error) {
                setMessage(error.response?.data?.message ?? 'Latihan belum dapat dimuat.');
            } finally {
                setLoading(false);
            }
        };

        loadExercise();
    }, [chapterId]);

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

            const { data } = await axios.post(`/api/student/chapters/${chapterId}/exercises/submit`, {
                answers: formattedAnswers,
            });

            setResult(data.result);
            setMessage(data.message);
            setPayload((current) =>
                current
                    ? {
                        ...current,
                        material: data.material,
                        chapter: data.chapter,
                        progress: data.progress,
                        quiz: data.quiz,
                        exercise: {
                            ...current.exercise,
                            status: data.chapter.exercise.status,
                            score: data.chapter.exercise.score,
                        },
                    }
                    : current,
            );
        } catch (error) {
            setMessage(error.response?.data?.message ?? 'Jawaban gagal dikirim.');
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
                title="Latihan Masih Terkunci"
                message={message || 'Selesaikan BAB ini terlebih dahulu untuk membuka latihan.'}
                actionHref={`/siswa/bab/${chapterId}`}
                actionLabel="Kembali ke BAB"
            />
        );
    }

    const canSubmit = payload.exercise.questions.length > 0
        && Object.keys(answers).length === payload.exercise.questions.length;

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                            {payload.material.title}
                        </p>
                        <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            {payload.exercise.title}
                        </h3>
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            {payload.exercise.instruction}
                        </p>
                    </div>
                    <a
                        href={`/siswa/bab/${payload.chapter.id}`}
                        className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold text-primary"
                    >
                        Kembali ke Detail BAB
                    </a>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <form
                    className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm dark:bg-slate-900"
                    onSubmit={handleSubmit}
                >
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        {payload.exercise.questions.length} Soal Latihan
                    </p>

                    <div className="mt-6 space-y-5">
                        {payload.exercise.questions.map((question, index) => (
                            <div key={question.id} className="rounded-[1.5rem] border border-primary/10 p-5">
                                <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
                                    Soal {index + 1}
                                </p>
                                <p className="mt-2 text-base font-semibold leading-8 text-slate-800 dark:text-slate-100">
                                    {question.question}
                                </p>
                                <div className="mt-4 grid gap-3">
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
                            </div>
                        ))}
                    </div>

                    {message ? (
                        <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {message}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting || !canSubmit}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-base">send</span>
                        {isSubmitting ? 'Memeriksa Jawaban...' : 'Kirim Jawaban'}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-primary/10 bg-slate-900 p-6 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Panduan</p>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                            <li>Latihan terbuka setelah BAB ditandai selesai.</li>
                            <li>Nilai minimal untuk membuka tahap berikutnya adalah 80.</li>
                            <li>Latihan dapat diulang jika nilai belum memenuhi batas.</li>
                        </ul>
                    </div>

                    <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Progress Latihan</p>
                        <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                            <p>
                                Status:{' '}
                                <span className={payload.chapter.exercise.is_completed ? 'font-bold text-blue-600' : 'font-bold text-amber-600'}>
                                    {payload.chapter.exercise.status_label}
                                </span>
                            </p>
                            <p>Nilai terakhir: {payload.chapter.exercise.score ?? 0}</p>
                        </div>
                    </div>

                    {result ? (
                        <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Hasil Latihan</p>
                            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <p>
                                    Status:{' '}
                                    <span className={result.passed ? 'font-bold text-blue-600' : 'font-bold text-amber-600'}>
                                        {result.passed ? 'Lulus' : 'Belum Lulus'}
                                    </span>
                                </p>
                                <p>Nilai: {result.score}</p>
                                <p>Jawaban benar: {result.correct_answers} / {result.total_questions}</p>
                            </div>

                            {result.passed ? (
                                <div className="mt-5 flex flex-wrap gap-3">
                                    {payload.progress.current_chapter_id ? (
                                        <a
                                            href={`/siswa/bab/${payload.progress.current_chapter_id}`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white"
                                        >
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            Lanjut BAB Berikutnya
                                        </a>
                                    ) : payload.quiz && !payload.quiz.is_locked ? (
                                        <a
                                            href={`/siswa/materi/${payload.material.id}/quiz`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white"
                                        >
                                            <span className="material-symbols-outlined text-sm">quiz</span>
                                            Buka Quiz Akhir
                                        </a>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className="mt-5 space-y-3">
                                {result.review.map((item, index) => (
                                    <div key={item.question_id} className="rounded-2xl bg-background-light p-4 text-xs dark:bg-slate-950">
                                        <p className="font-bold text-slate-700 dark:text-slate-200">Soal {index + 1}</p>
                                        <p className="mt-1 text-slate-500 dark:text-slate-400">
                                            Jawaban Anda: <span className="font-semibold">{item.selected_answer ?? '-'}</span>
                                        </p>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Kunci: <span className="font-semibold">{item.correct_answer}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
