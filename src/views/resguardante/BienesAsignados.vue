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
					<input v-model="searchQuery" type="text" placeholder="Buscar por descripción o código..."
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>

				<!-- Filter by Status -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
					<select v-model="selectedStatus"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option value="">Todos</option>
						<option value="Activo">Activo</option>
						<option value="En tránsito">En tránsito</option>
					</select>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-2 flex-wrap">
				<button @click="fetchBienes"
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
					Aplicar Filtros
				</button>
				<button @click="clearFilters"
					class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition text-sm font-medium">
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
		<div v-else-if="filteredBienes.length === 0"
			class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-8 text-center">
			<svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor"
				viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay bienes asignados</h3>
			<p class="text-gray-600 dark:text-gray-400">No se encontraron bienes que coincidan con los filtros.</p>
		</div>

		<!-- Bienes Cards -->
		<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div v-for="bien in filteredBienes" :key="bien.id"
				class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 border border-gray-200 dark:border-gray-700">
				<!-- Header with Icon -->
				<div class="flex items-start justify-between mb-3">
					<div class="flex items-start gap-3">
						<div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
							<svg v-if="bien.categoria === 'electrónica'"
								class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
							</svg>
							<svg v-else class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H4V4h14v10z" />
							</svg>
						</div>
						<div class="flex-1">
							<h3 class="font-semibold text-gray-900 dark:text-white">{{ bien.bien_descripcion }}</h3>
							<p class="text-xs text-gray-600 dark:text-gray-400">Código: {{ bien.bien_codigo }}</p>
						</div>
					</div>
					<div class="px-4 py-3 text-right">
						<span v-if="bien.bien_estado === 'Activo'"
							class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">Activo</span>

						<span v-else-if="bien.bien_estado === 'En tránsito'"
							class="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs font-semibold"
							style="cursor: help;"
							:title="'📍 Ubicación Actual: ' + (bien.ubicacion_actual?.nombre || 'Desconocida')">
							En tránsito
						</span>

						<span v-else-if="bien.bien_estado === 'Extravíado'"
							class="inline-block px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">Extravíado</span>

						<span v-else-if="bien.bien_estado === 'Baja'"
							class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-semibold">Baja</span>

						<span v-else
							class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-semibold">{{
								bien.bien_estado || 'N/A' }}</span>
					</div>
				</div>

				<!-- Details -->
				<div class="space-y-2 mb-4 text-sm">
					<p class="text-gray-600 dark:text-gray-400">
						<strong class="text-gray-700 dark:text-gray-300">Ubicación:</strong> {{
							bien.bien_caracteristicas || 'N/A' }}
					</p>
					<p class="text-gray-600 dark:text-gray-400">
						<strong class="text-gray-700 dark:text-gray-300">Modelo:</strong> {{ bien.bien_modelo || 'N/A'
						}}
					</p>
					<p class="text-gray-600 dark:text-gray-400">
						<strong class="text-gray-700 dark:text-gray-300">Marca:</strong> {{ bien.bien_marca || 'N/A' }}
					</p>
				</div>

				<!-- Actions -->
				<div class="flex gap-2 mt-4">
					<template v-if="bien.bien_estado === 'En tránsito'">
						<button @click="handleRegresarBien(bien)"
							class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-lg shadow-indigo-500/20">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
							</svg>
							Regresar bien
						</button>
					</template>
					<div v-if="bien.traspaso_pendiente" class="w-full">
						<div class="w-full px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2"
							:title="'Solicitud enviada el ' + bien.traspaso_pendiente.created_at">
							<svg class="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Pendiente de Autorización
						</div>
					</div>

					<template v-else>
						<button @click="openMoverModal(bien)"
							class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium shadow-lg shadow-purple-500/20">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
							</svg>
							Mover a...
						</button>
						<button @click="openTraspasoModal(bien)"
							class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-lg shadow-blue-500/20">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
							</svg>
							Traspasar
						</button>
					</template>


				</div>
			</div>
		</div>

		<!-- Pagination Controls -->
		<div v-if="filteredBienes.length > 0"
			class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
			<button @click="prevPage" :disabled="currentPage === 1"
				class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Atrás
			</button>

			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Página {{ currentPage }} de {{ totalPages }}
			</span>

			<button @click="nextPage" :disabled="currentPage === totalPages"
				class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2">
				Adelante
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>
	<ModalMoverBien :show="showMover" :bien="selectedBien" :fetchFunction="authenticatedFetch"
		@close="showMover = false" @move-success="handleMoveSuccess" />
	<ModalTraspaso :show="showTraspaso" :bien="selectedBien" :fetchFunction="authenticatedFetch"
		@close="showTraspaso = false" @success="fetchBienes" />
	<ModalConfirmacionMover :show="showConfirmModal" title="Regresar bien a origen"
		message="¿Confirmas que el bien ha llegado físicamente a su oficina de origen? El estado cambiará a Activo."
		@cancel="showConfirmModal = false" @confirm="confirmRegreso" />
	<ModalExito :show="showSuccessModal" title="Solicitud Enviada" :message="successMessage" />
	<ModalExito :show="showNotificationModal" :title="notificationTitle" :message="notificationMessage"
		:type="notificationType" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { authenticatedFetch } from '../../config/api.js'
