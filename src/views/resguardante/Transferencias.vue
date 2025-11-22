<template>
	<div class="space-y-6">
		<!-- Header -->
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Transferencias</h1>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Historial de transferencias de bienes</p>
		</div>

		<!-- Filters and Search -->
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Search Input -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar transferencia</label>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Bien, origen, destino..."
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
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
						<option value="completada">Completada</option>
						<option value="rechazada">Rechazada</option>
					</select>
				</div>

				<!-- Filter by Type -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
					<select
						v-model="selectedType"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Todos</option>
						<option value="interna">Interna</option>
						<option value="externa">Externa</option>
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
					@click="fetchTransferencias"
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
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando transferencias...</p>
			</div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
			<h3 class="font-bold">Error al cargar transferencias</h3>
			<p>{{ error }}</p>
			<button @click="fetchTransferencias" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
				Reintentar
			</button>
		</div>

		<!-- Empty State -->
		<div v-else-if="filteredTransferencias.length === 0" class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-8 text-center">
			<svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay transferencias</h3>
			<p class="text-gray-600 dark:text-gray-400">No se encontraron transferencias que coincidan con los filtros.</p>
		</div>

		<!-- Transferencias Table -->
		<div v-else class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Bien</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Tipo</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">De</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Hacia</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Estado</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Fecha</th>
							<th class="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						<tr v-for="transferencia in filteredTransferencias" :key="transferencia.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
							<td class="py-3 px-4 text-gray-900 dark:text-white font-medium">{{ transferencia.bien || 'N/A' }}</td>
							<td class="py-3 px-4">
								<span :class="[
									'px-2 py-1 rounded-full text-xs font-semibold',
									transferencia.tipo === 'interna' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
									'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
								]">
									{{ transferencia.tipo || 'N/A' }}
								</span>
							</td>
							<td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ transferencia.origen || 'N/A' }}</td>
							<td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ transferencia.destino || 'N/A' }}</td>
							<td class="py-3 px-4">
								<span :class="[
									'px-2 py-1 rounded-full text-xs font-semibold',
									transferencia.estado === 'completada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
									transferencia.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
									'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
								]">
									{{ transferencia.estado || 'N/A' }}
								</span>
							</td>
							<td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ formatDate(transferencia.fecha) }}</td>
							<td class="py-3 px-4">
								<button
									@click="viewTransferenciaDetails(transferencia)"
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
		<div v-if="selectedTransferencia" @click="selectedTransferencia = null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div @click.stop class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">Detalles de la transferencia</h2>
					<button @click="selectedTransferencia = null" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="space-y-4">
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Bien</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedTransferencia.bien }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedTransferencia.tipo }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">De</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedTransferencia.origen }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Hacia</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedTransferencia.destino }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedTransferencia.estado }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ formatDate(selectedTransferencia.fecha) }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedTransferencia.descripcion || 'N/A' }}</p>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
						<p class="text-gray-900 dark:text-white mt-1">{{ selectedTransferencia.cantidad || 'N/A' }}</p>
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
const transferencias = ref([])
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const dateFrom = ref('')
const selectedTransferencia = ref(null)

const filteredTransferencias = computed(() => {
	return transferencias.value.filter(trans => {
		const matchesSearch = !searchQuery.value ||
			(trans.bien && trans.bien.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
			(trans.origen && trans.origen.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
			(trans.destino && trans.destino.toLowerCase().includes(searchQuery.value.toLowerCase()))
		
		const matchesStatus = !selectedStatus.value || trans.estado === selectedStatus.value
		const matchesType = !selectedType.value || trans.tipo === selectedType.value
		
		const matchesDate = !dateFrom.value ||
			(trans.fecha && new Date(trans.fecha) >= new Date(dateFrom.value))
		
		return matchesSearch && matchesStatus && matchesType && matchesDate
	})
})

const formatDate = (date) => {
	if (!date) return 'N/A'
	return new Date(date).toLocaleDateString('es-ES')
}

const fetchTransferencias = () => {
	isLoading.value = true
	error.value = ''

	setTimeout(() => {
		transferencias.value = [
			{
				id: 1,
				bien: 'Computadora de Escritorio',
				tipo: 'interna',
				origen: 'Laboratorio A',
				destino: 'Laboratorio B',
				estado: 'completada',
				fecha: '2025-01-14',
				descripcion: 'Transferencia entre laboratorios',
				cantidad: 1
			},
			{
				id: 2,
				bien: 'Monitor Dell 27"',
				tipo: 'interna',
				origen: 'Dirección',
				destino: 'Coordinación Académica',
				estado: 'completada',
				fecha: '2025-01-10',
				descripcion: 'Reasignación departamental',
				cantidad: 2
			},
			{
				id: 3,
				bien: 'Impresora Láser HP',
				tipo: 'externa',
				origen: 'Instituto A',
				destino: 'Instituto B',
				estado: 'pendiente',
				fecha: '2025-01-08',
				descripcion: 'Transferencia externa en trámite',
				cantidad: 1
			},
			{
				id: 4,
				bien: 'Teclado Mecánico',
				tipo: 'interna',
				origen: 'Laboratorio A',
				destino: 'Almacén Central',
				estado: 'completada',
				fecha: '2025-01-05',
				descripcion: 'Devolución a almacén',
				cantidad: 5
			},
			{
				id: 5,
				bien: 'Mouse Inalámbrico',
				tipo: 'interna',
				origen: 'Oficina 1',
				destino: 'Oficina 2',
				estado: 'rechazada',
				fecha: '2025-01-02',
				descripcion: 'Rechazado por no disponibilidad',
				cantidad: 3
			}
		]
		isLoading.value = false
	}, 300)
}

const clearFilters = () => {
	searchQuery.value = ''
	selectedStatus.value = ''
	selectedType.value = ''
	dateFrom.value = ''
}

const viewTransferenciaDetails = (transferencia) => {
	selectedTransferencia.value = transferencia
}

onMounted(() => {
	fetchTransferencias()
})
</script>
