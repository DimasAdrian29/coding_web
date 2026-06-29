import axios from 'axios';
import { useMemo, useState } from 'react';
import logoSmk5 from '../../assets/images/logo-smk5.jfif';
import { getRedirectByRole, setStoredAuth } from '../../utils/auth';

const onlyNumbers = (value) => value.replace(/\D/g, '');
const schoolBackgroundUrl = 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAG2VMzDXveh3nK46Ze5AAShtZtkKBgN-op4xIeq2etZa8jqzEPS35AzsyYGxdCCJuhoIXnXQ_IjXAgIXyCumOssvgtSDHp9_WS4btjo70BI1SAN0XObwd1zz89wKZZArbgaIpL-=s1360-w1360-h1020-rw';

export default function LoginPage() {
    const initialRole = useMemo(() => {
        const role = new URLSearchParams(window.location.search).get('role');
        return role === 'guru' ? 'guru' : 'siswa';
    }, []);

    const [formData, setFormData] = useState({
        role: initialRole,
        nisn: '',
        nip: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: ['nisn', 'nip'].includes(name) ? onlyNumbers(value) : value,
        }));
    };

    const handleRoleChange = (role) => {
        setFormData((current) => ({
            ...current,
            role,
            nisn: '',
            nip: '',
            password: '',
        }));
        setErrors({});
        setMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setMessage('');

        try {
            const payload =
                formData.role === 'siswa'
                    ? {
                        role: 'siswa',
                        nisn: formData.nisn,
                        password: formData.password,
                    }
                    : {
                        role: 'guru',
                        nip: formData.nip,
                        password: formData.password,
                    };

            const { data } = await axios.post('/api/login', payload);
            const authData = data.data ?? data;
            const user = authData.user;

            setStoredAuth({
                isAuthenticated: true,
                token: authData.token ?? null,
                role: user.role,
                user,
            });

            window.location.href = data.redirect ?? getRedirectByRole(user.role);
        } catch (error) {
            setMessage(error.response?.data?.message ?? 'Login gagal. Silakan coba lagi.');
            setErrors(error.response?.data?.errors ?? {});
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStudent = formData.role === 'siswa';

    return (
        <main
            className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8 text-slate-900"
            style={{ backgroundImage: `url('${schoolBackgroundUrl}')` }}
        >
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-blue-50/35" />

            <section className="relative z-10 w-full max-w-md rounded-3xl border border-blue-100 bg-white p-7 shadow-xl shadow-slate-900/15 sm:p-8">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-white p-2 shadow-sm">
                        <img
                            src={logoSmk5}
                            alt="Logo SMK Negeri 5 Pekanbaru"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <h1 className="text-xl font-extrabold text-slate-900">
                        SMK Negeri 5 Pekanbaru
                    </h1>
                    <p className="mt-2 text-sm font-semibold text-blue-600">
                        Media Pembelajaran Coding Berbasis Web
                    </p>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                        Platform pembelajaran coding berbasis web yang membantu siswa mempelajari materi,
                        mengerjakan latihan, dan memantau hasil belajar secara mandiri.
                    </p>
                </div>

                <div className="my-7 border-t border-slate-200" />

                <div className="mb-6 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleRoleChange('guru')}
                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            formData.role === 'guru'
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                    >
                        Login Guru
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleChange('siswa')}
                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            formData.role === 'siswa'
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                    >
                        Login Siswa
                    </button>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">
                            {isStudent ? 'NISN' : 'NIP'}
                        </span>
                        <input
                            name={isStudent ? 'nisn' : 'nip'}
                            type="text"
                            value={isStudent ? formData.nisn : formData.nip}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            autoComplete="username"
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                        {isStudent && errors.nisn?.[0] ? (
                            <p className="text-xs font-medium text-red-600">{errors.nisn[0]}</p>
                        ) : null}
                        {!isStudent && errors.nip?.[0] ? (
                            <p className="text-xs font-medium text-red-600">{errors.nip[0]}</p>
                        ) : null}
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Password</span>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            autoComplete="current-password"
                        />
                        {errors.password?.[0] ? (
                            <p className="text-xs font-medium text-red-600">{errors.password[0]}</p>
                        ) : null}
                    </label>

                    {message ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {message}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Memproses...' : 'Masuk'}
                    </button>

                    {isStudent ? (
                        <p className="text-center text-sm text-slate-500">
                            Belum memiliki akun?{' '}
                            <a href="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                Daftar Sekarang
                            </a>
                        </p>
                    ) : null}
                </form>
            </section>
        </main>
    );
}
