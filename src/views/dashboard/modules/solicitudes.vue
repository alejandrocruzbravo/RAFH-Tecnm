<template>
	<div v-if="isLoading" class="flex items-center justify-center h-64">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
		<p class="ml-4 text-gray-600 dark:text-gray-400">Cargando solicitudes...</p>
	</div>

	<div v-else-if="error" class="p-6 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
		<h3 class="font-bold">Error al cargar los gestores</h3>
		<p>{{ error.message || 'No se pudo conectar con la API.' }}</p>
		<button @click="fetchSolicitudes(1)" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
			Reintentar
		</button>
	</div>
	<div v-else class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-2xl font-bold text-gray-900 dark:text-white font-audiowide tracking-wide0">Solicitudes</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de
				Chetumal</label>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 border border-gray-100 dark:border-gray-800">
			<div class="flex flex-col md:flex-row gap-4 items-end">
				<div class="flex-1">
					<input v-model="searchTerm" type="text" placeholder="Buscar solicitud"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<select v-model="filterEstado"
					class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					<option value="">Todos los estados</option>
					<option value="Pendiente">Pendiente</option>
					<option value="Aprobada">Aprobada</option>
					<option value="Rechazada">Rechazada</option>
				</select>
			</div>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-x-auto border border-gray-100 dark:border-gray-800">
			<div v-if="filteredSolicitudes.length === 0" class="flex items-center justify-center h-64">
				<p class="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">No existen registros</p>
			</div>
			<table v-else class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Tipo</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Solicitante</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Descripción</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Estado</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="(solicitud, index) in filteredSolicitudes" :key="solicitud.id"
						class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">

						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">Traspaso</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{
							solicitud.resguardante_origen?.res_nombre || 'N/A' }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ solicitud.traspaso_observaciones }}
						</td>
						<td class="px-4 py-3">
							<span v-if="solicitud.traspaso_estado === 'Pendiente'"
								class="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
								{{ solicitud.traspaso_estado }}
							</span>
							<span v-else-if="solicitud.traspaso_estado === 'Aprobada'"
								class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
								{{ solicitud.traspaso_estado }}
							</span>
							<span v-else
								class="inline-block px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
								{{ solicitud.traspaso_estado }}
							</span>
						</td>
						<td class="px-4 py-3 flex gap-2">
							<button @click="viewSolicitudDetails(index)"
								class="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
								title="Ver detalles">
								<svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
									viewBox="0 0 24 24">
									<path stroke="currentColor" stroke-width="2"
										d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
									<path stroke="currentColor" stroke-width="2"
										d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
								</svg>


							</button>
							<button v-if="solicitud.traspaso_estado === 'Pendiente'" @click="approveSolicitud(index)"
								class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors">
								Aprobar
							</button>
							<button v-else
								class="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs cursor-not-allowed opacity-50"
								disabled>
								Aprobar
							</button>
							<button v-if="solicitud.traspaso_estado === 'Pendiente'" @click="rejectSolicitud(index)"
								class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors">
								Rechazar
							</button>
							<button v-else
								class="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs cursor-not-allowed opacity-50"
								disabled>
								Rechazar
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Pagination Controls -->
		<div v-if="filteredSolicitudes.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
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

		<!-- View Details Modal -->
		<div v-if="showDetailsSolicitudModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalles de la Solicitud</h2>
					<button @click="showDetailsSolicitudModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div v-if="selectedSolicitudDetails" class="p-6 space-y-6">
					<!-- Información del Bien Section -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Left: Información del Bien -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
							<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Información del Bien
							</h3>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Nombre del
									Bien:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.bien.bien_descripcion
								}}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Descripción:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{
									selectedSolicitudDetails.bien.bien_caracteristicas }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Estado:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.bien.bien_estado
								}}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Número de
									Inventario:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{
									selectedSolicitudDetails.bien.bien_codigo }}</p>
							</div>
						</div>

						<!-- Right: Origen -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
							<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Origen</h3>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Área Actual:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{
									selectedSolicitudDetails.origen.areaActual }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Responsable
									Actual:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{
									selectedSolicitudDetails.origen.responsable }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Ubicación:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{
									selectedSolicitudDetails.origen.ubicacion }}</p>
							</div>
						</div>
					</div>

					<!-- Destino and Motivo Section -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Left: Destino -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
							<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Destino</h3>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Área Destino:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{
									selectedSolicitudDetails.destino.areaDestino }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Responsable
									Destino:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{
									selectedSolicitudDetails.destino.responsable }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Ubicación:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{
									selectedSolicitudDetails.destino.ubicacion }}</p>
							</div>
						</div>

						<!-- Right: Motivo del Intercambio -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
							<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Motivo del Intercambio
							</h3>
							<div>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.motivo }}
								</p>
							</div>
						</div>
					</div>

					<!-- Request Status Section -->
					<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Tipo de
									Solicitud:</span>
								<p class="text-sm text-gray-900 dark:text-white font-medium">{{
									selectedSolicitudDetails.tipo }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Solicitante:</span>
								<p class="text-sm text-gray-900 dark:text-white font-medium">{{
									selectedSolicitudDetails.solicitante }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Estado de
									Solicitud:</span>
								<span
									:class="['inline-block px-3 py-1 rounded-full text-xs font-semibold', selectedSolicitudDetails.estado === 'Pendiente' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : selectedSolicitudDetails.estado === 'Aprobada' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200']">
									{{ selectedSolicitudDetails.estado }}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showDetailsSolicitudModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js'

// --- ESTADOS DE CARGA ---
const isLoading = ref(true)
const error = ref(null)
const fetchError = ref(null)

// --- ESTADO DE DATOS (ACTUALIZADO) ---
// Se inicializa como un objeto de paginación vacío
const solicitudes = ref({ data: [] })
const currentPage = ref(1)
const itemsPerPage = 15
const totalItems = ref(0)

// --- Estados del formulario (Sin cambios) ---
const filterEstado = ref('')
const searchTerm = ref('')
const showDetailsSolicitudModal = ref(false)
const selectedSolicitudDetails = ref(null)

const confirmModal = ref({
    show: false,
    title: '',
    message: '',
    type: 'primary', // 'primary' o 'danger'
    action: null,    // 'aprobar' o 'rechazar'
    index: null      // índice en el array de solicitudes
});

const successModal = ref({
    show: false,
    title: '',
    message: '',
    type: 'success'
});

const isLoadingDetails = ref(false); // <--- ¡AÑADIDA AQUÍ!
let searchTimeout = null

// --- FUNCIÓN DE CARGA DE DATOS (NUEVA) ---
const totalPages = computed(() => {
	return Math.ceil(totalItems.value / itemsPerPage) || 1
})

const fetchSolicitudes = async (page = 1) => {
	isLoading.value = true
	fetchError.value = null
	try {
		const params = new URLSearchParams()
		params.append('page', page)

		if (searchTerm.value.trim()) {
			params.append('search', searchTerm.value.toUpperCase())
		}

		const response = await authenticatedFetch(`/traspasos?${params.toString()}`); // Llama a tu API
		if (!response.ok) {
			throw new Error('Error al cargar las solicitudes.');
		}
		const data = await response.json();
		solicitudes.value = data
		totalItems.value = data.total || 0
		currentPage.value = page
	} catch (e) {
		console.error('Error:', e);
		fetchError.value = e;
		solicitudes.value = { data: [] }
	} finally {
		isLoading.value = false;
	}
}

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		fetchSolicitudes(currentPage.value + 1)
	}
}

