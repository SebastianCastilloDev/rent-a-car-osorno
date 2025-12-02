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

const calcularPropiedadesUsuario = (usuario: UsuarioAutenticado | null) => {
    if (!usuario) {
        return {
            estadoUsuario: null,
            esSuperAdmin: false,
            esAdmin: false,
            esUsuarioNormal: false,
        };
    }

    return {
        estadoUsuario: usuario.estado || null,
        esSuperAdmin: usuario.rol === 'super_admin',
        esAdmin: usuario.rol === 'admin' || usuario.rol === 'super_admin',
        esUsuarioNormal: usuario.rol === 'usuario',
    };
};

export const useAuthStore = create<EstadoAutenticacion>((set) => {
    const almacenado = obtenerAutenticacionAlmacenada();
    const propiedadesUsuario = calcularPropiedadesUsuario(almacenado.usuario);

    return {
        token: almacenado.token,
        usuario: almacenado.usuario,
        estaAutenticado: !!almacenado.token,
        ...propiedadesUsuario,
        iniciarSesion: (response: LoginResponse) => {
            if (globalThis.window !== undefined) {
                globalThis.window.localStorage.setItem('auth_token', response.access_token);
                globalThis.window.localStorage.setItem('auth_user', JSON.stringify(response.usuario));
            }
            const nuevasPropiedades = calcularPropiedadesUsuario(response.usuario);
            set({
                token: response.access_token,
                usuario: response.usuario,
                estaAutenticado: true,
                ...nuevasPropiedades,
            });
        },
        cerrarSesion: () => {
            if (globalThis.window !== undefined) {
                globalThis.window.localStorage.removeItem('auth_token');
                globalThis.window.localStorage.removeItem('auth_user');
            }
            const propiedadesVacias = calcularPropiedadesUsuario(null);
            set({
                token: null,
                usuario: null,
                estaAutenticado: false,
                ...propiedadesVacias,
            });
        },
    };
});

