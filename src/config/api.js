// Configuración Global de la API
export const API_CONFIG = {
    // URL base de tu API de Laravel
    BASE_URL: 'http://127.0.0.1:8080/api',
    // Endpoints
    ENDPOINTS: {
        LOGIN: '/login',
        LOGOUT: '/logout',
        USER: '/user',
        REFRESH: '/refresh'
    },

  // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

// Función para obtener el token de autenticación
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

    return fetch(`${API_CONFIG.BASE_URL}${url}`, {
    ...defaultOptions,
    ...options
    })
}

// Función del login
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
    const response = await authenticatedFetch(API_CONFIG.ENDPOINTS.LOGOUT, {
    method: 'POST'
    })
    
    return response
}

// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
    const response = await authenticatedFetch(API_CONFIG.ENDPOINTS.USER)
    return response
}

// Función para actualizar el perfil del usuario
export const updateUserProfile = async (userData) => {
    const response = await authenticatedFetch(API_CONFIG.ENDPOINTS.USER, {
        method: 'PUT',
        body: JSON.stringify(userData)
    })
    return response
}
