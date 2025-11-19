<template>
    <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
        <p class="ml-4 text-gray-600 dark:text-gray-400">Cargando bienes...</p>
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
            <label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Bienes Materiales</label>
            <label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de
                Chetumal</label>
        </div>
        <div v-if="error" class="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            <strong>Error:</strong> {{ error }}
        </div>

        <div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecciona un Área para
                empezar</label>
            <select v-model="selectedArea" @change="fetchStructure"
                class="w-full md:w-1/3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50">
                <option v-if="!isLoading && areasList.length === 0" disabled class="text-gray-400">
                    No hay áreas registradas.
                </option>
                <option :value="null">Selecciona un área</option>
                <option v-for="area in areasList" :key="area.id" :value="area.id">
                    {{ area.area_nombre }}
                </option>
            </select>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Columna izquierda: Departamentos y Oficinas -->
            <div
                class="lg:col-span-1 bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white px-2">Departamentos</h3>

                <div v-if="isLoadingStructure" class="flex items-center justify-center p-10">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-600"></div>
                    <p class="ml-4 text-gray-600 dark:text-gray-400">Cargando Departamentos...</p>
                </div>

                <div v-else-if="!selectedArea" class="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
                    Selecciona un área para ver sus departamentos.
                </div>

                <div v-else-if="structureData.length === 0"
                    class="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
                    Aun no hay departamentos asignados a esta área.
                </div>

                <div v-for="dept in structureData" :key="dept.id"
                    class="border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
                    <button @click="toggleDepartment(dept.id)"
                        class="w-full flex justify-between items-center text-left font-semibold text-gray-800 dark:text-white p-3 bg-gray-50 dark:bg-gray-700/50 rounded-t-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span>{{ dept.dep_nombre }}</span>

                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                            :class="{ 'rotate-180': expandedDepartmentId === dept.id }"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div v-if="expandedDepartmentId === dept.id"
                        class="p-2 space-y-1 border-t border-gray-200 dark:border-gray-700">
                        <button @click="openLoteQR(dept)"
                            class="w-full px-3 py-2 border border-green-700 text-green-700 bg-transparent hover:bg-green-50 dark:hover:bg-green-700/20 rounded-md text-sm font-medium transition-colors">
                            Generar QRs para todo el Depto. ({{ dept.oficinas.length }})
                        </button>

                        <p v-if="dept.oficinas.length === 0" class="px-2 py-1 text-xs text-gray-400 dark:text-gray-500">
                            Sin oficinas</p>

                        <div v-for="oficina in dept.oficinas" :key="oficina.id" class="flex items-center gap-1">
                            <button @click="selectOficina(oficina)" :class="[
                                'flex-1 text-left px-2 py-1.5 rounded-md text-sm transition-colors',
                                selectedOficina?.id === oficina.id ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            ]">
                                {{ oficina.nombre }}
                            </button>

                            <button @click="openOficinaQR(oficina)" title="Generar QR para esta oficina"
                                class="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z" />
                                    <path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
                                        d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z" />
                                </svg>

                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Columna derecha: Bienes (tabla) -->
            <div class="lg:col-span-2">
                <div v-if="!selectedOficina"
                    class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-6 flex items-center justify-center h-full">
                    <p class="text-gray-500 dark:text-gray-400">Selecciona una oficina de la lista para ver los bienes.
                    </p>
                </div>

                <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div
                        class="xl:col-span-4 bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 max-h-[80vh]">
                        <div class="xl:col-span-2 bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950">
                            <div
                                class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedOficina.nombre
                                    }}</h3>

                                <div v-if="!isSelectionModeActive" class="flex gap-2">
                                    <button @click="activateSelectionMode"
                                        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm">
                                        Selección de Lote
                                    </button>
                                    <button @click="showNewBienModal = true"
                                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm">
                                        Nuevo Bien
                                    </button>
                                    <button
                                        class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium text-sm">
                                        Reporte
                                    </button>
                                </div>

                                <div v-else class="flex gap-2">
                                    <button @click="openBienBatchQRModal" :disabled="selectedBienesCount === 0"
                                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50">
                                        Generar QRs ({{ selectedBienesCount }})
                                    </button>
                                    <button @click="cancelSelectionMode"
                                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm">
                                        Cancelar
                                    </button>
                                </div>
                            </div>

                            <div v-if="isLoadingBienes" class="flex items-center justify-center h-64">
                                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-600">
                                </div>
                                <p class="ml-4 text-gray-600 dark:text-gray-400">Cargando bienes...</p>
                            </div>

                            <div v-else class="overflow-x-auto overflow-y-auto max-h-[70vh]">
                                <table class="w-full text-sm">
                                    <thead class="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th v-if="isSelectionModeActive" class="px-4 py-3 w-12 text-center">
                                                <input type="checkbox" v-model="selectAllBienes"
                                                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500">
                                            </th>
                                            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                                                Clave</th>
                                            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                                                Descripción</th>
                                            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                                                Estado</th>
                                            <th
                                                class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white justify-end">
                                                Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                                        <tr v-if="bienesList.data.length === 0">
                                            <td colspan="5" class="px-4 py-6 text-center">No se encontraron bienes.</td>
                                        </tr>
                                        <tr v-else v-for="bien in bienesList.data" :key="bien.id">
                                            <td v-if="isSelectionModeActive" class="px-4 py-3 text-center">
                                                <input type="checkbox" :value="bien.id" v-model="selectedBienes"
                                                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500">
                                            </td>
                                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400"><small>{{
                                                bien.bien_codigo || 'N/A' }}</small></td>
                                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400"><small>{{
                                                bien.bien_descripcion || 'N/A' }}</small></td>
                                            <td class="px-4 py-3">
                                                <span v-if="bien.bien_estado === 'Activo'"
                                                    class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">Activo</span>
                                                <span v-else-if="bien.bien_estado === 'En tránsito'"
                                                    class="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs font-semibold">En
                                                    tránsito</span>
                                                <span v-else-if="bien.bien_estado === 'Extravíado'"
                                                    class="inline-block px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">Extravíado</span>
                                                <span v-else-if="bien.bien_estado === 'Baja'"
                                                    class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-semibold">Baja</span>
                                                <span v-else
                                                    class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-semibold">{{
                                                        bien.bien_estado || 'N/A' }}</span>
                                            </td>
                                            <td class="px-4 py-3 flex gap-2 justify-end">
                                                <button @click="openIndividualQR(bien)" title="Generar QR"
                                                    class="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                    <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white"
                                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                        height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z" />
                                                        <path stroke="currentColor" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    class="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                                                    title="Ver detalles" @click="openVerModal(bien)">
                                                    <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                        height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-width="1.3"
                                                            d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                        <path stroke="currentColor" stroke-width="1.3"
                                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                </button>
                                                <button @click="openEditModal(bien)" title="Editar"
                                                    class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"><svg
                                                        class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                        height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-linecap="round"
                                                            stroke-linejoin="round" stroke-width="1.3"
                                                            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                                    </svg>
                                                </button>
                                                <button @click="openDeleteModal(bien)" title="Eliminar"
                                                    class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"><svg
                                                        class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                        height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-linecap="round"
                                                            stroke-linejoin="round" stroke-width="1.3"
                                                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <ModalNuevoBien :show="showNewBienModal" :fetch-function="authenticatedFetch"
        :id-oficina="selectedOficina ? selectedOficina.id : null" @close="showNewBienModal = false"
        @save="onBienSaved" />
    <DeleteBienModal :show="showDeleteModal" :bien="deletingBien" :fetch-function="authenticatedFetch"
        @close="closeDeleteModal" @delete-success="onBienDeleted" />
    <EditarBienModal :show="showEditModal" :bien="editingBien" :fetch-function="authenticatedFetch"
        @close="showEditModal = false" @edit-success="onBienEdited" />
    <ModalVerBien :show="showVerModal" :bien="selectedBien" @close="closeVerModal" @open-baja-modal="openBajaModal"
        @open-move-modal="openMoveModal" />
    <ModalConfirmarBaja :show="showBajaModal" :bien="selectedBien" :is-submitting="isSubmittingBaja"
        :error-message="bajaError" @close="closeBajaModal" @confirm-baja="handleConfirmBaja"
        @clearError="bajaError = null" />
    <ModalMoverBien :show="showMoveModal" :bien="selectedBien" :fetch-function="authenticatedFetch"
        @close="closeMoveModal" @move-success="onBienMoved" />
    <ModalGeneradorQR :show="showQRModal" :title="qrTitle" :value="qrValue" @close="showQRModal = false" />
    <ModalImpresionLote :show="showLoteModal" :title="loteTitle" :lista="loteList" :is-bienes="true"
        @close="showLoteModal = false" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js'
