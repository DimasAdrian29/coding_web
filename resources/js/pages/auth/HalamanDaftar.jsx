import axios from 'axios';
import { useState } from 'react';
import logoSmk5 from '../../assets/images/logo-smk5.jfif';
import { setStoredAuth } from '../../utils/auth';

const onlyNumbers = (value) => value.replace(/\D/g, '');
const schoolBackgroundUrl = 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAG2VMzDXveh3nK46Ze5AAShtZtkKBgN-op4xIeq2etZa8jqzEPS35AzsyYGxdCCJuhoIXnXQ_IjXAgIXyCumOssvgtSDHp9_WS4btjo70BI1SAN0XObwd1zz89wKZZArbgaIpL-=s1360-w1360-h1020-rw';

const initialForm = {
    name: '',
    nisn: '',
    password: '',
    password_confirmation: '',
};

function TextInput({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    autoComplete,
    inputMode,
    pattern,
}) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                autoComplete={autoComplete}
                inputMode={inputMode}
                pattern={pattern}
            />
            {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
        </label>
    );
}

export default function RegisterPage() {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: name === 'nisn' ? onlyNumbers(value) : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setMessage('');

        try {
            const { data } = await axios.post('/api/register-siswa', formData);
            const authData = data.data ?? data;
            const user = authData.user;

            setStoredAuth({
                isAuthenticated: true,
                token: authData.token ?? null,
                role: user.role,
                user,
            });

            window.location.href = data.redirect ?? '/siswa/dashboard';
        } catch (error) {
            setMessage(error.response?.data?.message ?? 'Registrasi gagal. Silakan coba lagi.');
            setErrors(error.response?.data?.errors ?? {});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main
            className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8 text-slate-900"
            style={{ backgroundImage: `url('${schoolBackgroundUrl}')` }}
        >
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-blue-50/35" />

            <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-blue-100 bg-white p-7 shadow-xl shadow-slate-900/15 sm:p-8">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-white p-2 shadow-sm">
                        <img
                            src={logoSmk5}
                            alt="Logo SMK Negeri 5 Pekanbaru"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <h1 className="text-xl font-extrabold text-slate-900">
                        Registrasi Siswa
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        SMK Negeri 5 Pekanbaru
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid gap-5 md:grid-cols-2">
                        <TextInput
                            label="Nama Lengkap"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name?.[0]}
                            autoComplete="name"
                        />
                        <TextInput
                            label="NISN"
                            name="nisn"
                            value={formData.nisn}
                            onChange={handleChange}
                            error={errors.nisn?.[0]}
                            autoComplete="username"
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                        <TextInput
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password?.[0]}
                            autoComplete="new-password"
                        />
                        <TextInput
                            label="Konfirmasi Password"
                            name="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            error={errors.password_confirmation?.[0]}
                            autoComplete="new-password"
                        />
                    </div>

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
                        {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Sudah memiliki akun?{' '}
                    <a href="/login?role=siswa" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        Login
                    </a>
                </p>
            </section>
        </main>
    );
}
