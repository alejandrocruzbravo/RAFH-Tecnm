<template>
	<div v-if="isLoading" class="flex items-center justify-center h-64">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
		<p class="ml-4 text-gray-600 dark:text-gray-400">Cargando gestores...</p>
	</div>

	<div v-else-if="error" class="p-6 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
		<h3 class="font-bold">Error al cargar los gestores</h3>
		<p>{{ error.message || 'No se pudo conectar con la API.' }}</p>
		<button @click="fetchGestoresData" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
			Reintentar
		</button>
	</div>
	<div v-else class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Gestores</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 space-y-4">
			<div class="flex flex-col md:flex-row gap-4 items-end">
				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar gestor</label>
					<input v-model="searchTerm" type="text" placeholder="Escribe para buscar..." class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<button @click="openNewGestorModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
					Nuevo Gestor
				</button>
				<button @click="showReportModal = true" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2zm2-6a2 2 0 11-4 0 2 2 0 014 0z"></path>
					</svg>
					Reporte
				</button>
			</div>
		</div>
		<!-- TABLA DE GESTORES-->
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-x-auto">
			<div v-if="filteredGestores.length === 0" class="flex items-center justify-center h-64">
				<p class="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">No existen registros</p>
			</div>
			<table v-else class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Apellidos</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Correo</th>
						<th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="gestor in filteredGestores" :key="gestor.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ gestor.gestor_nombre }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ gestor.gestor_apellidos }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ gestor.gestor_correo }}</td>
						<td class="px-4 py-3 flex gap-2 justify-end">
							<button @click="openEditGestorModal(gestor)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" title="Editar">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
							<button @click="openDeleteGestorModal(gestor)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" title="Eliminar">
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
		<div v-if="filteredGestores.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
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
				Página {{ currentPage }} de {{ totalPages }} | Total: {{ totalItems }} resultados
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

		<!-- New Gestor Modal -->
		<div v-if="showNewGestorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Gestor</h2>
					<button @click="showNewGestorModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="newGestorError" class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center" role="alert">
					<span class="font-medium text-sm">{{ newGestorError }}</span>
					<button @click="newGestorError = null" class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input v-model="newGestorData.nombre" type="text" placeholder="Nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
						<input v-model="newGestorData.apellidos" type="text" placeholder="Apellido" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
						<input v-model="newGestorData.correo" type="email" placeholder="correo@institucion.com" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
						<input v-model="newGestorData.password" type="password" placeholder="Contraseña" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewGestorModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewGestor" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar' }}
					</button>
				</div>
			</div>
		</div>

		<!-- Edit Gestor Modal -->
		<div v-if="showEditGestorModal && editingGestor.id" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Gestor</h2>
					<button @click="showEditGestorModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="editGestorError" class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center" role="alert">
					<span class="font-medium text-sm">{{ editGestorError }}</span>
					<button @click="editGestorError = null" class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input v-model="editingGestor.nombre" type="text" placeholder="Nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
						<input v-model="editingGestor.apellidos" type="text" placeholder="Apellido" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
						<input v-model="editingGestor.correo" type="email" placeholder="correo@institucion.com" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditGestorModal = false" :disabled="isSubmitting" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">Cancelar</button>
					<button @click="saveEditGestor" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
					</button>
				</div>
			</div>
		</div>

		<!-- Report Modal -->
		<div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Generar Reporte</h2>
					<button @click="showReportModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<p class="text-gray-600 dark:text-gray-400">Seleccione el formato de exportación:</p>
					<div class="space-y-2">
						<button class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Exportar a PDF</button>
						<button class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">Exportar a Excel</button>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showReportModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
				</div>
			</div>
		</div>
		<ConfirmModal :show="showDeleteGestorModal" :isSubmitting="isSubmitting" :errorMessage="deleteGestorError" title="Confirmar Eliminación" :message="deleteGestorMessage" confirmText="Sí, Eliminar" confirmClass="bg-red-600 hover:bg-red-700" @confirm="handleConfirmDelete" @cancel="cancelDelete" @clearError="deleteGestorError = null" />
	</div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js'
import ConfirmModal from '@/components/ConfirmModal.vue'

// --- Estados de carga y error ---
const isLoading = ref(true)
const error = ref(null)
const isSubmitting = ref(false)

// --- Estados de datos ---
const gestores = ref({ data: [] })
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 15
const totalItems = ref(0)

// --- Estados de Modales ---
const showNewGestorModal = ref(false)
const showEditGestorModal = ref(false)
const showReportModal = ref(false)
const newGestorError = ref(null)
const showDeleteGestorModal = ref(false)
const deletingGestor = ref(null)
const deleteGestorError = ref(null)
const editGestorError = ref(null)

const totalPages = computed(() => {
	return Math.ceil(totalItems.value / itemsPerPage) || 1
})

