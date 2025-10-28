<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Control de Áreas</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<!-- Search and Create Areas -->
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

		<!-- Management Sections Buttons -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<button @click="openNewDepartmentModal" class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
				</svg>
				Gestionar Departamentos
			</button>
			<button @click="openNewBuildingModal" class="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
				</svg>
				Gestionar Edificios
			</button>
			<button @click="openNewOfficeModal" class="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
				</svg>
				Gestionar Oficinas
			</button>
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

		<!-- Departments Section -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Departamentos</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Responsable</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Correo</th>
							<th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						<tr v-for="(dept, index) in departments" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ dept.name }}</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ dept.responsable }}</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ dept.correo }}</td>
							<td class="px-4 py-3 flex gap-2 justify-end">
								<button @click="editDepartment(index)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" title="Editar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
									</svg>
								</button>
								<button @click="deleteDepartment(index)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" title="Eliminar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
									</svg>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Buildings Section -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Edificios</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Departamento</th>
							<th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						<tr v-for="(building, index) in buildings" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ building.name }}</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ building.department }}</td>
							<td class="px-4 py-3 flex gap-2 justify-end">
								<button @click="editBuilding(index)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" title="Editar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
									</svg>
								</button>
								<button @click="deleteBuilding(index)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" title="Eliminar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
									</svg>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Offices Section -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Oficinas</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Edificio</th>
							<th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						<tr v-for="(office, index) in offices" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ office.name }}</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ office.building }}</td>
							<td class="px-4 py-3 flex gap-2 justify-end">
								<button @click="editOffice(index)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" title="Editar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
									</svg>
								</button>
								<button @click="deleteOffice(index)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" title="Eliminar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
									</svg>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- New Department Modal -->
		<div v-if="showNewDepartmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Departamento</h2>
					<button @click="showNewDepartmentModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input
							v-model="newDepartmentData.name"
							type="text"
							placeholder="Nombre del departamento"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
						<textarea
							v-model="newDepartmentData.descripcion"
							placeholder="Descripción del departamento"
							rows="3"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						></textarea>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable</label>
						<input
							v-model="newDepartmentData.responsable"
							type="text"
							placeholder="Nombre del responsable"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Institucional</label>
						<input
							v-model="newDepartmentData.correo"
							type="email"
							placeholder="correo@institucion.com"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewDepartmentModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewDepartment" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Department Modal -->
		<div v-if="showEditDepartmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Departamento</h2>
					<button @click="showEditDepartmentModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input
							v-model="editingDepartment.name"
							type="text"
							placeholder="Nombre del departamento"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
						<textarea
							v-model="editingDepartment.descripcion"
							placeholder="Descripción del departamento"
							rows="3"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						></textarea>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable</label>
						<input
							v-model="editingDepartment.responsable"
							type="text"
							placeholder="Nombre del responsable"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Institucional</label>
						<input
							v-model="editingDepartment.correo"
							type="email"
							placeholder="correo@institucion.com"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditDepartmentModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditDepartment" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- New Building Modal -->
		<div v-if="showNewBuildingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Edificio</h2>
					<button @click="showNewBuildingModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Edificio</label>
						<input
							v-model="newBuildingData.name"
							type="text"
							placeholder="Nombre del edificio"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<select v-model="newBuildingData.department" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option value="">Seleccionar departamento</option>
							<option v-for="(dept, idx) in departments" :key="idx" :value="dept.name">{{ dept.name }}</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewBuildingModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewBuilding" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Building Modal -->
		<div v-if="showEditBuildingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Edificio</h2>
					<button @click="showEditBuildingModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Edificio</label>
						<input
							v-model="editingBuilding.name"
							type="text"
							placeholder="Nombre del edificio"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<select v-model="editingBuilding.department" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option v-for="(dept, idx) in departments" :key="idx" :value="dept.name">{{ dept.name }}</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditBuildingModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditBuilding" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- New Office Modal -->
		<div v-if="showNewOfficeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nueva Oficina</h2>
					<button @click="showNewOfficeModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de la Oficina</label>
						<input
							v-model="newOfficeData.name"
							type="text"
							placeholder="Nombre de la oficina"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
						<select v-model="newOfficeData.building" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option value="">Seleccionar edificio</option>
							<option v-for="(building, idx) in buildings" :key="idx" :value="building.name">{{ building.name }}</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewOfficeModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewOffice" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Office Modal -->
		<div v-if="showEditOfficeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Oficina</h2>
					<button @click="showEditOfficeModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de la Oficina</label>
						<input
							v-model="editingOffice.name"
							type="text"
							placeholder="Nombre de la oficina"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
						<select v-model="editingOffice.building" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option v-for="(building, idx) in buildings" :key="idx" :value="building.name">{{ building.name }}</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditOfficeModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditOffice" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
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

