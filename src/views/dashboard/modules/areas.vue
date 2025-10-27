<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Control de Áreas</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<!-- Search and Create -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-end">
			<div class="flex-1">
				<form @submit.prevent="searchAreas" class="flex gap-2">
					<input 
						v-model="searchQuery"
						type="text" 
						placeholder="Buscar área" 
						class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
					<button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Buscar</button>
				</form>
			</div>
			<button @click="openNewAreaModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">Nueva Área</button>
		</div>

		<!-- Areas Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<!-- Area Card -->
			<div v-for="(area, index) in areas" :key="index" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
				<div class="flex gap-4 mb-4">
					<div class="flex-shrink-0">
						<div :class="['flex items-center justify-center h-12 w-12 rounded-lg', area.iconBg, area.iconColor]">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
							</svg>
						</div>
					</div>
					<div class="flex-1">
						<h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ area.name }}</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">Código: {{ area.code }}</p>
					</div>
				</div>
				<div class="space-y-1 mb-4 text-sm">
					<p class="text-gray-600 dark:text-gray-400">Responsable: {{ area.manager }}</p>
					<p class="text-gray-600 dark:text-gray-400">Edificio: {{ area.building }}</p>
					<p class="text-gray-600 dark:text-gray-400">Departamento: {{ area.department }}</p>
				</div>
				<div class="flex gap-2">
					<button @click="editArea(index)" class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium">Editar</button>
					<button @click="deleteArea(index)" class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm font-medium">Eliminar</button>
				</div>
			</div>
		</div>

		<!-- New Area Modal -->
		<div v-if="showNewAreaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nueva Área</h2>
					<button @click="showNewAreaModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Área</label>
						<input 
							v-model="newAreaData.name"
							type="text" 
							placeholder="Nombre del área" 
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código del Área</label>
						<input 
							v-model="newAreaData.code"
							type="text" 
							placeholder="Código" 
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable del Área</label>
						<select v-model="newAreaData.manager" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Seleccionar responsable</option>
							<option>Juan Pérez</option>
							<option>María García</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
						<select v-model="newAreaData.building" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Seleccionar edificio</option>
							<option>Edificio A</option>
							<option>Edificio B</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<select v-model="newAreaData.department" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Seleccionar departamento</option>
							<option>Sistemas</option>
							<option>RR.HH</option>
							<option>Administración</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewAreaModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewArea" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Area Modal -->
		<div v-if="showEditAreaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Área</h2>
					<button @click="showEditAreaModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Área</label>
						<input 
							v-model="editingArea.name"
							type="text" 
							placeholder="Nombre del área" 
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código del Área</label>
						<input 
							v-model="editingArea.code"
							type="text" 
							placeholder="Código" 
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable del Área</label>
						<select v-model="editingArea.manager" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Juan Pérez</option>
							<option>María García</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
						<select v-model="editingArea.building" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Edificio A</option>
							<option>Edificio B</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<select v-model="editingArea.department" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Sistemas</option>
							<option>RR.HH</option>
							<option>Administración</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditAreaModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditArea" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const showNewAreaModal = ref(false)
const showEditAreaModal = ref(false)
const editingIndex = ref(null)

const areas = ref([
	{
		name: 'Laboratorio de Sistemas',
		code: 'LAB-SIS-001',
		manager: 'Juan Pérez',
		building: 'Edificio A',
		department: 'Sistemas',
		iconBg: 'bg-blue-100 dark:bg-blue-900',
		iconColor: 'text-blue-600 dark:text-blue-400',
	},
	{
		name: 'RR.HH',
		code: 'RRHH-001',
		manager: 'María García',
		building: 'Edificio B',
		department: 'Administración',
		iconBg: 'bg-green-100 dark:bg-green-900',
		iconColor: 'text-green-600 dark:text-green-400',
	},
])

const newAreaData = ref({
	name: '',
	code: '',
	manager: '',
	building: '',
	department: '',
})

const editingArea = ref({
	name: '',
	code: '',
	manager: '',
	building: '',
	department: '',
})

const openNewAreaModal = () => {
	newAreaData.value = { name: '', code: '', manager: '', building: '', department: '' }
	showNewAreaModal.value = true
}

const saveNewArea = () => {
	if (newAreaData.value.name && newAreaData.value.code) {
		areas.value.push({
			...newAreaData.value,
			iconBg: 'bg-purple-100 dark:bg-purple-900',
			iconColor: 'text-purple-600 dark:text-purple-400',
		})
		showNewAreaModal.value = false
		newAreaData.value = { name: '', code: '', manager: '', building: '', department: '' }
	}
}

const editArea = (index) => {
	editingIndex.value = index
	editingArea.value = { ...areas.value[index] }
	showEditAreaModal.value = true
}

const saveEditArea = () => {
	if (editingIndex.value !== null) {
		areas.value[editingIndex.value] = editingArea.value
		showEditAreaModal.value = false
		editingIndex.value = null
	}
}

const deleteArea = (index) => {
	if (confirm('¿Estás seguro de que quieres eliminar esta área?')) {
		areas.value.splice(index, 1)
	}
}

const searchAreas = () => {
	// Search functionality can be implemented here
	console.log('Searching for:', searchQuery.value)
}
</script>