const filteredGestores = computed(() => {
	return gestores.value.data || []
})

// --- newGestorData ---
const newGestorData = ref({
	nombre: '',
	apellidos: '',
	correo: '',
	password: '',
})

// --- editingGestor ---
const editingGestor = ref({
	id: null,
	nombre: '',
	apellidos: '',
	correo: '',
})

// --- fetchGestoresData ---
const fetchGestoresData = async (page = 1) => {
	isLoading.value = true
	error.value = null
	try {
		const params = new URLSearchParams()
		params.append('page', page)

		if (searchTerm.value.trim()) {
			params.append('search', searchTerm.value.toUpperCase())
		}

		const gestoresRes = await authenticatedFetch(`/gestores?${params.toString()}`)

		if (!gestoresRes.ok) throw new Error('Error al cargar gestores')
		const gestoresData = await gestoresRes.json()

		gestores.value = gestoresData
		totalItems.value = gestoresData.total || 0
		currentPage.value = page
	} catch (e) {
		console.error('Error al cargar datos:', e)
		error.value = e
		gestores.value = { data: [] }
	} finally {
		isLoading.value = false
	}
}

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		fetchGestoresData(currentPage.value + 1)
	}
}

const prevPage = () => {
	if (currentPage.value > 1) {
		fetchGestoresData(currentPage.value - 1)
	}
}

watch(searchTerm, () => {
	currentPage.value = 1
	fetchGestoresData(1)
})

// --- Cargar datos al montar ---
onMounted(() => {
	fetchGestoresData(1)
})

// --- openNewGestorModal ---
const openNewGestorModal = () => {
	newGestorData.value = {
		nombre: '',
		apellidos: '',
		correo: '',
		password: '',
	}
	newGestorError.value = null
	showNewGestorModal.value = true
}

// --- saveNewGestor ---
const saveNewGestor = async () => {
	newGestorError.value = null
	if (!newGestorData.value.nombre || !newGestorData.value.apellidos || !newGestorData.value.correo || !newGestorData.value.password) {
		newGestorError.value = 'Todos los campos son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			gestor_nombre: newGestorData.value.nombre,
			gestor_apellidos: newGestorData.value.apellidos,
			gestor_correo: newGestorData.value.correo,
			usuario_pass: newGestorData.value.password,
			usuario_id_rol: 2,
		}
		const response = await authenticatedFetch('/gestores', {
			method: 'POST',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo crear el gestor.')
		}

		showNewGestorModal.value = false
		await fetchGestoresData()
	} catch (err) {
		console.error('Error al guardar gestor:', err)
		newGestorError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const openEditGestorModal = (gestor) => {
	editingGestor.value = {
		id: gestor.id,
		nombre: gestor.gestor_nombre,
		apellidos: gestor.gestor_apellidos,
		correo: gestor.gestor_correo,
	}

	editGestorError.value = null
	showEditGestorModal.value = true
}

const saveEditGestor = async () => {
	if (!editingGestor.value.id) return

	editGestorError.value = null

	if (!editingGestor.value.nombre || !editingGestor.value.apellidos || !editingGestor.value.correo) {
		editGestorError.value = 'Nombre, Apellidos y Correo son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			gestor_nombre: editingGestor.value.nombre,
			gestor_apellidos: editingGestor.value.apellidos,
			gestor_correo: editingGestor.value.correo,
		}

		const response = await authenticatedFetch(`/gestores/${editingGestor.value.id}`, {
			method: 'PUT',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo actualizar el gestor.')
		}

		showEditGestorModal.value = false
		await fetchGestoresData()
	} catch (err) {
		console.error('Error al actualizar gestor:', err)
		editGestorError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const deleteGestorMessage = computed(() => {
	if (!deletingGestor.value) return ''
	const name = `${deletingGestor.value.gestor_nombre} ${deletingGestor.value.gestor_apellidos || ''}`.trim()
	return `��Está seguro de que desea eliminar al gestor:<br><strong class='font-medium text-lg text-gray-900 dark:text-white'>${name}</strong>?`
})

const openDeleteGestorModal = (gestor) => {
	deletingGestor.value = gestor
	deleteGestorError.value = null
	showDeleteGestorModal.value = true
}

const cancelDelete = () => {
	showDeleteGestorModal.value = false
	deletingGestor.value = null
	deleteGestorError.value = null
}

const handleConfirmDelete = async () => {
	if (!deletingGestor.value) return

	isSubmitting.value = true
	deleteGestorError.value = null

	try {
		const response = await authenticatedFetch(`/gestores/${deletingGestor.value.id}`, {
			method: 'DELETE'
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo eliminar el gestor.')
		}

		showDeleteGestorModal.value = false
		await fetchGestoresData()
		deletingGestor.value = null
	} catch (err) {
		console.error('Error al eliminar gestor:', err)
		deleteGestorError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}
</script>
