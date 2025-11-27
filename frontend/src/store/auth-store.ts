'use client';

import { create } from 'zustand';
import { LoginResponse } from '@/src/types/auth.types';

interface AuthState {
    token: string | null;
    user: LoginResponse['usuario'] | null;
    isAuthenticated: boolean;
    login: (response: LoginResponse) => void;
    logout: () => void;
}

const getStoredAuth = () => {
    if (globalThis.window === undefined) {
        return { token: null, user: null };
    }

    const storedToken = globalThis.window.localStorage.getItem('auth_token');
    const storedUser = globalThis.window.localStorage.getItem('auth_user');

    return {
        token: storedToken,
        user: storedUser ? JSON.parse(storedUser) : null,
    };
};

export const useAuthStore = create<AuthState>((set) => {
    const stored = getStoredAuth();

    return {
        token: stored.token,
        user: stored.user,
        isAuthenticated: !!stored.token,
        login: (response: LoginResponse) => {
            if (globalThis.window !== undefined) {
                globalThis.window.localStorage.setItem('auth_token', response.access_token);
                globalThis.window.localStorage.setItem('auth_user', JSON.stringify(response.usuario));
            }
            set({
                token: response.access_token,
                user: response.usuario,
                isAuthenticated: true,
            });
        },
        logout: () => {
            if (globalThis.window !== undefined) {
                globalThis.window.localStorage.removeItem('auth_token');
                globalThis.window.localStorage.removeItem('auth_user');
            }
            set({
                token: null,
                user: null,
                isAuthenticated: false,
            });
        },
    };
});

