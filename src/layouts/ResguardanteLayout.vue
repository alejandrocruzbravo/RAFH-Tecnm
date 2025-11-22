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
				<p class="text-xs text-gray-600 dark:text-gray-400 mt-2">Panel Resguardante</p>
			</div>

			<!-- Navigation Menu -->
			<ResguardanteSidebar @closeSidebar="closeSidebar" />
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
						<RouterView />
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { logout } from '../config/api.js'
import { useTheme } from '../composables/useTheme.js'
import ResguardanteSidebar from '../components/ResguardanteSidebar.vue'

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

// Get user data from localStorage
const userData = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => userData.usuario_nombre || 'Usuario')
const userEmail = computed(() => userData.usuario_correo || 'email@example.com')

const handleLogout = async () => {
	if (isLoggingOut.value) return
	
	isLoggingOut.value = true
	try {
		const response = await logout()
		if (response.ok) {
			localStorage.removeItem('auth_token')
			localStorage.removeItem('user')
			router.push('/login')
		}
	} catch (error) {
		console.error('Error during logout:', error)
	} finally {
		isLoggingOut.value = false
	}
}
</script>
