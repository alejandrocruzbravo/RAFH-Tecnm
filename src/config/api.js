import { isSessionExpired } from './sessionState.js';

// Configuración Global de la API
export const API_CONFIG = {
    // URL base de tu API de Laravel
    BASE_URL: 'http://127.0.0.1:8081/api',
    // Endpoints
    ENDPOINTS: {
        LOGIN: '/login',
        LOGOUT: '/logout',
        USER: '/user',
        REFRESH: '/refresh',
        PROFILE: '/perfil'  // Nuevo endpoint para el perfil
    },

    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

// Función para obtener el token de autenticación (API original)
export const getAuthToken = () => {
    return localStorage.getItem('auth_token')
}
// Función para hacer peticiones autenticadas
export const authenticatedFetch = async (url, options = {}) => {
    const token = getAuthToken()
    const defaultOptions = {
        headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    }
    try {
        // 2. HACEMOS LA PETICIÓN ESPERANDO LA RESPUESTA
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
            ...defaultOptions,
            ...options
        });

        // 3. LÓGICA DE INTERCEPCIÓN DE ERROR 401 (Token Caducado)
        if (response.status === 401) {
            // Verificamos si ya se disparó el proceso para no repetirlo múltiples veces
            if (!isSessionExpired.value) {
                console.warn('Sesión expirada (401). Iniciando redirección...');

                // A. Activamos el Modal (esto hace que aparezca en App.vue)
                isSessionExpired.value = true;

                // B. Limpiamos el token (Ajusta 'auth_token' al nombre real de tu llave en localStorage)
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                // Si tienes otros datos de usuario, límpialos también:
                // 

                // C. Esperamos 3 segundos y redirigimos
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }
            // Retornamos la respuesta aunque sea error para detener el flujo limpiamente
            return response;
        }

        // 4. Si no es 401, retornamos la respuesta normal al componente
        return response;

    } catch (error) {
        // Manejo de errores de red (cuando no hay internet o el servidor está caído)
        console.error('Error de conexión con la API', error);
        throw error;
    }
}

// Función del login (API original)
export const login = async (usuario_correo, usuario_pass) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ usuario_correo, usuario_pass })
    })
    return response
}

// Función para hacer logout
export const logout = async () => {
    try {
        // 1. Intentamos avisar al Backend que destruya el token
        const response = await authenticatedFetch(API_CONFIG.ENDPOINTS.LOGOUT, {
            method: 'POST'
        })
        return response

    } catch (error) {
        console.error('Error de conexión al cerrar sesión:', error)
    } finally {

        localStorage.clear()

        sessionStorage.clear()

    }
}

// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
    const response = await authenticatedFetch(API_CONFIG.ENDPOINTS.USER)
    return response
}

// Función para actualizar el perfil del usuario
export const updateUserProfile = async (userData) => {
    // Usamos el endpoint '/perfil' que definimos en el PerfilController
    const response = await authenticatedFetch(API_CONFIG.ENDPOINTS.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
    return response;
}
