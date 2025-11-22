<template>
	<div class="space-y-6">
		<!-- Header -->
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Movimientos</h1>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Histórico de movimientos de sus bienes</p>
		</div>

		<!-- Filters and Search -->
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Search Input -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar movimiento</label>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Bien, tipo, descripción..."
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Filter by Type -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
					<select
						v-model="selectedType"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Todos</option>
						<option value="entrada">Entrada</option>
						<option value="salida">Salida</option>
						<option value="ajuste">Ajuste</option>
					</select>
				</div>

				<!-- Filter by Status -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
					<select
						v-model="selectedStatus"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Todos</option>
						<option value="pendiente">Pendiente</option>
						<option value="completado">Completado</option>
						<option value="cancelado">Cancelado</option>
					</select>
				</div>

				<!-- Filter by Date Range -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Desde fecha</label>
					<input
						v-model="dateFrom"
						type="date"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-2 flex-wrap">
				<button
					@click="fetchMovimientos"
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
				>
					Actualizar
				</button>
				<button
					@click="clearFilters"
					class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition text-sm font-medium"
				>
					Limpiar filtros
				</button>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="isLoading" class="flex items-center justify-center p-10 h-64">
			<div class="text-center">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando movimientos...</p>
			</div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
			<h3 class="font-bold">Error al cargar movimientos</h3>
			<p>{{ error }}</p>
			<button @click="fetchMovimientos" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
				Reintentar
			</button>
		</div>

		<!-- Empty State -->
		<div v-else-if="filteredMovimientos.length === 0" class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-8 text-center">
			<svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay movimientos</h3>
			<p class="text-gray-600 dark:text-gray-400">No se encontraron movimientos que coincidan con los filtros.</p>
		</div>

		<!-- Movimientos Table -->
		<div v-else class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Tipo</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Bien</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Cantidad</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Estado</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Fecha</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						<tr v-for="movimiento in filteredMovimientos" :key="movimiento.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
							<td class="py-3 px-4">
								<span :class="[
									'px-2 py-1 rounded-full text-xs font-semibold',
									movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
									movimiento.tipo === 'salida' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
									'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
								]">
									{{ movimiento.tipo || 'N/A' }}
								</span>
							</td>
							<td class="py-3 px-4 text-gray-900 dark:text-white font-medium">{{ movimiento.bien || 'N/A' }}</td>
							<td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ movimiento.cantidad || 0 }}</td>
							<td class="py-3 px-4">
								<span :class="[
									'px-2 py-1 rounded-full text-xs font-semibold',
									movimiento.estado === 'completado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
									movimiento.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
									'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
								]">
									{{ movimiento.estado || 'N/A' }}
								</span>
							</td>
							<td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ formatDate(movimiento.fecha) }}</td>
							<td class="py-3 px-4">
								<button
									@click="viewMovimientoDetails(movimiento)"
									class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
								>
									Ver detalles
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Details Modal -->
		<div v-if="selectedMovimiento" @click="selectedMovimiento = null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div @click.stop class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">Detalles del movimiento</h2>
					<button @click="selectedMovimiento = null" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="space-y-4">
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedMovimiento.tipo }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Bien</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedMovimiento.bien }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedMovimiento.cantidad }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedMovimiento.estado }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ formatDate(selectedMovimiento.fecha) }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedMovimiento.descripcion || 'N/A' }}</p>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isLoading = ref(false)
const error = ref('')
const movimientos = ref([])
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const dateFrom = ref('')
const selectedMovimiento = ref(null)

const filteredMovimientos = computed(() => {
	return movimientos.value.filter(mov => {
		const matchesSearch = !searchQuery.value ||
			(mov.bien && mov.bien.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
			(mov.tipo && mov.tipo.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
			(mov.descripcion && mov.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()))
		
		const matchesType = !selectedType.value || mov.tipo === selectedType.value
		const matchesStatus = !selectedStatus.value || mov.estado === selectedStatus.value
		
		const matchesDate = !dateFrom.value || 
			(mov.fecha && new Date(mov.fecha) >= new Date(dateFrom.value))
		
		return matchesSearch && matchesType && matchesStatus && matchesDate
	})
})

const formatDate = (date) => {
	if (!date) return 'N/A'
	return new Date(date).toLocaleDateString('es-ES')
}

const fetchMovimientos = () => {
	isLoading.value = true
	error.value = ''

	setTimeout(() => {
		movimientos.value = [
			{
				id: 1,
				tipo: 'entrada',
				bien: 'Computadora de Escritorio',
				cantidad: 1,
				estado: 'completado',
				fecha: '2025-01-15',
				descripcion: 'Ingreso de equipo nuevo'
			},
			{
				id: 2,
				tipo: 'salida',
				bien: 'Monitor LG 24"',
				cantidad: 2,
				estado: 'completado',
				fecha: '2025-01-12',
				descripcion: 'Salida para reparación'
			},
			{
				id: 3,
				tipo: 'ajuste',
				bien: 'Impresora Láser HP',
				cantidad: 1,
				estado: 'pendiente',
				fecha: '2025-01-10',
				descripcion: 'Ajuste de inventario'
			},
			{
				id: 4,
				tipo: 'entrada',
				bien: 'Teclado Mecánico',
				cantidad: 5,
				estado: 'completado',
				fecha: '2025-01-08',
				descripcion: 'Compra de repuestos'
			},
			{
				id: 5,
				tipo: 'salida',
				bien: 'Mouse Inalámbrico',
				cantidad: 3,
				estado: 'cancelado',
				fecha: '2025-01-05',
				descripcion: 'Cancelado por cambio de requisito'
			},
			{
				id: 6,
				tipo: 'entrada',
				bien: 'Monitor Dell 27"',
				cantidad: 2,
				estado: 'completado',
				fecha: '2024-12-28',
				descripcion: 'Asignación departamental'
			}
		]
		isLoading.value = false
	}, 300)
}

const clearFilters = () => {
	searchQuery.value = ''
	selectedType.value = ''
	selectedStatus.value = ''
	dateFrom.value = ''
}

const viewMovimientoDetails = (movimiento) => {
	selectedMovimiento.value = movimiento
}

onMounted(() => {
	fetchMovimientos()
})
</script>
