<template>
    <div class="space-y-6">
        
        <div class="flex justify-between items-center">
            <label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Catálogo CUCOP/CAMB</label>
            <label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
        </div>

        <div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4">
            <div class="flex flex-col md:flex-row gap-4 items-end">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
                    <input 
                        v-model="searchTerm"
                        type="text" 
                        placeholder="Buscar por Clave CUCOP, CAMB o Descripción..."
                        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                </div>
                <button 
                    @click="openNewModal"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
                    Nuevo Registro
                </button>
            </div>
        </div>

        <div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table class="w-full text-sm">
                <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Clave CUCOP</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">CAMB</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Descripción</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Partida Específica</th>
                        <th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                    
                    <tr v-if="isLoading">
                        <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                            Cargando catálogo...
                        </td>
                    </tr>
                    
                    <tr v-else-if="fetchError">
                        <td colspan="5" class="px-4 py-6 text-center text-red-500">
                            Error al cargar: {{ fetchError.message }}
                        </td>
                    </tr>

                    <tr v-else-if="filteredCatalogo.length === 0">
                        <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                            No se encontraron registros que coincidan con la búsqueda.
                        </td>
                    </tr>

                    <tr v-else v-for="item in filteredCatalogo" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.clave_cucop }}</td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.camb }}</td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                            <span :title="item.descripcion">
                                {{ item.descripcion.substring(0, 50) }}{{ item.descripcion.length > 50 ? '...' : '' }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.partida_especifica }}</td>
                        <td class="px-4 py-3 flex gap-2 justify-end">
                            <button @click="openEditModal(item)" title="Editar" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            <button @click="openDeleteModal(item)" title="Eliminar" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="filteredCatalogo.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
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
    </div>
    <div v-if="showNewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
                <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Registro CUCOP/CAMB</h2>
                    <button @click="showNewModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <div v-if="newError" class="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {{ newError }}
                </div>

                <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clave CUCOP *</label>
                        <input v-model="newItem.clave_cucop" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CAMB</label>
                        <input v-model="newItem.camb" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción *</label>
                        <textarea v-model="newItem.descripcion" rows="3" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Partida Específica</label>
                            <input v-model="newItem.partida_especifica" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clave CUCOP +</label>
                            <input v-model="newItem.clave_cucop_plus" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
                    <button @click="showNewModal = false" :disabled="isSubmitting" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancelar</button>
                    <button @click="saveNewItem" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                        {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
                <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Registro</h2>
                    <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <div v-if="editError" class="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {{ editError }}
                </div>

                <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clave CUCOP *</label>
                        <input v-model="editingItem.clave_cucop" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CAMB</label>
                        <input v-model="editingItem.camb" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción *</label>
                        <textarea v-model="editingItem.descripcion" rows="3" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Partida Específica</label>
                            <input v-model="editingItem.partida_especifica" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clave CUCOP +</label>
                            <input v-model="editingItem.clave_cucop_plus" type="text" class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
                    <button @click="showEditModal = false" :disabled="isSubmitting" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancelar</button>
                    <button @click="saveEditItem" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                        {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
                    </button>
                </div>
            </div>
        </div>

        <ConfirmModal
            :show="showDeleteModal"
            :is-submitting="isSubmitting"
            :error-message="deleteError"
            title="Confirmar Eliminación"
            :message="`¿Estás seguro de que deseas eliminar el registro con clave <strong>${deletingItem?.clave_cucop}</strong>?`"
            confirm-text="Sí, Eliminar"
            @confirm="confirmDelete"
            @cancel="showDeleteModal = false"
            @clearError="deleteError = null"
        />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js' // (Ajusta la ruta si es necesario)
import ConfirmModal from '@/components/ConfirmModal.vue'
// --- Estados Reactivos ---
const isLoading = ref(true)
const fetchError = ref(null)
const catalogoList = ref({ data: [] }) // Asumimos paginación
const searchTerm = ref('') // Para la barra de búsqueda
const currentPage = ref(1)
const itemsPerPage = 15
const totalItems = ref(0)
const isSubmitting = ref(false)

// --- Estados de Modales ---
const showNewModal = ref(false)
const newError = ref(null)

const showEditModal = ref(false)
const editError = ref(null)

const showDeleteModal = ref(false)
const deleteError = ref(null)
const deletingItem = ref(null)

// --- Formularios ---
const newItem = ref({
    clave_cucop: '',
    partida_especifica: '',
    clave_cucop_plus: '',
    descripcion: '',
    camb: ''
})

const editingItem = ref({
    id: null,
    clave_cucop: '',
    partida_especifica: '',
    clave_cucop_plus: '',
    descripcion: '',
    camb: ''
})

/**
 * Carga los datos del catálogo desde la API
 */
const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage) || 1
})

const fetchCatalogo = async (page = 1) => {
    isLoading.value = true
    fetchError.value = null
    try {
        const params = new URLSearchParams()
        params.append('page', page)

        if (searchTerm.value.trim()) {
            params.append('search', searchTerm.value.toUpperCase())
        }

        // Asumo esta ruta base para tu catálogo
        const response = await authenticatedFetch(`/catalogo-camb-cucop?${params.toString()}`)
        if (!response.ok) {
            throw new Error('Error al cargar el catálogo CUCOP/CAMB')
        }
        const data = await response.json()
        catalogoList.value = data
        totalItems.value = data.total || 0
        currentPage.value = page
    } catch (e) {
        console.error('Error:', e)
        fetchError.value = e
        catalogoList.value = { data: [] }
    } finally {
        isLoading.value = false
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        fetchCatalogo(currentPage.value + 1)
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        fetchCatalogo(currentPage.value - 1)
    }
}

