<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Roles</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-end gap-4">
			<button @click="showNewRolModal = true" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Nuevo Rol</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div v-for="(rol, index) in roles" :key="index" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ rol.nombre }}</h3>
					<div class="flex gap-2">
						<button @click="editRol(index)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" title="Editar">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
							</svg>
						</button>
						<button @click="deleteRol(index)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" title="Eliminar">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
							</svg>
						</button>
					</div>
				</div>
				<p class="text-gray-600 dark:text-gray-400 text-sm">{{ rol.descripcion }}</p>
				<div class="mt-4 space-y-2 text-sm">
					<p class="text-gray-600 dark:text-gray-400">Permisos:</p>
					<ul class="list-disc list-inside text-gray-600 dark:text-gray-400">
						<li v-for="permiso in rol.permisos" :key="permiso">{{ permiso }}</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- New Rol Modal -->
		<div v-if="showNewRolModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Rol</h2>
					<button @click="showNewRolModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Rol</label>
						<input v-model="newRolData.nombre" type="text" placeholder="Nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
						<textarea v-model="newRolData.descripcion" rows="3" placeholder="Descripción" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewRolModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewRol" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Rol Modal -->
		<div v-if="showEditRolModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Rol</h2>
					<button @click="showEditRolModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Rol</label>
						<input v-model="editingRol.nombre" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
						<textarea v-model="editingRol.descripcion" rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditRolModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditRol" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const showNewRolModal = ref(false)
const showEditRolModal = ref(false)
const editingIndex = ref(null)

const roles = ref([
	{ nombre: 'Administrador', descripcion: 'Acceso total al sistema', permisos: ['Ver reportes', 'Crear usuarios', 'Eliminar items'] },
	{ nombre: 'Gestor', descripcion: 'Acceso a gestión de bienes', permisos: ['Ver reportes', 'Crear bienes'] },
])

const newRolData = ref({ nombre: '', descripcion: '', permisos: [] })
const editingRol = ref({ nombre: '', descripcion: '', permisos: [] })

const saveNewRol = () => {
	if (newRolData.value.nombre.trim()) {
		roles.value.push({
			nombre: newRolData.value.nombre,
			descripcion: newRolData.value.descripcion,
			permisos: ['Nuevo permiso'],
		})
		showNewRolModal.value = false
		newRolData.value = { nombre: '', descripcion: '', permisos: [] }
	}
}

const editRol = (index) => {
	editingIndex.value = index
	editingRol.value = { ...roles.value[index] }
	showEditRolModal.value = true
}

const saveEditRol = () => {
	if (editingIndex.value !== null) {
		roles.value[editingIndex.value] = { ...editingRol.value }
		showEditRolModal.value = false
	}
}

const deleteRol = (index) => {
	if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
		roles.value.splice(index, 1)
	}
}
</script>
