<template>
	<div class="space-y-6">
		<!-- Header -->
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bienes Asignados</h1>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Listado de bienes bajo su responsabilidad</p>
		</div>

		<!-- Filters and Search -->
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Search Input -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar bien</label>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Nombre o descripción del bien..."
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
						<option value="activo">Activo</option>
						<option value="inactivo">Inactivo</option>
					</select>
				</div>

				<!-- Filter by Category -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
					<select
						v-model="selectedCategory"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Todas</option>
						<option value="electrónica">Electrónica</option>
						<option value="muebles">Muebles</option>
						<option value="otros">Otros</option>
					</select>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-2 flex-wrap">
				<button
					@click="fetchBienes"
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
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando bienes...</p>
			</div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
			<h3 class="font-bold">Error al cargar bienes</h3>
			<p>{{ error }}</p>
			<button @click="fetchBienes" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
				Reintentar
			</button>
		</div>

		<!-- Empty State -->
		<div v-else-if="filteredBienes.length === 0" class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-8 text-center">
			<svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay bienes asignados</h3>
			<p class="text-gray-600 dark:text-gray-400">No se encontraron bienes que coincidan con los filtros.</p>
		</div>

		<!-- Bienes Cards -->
		<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div v-for="bien in filteredBienes" :key="bien.id" class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 border border-gray-200 dark:border-gray-700">
				<!-- Header with Icon -->
				<div class="flex items-start justify-between mb-3">
					<div class="flex items-start gap-3">
						<div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
							<svg v-if="bien.categoria === 'electrónica'" class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
							</svg>
							<svg v-else class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H4V4h14v10z"/>
							</svg>
						</div>
						<div class="flex-1">
							<h3 class="font-semibold text-gray-900 dark:text-white">{{ bien.nombre }}</h3>
							<p class="text-xs text-gray-600 dark:text-gray-400">Código: {{ bien.numero_serie }}</p>
						</div>
					</div>
					<span :class="[
						'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
						bien.estado === 'activo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
						bien.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
						'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
					]">
						{{ bien.estado }}
					</span>
				</div>

				<!-- Details -->
				<div class="space-y-2 mb-4 text-sm">
					<p class="text-gray-600 dark:text-gray-400">
						<strong class="text-gray-700 dark:text-gray-300">Ubicación:</strong> {{ bien.descripcion || 'N/A' }}
					</p>
					<p class="text-gray-600 dark:text-gray-400">
						<strong class="text-gray-700 dark:text-gray-300">Modelo:</strong> {{ bien.categoria || 'N/A' }}
					</p>
					<p class="text-gray-600 dark:text-gray-400">
						<strong class="text-gray-700 dark:text-gray-300">Marca:</strong> Marca del bien
					</p>
				</div>

				<!-- Actions -->
				<div class="flex gap-2">
					<button
						@click="abrirGenerarSolicitud(bien.nombre)"
						class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
						</svg>
						Mover a...
					</button>
					<button
						@click="abrirTraspasoModal(bien.nombre)"
						class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M15 8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm6 0c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zM3 8c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3zm9 12c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 0c-2.67 0-8 1.34-8 4v2h4v-2c0-1.33 2.24-2.5 6-3.45-.58-.29-1.25-.55-2-55zm12 0c-.75.3-1.42.55-2 .55 3.75.95 6 2.12 6 3.45v2h4v-2c0-2.66-5.33-4-8-4z"/>
						</svg>
						Traspasar
					</button>
				</div>
			</div>
		</div>

		<!-- Pagination Controls -->
		<div v-if="filteredBienes.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
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
				Página {{ currentPage }} de {{ totalPages }}
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

		<!-- Generate Request Modal -->
		<div v-if="showGenerarSolicitudModal && selectedBienParaSolicitud" @click="showGenerarSolicitudModal = false" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div @click.stop class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-center mb-4">
					<svg class="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Generar Solicitud</h2>
				<p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">Estás generando una solicitud para el bien: <strong class="text-gray-900 dark:text-white">{{ selectedBienParaSolicitud }}</strong>.</p>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecciona un tipo de solicitud</label>
						<select
							v-model="solicitudData.tipo"
							class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
						>
							<option value="">Selecciona un tipo</option>
							<option value="mantenimiento">Mantenimiento</option>
							<option value="reparacion">Reparación</option>
							<option value="revision">Revisión</option>
							<option value="cambio">Cambio</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
							<svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
								<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
							</svg>
							Motivo o Justificación
						</label>
						<textarea
							v-model="solicitudData.motivo"
							placeholder="Describe el motivo de la solicitud..."
							rows="4"
							class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
						/>
					</div>
				</div>

				<div class="flex gap-3 mt-6">
					<button
						@click="showGenerarSolicitudModal = false"
						class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
					>
						Cancelar
					</button>
					<button
						@click="enviarSolicitud"
						class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
					>
						Enviar Solicitud
					</button>
				</div>
			</div>
		</div>

		<!-- Transfer Bien Modal -->
		<div v-if="showTraspasoModal && selectedBienParaTraspasor" @click="showTraspasoModal = false" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div @click.stop class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-center mb-4">
					<svg class="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
					</svg>
				</div>
				<h2 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">Traspasar Bien</h2>
				<p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">Vas a traspasar el bien: <strong class="text-gray-900 dark:text-white">{{ selectedBienParaTraspasor }}</strong>.</p>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
							<svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
							</svg>
							Buscar resguardante...
						</label>
						<input
							v-model="traspasoData.resguardante"
							type="text"
							placeholder="Nombre del resguardante..."
							class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por oficina...</label>
						<select
							v-model="traspasoData.oficina"
							class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Todas las oficinas</option>
							<option value="dirección">Dirección</option>
							<option value="académica">Coordinación Académica</option>
							<option value="administrativa">Coordinación Administrativa</option>
							<option value="laboratorio">Laboratorio</option>
						</select>
					</div>

					<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
						<p class="text-sm text-gray-500 dark:text-gray-400">(Aquí aparecerá la lista de resguardantes)</p>
					</div>
				</div>

				<div class="flex gap-3 mt-6">
					<button
						@click="showTraspasoModal = false"
						class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
					>
						Cancelar
					</button>
					<button
						@click="confirmarTraspaso"
						class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
					>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { authenticatedFetch } from '../../config/api.js'

