<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Transferencias</h1>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Historial de cambios de resguardo (Traspasos)</p>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 flex justify-between items-center">
			<h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Bitácora de Solicitudes</h2>
			<button @click="fetchTransferencias"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
				Actualizar
			</button>
		</div>

		<div v-if="isLoading" class="flex items-center justify-center p-10 h-64">
			<div class="text-center">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando transferencias...</p>
			</div>
		</div>

		<div v-else-if="transferencias.length === 0" class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-8 text-center">
			<svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sin transferencias</h3>
			<p class="text-gray-600 dark:text-gray-400">No hay registros de traspasos enviados o recibidos.</p>
		</div>

		<div v-else class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th class="px-6 py-3">Bien</th>
							<th class="px-6 py-3">Estado</th>
							<th class="px-6 py-3">Fecha Solicitud</th>
							<th class="px-6 py-3">Observaciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr v-for="trans in transferencias" :key="trans.id" class="bg-white border-b dark:bg-dark-bg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
							
							<td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
								{{ trans.bien?.bien_descripcion || 'N/A' }}
                                <p class="text-xs text-gray-500 font-normal mt-0.5">{{ trans.bien?.bien_codigo }}</p>
							</td>
							<td class="px-6 py-4">
								<span :class="[
									'px-2 py-1 rounded-full text-xs font-semibold',
									trans.traspaso_estado === 'Aprobada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
									trans.traspaso_estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
									'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
								]">
									{{ trans.traspaso_estado }}
								</span>
							</td>

							<td class="px-6 py-4 text-gray-500 dark:text-gray-400">
								{{ formatDate(trans.created_at) }}
							</td>

                            <td class="px-6 py-4 text-gray-500 dark:text-gray-400 italic truncate max-w-xs" :title="trans.traspaso_observaciones">
								{{ trans.traspaso_observaciones || '-' }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div v-if="totalPages > 1" class="flex justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
				<button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50">Anterior</button>
				<span class="text-gray-600 dark:text-gray-300 self-center">Página {{ currentPage }} de {{ totalPages }}</span>
				<button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50">Siguiente</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authenticatedFetch } from '../../config/api.js'

const isLoading = ref(false)
const transferencias = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const currentResguardanteId = ref(null) // Para saber quién soy

// Función para obtener ID del resguardante actual (del localStorage o similar)
const getMyId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return user.resguardante?.id || null;
    }
    return null;
}

// Helpers visuales
const isSentByMe = (trans) => {
    return trans.traspaso_id_usuario_origen === currentResguardanteId.value;
}

const getOtherPartyName = (trans) => {
    if (isSentByMe(trans)) {
        // Yo soy origen -> Muestro Destino
        const user = trans.resguardante_destino?.usuario; // O res_nombre si usas directo
        return user ? user.usuario_nombre : (trans.resguardante_destino?.res_nombre || 'N/A');
    } else {
        // Yo soy destino -> Muestro Origen
        const user = trans.resguardante_origen?.usuario;
        return user ? user.usuario_nombre : (trans.resguardante_origen?.res_nombre || 'N/A');
    }
}

const formatDate = (dateString) => {
	if (!dateString) return ''
	return new Date(dateString).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fetchTransferencias = async (page = 1) => {
	isLoading.value = true
    currentResguardanteId.value = getMyId();

	try {
		const response = await authenticatedFetch(`/mis-transferencias?page=${page}`)
		if (!response.ok) throw new Error('Error al cargar historial')
		
		const data = await response.json()
		transferencias.value = data.data
		currentPage.value = data.current_page
		totalPages.value = data.last_page
	} catch (e) {
		console.error(e)
	} finally {
		isLoading.value = false
	}
}

const changePage = (page) => {
	fetchTransferencias(page)
}

onMounted(() => {
	fetchTransferencias()
})
</script>