// Configuración Global de la API
export const API_CONFIG = {
    // URL base de tu API de Laravel
    BASE_URL: 'http://127.0.0.1:8081/api',
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

// Configuración para la segunda API (OAuth2 con grant_type password)
export const API_CONFIG_2 = {
    // URL base proxied localmente (ver vite.config.js)
    BASE_URL: '/comedatos',
    // Endpoints de la API Comedatos
    ENDPOINTS: {
        TOKEN: '/oauth/token', // Endpoint para obtener el token (OAuth2)
        LOGIN: '/api/NucleoDigital', // Endpoint para consultar datos protegidos
        LOGOUT: '/logout',
        USER: '/user',
        REFRESH: '/refresh'
    },

    // Credenciales del cliente OAuth2
    CLIENT_CREDENTIALS: {
        grant_type: 'password',
        client_id: '4',
        client_secret: 'VJi8wbu3t5tiXP7A7e81G8kXq6jK5VxlcLWVIucR'
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

// Función para obtener el token de Comedatos
export const getComedatosToken = () => {
    return localStorage.getItem('comedatos_token')
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

// Función del login (API original)
export const login = async (usuario_correo, usuario_pass) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
    method: 'POST',
    headers: API_CONFIG.DEFAULT_HEADERS,
    body: JSON.stringify({ usuario_correo, usuario_pass })
    })
    return response
}

// Función del login para la segunda API (OAuth2)
// Obtiene el token usando grant_type password
export const loginAPI2 = async (email, password) => {
    const response = await fetch(`${API_CONFIG_2.BASE_URL}${API_CONFIG_2.ENDPOINTS.TOKEN}`, {
        method: 'POST',
        headers: API_CONFIG_2.DEFAULT_HEADERS,
        body: JSON.stringify({
            grant_type: API_CONFIG_2.CLIENT_CREDENTIALS.grant_type,
            client_id: API_CONFIG_2.CLIENT_CREDENTIALS.client_id,
            client_secret: API_CONFIG_2.CLIENT_CREDENTIALS.client_secret,
            username: email, // El username es el email
            password: password
        })
    })
    return response
}

// Función para hacer consultas autenticadas con la segunda API
// Usa el token de Comedatos y envía email/password en el body
export const authenticatedQueryAPI2 = async (endpoint, email, password, options = {}) => {
    const token = getComedatosToken()
    const defaultOptions = {
        method: 'POST',
        headers: {
            ...API_CONFIG_2.DEFAULT_HEADERS,
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        body: JSON.stringify({
            email: email,
            password: password,
            ...options.body
        })
    }

    return fetch(`${API_CONFIG_2.BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options
    })
}

// Función para hacer doble login: API original + Comedatos
// Retorna { original: { success, data }, comedatos: { success, data } }
export const dualLogin = async (usuario_correo, usuario_pass, comedatosEmail, comedatosPassword) => {
    const [originalResponse, comedatosResponse] = await Promise.allSettled([
        login(usuario_correo, usuario_pass),
        loginAPI2(comedatosEmail, comedatosPassword)
    ])

    const results = {
        original: { success: false, data: null, error: null },
        comedatos: { success: false, data: null, error: null }
    }

    // Procesar respuesta de API original
    if (originalResponse.status === 'fulfilled') {
        try {
            const response = originalResponse.value
            const data = await response.json()
            if (response.ok && data.access_token) {
                results.original.success = true
                results.original.data = data
            } else {
                results.original.error = data.message || 'Error en login API original'
            }
        } catch (error) {
            results.original.error = error.message || 'Error al procesar respuesta API original'
        }
    } else {
        results.original.error = originalResponse.reason?.message || 'Error en login API original'
    }

    // Procesar respuesta de Comedatos
    if (comedatosResponse.status === 'fulfilled') {
        try {
            const response = comedatosResponse.value
            const data = await response.json()
            if (response.ok && data.access_token) {
                results.comedatos.success = true
                results.comedatos.data = data
            } else {
                results.comedatos.error = data.error_description || data.error || 'Error en login Comedatos'
            }
        } catch (error) {
            results.comedatos.error = error.message || 'Error al procesar respuesta Comedatos'
        }
    } else {
        results.comedatos.error = comedatosResponse.reason?.message || 'Error en login Comedatos'
    }

    return results
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
    const response = await authenticatedFetch(API_CONFIG.ENDPOINTS.USER, {
        method: 'PUT',
        body: JSON.stringify(userData)
    })
    return response
}
