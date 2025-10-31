<template>
    <section class="relative min-h-[calc(100vh-64px)] bg-cover bg-center transition-colors duration-300" style="background-image: url('/images/bg-waves.png')">
        
        <div class="absolute inset-0 dark:bg-dark-bg opacity-90 transition-colors duration-300"></div>

        <div class="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
            
            <div class="w-full max-w-md">
                <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg p-8 transition-colors duration-300">
                    <h1 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 font-audiowide">Iniciar Sesión</h1>
                    
                    <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg flex items-start justify-between">
                        <span>{{ errorMessage }}</span>
                        <button @click="errorMessage = ''" class="text-red-700 dark:text-red-200 hover:opacity-75">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="handleLogin" class="space-y-4">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
                            <div class="relative">
                                <input 
                                    id="email"
                                    type="email" 
                                    v-model="formData.email" 
                                    placeholder="Ingresa tu correo" 
                                    required
                                    :disabled="isLoading"
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
                            <div class="relative">
                                <input 
                                    id="password"
                                    type="password" 
                                    v-model="formData.password" 
                                    placeholder="Ingresa tu contraseña" 
                                    required
                                    :disabled="isLoading"
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                        </div>

                        <div class="text-right">
                            <a href="#" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">¿Olvidaste tu contraseña?</a>
                        </div>

                        <button 
                            type="submit" 
                            :disabled="isLoading"
                            class="w-full px-4 py-2 bg-teal-600 dark:bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                        >
                            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                        </button>
                    </form>

                    <div class="mt-6">
                        <button 
                            @click="loginWithMicrosoft"
                            :disabled="isLoading"
                            class="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
                        >
                            <img src="/images/microsoft.png" alt="Microsoft Logo" class="w-5 h-5">
                            <span>Iniciar Sesión con Microsoft</span>
                        </button>
                    </div>
                </div>
            </div>
        </div> </section>
</template>
<script setup>
	import { ref, reactive } from 'vue'
	import { useRouter } from 'vue-router'
	import { login } from '../config/api.js'

	const router = useRouter()

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

			if (response.ok) {
				if (data.access_token) {
					localStorage.setItem('auth_token', data.access_token)
					localStorage.setItem('user', JSON.stringify(data.user))
				}
				router.push('/dashboard')
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
