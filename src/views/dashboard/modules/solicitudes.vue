<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Solicitudes</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
			<div class="flex flex-col md:flex-row gap-4 items-end">
				<div class="flex-1">
					<form class="flex gap-2" @submit.prevent>
						<input type="text" placeholder="Buscar solicitud" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Buscar</button>
					</form>
				</div>
				<select v-model="filterEstado" class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					<option value="">Todos los estados</option>
					<option value="Pendiente">Pendiente</option>
					<option value="Aprobada">Aprobada</option>
					<option value="Rechazada">Rechazada</option>
				</select>
			</div>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
			<table class="w-full text-sm">
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
					<tr v-for="(solicitud, index) in filteredSolicitudes" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ solicitud.tipo }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ solicitud.solicitante }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ solicitud.descripcion }}</td>
						<td class="px-4 py-3">
							<span
								v-if="solicitud.estado === 'Pendiente'"
								class="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold"
							>
								{{ solicitud.estado }}
							</span>
							<span
								v-else-if="solicitud.estado === 'Aprobada'"
								class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold"
							>
								{{ solicitud.estado }}
							</span>
							<span
								v-else
								class="inline-block px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold"
							>
								{{ solicitud.estado }}
							</span>
						</td>
						<td class="px-4 py-3 flex gap-2">
							<button @click="viewSolicitudDetails(index)" class="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors" title="Ver detalles">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							</button>
							<button
								v-if="solicitud.estado === 'Pendiente'"
								@click="approveSolicitud(index)"
								class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
							>
								Aprobar
							</button>
							<button
								v-else
								class="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs cursor-not-allowed opacity-50"
								disabled
							>
								Aprobar
							</button>
							<button
								v-if="solicitud.estado === 'Pendiente'"
								@click="rejectSolicitud(index)"
								class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
							>
								Rechazar
							</button>
							<button
								v-else
								class="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs cursor-not-allowed opacity-50"
								disabled
							>
								Rechazar
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- View Details Modal -->
		<div v-if="showDetailsSolicitudModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalles de la Solicitud</h2>
					<button @click="showDetailsSolicitudModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div v-if="selectedSolicitudDetails" class="p-6 space-y-6">
					<!-- Información del Bien Section -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Left: Información del Bien -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
							<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Información del Bien</h3>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Nombre del Bien:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.bien.nombre }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Descripción:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.bien.descripcion }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Estado:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.bien.estado }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Número de Inventario:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.bien.numeroInventario }}</p>
							</div>
						</div>

						<!-- Right: Origen -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
							<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Origen</h3>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Área Actual:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.origen.areaActual }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Responsable Actual:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.origen.responsable }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Ubicación:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.origen.ubicacion }}</p>
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
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.destino.areaDestino }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Responsable Destino:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.destino.responsable }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Ubicación:</span>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.destino.ubicacion }}</p>
							</div>
						</div>

						<!-- Right: Motivo del Intercambio -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
							<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Motivo del Intercambio</h3>
							<div>
								<p class="text-sm text-gray-900 dark:text-white">{{ selectedSolicitudDetails.motivo }}</p>
							</div>
						</div>
					</div>

					<!-- Request Status Section -->
					<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Tipo de Solicitud:</span>
								<p class="text-sm text-gray-900 dark:text-white font-medium">{{ selectedSolicitudDetails.tipo }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Solicitante:</span>
								<p class="text-sm text-gray-900 dark:text-white font-medium">{{ selectedSolicitudDetails.solicitante }}</p>
							</div>
							<div>
								<span class="text-xs font-medium text-gray-600 dark:text-gray-400">Estado de Solicitud:</span>
								<span
									:class="['inline-block px-3 py-1 rounded-full text-xs font-semibold', selectedSolicitudDetails.estado === 'Pendiente' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : selectedSolicitudDetails.estado === 'Aprobada' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200']"
								>
									{{ selectedSolicitudDetails.estado }}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showDetailsSolicitudModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const solicitudes = ref([
	{
		tipo: 'Transferencia',
		solicitante: 'Juan Pérez',
		descripcion: 'Transferencia de laptop',
		estado: 'Pendiente',
		bien: {
			nombre: 'Computadora HP',
			descripcion: 'Laptop HP ProBook 450 G8, Intel Core i5, 8GB RAM',
			estado: 'Bueno',
			numeroInventario: 'INV-2023-001'
		},
		origen: {
			areaActual: 'Departamento de Sistemas',
			responsable: 'María González',
			ubicacion: 'Edificio A, Piso 3, Oficina 302'
		},
		destino: {
			areaDestino: 'Departamento de Contabilidad',
			responsable: 'Carlos Rodríguez',
			ubicacion: 'Edificio B, Piso 2, Oficina 205'
		},
		motivo: 'Necesidad de equipo para nuevo personal en el área de contabilidad. El equipo actual del departamento de sistemas será reemplazado por uno nuevo, por lo que se propone reutilizar este equipo en contabilidad.'
	},
	{
		tipo: 'Eliminación',
		solicitante: 'María García',
		descripcion: 'Eliminación de bien da��ado',
		estado: 'Aprobada',
		bien: {
			nombre: 'Monitor CRT',
			descripcion: 'Monitor CRT 17 pulgadas, con pantalla rota',
			estado: 'Malo',
			numeroInventario: 'INV-2015-045'
		},
		origen: {
			areaActual: 'Departamento de Sistemas',
			responsable: 'Juan Pérez',
			ubicacion: 'Almacén Central'
		},
		destino: {
			areaDestino: 'No aplica - Eliminación',
			responsable: 'No aplica',
			ubicacion: 'No aplica'
		},
		motivo: 'El equipo se encuentra en mal estado con daño irreparable en la pantalla, por lo que se solicita su eliminación del inventario.'
	},
	{
		tipo: 'Transferencia',
		solicitante: 'Carlos López',
		descripcion: 'Transferencia de escritorio',
		estado: 'Pendiente',
		bien: {
			nombre: 'Escritorio Ejecutivo',
			descripcion: 'Escritorio de madera color roble, dimensiones 1.5m x 0.75m',
			estado: 'Regular',
			numeroInventario: 'INV-2020-089'
		},
		origen: {
			areaActual: 'Dirección General',
			responsable: 'Laura Martínez',
			ubicacion: 'Edificio A, Piso 4, Oficina 401'
		},
		destino: {
			areaDestino: 'Departamento de Recursos Humanos',
			responsable: 'Patricia Sánchez',
			ubicacion: 'Edificio C, Piso 1, Oficina 105'
		},
		motivo: 'Reorganizaci��n de espacios en la dirección general. El escritorio será reasignado al departamento de recursos humanos para optimizar el espacio disponible.'
	},
	{
		tipo: 'Reparación',
		solicitante: 'Ana Rodríguez',
		descripcion: 'Reparación de monitor',
		estado: 'Rechazada',
		bien: {
			nombre: 'Monitor LED 24 pulgadas',
			descripcion: 'Monitor LED 24 pulgadas, marca LG, con líneas en la pantalla',
			estado: 'Regular',
			numeroInventario: 'INV-2021-156'
		},
		origen: {
			areaActual: 'Departamento de Sistemas',
			responsable: 'Juan Pérez',
			ubicacion: 'Laboratorio de Computo'
		},
		destino: {
			areaDestino: 'Centro de Reparación',
			responsable: 'Técnico de Mantenimiento',
			ubicacion: 'Área de Mantenimiento'
		},
		motivo: 'El monitor presenta líneas horizontales en la pantalla que afectan la visualización. Se solicita reparación o reemplazo del equipo.'
	},
])

const filterEstado = ref('')
const showDetailsSolicitudModal = ref(false)
const selectedSolicitudDetails = ref(null)

const filteredSolicitudes = computed(() => {
	if (!filterEstado.value) {
		return solicitudes.value
	}
	return solicitudes.value.filter(solicitud => solicitud.estado === filterEstado.value)
})

const viewSolicitudDetails = (index) => {
	selectedSolicitudDetails.value = { ...solicitudes.value[index] }
	showDetailsSolicitudModal.value = true
}

const approveSolicitud = (index) => {
	solicitudes.value[index].estado = 'Aprobada'
}

const rejectSolicitud = (index) => {
	solicitudes.value[index].estado = 'Rechazada'
}
</script>
