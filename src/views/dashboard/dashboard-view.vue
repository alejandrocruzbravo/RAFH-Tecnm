<template>
	<div class="flex h-screen bg-gray-50 dark:bg-dark-bg relative overflow-hidden transition-colors duration-300">

		<div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
			<div
				class="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow dark:block hidden">
			</div>

			<div
				class="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-blob dark:block hidden">
			</div>

			<div
				class="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000 dark:block hidden">
			</div>
		</div>

		<div v-if="isLoggingOut" class="fixed inset-0 bg-black bg-opacity-50 z-[60]"></div>

		<aside :class="[
			'fixed md:static z-40 md:z-auto w-64 h-full bg-white dark:bg-dark-surface shadow-xl transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800/50',
			isSidebarActive ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
		]">
			<div class="p-6 border-b border-gray-100 dark:border-gray-800">
				<div class="flex items-center space-x-3">
					<img src="/favicon.ico" alt="RAFH Logo" class="w-8 h-8 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]">
					<h1 class="text-2xl font-bold text-blue-900 dark:text-white font-audiowide tracking-wider">RAFH</h1>
				</div>
			</div>

			<nav class="p-4 space-y-1">
				<RouterLink to="/dashboard" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200">
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M20 14H4m6.5 3L8 20m5.5-3 2.5 3M4.88889 17H19.1111c.4909 0 .8889-.4157.8889-.9286V4.92857C20 4.41574 19.602 4 19.1111 4H4.88889C4.39797 4 4 4.41574 4 4.92857V16.0714c0 .5129.39797.9286.88889.9286ZM13 14v-3h4v3h-4Z" />
					</svg>
					<label class="px-3 font-medium cursor-pointer">Principal</label>
				</RouterLink>

				<RouterLink to="/dashboard/areas" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200">
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z" />
					</svg>
					<label class="px-3 font-medium cursor-pointer">Áreas</label>
				</RouterLink>

				<RouterLink to="/dashboard/bienes" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200">
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
							d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
					</svg>
					<label class="px-3 font-medium cursor-pointer">Bienes</label>
				</RouterLink>

				<RouterLink to="/dashboard/catalogoCucop" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200">
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
					</svg>
					<label class="px-3 font-medium cursor-pointer">Cátalogo de claves</label>
				</RouterLink>

				<RouterLink to="/dashboard/gestores" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200">
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2"
							d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					</svg>
					<label class="px-3 font-medium cursor-pointer">Gestores</label>
				</RouterLink>

				<RouterLink to="/dashboard/resguardantes" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200">
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-width="2"
							d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					</svg>
					<label class="px-3 font-medium cursor-pointer">Resguardantes</label>
				</RouterLink>

				<RouterLink to="/dashboard/solicitudes" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200">
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-width="2"
							d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
					</svg>
					<label class="px-3 font-medium cursor-pointer">Solicitudes</label>
				</RouterLink>
				<RouterLink to="/dashboard/movimientosAdmin" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200">
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="m7 16 4-4-4-4m6 8 4-4-4-4" />
					</svg>

					<label class="px-3 font-medium cursor-pointer">Movimientos</label>
				</RouterLink>
			</nav>

		</aside>

		<div v-if="isSidebarActive" @click="closeSidebar" class="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" />

		<div class="flex-1 flex flex-col relative z-10 h-full">

			<header
				class="relative z-20 bg-white dark:bg-dark-surface/80 dark:backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
				<div class="p-4 flex items-center justify-between">
					<button @click="toggleSidebar"
						class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>

					<div class="flex-1"></div>

					<div class="flex items-center gap-3">

						<button @click="toggleTheme" :class="[
							'p-2 rounded-lg transition-all duration-300',
							isDark ? 'bg-yellow-100/10 text-yellow-400 hover:bg-yellow-100/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
						]" title="Cambiar tema">
							<svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 2v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M2 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24" />
							</svg>
							<svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
							</svg>
						</button>

						<div class="relative">
							<button @click="isProfileMenuOpen = !isProfileMenuOpen"
								class="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
								<div
									class="w-8 h-8 rounded-full bg-blue-100 dark:bg-teal-900/50 flex items-center justify-center text-blue-600 dark:text-teal-400 font-bold text-sm border border-blue-200 dark:border-teal-700">
									{{ userName.charAt(0).toUpperCase() }}
								</div>
								<span class="hidden sm:inline text-sm font-medium">{{ userName }}</span>
								<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M19 9l-7 7-7-7" />
								</svg>
							</button>

							<div v-if="isProfileMenuOpen" @click.outside="!isLoggingOut && (isProfileMenuOpen = false)"
								class="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface/95 dark:backdrop-blur-xl rounded-xl shadow-2xl z-50 border border-gray-100 dark:border-gray-700 transform origin-top-right transition-all">
								<div class="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
									<p class="text-sm font-bold text-gray-900 dark:text-white">{{ userName }}</p>
									<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ userEmail }}
									</p>
								</div>

								<div class="p-1">
									<RouterLink to="/dashboard/profile-edit"
										@click="!isLoggingOut && (isProfileMenuOpen = false)"
										class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
										<svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor"
											viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
											</path>
										</svg>
										Editar Perfil
									</RouterLink>

									<button @click="handleLogout" :disabled="isLoggingOut" :class="{
										'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400': !isLoggingOut,
										'text-gray-400 cursor-not-allowed': isLoggingOut
									}" class="flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors mt-1">
										<span v-if="isLoggingOut" class="flex items-center justify-center w-full">
											<div
												class="spinner-logout mr-2 animate-spin inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full">
											</div>
											Cerrando...
										</span>
										<span v-else class="flex items-center w-full">
											<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor"
												viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
												</path>
											</svg>
											Cerrar Sesión
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<section class="p-4 md:p-8 overflow-auto flex-1 bg-gray-50 dark:bg-transparent relative">
				<Suspense>
					<template #default>
						<component :is="currentComponent" />
					</template>
					<template #fallback>
						<div class="flex items-center justify-center h-full">
							<div class="text-center">
								<div
									class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600/30 border-t-blue-600">
								</div>
								<p class="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">Cargando módulo...
								</p>
							</div>
						</div>
					</template>
				</Suspense>
			</section>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { logout } from '../../config/api.js'
