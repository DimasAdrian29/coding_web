import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import LockedContentCard from '../../components/student/LockedContentCard';

function getChapterIdFromPath() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const chapterIndex = segments.findIndex((segment) => segment === 'bab');
    return chapterIndex >= 0 ? segments[chapterIndex + 1] : null;
}

export default function BabSiswa() {
    const chapterId = useMemo(() => getChapterIdFromPath(), []);
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadChapter = async () => {
            try {
                const { data } = await axios.get(`/api/student/chapters/${chapterId}`);
                setPayload(data.data ?? data);
            } catch (error) {
                setMessage(error.response?.data?.message ?? 'BAB belum dapat dimuat.');
            } finally {
                setLoading(false);
            }
        };

        loadChapter();
    }, [chapterId]);

    const handleComplete = async () => {
        setIsSubmitting(true);
        setMessage('');

        try {
            const { data } = await axios.post(`/api/siswa/bab/${chapterId}/selesai`);
            const responsePayload = data.data ?? data;
            setPayload((current) =>
                current
                    ? {
                        ...current,
                        material: responsePayload.material ?? current.material,
                        progress: responsePayload.progress ?? current.progress,
                        chapter: responsePayload.chapter ?? current.chapter,
                        quiz: responsePayload.quiz ?? current.quiz,
                    }
                    : current,
            );
            setMessage(data.message);
        } catch (error) {
            setMessage(error.response?.data?.message ?? 'Gagal menyelesaikan BAB.');
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
                title="BAB Belum Bisa Dibuka"
                message={message || 'Selesaikan tahapan sebelumnya untuk membuka BAB ini.'}
                actionHref="/siswa/dashboard"
                actionLabel="Ke Beranda Siswa"
            />
        );
    }

    const { chapter } = payload;
    const exercise = chapter.exercise ?? {};
    const canOpenExercise = exercise.is_required && !exercise.is_locked;

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm dark:bg-slate-900">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                            {payload.material.title}
                        </p>
                        <h3 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            {chapter.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                                BAB {String(chapter.chapter_order).padStart(2, '0')}
                            </span>
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                                {chapter.status_label}
                            </span>
                        </div>
                    </div>
                    <a
                        href={`/siswa/materi/${payload.material.id}`}
                        className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold text-primary"
                    >
                        Kembali ke Daftar BAB
                    </a>
                </div>

                <div className="rounded-[1.75rem] bg-background-light p-6 dark:bg-slate-950">
                    <p className="whitespace-pre-line text-sm leading-8 text-slate-700 dark:text-slate-300">
                        {chapter.content || 'Isi BAB belum tersedia.'}
                    </p>
                </div>
            </section>

            <CodeExampleSection chapter={chapter} />

            <section className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
                <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        Alur BAB Ini
                    </p>
                    <div className="mt-5 grid gap-4">
                        <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
                            <span className="material-symbols-outlined text-primary">
                                {chapter.is_completed ? 'task_alt' : 'menu_book'}
                            </span>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Pelajari BAB</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {chapter.is_completed ? 'Selesai' : 'Baca materi lalu tandai selesai.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <span className="material-symbols-outlined text-slate-500">
                                {exercise.is_locked ? 'lock' : exercise.is_completed ? 'task_alt' : 'assignment'}
                            </span>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Latihan BAB</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {exercise.is_required ? exercise.status_label : 'Tidak ada latihan wajib pada BAB ini.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div
                        className={`rounded-[2rem] border p-6 shadow-sm ${
                            exercise.is_locked
                                ? 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900'
                                : 'border-primary/10 bg-white dark:bg-slate-900'
                        }`}
                    >
                        <p className="text-sm font-bold">Latihan</p>
                        <p className="mt-2 text-sm">
                            {exercise.is_required
                                ? `${exercise.question_count} soal pilihan ganda`
                                : 'BAB ini tidak memiliki latihan wajib.'}
                        </p>
                        <p className="mt-3 text-xs font-medium">
                            {exercise.is_locked
                                ? 'Terkunci sampai BAB ini ditandai selesai.'
                                : exercise.is_completed
                                    ? 'Latihan sudah selesai dan BAB berikutnya terbuka.'
                                    : 'Latihan sudah terbuka. Raih nilai minimal 80.'}
                        </p>
                        {exercise.score !== null && exercise.score !== undefined ? (
                            <p className="mt-3 text-xs font-bold text-primary">Nilai terakhir: {exercise.score}</p>
                        ) : null}
                        {canOpenExercise ? (
                            <a
                                href={`/siswa/bab/${chapter.id}/latihan`}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primary/20"
                            >
                                <span className="material-symbols-outlined text-sm">play_arrow</span>
                                Mulai Latihan
                            </a>
                        ) : null}
                    </div>

                    {message ? (
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                            {message}
                        </div>
                    ) : null}

                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={chapter.is_completed || isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-base">task_alt</span>
                        {chapter.is_completed
                            ? 'BAB Sudah Selesai'
                            : isSubmitting
                                ? 'Menyimpan Progress...'
                                : 'Tandai BAB Selesai'}
                    </button>
                </div>
            </section>
        </div>
    );
}
function CodeExampleSection({ chapter }) {
    const title = chapter.judulContohKode ?? chapter.judul_contoh_kode ?? '';
    const language = chapter.bahasaPemrograman ?? chapter.bahasa_pemrograman ?? '';
    const code = chapter.contohKode ?? chapter.contoh_kode ?? chapter.codeExample ?? '';
    const explanation = chapter.penjelasanKode ?? chapter.penjelasan_kode ?? '';
    const hasCodeExample = [title, language, code, explanation].some((value) => String(value ?? '').trim() !== '');

    if (!hasCodeExample) return null;

    return (
        <section className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm dark:bg-slate-900">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {title || 'Contoh Kode Program'}
            </h3>
            {language ? (
                <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    Bahasa : {language}
                </p>
            ) : null}
            {code ? (
                <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-blue-50 shadow-inner">
                    <code className="font-mono">{code}</code>
                </pre>
            ) : null}
            {explanation ? (
                <div className="mt-5">
                    <p className="text-sm font-black text-slate-900 dark:text-white">Penjelasan:</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                        {explanation}
                    </p>
                </div>
            ) : null}
        </section>
    );
}
