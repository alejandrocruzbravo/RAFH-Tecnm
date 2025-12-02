<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center">
            <label class="text-2xl font-bold text-gray-900 dark:text-white font-audiowide tracking-wide">Catálogo de claves</label>
            <label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de
                Chetumal</label>
        </div>

        <div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 border border-gray-100 dark:border-gray-800">
            <div class="flex flex-col md:flex-row gap-4 items-end">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
                    <input v-model="searchTerm" type="text" placeholder="Buscar por Clave CUCOP, CAMB o Descripción..."
                        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                </div>
                <div class="flex flex-col md:flex-row gap-4 items-end">
                    <div class="flex-1">
                    </div>

                    <button @click="showConfigModal = true"
                        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium flex items-center gap-2"
                        title="Configurar reglas de etiquetado">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="hidden md:inline">Configuración</span>
                    </button>
                </div>

                <div v-if="showConfigModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                        class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div class="flex justify-end p-4">
                            <button @click="showConfigModal = false"
                                class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <div class="p-6 pt-0">
                            <InventoryConfig @saved="onConfigSaved" />
                        </div>
                    </div>
                </div>
                <button @click="openNewModal"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
                    Nuevo Registro
                </button>
            </div>
        </div>

        <div
            class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-x-auto overflow-y-auto max-h-[60vh] border border-gray-100 dark:border-gray-800">
            <table class="w-full text-sm">
                <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Clave CUCOP</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Clave Interna</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Descripción</th>
                        <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Partida Específica
                        </th>
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

                    <tr v-else v-for="item in filteredCatalogo" :key="item.id"
                        class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.clave_cucop }}</td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.camb }}</td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                            <span :title="item.descripcion">
                                {{ item.descripcion.substring(0, 50) }}{{ item.descripcion.length > 50 ? '...' : '' }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.partida_especifica }}</td>
                        <td class="px-4 py-3 flex gap-2 justify-end">
                            <button @click="openEditModal(item)" title="Editar"
                                class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                    </path>
                                </svg>
                            </button>
                            <button @click="openDeleteModal(item)" title="Eliminar"
                                class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="filteredCatalogo.length > 0"
            class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Atrás
            </button>

            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Página {{ currentPage }} de {{ totalPages }} | Total: {{ totalItems }} resultados
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

    <!-- Modal de nuevo registro-->
    <div v-if="showNewModal"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div
            class="bg-white dark:bg-dark-bg rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">

            <div
                class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                <h2 class="text-lg font-bold text-gray-800 dark:text-white">Nuevo Registro</h2>
                <button @click="showNewModal = false"
                    class="text-gray-400 hover:text-gray-600 transition-colors text-2xl">&times;</button>
            </div>

            <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                <div class="relative">
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        ¿Qué deseas registrar?
                    </label>
                    <div class="relative group">
                        <input type="text" v-model="searchQuery" @focus="showDropdown = true" @blur="handleBlur"
                            placeholder="Buscar por partida o código (1.2.3.4)"
                            class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all z-10 relative">
                        <div class="absolute left-3 top-3.5 text-gray-400 z-20">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>

                        <div v-if="showDropdown"
                            class="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden max-h-60 overflow-y-auto">

                            <ul v-if="filteredAccounts.length > 0">
                                <li v-for="item in filteredAccounts" :key="item.id"
                                    @mousedown.prevent="selectAccount(item)"
                                    class="px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors group">
                                    <div class="flex justify-between items-center">
                                        <span
                                            class="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {{ item.nombre }}
                                        </span>
                                        <div class="flex gap-2 text-xs">
                                            <span
                                                class="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600 font-mono">
                                                {{ item.clave_gasto }}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div v-else-if="searchQuery"
                                class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No hay coincidencias para "{{ searchQuery }}"
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative py-2">
                    <div class="absolute inset-0 flex items-center" aria-hidden="true">
                        <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div class="relative flex justify-center">
                        <span
                            class="px-3 bg-white dark:bg-gray-900 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Datos Generados
                        </span>
                    </div>
                </div>

                <div
                    class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <small class="text-xs text-gray-500 dark:text-gray-400 uppercase">La clave CUCOP se generá automáticamente en base a la partida seleccionada</small>
                    <div>
                        <label
                            class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Partida</label>
                        <input v-model="newItem.partida_especifica" type="text"
                            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" disabled>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-blue-600 to-blue-500 p-0.5 rounded-xl shadow-lg shadow-blue-500/20">
                    <div class="bg-white dark:bg-gray-800 rounded-[10px] p-4">
                        <div class="flex justify-between items-end mb-2">
                            <label class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Clave Inventario
                            </label>
                            <span
                                class="text-[10px] font-semibold text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                                Automático
                            </span>
                        </div>
                        <div class="flex items-center bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-1">
                            <input v-model="newItem.camb" type="text" readonly
                                class="w-full bg-transparent text-xl md:text-2xl font-mono font-bold text-gray-800 dark:text-white outline-none placeholder-gray-300 dark:placeholder-gray-600 py-1"
                                placeholder="---">
                            <div v-if="newItem.camb" class="animate-bounce ml-2">
                                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nombre del bien
                        *</label>
                    <textarea v-model="newItem.descripcion" rows="3"
                        class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"></textarea>
                </div>
            </div>

            <div class="p-6 pt-1 flex gap-3 justify-end bg-white dark:bg-gray-800 ">
                <button @click="showNewModal = false" :disabled="isSubmitting"
                    class="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Cancelar
                </button>
                <button @click="saveNewItem" :disabled="isSubmitting"
                    class="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                    {{ isSubmitting ? 'Guardando...' : 'Guardar Registro' }}
                </button>
            </div>
        </div>
    </div>
 <!-- Modal de editar registro-->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
            <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Registro</h2>
                <button @click="showEditModal = false"
                    class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div v-if="editError" class="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {{ editError }}
            </div>

            <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CAMB</label>
                    <input v-model="editingItem.camb" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción *</label>
                    <textarea v-model="editingItem.descripcion" rows="3"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clave CUCOP
                        </label>
                        <input v-model="editingItem.clave_cucop" type="text"
                            class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </input>
                    </div>
                </div>
            </div>

            <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
                <button @click="showEditModal = false" :disabled="isSubmitting"
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancelar</button>
                <button @click="saveEditItem" :disabled="isSubmitting"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                    {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
            </div>
        </div>
    </div>

    <ConfirmModal :show="showDeleteModal" :is-submitting="isSubmitting" :error-message="deleteError"
        title="Confirmar Eliminación"
        :message="`¿Estás seguro de que deseas eliminar el registro con clave <strong>${deletingItem?.clave_cucop}</strong>?`"
        confirm-text="Sí, Eliminar" @confirm="confirmDelete" @cancel="showDeleteModal = false"
        @clearError="deleteError = null" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js' // (Ajusta la ruta si es necesario)
import { authenticatedQueryAPI2, API_CONFIG_2 } from '../../../config/api.js'
import ConfirmModal from '@/components/ConfirmModal.vue'
import InventoryConfig from '@/components/InventoryConfig.vue'
// --- Estados Reactivos ---
const isLoading = ref(true)
const fetchError = ref(null)
const catalogoList = ref({ data: [] }) // Asumimos paginación
const searchTerm = ref('') // Para la barra de búsqueda
const currentPage = ref(1)
let searchTimeout = null
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
const showConfigModal = ref(false)

const inventoryConfig = ref(null) // La config del usuario (Prefijos, Estructura)



const accountOptions = ref([]) // Lista completa de la API
const searchQuery = ref('')    // Lo que escribe el usuario
const showDropdown = ref(false) // Controlar visibilidad del menú

// --- Formularios ---
const newItem = ref({
    partida_especifica: '',
    descripcion: '',
    camb: ''
})

const editingItem = ref({
    id: null,
    partida_especifica: '',
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
            throw new Error('Error al cargar el cat��logo CUCOP/CAMB')
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

watch(
    () => newItem.value.partida_especifica,
    (newPartida) => {
        // Ejecutar solo si hay al menos 3 dígitos (ej. "511")
        if (newPartida && newPartida.length >= 3) {

            // Llamamos a la función generadora que creamos en el paso anterior
            const claveGenerada = generateSmartCAMB(newPartida)

            // Si generó algo válido, lo asignamos
            if (claveGenerada) {
                newItem.value.camb = claveGenerada
            }
        }
    }
)

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
    newItem.value = { clave_cucop: '', partida_especifica: '', descripcion: '', camb: '' }
    newError.value = null
    showNewModal.value = true
}

const saveNewItem = async () => {
    newError.value = null
    // Validación simple (frontend)
    if (!newItem.value.descripcion) {
        newError.value = 'La descripción son obligatorias.'
        return
    }

    isSubmitting.value = true
    try {
        let cambParaBackend = newItem.value.camb

        if (cambParaBackend && cambParaBackend.includes('####')) {

            //Quitar separador final (si queda "MUE-25-23-")
            cambParaBackend = cambParaBackend.replace(/[-/.]####$/, '') 
        }
        const payload = {
            partida_especifica: newItem.value.partida_especifica,
            descripcion: newItem.value.descripcion,
            camb: cambParaBackend
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
        descripcion: item.descripcion,
        camb: item.camb
    }
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
            clave_cucop: editingItem.value.clave_cucop,
            descripcion: editingItem.value.descripcion,
            camb: editingItem.value.camb
        }
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
onMounted(async () => {
    isLoading.value = true
    try {
        await fetchCatalogo()
        await loadInventoryConfig() // Solo cargamos esto y listo
        await loadAccountOptions()
    } catch (e) {
        console.error("Error inicializando:", e)
    } finally {
        isLoading.value = false
    }
})
const onConfigSaved = async() => {
    showConfigModal.value = false
    await loadInventoryConfig()
    // Aquí podrías mostrar un toast: "Configuración actualizada"
    // Y recargar la configuración local si la tienes en memoria
}
// A. Cargar Configuración del Usuario (Desde tu BD MySQL)
const loadInventoryConfig = async () => {
    try {
        const response = await authenticatedFetch('/configuracion-inventario', { method: 'GET' })
        if (response.ok) {
            const data = await response.json()
            inventoryConfig.value = data // Guardamos { structure:..., prefixes:... }
        }
    } catch (e) {
        console.error("Error cargando config inventario:", e)
    }
}

// B. Cargar Mapa de Traducción (Desde API NucleoDigital)
// Necesitamos saber que la partida "511" pertenece a la clasificación "1.2.4.1"

const generateSmartCAMB = (partidaEspecifica) => {
    // 1. Validaciones
    if (!partidaEspecifica || partidaEspecifica.length < 3) return ''
    if (!inventoryConfig.value) return ''

    const { structure, prefixes } = inventoryConfig.value

    // 2. OBTENER FAMILIA (CLAVE GASTO)
    // De "51101", tomamos "511". 
    // ¡Esto coincide exactamente con lo que guardamos en la configuración ahora!
    const familia = partidaEspecifica.substring(0, 3)

    // 3. BUSCAR PREFIJO DIRECTAMENTE
    const found = prefixes.find(p => p.api_code === familia)
    const catPrefix = found ? found.prefix : 'GEN'

    // --- (El resto de la lógica de armado de string queda IDÉNTICA) ---
    const currentYearStr = new Date().getFullYear().toString()
    const p_year = structure.yearFormat === 'YY' ? currentYearStr.slice(-2) : currentYearStr
    const p_inst = structure.institutionPrefix || 'INST'
    const p_seq = '####'

    let parts = []
    if (structure.includeInstitution) {
        if (structure.institutionPosition === 'start') {
            parts.push(p_inst); parts.push(catPrefix)
        } else if (structure.institutionPosition === 'middle') {
            parts.push(catPrefix); parts.push(p_inst)
        } else {
            parts.push(catPrefix)
        }
    } else {
        parts.push(catPrefix)
    }

    // Año
    if (structure.includeYear) parts.push(p_year)

    // Inst (Final)
    if (structure.includeInstitution && structure.institutionPosition === 'before_seq') {
        parts.push(p_inst)
    }

    // Consecutivo
    parts.push(p_seq)

    return parts.join(structure.separator || '-')
}

const loadAccountOptions = async () => {
    try {
        // Usamos credenciales del auth store o session (ajusta según tu proyecto)
        const storedCredentials = sessionStorage.getItem('user_credentials');

        if (!storedCredentials) {
            errorMessage.value = 'No hay credenciales disponibles. Inicia sesión nuevamente.';
            return;
        }

        const { email, password } = JSON.parse(storedCredentials);
        const response = await authenticatedQueryAPI2(
            API_CONFIG_2.ENDPOINTS.LOGIN,
            email,
            password,
            {
                // Si tu API requiere especificar qué tabla quieres, úsalo aquí.
                // Si devuelve todo por defecto, deja el body vacío.
                // body: { accion: 'obtener_catalogos' } 
            }
        )
        const data = await response.json()
        // Extraer lista y asegurar que sea array
        const list = data.datosTablas?.h25_cat_subcuentas_bienes || data.h25_cat_subcuentas_bienes || []
        accountOptions.value = list
    } catch (e) {
        console.error("Error cargando opciones de cuentas:", e)
    }
}
const filteredAccounts = computed(() => {
    if (!searchQuery.value) return []
    const term = searchQuery.value.toLowerCase()
    return accountOptions.value.filter(item =>
        (item.nombre && item.nombre.toLowerCase().includes(term)) ||
        (item.clave_gasto && item.clave_gasto.includes(term)) ||
        (item.codigo && item.codigo.includes(term))
    ).slice(0, 8) // Limitamos a 8 resultados para no saturar
})

const selectAccount = (item) => {
    // 1. Obtener la clave base (Ej. 511)
    const partidaBase = item.clave_gasto // "511"

    // 2. Auto-llenar Partida Específica
    // Nota: La partida específica suele ser de 5 dígitos (51101). 
    // Como la API da 3, agregamos '01' por defecto o dejamos la base.
    newItem.value.partida_especifica = partidaBase + "01"

    // 6. Limpieza UI
    searchQuery.value = item.nombre // Mostrar el nombre seleccionado
    showDropdown.value = false
}
const handleBlur = () => {
    setTimeout(() => {
        showDropdown.value = false
    }, 200)
}
</script>
