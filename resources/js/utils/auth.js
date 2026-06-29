import axios from 'axios';

const AUTH_STORAGE_KEY = 'smkn5-coder-auth';
const LEGACY_AUTH_KEYS = ['token', 'user', 'user_id', 'role'];

export function getStoredAuth() {
    try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setStoredAuth(payload) {
    clearStoredAuth();
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));

    if (payload?.token) {
        window.localStorage.setItem('token', payload.token);
    }

    if (payload?.user) {
        window.localStorage.setItem('user', JSON.stringify(payload.user));
        window.localStorage.setItem('user_id', String(payload.user.id));
    }

    if (payload?.role) {
        window.localStorage.setItem('role', payload.role);
    }
}

export function clearStoredAuth() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    LEGACY_AUTH_KEYS.forEach((key) => window.localStorage.removeItem(key));
}

export async function logoutUser() {
    try {
        await axios.post('/api/logout');
    } catch {
        // Ignore API logout failures so the UI can still recover locally.
    } finally {
        clearStoredAuth();
        window.location.href = '/login';
    }
}

export function isTeacherRoute(pathname) {
    return (
        pathname === '/guru/dashboard' ||
        pathname.startsWith('/guru/') ||
        pathname === '/dashboard-guru' ||
        pathname.startsWith('/dashboard-guru/')
    );
}

export function isStudentRoute(pathname) {
    return (
        pathname === '/siswa/dashboard' ||
        pathname.startsWith('/siswa/') ||
        pathname === '/student/dashboard' ||
        pathname.startsWith('/student/')
    );
}

export function getRedirectByRole(role) {
    return role === 'guru' ? '/guru/dashboard' : '/siswa/dashboard';
}