import ModalMoverBien from '../../components/ModalMoverBien.vue' // O la ruta donde lo tengas
import ModalTraspaso from '../../components/ModalTraspaso.vue'
import ModalConfirmacionMover from '../../components/ModalConfirmacionMover.vue'
import ModalExito from '../../components/ModalExito.vue'


const isLoading = ref(true)
const error = ref('')
const bienesList = ref({ data: [] })
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedCategory = ref('')
const selectedBien = ref(null)

const showMover = ref(false)
const showTraspaso = ref(false)

const currentPage = ref(1)
const itemsPerPage = 15
const totalPages = ref(1)
const searchTimeout = ref(null)
// Estado para el modal de confirmación
const showConfirmModal = ref(false)
const bienToReturn = ref(null) // Guardamos temporalmente qué bien se va a regresar

const showSuccessModal = ref(false)
const successMessage = ref('')

const showNotificationModal = ref(false)
const notificationTitle = ref('')
const notificationMessage = ref('')

const notificationType = ref('success')

const filteredBienes = computed(() => {
	return bienesList.value.data || []
})
const getUserId = () => {
	const userStr = localStorage.getItem('user');
	if (userStr) {
		const user = JSON.parse(userStr);
		return user.id; // ID de la tabla 'usuarios'
	}
	return null;
}

const fetchBienes = async () => {
	isLoading.value = true
	error.value = ''

	const userId = getUserId();

	// Validación de seguridad simple
	if (!userId) {
		error.value = 'No se pudo identificar al resguardante (Sesión no válida).';
		isLoading.value = false;
		return;
	}

	try {
		const params = new URLSearchParams()
		params.append('page', currentPage.value)

		// Solo enviamos search si el usuario escribió algo
		if (searchQuery.value.trim()) {
			params.append('search', searchQuery.value) // Quitamos .toUpperCase() para dejar que el Backend maneje ILIKE
		}
		if (selectedStatus.value) {
			// Enviamos el valor exacto (ej. "Activo" o "En tránsito")
			params.append('estado', selectedStatus.value)
		}


		const response = await authenticatedFetch(`/mis-bienes?${params.toString()}`)

		if (!response.ok) throw new Error('Error al cargar los bienes asignados')

		const data = await response.json()
		bienesList.value = data
		// Manejo seguro de la paginación (evita NaN si data.total es null)
		totalPages.value = data.total ? Math.ceil(data.total / itemsPerPage) : 1

	} catch (e) {
		console.error(e); // Útil para depurar
		error.value = e.message || 'Error de conexión'
		bienesList.value = { data: [] }
	} finally {
		isLoading.value = false
	}
}

const clearFilters = () => {
	searchQuery.value = ''
	selectedStatus.value = ''
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
const openMoverModal = (bien) => {
	selectedBien.value = bien
	showMover.value = true
}

const openTraspasoModal = (bien) => {
	selectedBien.value = bien
	showTraspaso.value = true
}
const handleMoveSuccess = () => {
	// 1. Cerramos el modal
	showMover.value = false;

	// 2. Refrescamos la lista para ver el cambio (el bien ya no debería estar aquí o cambiará de ubicación)
	fetchBienes();
}
const handleRegresarBien = (bien) => {
	// 1. Guardamos el bien seleccionado
	bienToReturn.value = bien;
	// 2. Abrimos el modal
	showConfirmModal.value = true;
}
const confirmRegreso = async () => {
	if (!bienToReturn.value) return;

	// Cerramos el modal primero (opcional, o puedes dejarlo hasta que termine)
	showConfirmModal.value = false;

	isLoading.value = true;
	try {
		const response = await authenticatedFetch(`/bienes/${bienToReturn.value.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				accion: 'regresar'
			})
		});

		if (!response.ok) throw new Error('Error al actualizar el estado del bien');

		await fetchBienes();

	} catch (e) {
		console.error(e);
		error.value = 'No se pudo regresar el bien: ' + e.message;
	} finally {
		isLoading.value = false;
		bienToReturn.value = null; // Limpiamos
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
	fetchBienes();

	const myUserId = getUserId(); // Obtenemos ID de usuario (ej: 3)

	if (window.Echo && myUserId) {
		window.Echo.channel('solicitudes')
			.listen('.solicitud.actualizada', (e) => {

				if (parseInt(e.user_id_destinatario) === parseInt(myUserId)) {

					if (e.estado === 'Aprobada') {
						notificationType.value = 'success';
						notificationTitle.value = '¡Solicitud Aprobada!';
						notificationMessage.value = `El traspaso de "${e.bien_nombre}" ha sido autorizado.`;
					} else {
						notificationType.value = 'error'; // <--- ESTO ES LO NUEVO
						notificationTitle.value = 'Solicitud Rechazada';
						notificationMessage.value = `El traspaso de "${e.bien_nombre}" fue denegado.`;
					}

					showNotificationModal.value = true;
					fetchBienes();

					setTimeout(() => {
						showNotificationModal.value = false;
					}, 5000);
				}
			});
	}
})

// No olvides desconectarte al salir
onUnmounted(() => {
	if (window.Echo) {
		window.Echo.leave('solicitudes');
	}
})
</script>
