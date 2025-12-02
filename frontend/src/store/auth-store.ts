'use client';

import { create } from 'zustand';
import { LoginResponse, EstadoUsuario, UsuarioAutenticado } from '@/src/types/auth.types';

interface EstadoAutenticacion {
    token: string | null;
    usuario: UsuarioAutenticado | null;
    estaAutenticado: boolean;
    estadoUsuario: EstadoUsuario | null;
    esSuperAdmin: boolean;
    esAdmin: boolean;
    esUsuarioNormal: boolean;
    iniciarSesion: (response: LoginResponse) => void;
    cerrarSesion: () => void;
}

const obtenerAutenticacionAlmacenada = () => {
    if (globalThis.window === undefined) {
        return { token: null, usuario: null };
    }

    const tokenAlmacenado = globalThis.window.localStorage.getItem('auth_token');
    const usuarioAlmacenado = globalThis.window.localStorage.getItem('auth_user');

    return {
        token: tokenAlmacenado,
        usuario: usuarioAlmacenado ? JSON.parse(usuarioAlmacenado) : null,
    };
};

export const useAuthStore = create<EstadoAutenticacion>((set, get) => {
    const almacenado = obtenerAutenticacionAlmacenada();

    return {
        token: almacenado.token,
        usuario: almacenado.usuario,
        estaAutenticado: !!almacenado.token,
        get estadoUsuario() {
            return get().usuario?.estado || null;
        },
        get esSuperAdmin() {
            return get().usuario?.rol === 'super_admin';
        },
        get esAdmin() {
            const rol = get().usuario?.rol;
            return rol === 'admin' || rol === 'super_admin';
        },
        get esUsuarioNormal() {
            return get().usuario?.rol === 'usuario';
        },
        iniciarSesion: (response: LoginResponse) => {
            if (globalThis.window !== undefined) {
                globalThis.window.localStorage.setItem('auth_token', response.access_token);
                globalThis.window.localStorage.setItem('auth_user', JSON.stringify(response.usuario));
            }
            set({
                token: response.access_token,
                usuario: response.usuario,
                estaAutenticado: true,
            });
        },
        cerrarSesion: () => {
            if (globalThis.window !== undefined) {
                globalThis.window.localStorage.removeItem('auth_token');
                globalThis.window.localStorage.removeItem('auth_user');
            }
            set({
                token: null,
                usuario: null,
                estaAutenticado: false,
            });
        },
    };
});

