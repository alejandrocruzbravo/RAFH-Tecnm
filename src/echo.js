import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Esto es necesario para que Echo encuentre la librería Pusher
window.Pusher = Pusher;

// Creamos la instancia de Echo
window.Echo = new Echo({
    broadcaster: 'reverb', // O 'pusher' si no usas Reverb
    key: import.meta.env.VITE_REVERB_APP_KEY, // Tu 'key' de .env
    wsHost: import.meta.env.VITE_REVERB_HOST, // ej. window.location.hostname
    wsPort: import.meta.env.VITE_REVERB_PORT, // ej. 8080 (para Reverb) o 6001
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https',
    enabledTransports: ['ws', 'wss'], 
});

