<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Usuarios Resguardantes</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
			<form @submit.prevent class="flex gap-2">
				<input v-model="searchQuery" type="text" placeholder="Buscar usuario" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				<button type="button" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Buscar</button>
			</form>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Correo</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Área</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Bienes Asignados</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="user in filteredUsers" :key="user.nombre" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ user.nombre }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ user.correo }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ user.area }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ user.bienesAsignados }}</td>
						<td class="px-4 py-3 flex gap-2">
							<button class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							</button>
							<button class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Pagination Controls -->
		<div v-if="filteredUsers.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
			<button
				@click="prevPage"
				:disabled="currentPage === 1"
				class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Atrás
			</button>

			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Página {{ currentPage }} de {{ totalPages }} | Total: {{ allFiltered.length }} resultados
			</span>

			<button
				@click="nextPage"
				:disabled="currentPage === totalPages"
				class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
			>
				Adelante
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const users = ref([
	{ nombre: 'Juan Pérez', correo: 'juan@example.com', area: 'Sistemas', bienesAsignados: 5 },
	{ nombre: 'María García', correo: 'maria@example.com', area: 'Contabilidad', bienesAsignados: 3 },
	{ nombre: 'Carlos López', correo: 'carlos@example.com', area: 'Recursos Humanos', bienesAsignados: 2 },
	{ nombre: 'Ana Rodríguez', correo: 'ana@example.com', area: 'Sistemas', bienesAsignados: 8 },
	{ nombre: 'Pedro Martínez', correo: 'pedro@example.com', area: 'Contabilidad', bienesAsignados: 1 },
])

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

const allFiltered = computed(() => {
	return users.value.filter(user => {
		return !searchQuery.value ||
			user.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			user.correo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			user.area.toLowerCase().includes(searchQuery.value.toLowerCase())
	})
})

const totalPages = computed(() => {
	return Math.ceil(allFiltered.value.length / itemsPerPage) || 1
})

const filteredUsers = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage
	const end = start + itemsPerPage
	return allFiltered.value.slice(start, end)
})

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++
	}
}

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--
	}
}

watch(searchQuery, () => {
	currentPage.value = 1
})
</script>
