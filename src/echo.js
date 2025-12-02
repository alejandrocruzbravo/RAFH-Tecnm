import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Esto es necesario para que Echo encuentre la librería Pusher
window.Pusher = Pusher;

const token = localStorage.getItem('auth_token');
// Creamos la instancia de Echo
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],

    authEndpoint: 'http://127.0.0.1:8081/api/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        }
    }
});


/*
TRABAJO LOCAL (LOCALHOST)

window.Echo = new Echo({
    broadcaster: 'reverb', // O 'pusher' si no usas Reverb
    key: import.meta.env.VITE_REVERB_APP_KEY, // Tu 'key' de .env
    wsHost: import.meta.env.VITE_REVERB_HOST, // ej. window.location.hostname
    wsPort: import.meta.env.VITE_REVERB_PORT, // ej. 8080 (para Reverb) o 6001
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https',
    enabledTransports: ['ws', 'wss'], 
});

*/