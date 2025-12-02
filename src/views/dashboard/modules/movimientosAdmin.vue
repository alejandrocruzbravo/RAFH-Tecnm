<template>
	<div class="space-y-6 animate-fade-in-up">
		
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white font-audiowide tracking-wide">
                    Control de Movimientos
                </h1>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Bitácora global de transferencias y movimientos de bienes.
                </p>
			</div>
		</div>

		<div class="bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-5">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				
                <div class="col-span-1 md:col-span-2">
					<label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Búsqueda Global</label>
					<div class="relative">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Buscar por bien, código o usuario..."
                            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
				</div>

				<div>
					<label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tipo Movimiento</label>
					<select
						v-model="selectedType"
						class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					>
						<option value="">Todos los tipos</option>
						<option value="TRASLADO_FISICO">Traslado Físico</option>
						<option value="ASIGNACION">Asignación</option>
                        <option value="ALTA">Alta</option>
                        <option value="BAJA">Baja</option>
					</select>
				</div>

				<div>
					<label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Fecha Inicio</label>
					<input
						v-model="dateFrom"
						type="date"
						class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
				</div>
			</div>
            
            <div class="flex justify-end mt-4 gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                 <button
					@click="clearFilters"
					class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
				>
					Limpiar Filtros
				</button>
				<button
					@click="fetchMovimientos(1)"
					class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/30 text-sm font-medium transition-all transform hover:scale-105"
				>
					Aplicar Filtros
				</button>
            </div>
		</div>

		<div v-if="isLoading" class="flex flex-col items-center justify-center p-12 h-64 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div class="relative w-12 h-12">
                 <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                 <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
			<p class="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Cargando registros...</p>
		</div>

		<div v-else class="bg-white dark:bg-dark-surface rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left">
					<thead class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
						<tr>
                            <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Fecha / Hora</th>
							<th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Bien</th>
                            <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Usuario (Origen)</th>
							<th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Destino Físico</th>
							<th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Tipo</th>
                            <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 text-right">Cant.</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        <tr v-if="movimientos.length === 0">
                            <td colspan="6" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                No se encontraron movimientos con los criterios seleccionados.
                            </td>
                        </tr>

						<tr v-for="mov in movimientos" :key="mov.id" class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
							
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(mov.movimiento_fecha) }}</span>
                                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(mov.movimiento_fecha) }}</span>
                                </div>
							</td>

                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    </div>
                                    <div>
                                        <button 
                                            @click="openBienDetails(mov.bien)"
                                            class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline text-left transition-colors focus:outline-none"
                                            title="Ver detalles del bien"
                                        >
                                            {{ mov.bien?.bien_descripcion || 'Sin nombre' }}
                                        </button>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{{ mov.bien?.bien_codigo || 'N/A' }}</p>
                                    </div>
                                </div>
							</td>
							
							<td class="px-6 py-4">
								<div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {{ mov.usuario_origen?.usuario_nombre ? mov.usuario_origen.usuario_nombre.charAt(0) : '?' }}
                                    </div>
									<span class="text-gray-700 dark:text-gray-300">{{ mov.usuario_origen?.usuario_nombre || 'Sistema' }}</span>
								</div>
							</td>

							<td class="px-6 py-4">
								<div class="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
									<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
									{{ mov.departamento?.dep_nombre || 'N/A' }}
								</div>
							</td>

							<td class="px-6 py-4">
								<span :class="[
									'px-2.5 py-1 rounded-full text-xs font-bold border',
									mov.movimiento_tipo === 'TRASLADO_FISICO' ? 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800' :
									mov.movimiento_tipo === 'ALTA' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' :
                                    mov.movimiento_tipo === 'ASIGNACION' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
									'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
								]">
									{{ formatType(mov.movimiento_tipo) }}
								</span>
							</td>

                            <td class="px-6 py-4 text-right font-mono text-gray-700 dark:text-gray-300">
                                {{ mov.movimiento_cantidad }}
                            </td>
						</tr>
					</tbody>
				</table>
			</div>

			<div v-if="totalPages > 1" class="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                    Mostrando página <span class="font-bold">{{ currentPage }}</span> de {{ totalPages }}
                </span>
                <div class="flex gap-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors">Anterior</button>
				    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors">Siguiente</button>
                </div>
			</div>
		</div>

        <ModalDetalleBienMov
            :show="showBienModal" 
            :bien="selectedBienForDetail"
            @close="showBienModal = false"
        />

	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js'
// Asegúrate de importar el Modal que creamos antes
import ModalDetalleBienMov from '@/components/ModalDetalleBienMov.vue'

const isLoading = ref(false)
const movimientos = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

// Filtros
const searchQuery = ref('')
const selectedType = ref('')
const dateFrom = ref('')
let searchTimeout = null

// Variables para el modal
const showBienModal = ref(false)
const selectedBienForDetail = ref({})

// --- FUNCIONES AUXILIARES (AGREGADAS) ---

// Formatea la fecha: 01/12/2025
const formatDate = (dateString) => {
	if (!dateString) return ''
	return new Date(dateString).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Formatea la hora: 14:30
const formatTime = (dateString) => {
    if (!dateString) return ''
	return new Date(dateString).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

// Limpia el texto del tipo: TRASLADO_FISICO -> Traslado Fisico
const formatType = (type) => {
    if(!type) return 'N/A';
    const cleaned = type.replace(/_/g, ' ').toLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// Abre el modal con la info del bien
const openBienDetails = (bienData) => {
    if (!bienData) return;
    selectedBienForDetail.value = bienData;
    showBienModal.value = true;
}

// --- LÓGICA DE CARGA ---

const fetchMovimientos = async (page = 1) => {
	isLoading.value = true
	try {
        // Construimos la query string de forma segura
        const params = new URLSearchParams({
            page: page,
            search: searchQuery.value,
            tipo: selectedType.value,
            date_from: dateFrom.value
        });

		const response = await authenticatedFetch(`/admin/movimientos?${params.toString()}`)
		
        if (!response.ok) throw new Error('Error al cargar historial')
		
		const data = await response.json()
		movimientos.value = data.data
		currentPage.value = data.current_page
		totalPages.value = data.last_page
	} catch (e) {
		console.error('Error fetching movimientos:', e)
	} finally {
		isLoading.value = false
	}
}

const changePage = (page) => {
	fetchMovimientos(page)
}

const clearFilters = () => {
    searchQuery.value = ''
    selectedType.value = ''
    dateFrom.value = ''
    fetchMovimientos(1)
}

// Debounce para la búsqueda
watch(searchQuery, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchMovimientos(1)
    }, 500)
})

onMounted(() => {
	fetchMovimientos()

    // Lógica Websocket
    if (window.Echo) {
        window.Echo.channel('movimientos')
            .listen('.nuevo.movimiento', (e) => {
                console.log('⚡ Nuevo movimiento:', e.movimiento);
                fetchMovimientos(1);
            });
    }
})

onUnmounted(() => {
    if (window.Echo) {
        window.Echo.leave('movimientos');
    }
})
</script>