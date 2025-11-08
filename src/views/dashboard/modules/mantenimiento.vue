<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Mantenimiento</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 flex flex-col md:flex-row gap-4 items-end">
			<div class="flex-1">
				<input v-model="searchTerm" type="text" placeholder="Buscar bien" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
			</div>
			<button @click="openNewMantenimientoModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">Nuevo Mantenimiento</button>
			<button @click="showReportModal = true" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2zm2-6a2 2 0 11-4 0 2 2 0 014 0z"></path>
				</svg>
				Reporte
			</button>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-x-auto">
			<div v-if="filteredMantenimientos.length === 0" class="flex items-center justify-center h-64">
				<p class="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">No existen registros</p>
			</div>
			<table v-else class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Bien</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Tipo de Mantenimiento</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Fecha</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Estado</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="(mantenimiento, index) in filteredMantenimientos" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ mantenimiento.bien }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ mantenimiento.tipo }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ mantenimiento.fecha }}</td>
						<td class="px-4 py-3">
							<span 
								v-if="mantenimiento.estado === 'Completado'" 
								class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold"
							>
								{{ mantenimiento.estado }}
							</span>
							<span 
								v-else-if="mantenimiento.estado === 'Pendiente'" 
								class="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold"
							>
								{{ mantenimiento.estado }}
							</span>
							<span 
								v-else 
								class="inline-block px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold"
							>
								{{ mantenimiento.estado }}
							</span>
						</td>
						<td class="px-4 py-3 flex gap-2">
							<button @click="editMantenimiento(index)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
							<button @click="deleteMantenimiento(index)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- New Mantenimiento Modal -->
		<div v-if="showNewMantenimientoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Mantenimiento</h2>
					<button @click="showNewMantenimientoModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bien</label>
						<select v-model="newMantenimientoData.bien" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Seleccionar bien</option>
							<option>COMPUTADORA DELL</option>
							<option>IMPRESORA HP</option>
							<option>LAPTOP LENOVO</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Mantenimiento</label>
						<select v-model="newMantenimientoData.tipo" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Seleccionar tipo</option>
							<option>Preventivo</option>
							<option>Correctivo</option>
							<option>Limpieza</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha</label>
						<input v-model="newMantenimientoData.fecha" type="date" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
						<select v-model="newMantenimientoData.estado" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Seleccionar estado</option>
							<option>Pendiente</option>
							<option>Completado</option>
							<option>En proceso</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones</label>
						<textarea v-model="newMantenimientoData.observaciones" rows="3" placeholder="Observaciones" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewMantenimientoModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewMantenimiento" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Mantenimiento Modal -->
		<div v-if="showEditMantenimientoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Mantenimiento</h2>
					<button @click="showEditMantenimientoModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bien</label>
						<select v-model="editingMantenimiento.bien" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>COMPUTADORA DELL</option>
							<option>IMPRESORA HP</option>
							<option>LAPTOP LENOVO</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Mantenimiento</label>
						<select v-model="editingMantenimiento.tipo" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Preventivo</option>
							<option>Correctivo</option>
							<option>Limpieza</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha</label>
						<input v-model="editingMantenimiento.fecha" type="date" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
						<select v-model="editingMantenimiento.estado" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Pendiente</option>
							<option>Completado</option>
							<option>En proceso</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones</label>
						<textarea v-model="editingMantenimiento.observaciones" rows="3" placeholder="Observaciones" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditMantenimientoModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditMantenimiento" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Report Modal -->
		<div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Generar Reporte</h2>
					<button @click="showReportModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<p class="text-gray-600 dark:text-gray-400">Seleccione el formato de exportación:</p>
					<div class="space-y-2">
						<button class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Exportar a PDF</button>
						<button class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">Exportar a Excel</button>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showReportModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
				</div>
			</div>
		</div>

		<!-- Delete Confirmation Modal -->
		<div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Confirmar Eliminación</h2>
					<button @click="showDeleteConfirm = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6">
					<p class="text-gray-600 dark:text-gray-400">¿Está seguro de que desea eliminar este registro de mantenimiento?</p>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showDeleteConfirm = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="confirmDelete" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">Eliminar</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const mantenimientos = ref([
	{ bien: 'COMPUTADORA DELL', tipo: 'Limpieza', fecha: '2024-02-15', estado: 'Completado', observaciones: 'Limpieza general realizada' },
	{ bien: 'IMPRESORA HP', tipo: 'Preventivo', fecha: '2024-02-10', estado: 'Completado', observaciones: 'Mantenimiento preventivo' },
	{ bien: 'LAPTOP LENOVO', tipo: 'Correctivo', fecha: '2024-02-20', estado: 'Pendiente', observaciones: 'Reparación de teclado' },
])

const showNewMantenimientoModal = ref(false)
const showEditMantenimientoModal = ref(false)
const showReportModal = ref(false)
const showDeleteConfirm = ref(false)
const editingIndex = ref(null)
const searchTerm = ref('')

const filteredMantenimientos = computed(() => {
	return mantenimientos.value.filter(mantenimiento => {
		return !searchTerm.value ||
			mantenimiento.bien.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
			mantenimiento.tipo.toLowerCase().includes(searchTerm.value.toLowerCase())
	})
})

const newMantenimientoData = ref({
	bien: '',
	tipo: '',
	fecha: '',
	estado: '',
	observaciones: '',
})

const editingMantenimiento = ref({
	bien: '',
	tipo: '',
	fecha: '',
	estado: '',
	observaciones: '',
})

const openNewMantenimientoModal = () => {
	newMantenimientoData.value = { bien: '', tipo: '', fecha: '', estado: '', observaciones: '' }
	showNewMantenimientoModal.value = true
}

const saveNewMantenimiento = () => {
	if (newMantenimientoData.value.bien && newMantenimientoData.value.tipo && newMantenimientoData.value.fecha && newMantenimientoData.value.estado) {
		mantenimientos.value.push({ ...newMantenimientoData.value })
		showNewMantenimientoModal.value = false
		newMantenimientoData.value = { bien: '', tipo: '', fecha: '', estado: '', observaciones: '' }
	}
}

const editMantenimiento = (index) => {
	editingIndex.value = index
	editingMantenimiento.value = { ...mantenimientos.value[index] }
	showEditMantenimientoModal.value = true
}

const saveEditMantenimiento = () => {
	mantenimientos.value[editingIndex.value] = { ...editingMantenimiento.value }
	showEditMantenimientoModal.value = false
}

const deleteMantenimiento = (index) => {
	editingIndex.value = index
	showDeleteConfirm.value = true
}

const confirmDelete = () => {
	mantenimientos.value.splice(editingIndex.value, 1)
	showDeleteConfirm.value = false
}
</script>
