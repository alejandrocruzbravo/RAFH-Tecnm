<template>
	<nav class="fixed top-0 left-0 right-0 z-50 bg-gray-900 dark:bg-[#14161A] text-white shadow-lg transition-colors duration-300">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo -->
				<RouterLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
					<img src="/favicon.ico" alt="RAFH Logo" class="w-18 h-20">
				</RouterLink>

				<!-- Desktop Menu -->
				<div class="hidden md:flex items-center space-x-6">
					<RouterLink to="/" class="hover:text-blue-400 transition-colors">Inicio</RouterLink>
					<RouterLink to="/about" class="hover:text-blue-400 transition-colors">Acerca de</RouterLink>
					<RouterLink to="/contact" class="hover:text-blue-400 transition-colors">Contáctanos</RouterLink>
				</div>

				<!-- Theme Toggle & Hamburger -->
				<div class="flex items-center space-x-4">
					<!-- Theme Toggle Button -->
					<button
						@click="toggleTheme"
						class="p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
						:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
					>
						<svg v-if="!isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
						</svg>
						<svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 13.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 000-1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clip-rule="evenodd"></path>
						</svg>
					</button>

					<!-- Mobile Menu Button -->
					<button
						@click="isOpen = !isOpen"
						class="md:hidden p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
						:aria-label="isOpen ? 'Close menu' : 'Open menu'"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
							<path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>

			<!-- Mobile Menu -->
			<div v-if="isOpen" class="md:hidden bg-gray-800 dark:bg-gray-900 border-t border-gray-700">
				<div class="space-y-2 px-2 pt-2 pb-3">
					<RouterLink to="/" class="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors" @click="isOpen = false">Inicio</RouterLink>
					<RouterLink to="/about" class="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors" @click="isOpen = false">Acerca de</RouterLink>
					<RouterLink to="/contact" class="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors" @click="isOpen = false">Contáctanos</RouterLink>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '../composables/useTheme'

defineProps({ isCentroT: { type: Boolean, default: false } })

const isOpen = ref(false)
const { isDark, toggleTheme } = useTheme()

// Close menu when clicking outside
const handleClickOutside = (event) => {
	const navbar = event.target.closest('nav')
	if (!navbar && isOpen.value) {
		isOpen.value = false
	}
}

// Close menu on Escape key
const handleEscape = (event) => {
	if (event.key === 'Escape' && isOpen.value) {
		isOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
	document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
	document.removeEventListener('keydown', handleEscape)
})
</script>
