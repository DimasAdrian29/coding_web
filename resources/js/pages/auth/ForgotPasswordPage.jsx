import axios from 'axios';
import { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/auth/Button';
import InputField from '../../components/auth/InputField';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true);

        try {
            const { data } = await axios.post('/api/forgot-password', { email });
            setMessage(data.message);
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Gagal mengirim link reset password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Lupa Password"
            subtitle="Masukkan email akun Anda. Reset link akan dikirim ke email yang terdaftar untuk siswa maupun guru."
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Masukkan email akun"
                    icon="mail"
                    error={error}
                    autoComplete="email"
                />

                {message ? (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-600">
                        {message}
                    </div>
                ) : null}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    <span className="material-symbols-outlined text-sm">mark_email_read</span>
                    {isSubmitting ? 'Mengirim...' : 'Kirim Reset Link'}
                </Button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
                Kembali ke{' '}
                <a href="/login" className="font-bold text-primary hover:underline">
                    halaman login
                </a>
            </p>
        </AuthLayout>
    );
}