const prevPage = () => {
	if (currentPage.value > 1) {
		fetchSolicitudes(currentPage.value - 1)
	}
}

watch(searchTerm, () => {
	if (searchTimeout) clearTimeout(searchTimeout)
	isLoading.value = true
	searchTimeout = setTimeout(() => {
		currentPage.value = 1
		fetchSolicitudes(1)
	}, 500)
})
const fetchSolicitudesSocket = async () => {
	try {
		const response = await authenticatedFetch('/traspasos'); // Llama a tu API
		if (!response.ok) {
			throw new Error('Error al cargar las solicitudes.');
		}
		solicitudes.value = await response.json();
	} catch (e) {
		console.error('Error:', e);
		fetchError.value = e;
	} finally {
		isLoading.value = false;
	}
}
const handleSolicitudCreada = (event) => {
	console.log('¡Traspaso creado! (RECIBIDO en Solicitudes)', event);
	fetchSolicitudes();
};

// --- Cargar datos al montar el componente ---
onMounted(() => {
	fetchSolicitudes();
	console.log('ENTRANDO AL CANAL EN SOLICITUDES');

	const channel = window.Echo.channel('solicitudes');

	channel.listen('.solicitud.creada', (e) => {
		console.log('Traspaso creado:', e);
		fetchSolicitudesSocket();
	});

});
onUnmounted(() => {
	window.Echo.channel('solicitudes')
		.stopListening('.solicitud.creada', handleSolicitudCreada);

	console.log('SALIENDO DEL CANAL EN SOLICITUDES');
});