watch(searchTerm, () => {
    currentPage.value = 1
    fetchCatalogo(1)
})

/**
 * Filtra la lista basado en el término de búsqueda
 */
const filteredCatalogo = computed(() => {
    const list = Array.isArray(catalogoList.value.data) ? catalogoList.value.data : []
    const term = searchTerm.value.toLowerCase()

    if (!term) {
        return list // Devuelve todo si no hay búsqueda
    }

    return list.filter(item => {
        // Convierte campos numéricos a string para la búsqueda
        const claveCucop = String(item.clave_cucop || '')
        const camb = (item.camb || '').toLowerCase()
        const descripcion = (item.descripcion || '').toLowerCase()

        return claveCucop.includes(term) ||
               camb.includes(term) ||
               descripcion.includes(term)
    })
})

// --- Funciones CRUD: NUEVO ---
const openNewModal = () => {
    newItem.value = { clave_cucop: '', partida_especifica: '', clave_cucop_plus: '', descripcion: '', camb: '' }
    newError.value = null
    showNewModal.value = true
}

const saveNewItem = async () => {
    newError.value = null
    // Validación simple (frontend)
    if (!newItem.value.clave_cucop || !newItem.value.descripcion) {
        newError.value = 'La Clave CUCOP y la Descripción son obligatorias.'
        return
    }

    isSubmitting.value = true
    try {
        // El backend añade los campos constantes (tipo, nivel, etc.) automáticamente
        const payload = {
            tipo: '1', // Aunque el backend lo fuerza, a veces es mejor enviarlo si la validación 'required' es estricta antes de la lógica
            clave_cucop: newItem.value.clave_cucop,
            partida_especifica: newItem.value.partida_especifica,
            clave_cucop_plus: newItem.value.clave_cucop_plus,
            descripcion: newItem.value.descripcion,
            camb: newItem.value.camb
        }

        const response = await authenticatedFetch('/catalogo-camb-cucop', {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            throw new Error(errData.message || 'No se pudo crear el registro.')
        }

        showNewModal.value = false
        await fetchCatalogo() // Recargar tabla

    } catch (e) {
        newError.value = e.message
    } finally {
        isSubmitting.value = false
    }
}

// --- Funciones CRUD: EDITAR ---
const openEditModal = (item) => {
    editingItem.value = {
        id: item.id ?? item._id ?? null,
        clave_cucop: item.clave_cucop,
        partida_especifica: item.partida_especifica,
        clave_cucop_plus: item.clave_cucop_plus,
        descripcion: item.descripcion,
        camb: item.camb
    }
    console.log('Abriendo modal de edición para:', editingItem.value)
    editError.value = null
    showEditModal.value = true
}

const saveEditItem = async () => {
    editError.value = null
    if (!editingItem.value || (editingItem.value.id === null || editingItem.value.id === undefined)) {
        editError.value = 'No se pudo determinar el ID del registro a editar.'
        return
    }
    if (!editingItem.value.clave_cucop || !editingItem.value.descripcion) {
        editError.value = 'La Clave CUCOP y la Descripción son obligatorias.'
        return
    }

    isSubmitting.value = true
    try {
        const payload = {
            tipo: '1',
            clave_cucop: editingItem.value.clave_cucop,
            partida_especifica: editingItem.value.partida_especifica,
            clave_cucop_plus: editingItem.value.clave_cucop_plus || 'N/A',
            descripcion: editingItem.value.descripcion,
            camb: editingItem.value.camb
        }

        console.log('Payload de edición:',payload)
        console.log('ID del ítem a editar:',editingItem.value.id)
        const response = await authenticatedFetch(`/catalogo-camb-cucop/${editingItem.value.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            throw new Error(errData.message || 'No se pudo actualizar el registro.')
        }

        showEditModal.value = false
        await fetchCatalogo()

    } catch (e) {
        editError.value = e.message
    } finally {
        isSubmitting.value = false
    }
}

// --- Funciones CRUD: ELIMINAR ---
const openDeleteModal = (item) => {
    // Asegura compatibilidad con APIs que usan `id` o `_id`
    deletingItem.value = {
        ...(item || {}),
        id: item?.id ?? item?._id ?? null
    }
    deleteError.value = null
    showDeleteModal.value = true
}

const confirmDelete = async () => {
    if (!deletingItem.value) return
    isSubmitting.value = true
    try {
        const response = await authenticatedFetch(`/catalogo-camb-cucop/${deletingItem.value.id}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            throw new Error(errData.message || 'No se pudo eliminar el registro.')
        }

        showDeleteModal.value = false
        deletingItem.value = null
        await fetchCatalogo()

    } catch (e) {
        deleteError.value = e.message
    } finally {
        isSubmitting.value = false
    }
}

// Carga inicial
onMounted(() => {
    fetchCatalogo()
})
</script>