import ModalNuevoBien from '../../../components/ModalNuevoBien.vue';
import DeleteBienModal from '../../../components/DeleteBienModal.vue'
import EditarBienModal from '../../../components/EditarBienModal.vue'
import ModalVerBien from '../../../components/ModalVerBien.vue'
import ModalConfirmarBaja from '../../../components/ModalConfirmarBaja.vue'
import ModalMoverBien from '../../../components/ModalMoverBien.vue'
import ModalGeneradorQR from '../../../components/ModalGeneradorQR.vue'
import ModalImpresionLote from '../../../components/ModalImpresionLote.vue'

// --- Estados de Carga ---
const isLoading = ref(true)
const isLoadingStructure = ref(false) // Para la columna de Deptos/Oficinas
const isLoadingBienes = ref(false)
const error = ref(null)

// --- Listas de Datos ---
const areasList = ref([])           // Para el dropdown Verde
const structureData = ref([])       // Para las columnas Roja/Azul/Rosa
const bienesList = ref({ data: [] }) // Para la tabla Blanca

const selectedArea = ref(null)
const selectedOficina = ref(null) // Este objeto guardará la info de la oficina (para el cuadro Gris)

const expandedDepartmentId = ref(null) // Rastrea el ID del departamento abierto

const showNewBienModal = ref(false);
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const deletingBien = ref(null) // El 'bien' que se va a eliminar
const editingBien = ref(null) // El 'bien' que se va a editar

