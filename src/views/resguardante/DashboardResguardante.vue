<template>
	<div v-if="isLoading" class="flex items-center justify-center p-10 h-64">
		<div class="text-center">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600 dark:border-blue-400"></div>
			<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
		</div>
	</div>

	<div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
		<h3 class="font-bold">Error al cargar el dashboard</h3>
		<p>{{ error }}</p>
		<button @click="fetchDashboardData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
			Reintentar
		</button>
	</div>

	<div v-else class="space-y-6 animate-fade-in-up">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white font-audiowide">Bienvenido, {{ userName }}</h1>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Panel de resguardante - Consulte sus bienes y movimientos</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			
			<div class="lg:col-span-2 space-y-6">
				
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					
					<div class="bg-white dark:bg-dark-surface rounded-lg shadow-md dark:shadow-stone-950 p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Bienes</h2>
						</div>
						<div class="space-y-2">
							<div class="flex items-center">
								<div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
									<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
								</div>
								<h2 class="ml-3 font-bold text-2xl text-gray-900 dark:text-white">{{ dashboardData.contadores?.bienes || 0 }}</h2>
							</div>
							<label class="text-gray-500 dark:text-gray-500 text-xs">Total asignado</label>
						</div>
					</div>

					<div class="bg-white dark:bg-dark-surface rounded-lg shadow-md dark:shadow-stone-950 p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Movimientos</h2>
						</div>
						<div class="space-y-2">
							<div class="flex items-center">
								<div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
									<svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
								</div>
								<h2 class="ml-3 font-bold text-2xl text-gray-900 dark:text-white">{{ dashboardData.contadores?.movimientos || 0 }}</h2>
							</div>
							<label class="text-gray-500 dark:text-gray-500 text-xs">Historial registrado</label>
						</div>
					</div>

					<div class="bg-white dark:bg-dark-surface rounded-lg shadow-md dark:shadow-stone-950 p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Traspasos</h2>
						</div>
						<div class="space-y-2">
							<div class="flex items-center">
								<div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
									<svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
								</div>
								<h2 class="ml-3 font-bold text-2xl text-gray-900 dark:text-white">{{ dashboardData.contadores?.transferencias || 0 }}</h2>
							</div>
							<label class="text-gray-500 dark:text-gray-500 text-xs">Enviados y recibidos</label>
						</div>
					</div>
				</div>

				<div class="bg-white dark:bg-dark-surface rounded-lg shadow-md dark:shadow-stone-950 p-4 border border-gray-100 dark:border-gray-800">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-gray-800 dark:text-gray-200 text-sm font-bold">Últimos movimientos físicos</h2>
						<RouterLink to="/resguardante/movimientos" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">Ver todos →</RouterLink>
					</div>
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b border-gray-200 dark:border-gray-700">
									<th class="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Bien</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Departamento Destino</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Fecha</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
								<tr v-if="!dashboardData.ultimos_movimientos || dashboardData.ultimos_movimientos.length === 0">
									<td colspan="4" class="py-6 text-center text-gray-500 dark:text-gray-400 text-xs italic">
										No hay movimientos recientes.
									</td>
								</tr>
								<tr v-else v-for="(mov, index) in dashboardData.ultimos_movimientos" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
									<td class="py-3 px-2">
										<span :class="[
											'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide',
											mov.movimiento_tipo === 'TRASLADO_FISICO' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
											mov.movimiento_tipo === 'BAJA' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
											'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
										]">
											{{ formatType(mov.movimiento_tipo) }}
										</span>
									</td>
									<td class="py-3 px-2 text-gray-700 dark:text-gray-300 font-medium truncate max-w-[150px]" :title="mov.bien?.bien_descripcion">
                                        {{ mov.bien?.bien_descripcion || 'Desconocido' }}
                                    </td>
									<td class="py-3 px-2 text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                                        {{ mov.departamento?.dep_nombre || 'N/A' }}
                                    </td>
									<td class="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs">
                                        {{ formatDate(mov.created_at) }}
                                    </td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="space-y-6">
				
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md dark:shadow-stone-950 p-5 border-l-4 border-blue-600 dark:border-blue-500">
					<h3 class="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Información Actual
                    </h3>
					<div class="space-y-3 text-sm">
						<div>
                            <p class="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Oficina</p>
						    <p class="text-gray-700 dark:text-gray-300">{{ dashboardData.info?.oficina || 'Sin asignar' }}</p>
                        </div>
						<div class="border-t border-blue-200 dark:border-blue-800 pt-2">
                            <p class="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Departamento</p>
						    <p class="text-gray-700 dark:text-gray-300">{{ dashboardData.info?.departamento || 'Sin asignar' }}</p>
                        </div>
					</div>
				</div>

                <div class="bg-white dark:bg-dark-surface rounded-lg shadow-md dark:shadow-stone-950 p-5 border border-gray-100 dark:border-gray-800">
					<h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Acciones rápidas
                    </h3>
					<div class="space-y-3">
						<RouterLink to="/resguardante/bienes-asignados"
							class="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 rounded-lg transition-colors group border border-gray-200 dark:border-gray-700">
							<span class="text-sm font-medium">Ver bienes asignados</span>
                            <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
						</RouterLink>
						<RouterLink to="/resguardante/movimientos"
							class="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300 rounded-lg transition-colors group border border-gray-200 dark:border-gray-700">
							<span class="text-sm font-medium">Ver movimientos</span>
                            <svg class="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
						</RouterLink>
						<RouterLink to="/resguardante/transferencias"
							class="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 rounded-lg transition-colors group border border-gray-200 dark:border-gray-700">
							<span class="text-sm font-medium">Ver transferencias</span>
                            <svg class="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
						</RouterLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { authenticatedFetch } from '../../config/api.js'

const isLoading = ref(true)
const error = ref('')
const dashboardData = ref({
    contadores: {
        bienes: 0,
        movimientos: 0,
        transferencias: 0
    },
    info: {
        oficina: '',
        departamento: ''
    },
    ultimos_movimientos: []
})

// Obtener nombre del usuario del localStorage (para el saludo)
const userData = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => userData.usuario_nombre || 'Usuario')

const formatDate = (dateString) => {
	if (!dateString) return 'N/A'
	return new Date(dateString).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatType = (type) => {
    if(!type) return 'N/A';
    // Reemplaza guiones bajos por espacios y capitaliza
    const cleaned = type.replace(/_/g, ' ').toLowerCase(); 
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
const fetchDashboardData = async () => {
	isLoading.value = true
	error.value = ''

	try {
        const response = await authenticatedFetch('/resguardante/dashboard');
        
        if (!response.ok) {
            throw new Error('Error al cargar datos del dashboard');
        }

        const data = await response.json();
        dashboardData.value = data;

	} catch (e) {
        console.error(e);
        error.value = 'No se pudo cargar la información. Intente nuevamente.';
	} finally {
		isLoading.value = false
	}
}

onMounted(() => {
	fetchDashboardData()
})
</script>

<style scoped>
/* Animación suave de entrada */
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>