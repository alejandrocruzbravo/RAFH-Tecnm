<template>
  <div 
    class="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden selection:bg-teal-500 selection:text-white"
    style="background-image: url('/images/bg-waves.png')"
  >
    
    <div class="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-[2px]"></div>

    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
    <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-teal-800/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>

    <div class="relative z-10 w-full max-w-md p-4 animate-fade-in-up my-8">
      
      <div class="absolute inset-0 bg-white/5 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"></div>
      
      <div class="relative z-20 p-8">
        
        <div class="flex items-center justify-center gap-4 mb-8">
            <img src="/favicon.ico" alt="RAFH Logo" class="w-12 h-12 drop-shadow-[0_0_15px_rgba(20,184,166,0.6)]">
            <span class="text-4xl font-bold text-white font-audiowide tracking-widest drop-shadow-lg">
                RAFH
            </span>
        </div>

        <div class="text-center mb-8">
          <h2 class="text-2xl font-semibold text-gray-200 mb-2 tracking-wide drop-shadow-lg">
            Iniciar Sesión
          </h2>
          <p class="text-gray-400 text-sm">Ingresa tus credenciales para acceder</p>
        </div>

        <div v-if="errorMessage" class="mb-6 p-4 bg-red-500/10 border border-red-500/50 backdrop-blur-sm text-red-200 rounded-lg flex items-start justify-between text-sm animate-pulse-soft">
            <span>{{ errorMessage }}</span>
            <button @click="errorMessage = ''" class="text-red-200 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div class="group">
            <label class="block text-sm font-medium text-gray-300 mb-1 ml-1 transition-colors group-focus-within:text-teal-400">Correo Electrónico</label>
            <div class="relative">
              <input 
                id="email"
                type="email" 
                v-model="formData.email"
                placeholder="usuario@email.com"
                required
                :disabled="isLoading"
                class="w-full pl-4 pr-10 py-3 bg-gray-900/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50 transition-all duration-300"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="group">
            <div class="flex items-center justify-between mb-1 ml-1">
              <label class="block text-sm font-medium text-gray-300 transition-colors group-focus-within:text-teal-400">Contraseña</label>
            </div>
            <div class="relative">
              <input 
                id="password"
                type="password" 
                v-model="formData.password"
                placeholder="••••••••"
                required
                :disabled="isLoading"
                class="w-full pl-4 pr-10 py-3 bg-gray-900/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50 transition-all duration-300"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
            <div class="text-right mt-2">
                <a href="#" class="text-xs text-teal-400 hover:text-teal-300 hover:underline transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-teal-700 to-teal-500 hover:from-teal-600 hover:to-teal-400 text-white font-bold rounded-lg shadow-lg shadow-teal-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-500/30"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 text-gray-400 bg-transparent shadow-sm rounded backdrop-blur-md">O continúa con</span>
            </div>
          </div>

          <button 
            type="button"
            @click="loginWithMicrosoft"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-gray-500/30 hover:border-gray-400 text-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="/images/microsoft.png" alt="Microsoft Logo" class="w-5 h-5 group-hover:scale-110 transition-transform">
            <span class="text-sm font-medium">Iniciar Sesión con Microsoft</span>
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../config/api.js'
import { useTheme } from '../composables/useTheme.js'

const router = useRouter()
const { isDark, toggleTheme, initTheme } = useTheme()

initTheme()

const formData = reactive({
    email: '',
    password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    if (!formData.email || !formData.password) {
        errorMessage.value = 'Por favor, completa todos los campos'
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        const response = await login(formData.email, formData.password)
        const data = await response.json()
        console.log(data);
        if (response.ok) {
            // 1. Guardar sesión
            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token)
                localStorage.setItem('user', JSON.stringify(data.user))
            }
            if (data.user.usuario_id_rol === 3) {
                router.push('/resguardante')
            } else {
                router.push('/dashboard')
            }

           

        } else {
            errorMessage.value = data.message || 'Error al iniciar sesión'
        }
    } catch (error) {
        console.error('Error en la petición:', error)
        errorMessage.value = 'Error de conexión. Verifica que tu API esté funcionando.'
    } finally {
        isLoading.value = false
    }
}

const loginWithMicrosoft = () => {
    console.log('Login con Microsoft - por implementar')
}
</script>

<style scoped>
/* Animación de los Orbes (Flotando suavemente) */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

/* Animación de Entrada (Fade In + Slide Up) */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Animación pulso suave para errores */
@keyframes pulseSoft {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}
.animate-pulse-soft {
    animation: pulseSoft 2s infinite;
}
</style>