const showVerModal = ref(false)
const showBajaModal = ref(false)
const selectedBien = ref(null) // Un ref único para el bien seleccionado
const isSubmittingBaja = ref(false)
const bajaError = ref(null)

const showMoveModal = ref(false)
// Previene que el modal 'Ver' se reabra automáticamente después de confirmar acciones
const preventReopenVer = ref(false)
const showQRModal = ref(false)      // Para el modal individual
const showLoteModal = ref(false)    // Para el modal de lote
const qrTitle = ref('')             // Título para el modal
const qrValue = ref('')             // Valor (código) para el modal individual
const loteTitle = ref('')           // Título para el modal de lote
const loteList = ref([])            // Lista de oficinas para el modal de lote

const isSelectionModeActive = ref(false)  // Controla si los checkboxes son visibles
const selectedBienes = ref(new Set()) // Guarda los IDs de los bienes seleccionados
// --- 1. Funciones de Carga (API) ---
// Carga el primer dropdown al iniciar
const fetchAreas = async () => {
    error.value = null
    try {
        const response = await authenticatedFetch('/areas') // (O la ruta de tu módulo de Áreas)
        if (!response.ok) throw new Error('Error al cargar las áreas')
        const data = await response.json()
        areasList.value = data.data || data
    } catch (e) {
        error.value = e.message
    } finally {
        isLoading.value = false
    }
}

// Carga la estructura anidada de Departamentos y Oficinas (Cuadros Rojo/Azul/Rosa)
const fetchStructure = async () => {
    if (!selectedArea.value) return

    // Resetea todo
    isLoadingStructure.value = true
    structureData.value = []
    bienesList.value = { data: [] }
    selectedOficina.value = null
    error.value = null

    try {
        const response = await authenticatedFetch(`/areas/${selectedArea.value}/structure`)
        if (!response.ok) throw new Error('Error al cargar la estructura del área')
        structureData.value = await response.json()
    } catch (e) {
        error.value = e.message
    } finally {
        isLoadingStructure.value = false
    }
}

// Carga los Bienes (Cuadro Blanco)
const fetchBienes = async () => {
    if (!selectedOficina.value) return

    isLoadingBienes.value = true
    bienesList.value = { data: [] }
    error.value = null

    try {
        const response = await authenticatedFetch(`/oficinas/${selectedOficina.value.id}/bienes`)
        if (!response.ok) throw new Error('Error al cargar los bienes')
        bienesList.value = await response.json()
    } catch (e) {
        error.value = e.message
    } finally {
        isLoadingBienes.value = false
    }
}

// --- 2. Funciones de Interacción ---

// Se llama al hacer clic en una Oficina (Cuadro Rosa)
const selectOficina = (oficina) => {
    selectedOficina.value = oficina
    fetchBienes() // Carga los bienes para esa oficina
}

// --- 3. Carga Inicial ---
onMounted(() => {
    fetchAreas();
})

// Se llama al hacer clic en el título de un departamento
const toggleDepartment = (deptId) => {
    // Si el que se clickeó ya estaba abierto, ciérralo (null).
    // Si no, ábrelo (asigna el ID).
    if (expandedDepartmentId.value === deptId) {
        expandedDepartmentId.value = null;
    } else {
        expandedDepartmentId.value = deptId;
    }
}

