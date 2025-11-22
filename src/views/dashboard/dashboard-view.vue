<template>
	<div class="flex h-screen bg-white dark:bg-dark-bg">
		<!-- Loading overlay during logout -->
		<div v-if="isLoggingOut" class="fixed inset-0 bg-black bg-opacity-50 z-[49]"></div>

		<!-- Sidebar -->
		<aside :class="[
			'fixed md:static z-40 w-64 h-full dark:bg-dark-surface shadow-lg transition-transform duration-300 ease-in-out',
			isSidebarActive ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
		]">
			<!-- Sidebar Header -->
			<div class="p-6 border-b border-blue-200 dark:border-gray-700">
				<div class="flex items-center space-x-2">
					<img src="/favicon.ico" alt="RAFH Logo" class="w-8 h-8">
					<h1 class="text-2xl font-bold text-blue-900 dark:text-white">RAFH</h1>
				</div>
			</div>

			<!-- Navigation Menu -->
			<nav class="p-4">
				<RouterLink to="/dashboard" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M20 14H4m6.5 3L8 20m5.5-3 2.5 3M4.88889 17H19.1111c.4909 0 .8889-.4157.8889-.9286V4.92857C20 4.41574 19.602 4 19.1111 4H4.88889C4.39797 4 4 4.41574 4 4.92857V16.0714c0 .5129.39797.9286.88889.9286ZM13 14v-3h4v3h-4Z" />
					</svg>
					<label class="px-2" for="">Principal</label>
				</RouterLink>

				<RouterLink to="/dashboard/areas" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z" />
					</svg>

					<label class="px-2" for="">Áreas</label>
				</RouterLink>
				<RouterLink to="/dashboard/bienes" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
							d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
					</svg>
					<label class="px-2" for="">Bienes</label>
				</RouterLink>
				<RouterLink to="/dashboard/auditorias" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z" />
					</svg>

					<label class="px-2 text-gray-900" for="">Movimientos</label>
				</RouterLink>
				<RouterLink to="/dashboard/catalogoCucop" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
					</svg>

					<label class="px-2">CUCOP/CAMB</label>
				</RouterLink>
				<RouterLink to="/dashboard/gestores" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2"
							d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					</svg>
					<label class="px-2" for="">Gestores</label>
				</RouterLink>
				<RouterLink to="/dashboard/resguardantes" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-width="2"
							d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					</svg>

					<label class="px-2" for="">Resguardantes</label>
				</RouterLink>
				<RouterLink to="/dashboard/solicitudes" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-width="2"
							d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
					</svg>
					<label class="px-2" for="">Solicitudes</label>
				</RouterLink>
				<RouterLink to="/dashboard/workcenter" @click="closeSidebar"
					class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-width="2"
							d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2" />
					</svg>
					<label class="px-2 text-gray-900" for="">Centro de trabajo</label>
				</RouterLink>
			</nav>

		</aside>

		<!-- Overlay for mobile -->
		<div v-if="isSidebarActive" @click="closeSidebar" class="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" />

		<!-- Main Content -->
		<div class="flex-1 flex flex-col">
			<!-- Top Bar -->
			<header class="bg-white dark:bg-dark-bg shadow-md">
				<div class="p-4 flex items-center justify-between">
					<button @click="toggleSidebar"
						class="p-2 text-blue-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
					<div class="flex-1"></div>
					<div class="flex items-center gap-2">

						<!-- Theme Toggle Button -->
            
						<button @click="toggleTheme" :class="[
							'p-2 rounded-lg transition-colors',
							isDark ? 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200' : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
						]" title="Cambiar tema">
							<svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 2v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M2 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24" />
							</svg>
							<svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
							</svg>
						</button>
					</div>
					<div class="relative">
						<button @click="isProfileMenuOpen = !isProfileMenuOpen"
							class="flex items-center space-x-2 p-2 text-blue-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
							<span class="hidden sm:inline text-sm font-medium">{{ userName }}</span>
						</button>

						<!-- Profile Dropdown Menu -->
						<div v-if="isProfileMenuOpen" @click.outside="!isLoggingOut && (isProfileMenuOpen = false)"
							class="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-600">
							<div class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
								<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ userName }}</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
							</div>
							<RouterLink to="/dashboard/profile-edit"
								@click="!isLoggingOut && (isProfileMenuOpen = false)"
								class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
								Editar Perfil
							</RouterLink>
							<button @click="handleLogout" :disabled="isLoggingOut" :class="{
								'text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600': !isLoggingOut,
								'flex justify-center items-center text-gray-400 dark:text-gray-500 cursor-not-allowed': isLoggingOut
							}" class="w-full px-4 py-2 text-sm transition">
								<span v-if="isLoggingOut" class="flex items-center justify-center">
									<div
										class="spinner-logout mr-2 animate-spin inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full">
									</div>
									Cerrando sesión...
								</span>
								<span v-else>
									Cerrar Sesión
								</span>
							</button>
						</div>
					</div>
				</div>
			</header>

			<!-- Component Display Area -->
			<section class="p-4 md:p-8 overflow-auto flex-1 bg-gray-50 dark:bg-dark-bg">
				<Suspense>
					<template #default>
						<component :is="currentComponent" />
					</template>
					<template #fallback>
						<div class="flex items-center justify-center h-64">
							<div class="text-center">
								<div
									class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600">
								</div>
								<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
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
	auditorias: defineAsyncComponent(() => import('./modules/auditorias.vue')),
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
	// Evita doble clic si ya está cargando
	if (isLoggingOut.value) return

	// Activa el estado de carga
	isLoggingOut.value = true

	try {
		// Llama a la API de logout
		await logout()
	} catch (error) {
		console.error('Error al cerrar sesión en la API:', error)
		// No importa si la API falla, el usuario DEBE ser deslogueado localmente
	}

	// Limpiar el localStorage
	localStorage.removeItem('auth_token')
	localStorage.removeItem('user')

	// Pequeña pausa para mostrar la animación antes de redirigir
	await new Promise(resolve => setTimeout(resolve, 500))

	// Cerrar el menú desplegable antes de redirigir
	isProfileMenuOpen.value = false

	// Redirige al login
	router.push('/')
}
</script>