// --- CÁLCULO DE FILTROS (ACTUALIZADO) ---
const filteredSolicitudes = computed(() => {
	// Lee del array 'data' de la paginación
	const list = Array.isArray(solicitudes.value.data) ? solicitudes.value.data : [];

	return list.filter(solicitud => {
		// Filtra por el estado de la API
		const matchEstado = !filterEstado.value || solicitud.traspaso_estado === filterEstado.value

		// Busca en los campos de la API
		const term = searchTerm.value ? searchTerm.value.toLowerCase() : '';
		const matchSearch = !term ||
			('traspaso').includes(term) || // Para el tipo "Traspaso"
			(solicitud.usuario_origen?.usuario_nombre || '').toLowerCase().includes(term) ||
			(solicitud.traspaso_observaciones || '').toLowerCase().includes(term)

		return matchEstado && matchSearch
	})
})


const viewSolicitudDetails = async (index) => {
    // ... (Código para obtener solicitudCorta y manejar la carga) ...
    const solicitudCorta = solicitudes.value.data[index];
    if (!solicitudCorta || !solicitudCorta.id) {
        console.error("No se encontró ID de la solicitud para mostrar detalles.");
        return;
    }

    try {
        isLoadingDetails.value = true;
        
        // 2. Realiza la llamada a la API para obtener los datos completos
        const response = await authenticatedFetch(`/traspasos/${solicitudCorta.id}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error al obtener detalles: ${response.status}`);
        }
        
        const solicitudCompleta = await response.json();

        // --- INICIO DE LAS CORRECCIONES DE MAPEO ---
        
        // Alias para el Resguardante Origen y Destino para hacer el código más limpio
        const rOrigen = solicitudCompleta.resguardante_origen;
        const rDestino = solicitudCompleta.resguardante_destino;
        const rBien = solicitudCompleta.bien?.resguardante;

        selectedSolicitudDetails.value = { 
            bien: solicitudCompleta.bien, 
            origen: {
                areaActual: rOrigen.departamento?.area?.area_nombre || rBien?.departamento?.dep_nombre || 'N/A',
                responsable: (rOrigen.res_nombre && rOrigen.res_apellidos) ? `${rOrigen.res_nombre} ${rOrigen.res_apellidos}` : 'N/A',
                ubicacion: (rOrigen?.oficina?.edificio?.nombre && rOrigen?.oficina?.nombre) ? `${rOrigen.oficina.edificio.nombre} - ${rOrigen.oficina.nombre}` : 'N/A',
            },
            destino: {
                areaDestino: rDestino?.departamento?.area?.area_nombre || rDestino?.departamento?.dep_nombre || 'N/A',
                responsable: (rDestino?.res_nombre && rDestino?.res_apellidos) ? `${rDestino.res_nombre} ${rDestino.res_apellidos}` : 'N/A',
                ubicacion: (rDestino?.oficina?.edificio?.nombre && rDestino?.oficina?.nombre) ? `${rDestino.oficina.edificio.nombre} - ${rDestino.oficina.nombre}` : 'N/A',
            },
            
            motivo: solicitudCompleta.traspaso_observaciones,
            tipo: 'Traspaso',
            solicitante: (rOrigen?.res_nombre && rOrigen?.res_apellidos) ? `${rOrigen.res_nombre} ${rOrigen.res_apellidos}` : 'N/A',
            estado: solicitudCompleta.traspaso_estado,
        };
        showDetailsSolicitudModal.value = true;

    } catch (e) {
        console.error("Error al obtener detalles de la solicitud:", e);
    } finally {
        isLoadingDetails.value = false;
    }
}
// Función para APROBAR
const approveSolicitud = async (index) => {
    // Obtenemos la solicitud real del array data
    const solicitud = solicitudes.value.data[index];
    
    if(!confirm(`¿Autorizar traspaso de "${solicitud.bien?.bien_descripcion}" a ${solicitud.resguardante_destino?.res_nombre}?`)) return;

    try {

        const response = await authenticatedFetch(`/traspasos/${solicitud.id}`, {
            method: 'PUT',
            body: JSON.stringify({ estado: 'Aprobada' })
        });

        if (response.ok) {
            alert('Traspaso autorizado. El inventario ha sido actualizado.');
            // Recargamos la tabla para ver el cambio de estado
            fetchSolicitudes(currentPage.value);
        } else {
            const err = await response.json();
            alert('Error: ' + (err.message || 'No se pudo aprobar'));
        }
    } catch (e) {
        console.error(e);
        alert('Error de conexión');
    }
}

// Función para RECHAZAR
const rejectSolicitud = async (index) => {
    const solicitud = solicitudes.value.data[index];

    if(!confirm('¿Rechazar esta solicitud?')) return;

    try {
        const response = await authenticatedFetch(`/traspasos/${solicitud.id}`, {
            method: 'PUT',
            body: JSON.stringify({ estado: 'Rechazada' })
        });

        if (response.ok) {
            fetchSolicitudes(currentPage.value);
        } else {
            const err = await response.json();
            alert('Error: ' + (err.message || 'No se pudo rechazar'));
        }
    } catch (e) {
        console.error(e);
    }
}


</script>