const onBienSaved = () => {
    // El modal nos avisó que guardó algo, así que solo
    // necesitamos recargar la tabla de bienes de la oficina actual.
    if (selectedOficina.value) {
        fetchBienes()
    }
}
/**
 * Abre el modal de eliminación y guarda el 'bien' seleccionado
 */
const openDeleteModal = (bien) => {
    deletingBien.value = bien
    showDeleteModal.value = true
}
/**
 * Abre el modal de edición y guarda el 'bien' seleccionado
 */
const openEditModal = (bien) => {
    editingBien.value = bien
    showEditModal.value = true
}

/**
 * Se llama cuando el modal de edición emite 'edit-success'
 */
const onBienEdited = () => {
    showEditModal.value = false;
    editingBien.value = null;
    // Recarga la tabla
    if (selectedOficina.value) {
        fetchBienes();
    }
}

/**
 * Cierra el modal de eliminación
 */
const closeDeleteModal = () => {
    showDeleteModal.value = false
    // Retrasamos el reseteo del 'bien' para que el modal se cierre suavemente
    setTimeout(() => {
        deletingBien.value = null
    }, 300);
}
const onBienDeleted = () => {
    closeDeleteModal();
    // Recarga la tabla de bienes de la oficina actual
    if (selectedOficina.value) {
        fetchBienes();
    }
}

/**
 * Abre el modal de "Ver Bien"
 */
const openVerModal = (bien) => {
    selectedBien.value = bien
    showVerModal.value = true
}

/**
 * Abre el modal de "Baja"
 */
const openBajaModal = () => {
    // 'selectedBien' ya está seteado por openVerModal
    showVerModal.value = false // Cierra el modal de "Ver"
    showBajaModal.value = true // Abre el modal de "Baja"
}

/**
 * Cierra el modal de "Ver" y resetea el 'bien'
 */
const closeVerModal = () => {
    showVerModal.value = false
    setTimeout(() => {
        selectedBien.value = null
    }, 300)
}

/**
 * Cierra el modal de "Baja"
 */
const closeBajaModal = () => {
    showBajaModal.value = false
    bajaError.value = null
    isSubmittingBaja.value = false
    // Si la acción que cerró este modal fue una confirmación (mover/baja),
    // `preventReopenVer` estará en true y evitaremos reabrir el modal 'Ver'.
    if (selectedBien.value && !preventReopenVer.value) {
        showVerModal.value = true;
    }
    // Resetea el flag para futuras operaciones
    preventReopenVer.value = false
}
/**
 * Lógica de API para dar de Baja un bien (PUT)
 */
const handleConfirmBaja = async () => {
    if (!selectedBien.value) return;

    isSubmittingBaja.value = true
    bajaError.value = null

    try {
        // Asumo una ruta de API para esto:
        const response = await authenticatedFetch(`/bienes/${selectedBien.value.id}/baja`, {
            method: 'PUT' // O 'POST', según tu API
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'No se pudo dar de baja el bien.');
        }

        // ¡Éxito!
        // Evita que el modal 'Ver' se reabra automáticamente al confirmar la baja
        preventReopenVer.value = true
        closeBajaModal();
        fetchBienes(); // Recarga la tabla

    } catch (err) {
        console.error('Error al dar de baja el bien:', err);
        bajaError.value = err.message;
    } finally {
        isSubmittingBaja.value = false;
    }
}
/**
 * Cierra "Ver" y abre "Mover"
 */
const openMoveModal = () => {
    // 'selectedBien' ya está seteado por openVerModal
    showVerModal.value = false // Cierra el modal de "Ver"
    showMoveModal.value = true // Abre el modal de "Mover"
}

/**
 * Cierra el modal "Mover"
 */
const closeMoveModal = () => {
    showMoveModal.value = false

    // Solo reabre si NO estamos previniendo la reapertura
    if (selectedBien.value && !preventReopenVer.value) {
        showVerModal.value = true;
    }

    // Reseteamos la bandera después de un momento para que 
    // la próxima vez (si cancela) funcione normal
    setTimeout(() => {
        preventReopenVer.value = false;
        // Si se confirmó el movimiento, también limpiamos el bien seleccionado
        // para que no quede "colgando" en memoria
        if (!showVerModal.value) {
            selectedBien.value = null;
        }
    }, 300);
}

/**
 * Se llama cuando el bien se movió exitosamente
 */
