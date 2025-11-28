import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }, // <--- Cierre de resolve aquí
  
  // Configuración del Servidor y Proxy
  server: {
    port: 5174,
   /* proxy: {
      '/api': {
        target: 'https://jovan-entonzoic-nam.ngrok-free.dev', // Tu URL de ngrok
        changeOrigin: true, // Esto es vital para ngrok (cambia el host header)
        secure: false,      // Ayuda con certificados SSL auto-firmados si los hubiera
        rewrite: (path) => path.replace(/^\/api/, ''), // Descomenta si tu backend NO espera /api en la ruta
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Error del proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Enviando petición a:', proxyReq.getHeader('host') + proxyReq.path);
          });
        }
        
      }
    }*/
  }
})