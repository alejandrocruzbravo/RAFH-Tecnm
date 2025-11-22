<template>
	<nav class="p-4 space-y-2">
		<!-- Bienes Asignados -->
		<RouterLink to="/resguardante/bienes-asignados"
			@click="$emit('closeSidebar')"
			class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M12 8v4m0 4v-1m6.5-5H5.5A1.5 1.5 0 0 0 4 10.5v3a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 19.5 7Z" />
			</svg>
			<label class="px-2" for="">Bienes asignados</label>
		</RouterLink>

		<!-- Movimientos -->
		<RouterLink to="/resguardante/movimientos"
			@click="$emit('closeSidebar')"
			class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M13.5 8H3v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8m0 0a2 2 0 0 0-2-2h-2.5a2 2 0 0 0-1 .266M13.5 8V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1m0 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0" />
			</svg>
			<label class="px-2" for="">Movimientos</label>
		</RouterLink>

		<!-- Transferencias -->
		<RouterLink to="/resguardante/transferencias"
			@click="$emit('closeSidebar')"
			class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M8 16h8m0-8H8m8 4H8M5 3v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3m-4 0V1m-4 2V1" />
			</svg>
			<label class="px-2" for="">Transferencias</label>
		</RouterLink>
	</nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineEmits(['closeSidebar'])
</script>
