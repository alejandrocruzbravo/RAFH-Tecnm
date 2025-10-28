<template>
	<div v-if="isLoading" class="flex items-center justify-center p-10 h-64">
		<div class="text-center">
			<div
				class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600 dark:border-blue-400">
			</div>
			<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
		</div>
	</div>

	<div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
		<h3 class="font-bold">Error al cargar el dashboard</h3>
		<p>{{ error }}</p>
		<button @click="fetchDashboardData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
			Reintentar
		</button>
	</div>

	<div v-else-if="dashboardData" class="space-y-6">
		<div>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Vista general</label>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2 space-y-6">

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">

					<div
						class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm">Ultimo bien registrado</h2>
							<a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
								<img src="/icons/consulta.png" alt="More" class="w-4 h-4">
							</a>
						</div>
						<div class="space-y-2">
							<a href="#" class="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
								<img src="/icons/bien.png" alt="Bien" class="w-4 h-4">
								<h2 class="ml-3 font-semibold">{{ dashboardData.ultimo_bien_registrado.nombre }}</h2>
							</a>
						</div>
					</div>

					<div
						class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm">Próximo mantenimiento</h2>
							<a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
								<img src="/icons/consulta.png" alt="More" class="w-4 h-4">
							</a>
						</div>
						<div class="space-y-2">
							<a href="#" class="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
								<img src="/icons/fecha.png" alt="Fecha" class="w-4 h-4">
								<h2 class="ml-3 font-semibold">{{ dashboardData.proximo_mantenimiento.fecha_programada
								}}</h2>
							</a>
							<label class="text-gray-600 dark:text-gray-400 text-xs">Para: {{
								dashboardData.proximo_mantenimiento.para_bien_nombre }}</label>
						</div>
					</div>

					<div
						class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-gray-600 dark:text-gray-400 text-sm">Última transferencia</h2>
							<a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
								<img src="/icons/consulta.png" alt="More" class="w-4 h-4">
							</a>
						</div>
						<div class="space-y-2">
							<a href="#" class="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
								<img src="/icons/enviar.png" alt="Enviar" class="w-4 h-4">
								<h2 class="ml-3 font-semibold">{{ dashboardData.ultima_transferencia.bien_nombre }}</h2>
							</a>
							<label class="text-gray-600 dark:text-gray-400 text-xs">Realizada por: {{
								dashboardData.ultima_transferencia.realizada_por }}</label>
						</div>
					</div>
				</div>

				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-gray-600 dark:text-gray-400 text-sm font-semibold">Últimos movimientos</h2>
						<a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
							<img src="/icons/consulta.png" alt="More" class="w-4 h-4">
						</a>
					</div>
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b border-gray-300 dark:border-gray-600">
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Tipo
									</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Gestor
										encargado</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">
										Resguardante responsable</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Bien
										involucrado</th>
									<th class="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Área
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
								<tr v-if="dashboardData.ultimos_movimientos.length === 0">
									<td colspan="5" class="py-3 px-2 text-center text-gray-500 dark:text-gray-400">
										No hay movimientos recientes.
									</td>
								</tr>
								<tr v-else v-for="(mov, index) in dashboardData.ultimos_movimientos" :key="index"
									class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{ mov.tipo }}</td>
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{ mov.gestor_encargado }}
									</td>
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{
										mov.resguardante_responsable }}</td>
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{ mov.bien_involucrado }}
									</td>
									<td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{ mov.area }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="lg:col-span-1 space-y-6">

				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
					<div class="flex items-center justify-between mb-4">
						<label class="text-gray-600 dark:text-gray-400 text-sm">Centro de trabajo</label>
						<a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
							<img src="/icons/consulta.png" alt="More" class="w-4 h-4">
						</a>
					</div>
					<h5 class="font-bold text-base mb-4 text-gray-800 dark:text-white">Instituto Tecnológico de Chetumal
					</h5>
					<div class="space-y-3">
						<div class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
								fill="currentColor" class="w-6 h-6 text-gray-500 dark:text-gray-400">
								<path
									d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z" />
							</svg>
							<h2 class="ml-2 text-gray-600 dark:text-gray-400 text-sm">Bienes registrados: {{
								dashboardData.stats.bienes_registrados }}</h2>
						</div>
						<div class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
								fill="currentColor" class="w-6 h-6 text-gray-500 dark:text-gray-400">
								<path
									d="M42-120v-112q0-33 17-62t47-44q51-26 115-44t141-18q77 0 141 18t115 44q30 15 47 44t17 62v112H42Zm80-80h480v-32q0-11-5.5-20T582-266q-36-18-92.5-36T362-320q-71 0-127.5 18T142-266q-9 5-14.5 14t-5.5 20v32Zm240-240q-66 0-113-47t-47-113h-10q-9 0-14.5-5.5T172-620q0-9 5.5-14.5T192-640h10q0-45 22-81t58-57v38q0 9 5.5 14.5T302-720q9 0 14.5-5.5T322-740v-54q9-3 19-4.5t21-1.5q11 0 21 1.5t19 4.5v54q0 9 5.5 14.5T422-720q9 0 14.5-5.5T442-740v-38q36 21 58 57t22 81h10q9 0 14.5 5.5T552-620q0 9-5.5 14.5T532-600h-10q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T442-600H282q0 33 23.5 56.5T362-520Zm300 160-6-30q-6-2-11.5-4.5T634-402l-28 10-20-36 22-20v-24l-22-20 20-36 28 10q4-4 10-7t12-5l6-30h40l6 30q6 2 12 5t10 7l28-10 20 36-22 20v24l22 20-20 36-28-10q-5 5-10.5 7.5T708-390l-6 30h-40Zm20-70q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm72-130-8-42q-9-3-16.5-7.5T716-620l-42 14-28-48 34-30q-2-5-2-8v-16q0-3 2-8l-34-30 28-48 42 14q6-6 13.5-10.5T746-798l8-42h56l8 42q9 3 16.5 7.5T848-780l42-14 28 48-34 30q2 5 2 8v16q0 3-2 8l34 30-28 48-42-14q-6 6-13.5 10.5T818-602l-8 42h-56Zm28-90q21 0 35.5-14.5T832-700q0-21-14.5-35.5T782-750q-21 0-35.5 14.5T732-700q0 21 14.5 35.5T782-650ZM362-200Z" />
							</svg>
							<h2 class="ml-2 text-gray-600 dark:text-gray-400 text-sm">Gestores asignados: {{
								dashboardData.stats.gestores_asignados }}</h2>
						</div>
						<div class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
								fill="currentColor" class="w-6 h-6 text-gray-500 dark:text-gray-400">
								<path
									d="M120-160v-520l160 120 200-280 200 160h160v520H120Zm200-120 160-220 280 218v-318H652L496-725 298-447l-98-73v144l120 96Z" />
							</svg>
							<h2 class="ml-2 text-gray-600 dark:text-gray-400 text-sm">Áreas asociadas: {{
								dashboardData.stats.areas_asociadas }}</h2>
						</div>
						<div class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
								fill="currentColor" class="w-6 h-6 text-gray-500 dark:text-gray-400">
								<path
									d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" />
							</svg>
							<h2 class="ml-2 text-gray-600 dark:text-gray-400 text-sm">Resguardantes registrados: {{
								dashboardData.stats.resguardantes_registrados }}</h2>
						</div>
					</div>
				</div>

				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 border-l-4 border-red-500">
					<div class="flex items-center justify-between mb-4">
						<label class="text-gray-600 dark:text-gray-400 text-sm">Notificaciones</label>
						<a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
							<img src="/icons/consulta.png" alt="More" class="w-4 h-4">
						</a>
					</div>

					<div v-if="dashboardData.notificaciones.length === 0" class="p-6 text-center">
						<p class="text-gray-500 dark:text-gray-400 text-sm">No hay notificaciones pendientes.</p>
					</div>

					<div v-else v-for="notif in dashboardData.notificaciones" :key="notif.id_traspaso"
						class="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
						<h5 class="font-bold text-base mb-4 text-gray-800 dark:text-white">Solicitudes de transferencia
						</h5>
						<div class="space-y-2 mb-4">
							<h3 class="text-orange-600 dark:text-orange-400 font-semibold">Autorización requerida</h3>
							<h3 class="text-gray-600 dark:text-gray-400 text-sm">Transferencia de bien:
								<a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">{{
									notif.bien_nombre }}</a>
							</h3>
							<h3 class="text-gray-600 dark:text-gray-400 text-sm">Emisor:
								<a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">{{ notif.emisor
								}}</a>
							</h3>
							<h3 class="text-gray-600 dark:text-gray-400 text-sm">Receptor:
								<a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">{{ notif.receptor
								}}</a>
							</h3>
						</div>
						<div class="flex gap-2 mt-4">
							<button @click="handleAutorizar(notif.id_traspaso)" :disabled="isSubmitting"
								class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50">
								Autorizar
							</button>
							<button @click="handleDenegar(notif.id_traspaso)" :disabled="isSubmitting"
								class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
								Denegar
							</button>
						</div>
					</div>
				</div>

				<div v-if="showAuthModal"
					class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
						<div
							class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-4">
							<h2 class="text-lg font-semibold text-green-600">Solicitud Autorizada</h2>
							<button @click="showAuthModal = false"
								class="text-gray-400 hover:text-gray-600">&times;</button>
						</div>
						<div class="p-8 flex flex-col items-center justify-center">
							<img src="/icons/lista-de-verificacion.png" alt="Check" class="w-24 h-24 mb-4">
							<h1 class="text-gray-600 dark:text-gray-400 text-base text-center">Se ha autorizado la
								transferencia.</h1>
						</div>
						<div class="border-t border-gray-300 dark:border-gray-600 p-4">
							<button @click="showAuthModal = false"
								class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Continuar</button>
						</div>
					</div>
				</div>

				<div v-if="showDenyModal"
					class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
						<div
							class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-4">
							<h2 class="text-lg font-semibold text-red-600">Solicitud Denegada</h2>
							<button @click="showDenyModal = false"
								class="text-gray-400 hover:text-gray-600">&times;</button>
						</div>
						<div class="p-8 flex flex-col items-center justify-center">
							<img src="/icons/prohibido.png" alt="Denied" class="w-24 h-24 mb-4">
							<h1 class="text-gray-600 dark:text-gray-400 text-base text-center">Se ha negado la
								transferencia.</h1>
						</div>
						<div class="border-t border-gray-300 dark:border-gray-600 p-4">
							<button @click="showDenyModal = false"
								class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Continuar</button>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// ❗️ REVISA LA RUTA ❗️