const onBienMoved = () => {
    // 1. Activamos la bandera: "No quiero volver atrás"
    preventReopenVer.value = true;

    // 2. Cerramos el modal (que ahora respetará la bandera)
    closeMoveModal();

    // 3. Recargamos datos
    fetchStructure();
    if (selectedOficina.value) {
        fetchBienes(selectedOficina.value.id);
    }
}
/**
 * Abre el modal de QR individual para una oficina específica.
 * (Se llama desde el botón [QR] al lado de una oficina)
 */
const openOficinaQR = (oficina) => {
    qrTitle.value = oficina.nombre;
    qrValue.value = oficina.ofi_codigo || 'N/A'; // El valor a codificar
    showQRModal.value = true;
}

/**
 * Abre el modal de impresión por lote para un departamento.
 * (Se llama desde el botón "Generar QRs" del departamento)
 */
const openLoteQR = (departamento) => {
    loteTitle.value = `Oficinas en: ${departamento.dep_nombre}`;
    loteList.value = departamento.oficinas; // Pasa la lista de oficinas
    showLoteModal.value = true;
}

const selectedBienesCount = computed(() => selectedBienes.value.size)
// Lógica para el checkbox "Seleccionar Todos"
const selectAllBienes = computed({
    // 'get' comprueba si todos los bienes visibles están seleccionados
    get() {
        const currentBienes = bienesList.value.data || []
        if (currentBienes.length === 0) return false
        // Devuelve true SÓLO SI todos los 'bien.id' en la lista están en el 'Set'
        return currentBienes.every(bien => selectedBienes.value.has(bien.id))
    },
    // 'set' se activa cuando el usuario hace clic en "Seleccionar Todos"
    set(value) {
        const currentBienesIds = (bienesList.value.data || []).map(bien => bien.id)
        if (value) {
            // Si value es 'true', añade todos los IDs visibles al Set
            currentBienesIds.forEach(id => selectedBienes.value.add(id))
        } else {
            // Si value es 'false', quita todos los IDs visibles del Set
            currentBienesIds.forEach(id => selectedBienes.value.delete(id))
        }
    }
})
const activateSelectionMode = () => {
    isSelectionModeActive.value = true
}

/**
 * Desactiva la UI de checkboxes y limpia la selección
 */
const cancelSelectionMode = () => {
    isSelectionModeActive.value = false
    selectedBienes.value.clear()
}

/**
 * Se llama al hacer clic en "Generar QRs (n)"
 * Prepara los datos y abre el ModalImpresionLote
 */
// --- AÑADE ESTA FUNCIÓN HELPER PARA BUSCAR NOMBRES ---
const getCurrentContextNames = () => {
    let oficinaNombre = 'N/A';
    let deptoNombre = 'N/A';

    // 1. Nombre de la Oficina (ya lo tenemos en selectedOficina)
    if (selectedOficina.value) {
        oficinaNombre = selectedOficina.value.nombre;
    }

    // 2. Nombre del Departamento
    // Opción A: Si estamos en vista de Acordeón (structureData tiene datos)
    if (structureData.value.length > 0 && selectedOficina.value) {
        // Buscamos el departamento que contiene esta oficina
        const parentDept = structureData.value.find(dept =>
            dept.oficinas.some(ofi => ofi.id === selectedOficina.value.id)
        );
        if (parentDept) deptoNombre = parentDept.dep_nombre;
    }

    // Opción B: Si estamos en vista de Dropdowns y no lo encontramos arriba
    if (deptoNombre === 'N/A' && selectedDepartment.value) {
        // Buscamos en departmentsList si existe
        const dept = departmentsList.value.find(d => d.id === selectedDepartment.value);
        if (dept) deptoNombre = dept.dep_nombre;
    }

    return { oficinaNombre, deptoNombre };
}

// --- ACTUALIZA ESTA FUNCIÓN ---
const openBienBatchQRModal = () => {
    const currentBienes = bienesList.value.data || []
    const bienesSeleccionados = currentBienes.filter(bien =>
        selectedBienes.value.has(bien.id)
    )

    loteTitle.value = `Lote de Bienes (${bienesSeleccionados.length} seleccionados)`

    // Obtenemos los nombres del contexto actual
    const { oficinaNombre, deptoNombre } = getCurrentContextNames();

    // Mapeamos los datos incluyendo la info extra para el CSV
    loteList.value = bienesSeleccionados.map(bien => ({
        id: bien.id,
        nombre: bien.bien_descripcion,
        ofi_codigo: bien.bien_codigo || bien.numero_serie,
        // Datos extra para el CSV:
        oficina_nombre: oficinaNombre,
        departamento_nombre: deptoNombre
    }))

    showLoteModal.value = true
}
</script>
