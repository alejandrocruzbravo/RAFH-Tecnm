<template>
	<nav class="p-4 space-y-2">
		<RouterLink to="/resguardante" @click="$emit('closeSidebar')"
			class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
				width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-width="2"
					d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
				<path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
			</svg>

			<label class="px-2" for="">Vista general</label>
		</RouterLink>
		<!-- Bienes Asignados -->
		<RouterLink to="/resguardante/bienes-asignados" @click="$emit('closeSidebar')"
			class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
				width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
					d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
			</svg>

			<label class="px-2" for="">Bienes asignados</label>
		</RouterLink>

		<!-- Movimientos -->
		<RouterLink to="/resguardante/movimientos" @click="$emit('closeSidebar')"
			class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
			<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
				fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="m7 16 4-4-4-4m6 8 4-4-4-4" />
			</svg>
			<label class="px-2" for="">Movimientos</label>
		</RouterLink>

		<!-- Transferencias -->
		<RouterLink to="/resguardante/transferencias" @click="$emit('closeSidebar')"
			class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
</svg>

			<label class="px-2" for="">Traspasos</label>
		</RouterLink>
	</nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineEmits(['closeSidebar'])
</script>
