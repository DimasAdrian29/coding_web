import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

function readStoredAuth() {
    try {
        const raw = window.localStorage.getItem('smkn5-coder-auth');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function readLegacyUser() {
    try {
        const raw = window.localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

const storedAuth = readStoredAuth();
const legacyUser = readLegacyUser();
const userId = window.localStorage.getItem('user_id') ?? storedAuth?.user?.id ?? legacyUser?.id;

if (userId) {
    window.axios.defaults.headers.common['X-User-Id'] = String(userId);
}
