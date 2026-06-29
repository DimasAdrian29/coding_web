import axios from 'axios';
import { useMemo, useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/auth/Button';
import InputField from '../../components/auth/InputField';

export default function ResetPasswordPage() {
    const token = useMemo(() => window.location.pathname.split('/').filter(Boolean).pop() ?? '', []);
    const email = useMemo(() => new URLSearchParams(window.location.search).get('email') ?? '', []);

    const [formData, setFormData] = useState({
        email,
        token,
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setMessage('');
        setIsSubmitting(true);

        try {
            const { data } = await axios.post('/api/reset-password', formData);
            setMessage(data.message);
            window.setTimeout(() => {
                window.location.href = data.redirect ?? '/login';
            }, 1200);
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
            setMessage(error.response?.data?.message ?? 'Reset password gagal.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Masukkan password baru untuk akun Anda, lalu login kembali ke sistem."
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email akun"
                    icon="mail"
                    error={errors.email?.[0]}
                />
                <InputField
                    label="Password Baru"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    icon="lock"
                    error={errors.password?.[0]}
                    autoComplete="new-password"
                />
                <InputField
                    label="Konfirmasi Password Baru"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Ulangi password baru"
                    icon="verified_user"
                    error={errors.password_confirmation?.[0]}
                    autoComplete="new-password"
                />

                {message ? (
                    <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                        {message}
                    </div>
                ) : null}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    <span className="material-symbols-outlined text-sm">password</span>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Password Baru'}
                </Button>
            </form>
        </AuthLayout>
    );
}
