<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Gestores</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-end">
			<div class="flex-1">
				<form class="flex gap-2" @submit.prevent>
					<input type="text" placeholder="Buscar gestor" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					<button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Buscar</button>
				</form>
			</div>
			<button @click="openNewGestorModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">Nuevo Gestor</button>
			<button @click="showReportModal = true" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2zm2-6a2 2 0 11-4 0 2 2 0 014 0z"></path>
				</svg>
				Reporte
			</button>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Apellidos</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Puesto</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Área</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="(gestor, index) in gestores" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ gestor.nombre }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ gestor.apellidos }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ gestor.puesto }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ gestor.area }}</td>
						<td class="px-4 py-3 flex gap-2">
							<button @click="editGestor(index)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
							<button @click="deleteGestor(index)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- New Gestor Modal -->
		<div v-if="showNewGestorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Gestor</h2>
					<button @click="showNewGestorModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input v-model="newGestorData.nombre" type="text" placeholder="Nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
						<input v-model="newGestorData.apellidos" type="text" placeholder="Apellido" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puesto/Cargo</label>
						<select v-model="newGestorData.puesto" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Seleccione puesto/cargo</option>
							<option>Gestor Superior</option>
							<option>Gestor Junior</option>
							<option>Coordinador</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área</label>
						<select v-model="newGestorData.area" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Seleccionar Área</option>
							<option>RR.HH</option>
							<option>Sistemas</option>
							<option>Administración</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewGestorModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewGestor" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Gestor Modal -->
		<div v-if="showEditGestorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Gestor</h2>
					<button @click="showEditGestorModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input v-model="editingGestor.nombre" type="text" placeholder="Nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
						<input v-model="editingGestor.apellidos" type="text" placeholder="Apellido" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puesto/Cargo</label>
						<select v-model="editingGestor.puesto" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Gestor Superior</option>
							<option>Gestor Junior</option>
							<option>Coordinador</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área</label>
						<select v-model="editingGestor.area" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>RR.HH</option>
							<option>Sistemas</option>
							<option>Administración</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditGestorModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditGestor" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Report Modal -->
		<div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
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
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Confirmar Eliminación</h2>
					<button @click="showDeleteConfirm = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6">
					<p class="text-gray-600 dark:text-gray-400">¿Está seguro de que desea eliminar este gestor?</p>
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
import { ref } from 'vue'

const gestores = ref([
	{ nombre: 'Juan', apellidos: 'Pérez', puesto: 'Gestor Superior', area: 'Sistemas' },
	{ nombre: 'María', apellidos: 'García', puesto: 'Gestor Junior', area: 'Administración' },
	{ nombre: 'Carlos', apellidos: 'López', puesto: 'Coordinador', area: 'RR.HH' },
])

const showNewGestorModal = ref(false)
const showEditGestorModal = ref(false)
const showReportModal = ref(false)
const showDeleteConfirm = ref(false)
const editingIndex = ref(null)

const newGestorData = ref({
	nombre: '',
	apellidos: '',
	puesto: '',
	area: '',
})

const editingGestor = ref({
	nombre: '',
	apellidos: '',
	puesto: '',
	area: '',
})

const openNewGestorModal = () => {
	newGestorData.value = { nombre: '', apellidos: '', puesto: '', area: '' }
	showNewGestorModal.value = true
}

const saveNewGestor = () => {
	if (newGestorData.value.nombre && newGestorData.value.apellidos && newGestorData.value.puesto && newGestorData.value.area) {
		gestores.value.push({ ...newGestorData.value })
		showNewGestorModal.value = false
		newGestorData.value = { nombre: '', apellidos: '', puesto: '', area: '' }
	}
}

const editGestor = (index) => {
	editingIndex.value = index
	editingGestor.value = { ...gestores.value[index] }
	showEditGestorModal.value = true
}

const saveEditGestor = () => {
	gestores.value[editingIndex.value] = { ...editingGestor.value }
	showEditGestorModal.value = false
}

const deleteGestor = (index) => {
	editingIndex.value = index
	showDeleteConfirm.value = true
}

const confirmDelete = () => {
	gestores.value.splice(editingIndex.value, 1)
	showDeleteConfirm.value = false
}
</script>