const isLoading = ref(true)
const error = ref('')
const bienesList = ref({ data: [] })
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedCategory = ref('')
const selectedBien = ref(null)
const showGenerarSolicitudModal = ref(false)
const selectedBienParaSolicitud = ref(null)
const solicitudData = ref({
	tipo: '',
	motivo: ''
})
const showTraspasoModal = ref(false)
const selectedBienParaTraspasor = ref(null)
const traspasoData = ref({
	resguardante: '',
	oficina: ''
})
const currentPage = ref(1)
const itemsPerPage = 15
const totalPages = ref(1)
const searchTimeout = ref(null)

const filteredBienes = computed(() => {
	return bienesList.value.data || []
})

const fetchBienes = async () => {
	isLoading.value = true
	error.value = ''

	try {
		const params = new URLSearchParams()
		params.append('page', currentPage.value)
		
		if (searchQuery.value.trim()) {
			params.append('search', searchQuery.value.toUpperCase())
		}

		const response = await authenticatedFetch(`/oficinas/9/bienes?${params.toString()}`)
		if (!response.ok) throw new Error('Error al cargar los bienes')
		
		const data = await response.json()
		bienesList.value = data
		totalPages.value = Math.ceil((data.total || 0) / itemsPerPage)
	} catch (e) {
		error.value = e.message
		bienesList.value = { data: [] }
	} finally {
		isLoading.value = false
	}
}

const clearFilters = () => {
	searchQuery.value = ''
	selectedStatus.value = ''
	selectedCategory.value = ''
	currentPage.value = 1
	fetchBienes()
}

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++
		fetchBienes()
	}
}

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--
		fetchBienes()
	}
}

const viewBienDetails = (bien) => {
	selectedBien.value = bien
}

const abrirGenerarSolicitud = (bienNombre) => {
	selectedBienParaSolicitud.value = bienNombre
	solicitudData.value = {
		tipo: '',
		motivo: ''
	}
	showGenerarSolicitudModal.value = true
}

const enviarSolicitud = () => {
	if (!solicitudData.value.tipo) {
		alert('Por favor selecciona un tipo de solicitud')
		return
	}
	if (!solicitudData.value.motivo.trim()) {
		alert('Por favor ingresa un motivo o justificación')
		return
	}

	console.log('Solicitud de movimiento creada:', {
		bien: selectedBienParaSolicitud.value,
		tipo: solicitudData.value.tipo,
		motivo: solicitudData.value.motivo
	})

	alert('Solicitud de movimiento registrada para: ' + selectedBienParaSolicitud.value)
	showGenerarSolicitudModal.value = false
	solicitudData.value = {
		tipo: '',
		motivo: ''
	}
}

const abrirTraspasoModal = (bienNombre) => {
	selectedBienParaTraspasor.value = bienNombre
	traspasoData.value = {
		resguardante: '',
		oficina: ''
	}
	showTraspasoModal.value = true
}

const confirmarTraspaso = () => {
	if (!traspasoData.value.resguardante.trim()) {
		alert('Por favor ingresa el nombre del resguardante')
		return
	}

	console.log('Transferencia creada:', {
		bien: selectedBienParaTraspasor.value,
		resguardante: traspasoData.value.resguardante,
		oficina: traspasoData.value.oficina
	})

	alert('Transferencia registrada para: ' + traspasoData.value.resguardante)
	showTraspasoModal.value = false
	traspasoData.value = {
		resguardante: '',
		oficina: ''
	}
}

watch(searchQuery, () => {
	currentPage.value = 1
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value)
	}
	searchTimeout.value = setTimeout(() => {
		fetchBienes()
	}, 500)
})

onMounted(() => {
	fetchBienes()
})
</script>