// Department modal states
const showNewDepartmentModal = ref(false)
const showEditDepartmentModal = ref(false)
const departments = ref([
	{ name: 'Sistemas', descripcion: 'Departamento de Tecnología de Información', responsable: 'Juan Pérez', correo: 'sistemas@tec.edu.mx' },
	{ name: 'Administración', descripcion: 'Departamento Administrativo', responsable: 'María García', correo: 'admin@tec.edu.mx' },
	{ name: 'Recursos Humanos', descripcion: 'Gestión de Recursos Humanos', responsable: 'Carlos López', correo: 'rrhh@tec.edu.mx' },
])
const newDepartmentData = ref({ name: '', descripcion: '', responsable: '', correo: '' })
const editingDepartment = ref({ name: '', descripcion: '', responsable: '', correo: '' })
const editingDepartmentIndex = ref(null)

const openNewDepartmentModal = () => {
	newDepartmentData.value = { name: '', descripcion: '', responsable: '', correo: '' }
	showNewDepartmentModal.value = true
}

const saveNewDepartment = () => {
	if (newDepartmentData.value.name && newDepartmentData.value.responsable && newDepartmentData.value.correo) {
		departments.value.push({ ...newDepartmentData.value })
		showNewDepartmentModal.value = false
		newDepartmentData.value = { name: '', descripcion: '', responsable: '', correo: '' }
	}
}

const editDepartment = (index) => {
	editingDepartmentIndex.value = index
	editingDepartment.value = { ...departments.value[index] }
	showEditDepartmentModal.value = true
}

const saveEditDepartment = () => {
	if (editingDepartmentIndex.value !== null) {
		departments.value[editingDepartmentIndex.value] = { ...editingDepartment.value }
		showEditDepartmentModal.value = false
		editingDepartmentIndex.value = null
	}
}

const deleteDepartment = (index) => {
	if (confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
		departments.value.splice(index, 1)
	}
}

// Building modal states
const showNewBuildingModal = ref(false)
const showEditBuildingModal = ref(false)
const buildings = ref([
	{ name: 'Edificio A', department: 'Sistemas' },
	{ name: 'Edificio B', department: 'Administración' },
])
const newBuildingData = ref({ name: '', department: '' })
const editingBuilding = ref({ name: '', department: '' })
const editingBuildingIndex = ref(null)

const openNewBuildingModal = () => {
	newBuildingData.value = { name: '', department: '' }
	showNewBuildingModal.value = true
}

const saveNewBuilding = () => {
	if (newBuildingData.value.name && newBuildingData.value.department) {
		buildings.value.push({ ...newBuildingData.value })
		showNewBuildingModal.value = false
		newBuildingData.value = { name: '', department: '' }
	}
}

const editBuilding = (index) => {
	editingBuildingIndex.value = index
	editingBuilding.value = { ...buildings.value[index] }
	showEditBuildingModal.value = true
}

const saveEditBuilding = () => {
	if (editingBuildingIndex.value !== null) {
		buildings.value[editingBuildingIndex.value] = { ...editingBuilding.value }
		showEditBuildingModal.value = false
		editingBuildingIndex.value = null
	}
}

const deleteBuilding = (index) => {
	if (confirm('¿Estás seguro de que quieres eliminar este edificio?')) {
		buildings.value.splice(index, 1)
	}
}

// Office modal states
const showNewOfficeModal = ref(false)
const showEditOfficeModal = ref(false)
const offices = ref([
	{ name: 'Oficina 101', building: 'Edificio A' },
	{ name: 'Oficina 102', building: 'Edificio A' },
	{ name: 'Oficina 201', building: 'Edificio B' },
])
const newOfficeData = ref({ name: '', building: '' })
const editingOffice = ref({ name: '', building: '' })
const editingOfficeIndex = ref(null)

const openNewOfficeModal = () => {
	newOfficeData.value = { name: '', building: '' }
	showNewOfficeModal.value = true
}

const saveNewOffice = () => {
	if (newOfficeData.value.name && newOfficeData.value.building) {
		offices.value.push({ ...newOfficeData.value })
		showNewOfficeModal.value = false
		newOfficeData.value = { name: '', building: '' }
	}
}

const editOffice = (index) => {
	editingOfficeIndex.value = index
	editingOffice.value = { ...offices.value[index] }
	showEditOfficeModal.value = true
}

const saveEditOffice = () => {
	if (editingOfficeIndex.value !== null) {
		offices.value[editingOfficeIndex.value] = { ...editingOffice.value }
		showEditOfficeModal.value = false
		editingOfficeIndex.value = null
	}
}

const deleteOffice = (index) => {
	if (confirm('¿Estás seguro de que quieres eliminar esta oficina?')) {
		offices.value.splice(index, 1)
	}
}
</script>
