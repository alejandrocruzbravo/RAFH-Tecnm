<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Movimientos</h1>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Histórico de traslados realizados por usted</p>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 flex justify-between items-center">
			<h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Historial de Operaciones</h2>
			<button @click="fetchMovimientos"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
				Actualizar
			</button>
		</div>

		<div v-if="isLoading" class="flex items-center justify-center p-10 h-64">
			<div class="text-center">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando historial...</p>
			</div>
		</div>

		<div v-else-if="movimientos.length === 0" class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-8 text-center">
			<svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sin movimientos registrados</h3>
			<p class="text-gray-600 dark:text-gray-400">Aún no ha realizado movimientos de bienes.</p>
		</div>

		<div v-else class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th class="px-6 py-3">Código</th>
							<th class="px-6 py-3">Nombre del Bien</th>
							<th class="px-6 py-3">Ubicación Origen (Oficina)</th>
							<th class="px-6 py-3">Ubicación Destino</th>
							<th class="px-6 py-3">Fecha</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr v-for="mov in movimientos" :key="mov.id" class="bg-white border-b dark:bg-dark-bg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
							
							<td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
								{{ mov.bien?.bien_codigo || 'N/A' }}
							</td>

							<td class="px-6 py-4 text-gray-700 dark:text-gray-300">
								{{ mov.bien?.bien_descripcion || 'Sin descripción' }}
							</td>

							<td class="px-6 py-4 text-gray-600 dark:text-gray-400">
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
									{{ mov.bien?.oficina?.nombre || 'Desconocido' }}
								</div>
							</td>

							<td class="px-6 py-4">
								<div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
									{{ mov.departamento?.dep_nombre || 'N/A' }}
								</div>
							</td>
							<td class="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
								{{ formatDate(mov.movimiento_fecha) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div v-if="totalPages > 1" class="flex justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
				<button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50">Anterior</button>
				<span class="text-gray-600 dark:text-gray-300 self-center">Página {{ currentPage }} de {{ totalPages }}</span>
				<button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50">Siguiente</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authenticatedFetch } from '../../config/api.js'

const isLoading = ref(false)
const movimientos = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

const formatDate = (dateString) => {
	if (!dateString) return ''
	const date = new Date(dateString)
	return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })
}

const fetchMovimientos = async (page = 1) => {
	isLoading.value = true
	try {
		const response = await authenticatedFetch(`/mis-movimientos?page=${page}`)
		if (!response.ok) throw new Error('Error al cargar historial')
		
		const data = await response.json()
		movimientos.value = data.data
		currentPage.value = data.current_page
		totalPages.value = data.last_page
	} catch (e) {
		console.error(e)
	} finally {
		isLoading.value = false
	}
}

const changePage = (page) => {
	fetchMovimientos(page)
}

onMounted(() => {
	fetchMovimientos()
})
</script>