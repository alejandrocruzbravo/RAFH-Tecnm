<template>
	<div v-if="isLoading" class="flex items-center justify-center p-10 h-64">
		<div class="text-center">
			<div
				class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600 dark:border-blue-400">
			</div>
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
	<div v-else class="space-y-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bienvenido, {{ userName }}</h1>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Panel de resguardante - Consulte sus bienes y movimientos</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2 space-y-6">
				<!-- Summary Cards -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div
						class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 hover:shadow-lg transition-shadow duration-300">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm font-semibold">Bienes asignados</h2>
						</div>
						<div class="space-y-2">
							<div class="flex items-center">
								<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 10v10l8 4m0-10l8-4" />
								</svg>
								<h2 class="ml-3 font-bold text-lg">{{ dashboardData.total_bienes || 0 }}</h2>
							</div>
							<label class="text-gray-600 dark:text-gray-400 text-xs">Total en tu responsabilidad</label>
						</div>
					</div>
					<div
						class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 hover:shadow-lg transition-shadow duration-300">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm font-semibold">Movimientos</h2>
						</div>
						<div class="space-y-2">
							<div class="flex items-center">
								<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
								<h2 class="ml-3 font-bold text-lg">{{ dashboardData.total_movimientos || 0 }}</h2>
							</div>
							<label class="text-gray-600 dark:text-gray-400 text-xs">Movimientos registrados</label>
						</div>
					</div>
					<div
						class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 hover:shadow-lg transition-shadow duration-300">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm font-semibold">Transferencias</h2>
						</div>
						<div class="space-y-2">
							<div class="flex items-center">
								<svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M8 7h12M8 11h12M8 15h12M3 7h.01M3 11h.01M3 15h.01" />
								</svg>
								<h2 class="ml-3 font-bold text-lg">{{ dashboardData.total_transferencias || 0 }}</h2>
							</div>
							<label class="text-gray-600 dark:text-gray-400 text-xs">Transferencias realizadas</label>
						</div>
					</div>
				</div>

				<!-- Recent Movements Table -->
				<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-gray-600 dark:text-gray-400 text-sm font-semibold">Últimos movimientos</h2>
						<RouterLink to="/resguardante/movimientos"
							class="text-xs text-blue-600 dark:text-blue-400 hover:underline">Ver todos →</RouterLink>
					</div>
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b border-gray-300 dark:border-gray-600">
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Tipo
									</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Bien
									</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Departamento
									</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Fecha</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
								<tr v-if="!dashboardData.ultimos_movimientos || dashboardData.ultimos_movimientos.length === 0">
									<td colspan="4" class="py-3 px-2 text-center text-gray-500 dark:text-gray-400">
										No hay movimientos recientes.
									</td>
								</tr>
								<tr v-else v-for="(mov, index) in dashboardData.ultimos_movimientos" :key="index"
									class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">
										<span :class="[
											'px-2 py-1 rounded-full text-xs font-semibold',
											mov.tipo === 'entrada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
											mov.tipo === 'salida' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
											'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
										]">
											{{ mov.tipo || 'N/A' }}
										</span>
									</td>
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{ mov.bien || 'N/A' }}</td>
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{ mov.departamento || 'N/A' }}</td>
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{ formatDate(mov.fecha) }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- Sidebar Info -->
			<div class="space-y-4">
				<div class="bg-blue-50 dark:bg-blue-900 rounded-lg shadow-md dark:shadow-stone-950 p-4 border-l-4 border-blue-600">
					<h3 class="font-semibold text-gray-900 dark:text-white mb-2">Información</h3>
					<div class="space-y-2 text-sm">
						<p class="text-gray-600 dark:text-gray-300"><strong>Oficina:</strong> {{ userOffice || 'N/A' }}</p>
						<p class="text-gray-600 dark:text-gray-300"><strong>Departamento:</strong> {{ userDepartment || 'N/A' }}</p>
					</div>
				</div>

				<div class="bg-green-50 dark:bg-green-900 rounded-lg shadow-md dark:shadow-stone-950 p-4">
					<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Acciones rápidas</h3>
					<div class="space-y-2">
						<RouterLink to="/resguardante/bienes-asignados"
							class="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center text-sm font-medium">
							Ver bienes asignados
						</RouterLink>
						<RouterLink to="/resguardante/movimientos"
							class="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center text-sm font-medium">
							Ver movimientos
						</RouterLink>
						<RouterLink to="/resguardante/transferencias"
							class="block w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-center text-sm font-medium">
							Ver transferencias
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

const isLoading = ref(true)
const error = ref('')
const dashboardData = ref({
	total_bienes: 0,
	total_movimientos: 0,
	total_transferencias: 0,
	ultimos_movimientos: []
})

const userData = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => userData.usuario_nombre || 'Usuario')
const userOffice = computed(() => userData.usuario_oficina || userData.oficina_nombre || 'N/A')
const userDepartment = computed(() => userData.usuario_departamento || userData.departamento_nombre || 'N/A')

const formatDate = (date) => {
	if (!date) return 'N/A'
	return new Date(date).toLocaleDateString('es-ES')
}

const fetchDashboardData = () => {
	isLoading.value = true
	error.value = ''

	setTimeout(() => {
		dashboardData.value = {
			total_bienes: 15,
			total_movimientos: 6,
			total_transferencias: 5,
			ultimos_movimientos: [
				{
					tipo: 'entrada',
					bien: 'Computadora de Escritorio',
					departamento: 'Laboratorio A',
					fecha: '2025-01-15'
				},
				{
					tipo: 'salida',
					bien: 'Monitor LG 24"',
					departamento: 'Laboratorio B',
					fecha: '2025-01-12'
				},
				{
					tipo: 'ajuste',
					bien: 'Impresora Láser HP',
					departamento: 'Coordinación Académica',
					fecha: '2025-01-10'
				}
			]
		}
		isLoading.value = false
	}, 300)
}

onMounted(() => {
	fetchDashboardData()
})
</script>
