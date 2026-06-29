import axios from 'axios';
import { useEffect, useState } from 'react';
import ExerciseHeader from '../components/exercise/ExerciseHeader';
import ExerciseStats from '../components/exercise/ExerciseStats';

const logQuizAction = (label, payload = null) => {
    console.log(`[Teacher Quiz] ${label}`, payload);
};

export default function KelolaKuisGuru() {
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                const { data } = await axios.get('/api/guru/quizzes');
                setPayload(data);
            } catch (error) {
                console.error('failed-load-teacher-quizzes', error);
            } finally {
                setLoading(false);
            }
        };

        loadQuizzes();
    }, []);

    if (loading) {
        return <div className="m-8 h-96 animate-pulse rounded-[2rem] bg-white dark:bg-slate-900" />;
    }

    if (!payload) {
        return (
            <div className="m-8 rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-600">
                Gagal memuat data quiz.
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <ExerciseHeader
                title={payload.header.title}
                actionLabel={payload.header.actionLabel}
                onAdd={() => logQuizAction('add-quiz')}
            />

            <ExerciseStats items={payload.stats} />

            <section className="mb-8 overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm dark:bg-background-dark">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-primary/10 bg-primary/5">
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Judul Quiz
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Materi
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    BAB
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Jumlah Soal
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                            {payload.items.map((item) => (
                                <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                        {item.title}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {item.material}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {item.babTitle}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {item.questionCount} soal
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                item.status === 'Aktif'
                                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                                                    : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => logQuizAction('edit', item)}
                                                className="p-2 text-slate-400 transition-colors hover:text-primary"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => logQuizAction('delete', item)}
                                                className="p-2 text-slate-400 transition-colors hover:text-red-500"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {payload.preview ? (
                <section className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm dark:bg-slate-900">
                    <div className="mb-6">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Preview Quiz Siswa</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            {payload.preview.title}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {payload.preview.questions.map((question, index) => (
                            <div key={question.id} className="rounded-[1.5rem] border border-primary/10 p-5">
                                <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
                                    Soal {index + 1}
                                </p>
                                <p className="mt-2 text-base font-semibold leading-8 text-slate-800 dark:text-slate-100">
                                    {question.question}
                                </p>
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {question.options.map((option) => (
                                        <div
                                            key={option.key}
                                            className={`rounded-[1.25rem] border px-4 py-4 text-sm ${
                                                option.key === question.correct_answer
                                                    ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                                    : 'border-primary/10 bg-background-light dark:bg-slate-950'
                                            }`}
                                        >
                                            <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 dark:bg-slate-900">
                                                {option.key.toUpperCase()}
                                            </span>
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