import { useTheme } from '../../composables/useTheme.js'

const { isDark, toggleTheme } = useTheme()
const isSidebarActive = ref(false)
const isProfileMenuOpen = ref(false)
const isLoggingOut = ref(false)
const toggleSidebar = () => { isSidebarActive.value = !isSidebarActive.value }
const closeSidebar = () => { isSidebarActive.value = false }

const handleResize = () => {
	if (window.innerWidth > 768) isSidebarActive.value = false
}

onMounted(() => {
	window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
	window.removeEventListener('resize', handleResize)
})

const route = useRoute()
const router = useRouter()
const componentParam = computed(() => route.params.component)

// Get user data from localStorage
const userData = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => userData.usuario_nombre || 'Usuario')
const userEmail = computed(() => userData.usuario_correo || 'email@example.com')

const componentMap = {
	areas: defineAsyncComponent(() => import('./modules/areas.vue')),
	movimientosAdmin: defineAsyncComponent(() => import('./modules/movimientosAdmin.vue')),
	"bien-view": defineAsyncComponent(() => import('./modules/bien-view.vue')),
	bienes: defineAsyncComponent(() => import('./modules/bienes.vue')),
	gestores: defineAsyncComponent(() => import('./modules/gestores.vue')),
	main: defineAsyncComponent(() => import('./modules/main.vue')),
	mantenimiento: defineAsyncComponent(() => import('./modules/mantenimiento.vue')),
	resguardantes: defineAsyncComponent(() => import('./modules/resguardantes.vue')),
	roles: defineAsyncComponent(() => import('./modules/roles.vue')),
	solicitudes: defineAsyncComponent(() => import('./modules/solicitudes.vue')),
	"user-resg": defineAsyncComponent(() => import('./modules/user-resg.vue')),
	workcenter: defineAsyncComponent(() => import('./modules/workcenter.vue')),
	"profile-edit": defineAsyncComponent(() => import('./modules/profile-edit.vue')),
	catalogoCucop: defineAsyncComponent(() => import('./modules/CatalogoCucopCamba.vue')),
}

const currentComponent = computed(() => {
	const key = String(componentParam.value || 'main')
	return componentMap[key] ? componentMap[key] : componentMap['main']
})

const handleLogout = async () => {
	if (isLoggingOut.value) return
	isLoggingOut.value = true

	try {
		await logout()
	} catch (error) {
		console.error('Error al cerrar sesión en la API:', error)
	}

	localStorage.removeItem('auth_token')
	localStorage.removeItem('user')

	await new Promise(resolve => setTimeout(resolve, 500))
	isProfileMenuOpen.value = false
	router.push('/')
}
</script>

<style scoped>
/* Animaciones suaves para los orbes de luz */
@keyframes blob {
	0% {
		transform: translate(0px, 0px) scale(1);
	}

	33% {
		transform: translate(30px, -50px) scale(1.1);
	}

	66% {
		transform: translate(-20px, 20px) scale(0.9);
	}

	100% {
		transform: translate(0px, 0px) scale(1);
	}
}

.animate-blob {
	animation: blob 10s infinite;
}

.animate-pulse-slow {
	animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animation-delay-2000 {
	animation-delay: 2s;
}

.animation-delay-4000 {
	animation-delay: 4s;
}
</style>