// Esta ruta (../../../config/api) puede estar incorrecta. 
// Asegúrate de que apunte a tu archivo api.js
import { authenticatedFetch } from '../../../config/api'

// --- Estado Reactivo ---
const dashboardData = ref(null)
const isLoading = ref(true)
const error = ref(null)
const showAuthModal = ref(false)
const showDenyModal = ref(false)
const isSubmitting = ref(false) // Para deshabilitar botones mientras se envía

// --- Lógica (Métodos) ---
const fetchDashboardData = async () => {
	isLoading.value = true
	error.value = null
	try {
		const response = await authenticatedFetch('/dashboard')
		if (!response.ok) {
			throw new Error(`Error ${response.status}: No se pudo obtener la información.`)
		}
		dashboardData.value = await response.json()

	} catch (e) {
		console.error('Error al cargar el dashboard:', e)
		error.value = e.message
	} finally {
		isLoading.value = false
	}
}

// --- Lógica para los botones de notificación ---

const handleAutorizar = async (id) => {
	if (isSubmitting.value) return; // Evitar doble click
	isSubmitting.value = true;

	try {
		// ❗️ Asumo que tu ruta es así, ajústala si es necesario
		const response = await authenticatedFetch(`/transferencias/${id}/autorizar`, {
			method: 'POST'
		});

		if (!response.ok) {
			// Intentar leer el error del body
			const errData = await response.json();
			throw new Error(errData.message || 'Falló la autorización');
		}

		// Éxito:
		showAuthModal.value = true // Mostrar modal de éxito
		await fetchDashboardData() // Recargar los datos del dashboard (para que desaparezca la notif)

	} catch (err) {
		console.error('Error al autorizar:', err);
		alert(err.message || 'Un error ocurrió. Intente de nuevo.'); // Mostrar error
	} finally {
		isSubmitting.value = false;
	}
}

const handleDenegar = async (id) => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;

	try {
		// ❗️ Asumo que tu ruta es así, ajústala si es necesario
		const response = await authenticatedFetch(`/transferencias/${id}/denegar`, {
			method: 'POST'
		});

		if (!response.ok) {
			const errData = await response.json();
			throw new Error(errData.message || 'Falló la denegación');
		}

		// Éxito:
		showDenyModal.value = true // Mostrar modal de éxito
		await fetchDashboardData() // Recargar los datos

	} catch (err) {
		console.error('Error al denegar:', err);
		alert(err.message || 'Un error ocurrió. Intente de nuevo.');
	} finally {
		isSubmitting.value = false;
	}
}

// --- Hook de Ciclo de Vida ---
onMounted(() => {
	fetchDashboardData()
})
</script>
