'use client';

import { create } from 'zustand';
import { LoginResponse } from '@/src/types/auth.types';

interface AuthState {
    token: string | null;
    user: LoginResponse['user'] | null;
    isAuthenticated: boolean;
    login: (response: LoginResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
    // Inicializar desde localStorage si existe
    if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            // Intentar obtener user del localStorage si existe
            const storedUser = localStorage.getItem('auth_user');
            return {
                token: storedToken,
                user: storedUser ? JSON.parse(storedUser) : null,
                isAuthenticated: !!storedToken,
                login: (response: LoginResponse) => {
                    localStorage.setItem('auth_token', response.access_token);
                    localStorage.setItem('auth_user', JSON.stringify(response.user));
                    set({
                        token: response.access_token,
                        user: response.user,
                        isAuthenticated: true,
                    });
                },
                logout: () => {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    set({
                        token: null,
                        user: null,
                        isAuthenticated: false,
                    });
                },
            };
        }
    }

    return {
        token: null,
        user: null,
        isAuthenticated: false,
        login: (response: LoginResponse) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.access_token);
                localStorage.setItem('auth_user', JSON.stringify(response.user));
            }
            set({
                token: response.access_token,
                user: response.user,
                isAuthenticated: true,
            });
        },
        logout: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
            set({
                token: null,
                user: null,
                isAuthenticated: false,
            });
        },
    };
});

