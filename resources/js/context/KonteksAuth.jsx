import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../utils/auth';

const AuthContext = createContext({
    user: null,
    loading: true,
    refreshUser: async () => null,
});

export function AuthProvider({ children }) {
    const storedAuth = getStoredAuth();
    const [user, setUser] = useState(storedAuth?.user ?? null);
    const [loading, setLoading] = useState(Boolean(storedAuth?.isAuthenticated));

    const refreshUser = async () => {
        if (!getStoredAuth()?.isAuthenticated) {
            setUser(null);
            setLoading(false);
            return null;
        }

        try {
            setLoading(true);
            const { data } = await axios.get('/api/user');
            setUser(data);
            setStoredAuth({
                isAuthenticated: true,
                token: getStoredAuth()?.token ?? null,
                role: data.role,
                user: data,
            });

            return data;
        } catch (error) {
            if ([401, 403].includes(error.response?.status)) {
                clearStoredAuth();
                setUser(null);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            refreshUser,
        }),
        [user, loading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
