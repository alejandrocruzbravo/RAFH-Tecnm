<template>
	<div v-if="isLoading" class="flex items-center justify-center h-64">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
		<p class="ml-4 text-gray-600 dark:text-gray-400">Cargando áreas...</p>
	</div>

	<div v-else-if="error" class="p-6 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
		<h3 class="font-bold">Error al cargar las áreas</h3>
		<p>{{ error.message || 'No se pudo conectar con la API.' }}</p>
		<button @click="fetchAreas" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
			Reintentar
		</button>
	</div>

	<div v-else class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Control de Áreas</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de
				Chetumal</label>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-end">
			<div class="flex-1">
				<form @submit.prevent="alert('Búsqueda (Paso 2)')" class="flex gap-2">
					<input type="text" placeholder="Buscar área (Paso 2)" disabled
						class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
					<button type="submit" disabled
						class="px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed">Buscar</button>
				</form>
			</div>
			<button @click="openNewAreaModal"
				class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
				Nueva Área
			</button>
		</div>

		<!-- TARJETAS DE ÁREAS  -->
		<div v-if="areas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div v-for="area in areas" :key="area.id"
				class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
				<div class="flex gap-4 mb-4">
					<div class="flex-shrink-0">
						<div
							:class="['flex items-center justify-center h-12 w-12 rounded-lg', area.iconBg || 'bg-gray-100', area.iconColor || 'text-gray-600']">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
							</svg>
						</div>
					</div>
					<div class="flex-1">
						<h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ area.area_nombre }}</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">Código: {{ area.area_codigo }}</p>
					</div>
				</div>
				<div class="space-y-1 mb-4 text-sm">
					<p class="text-gray-600 dark:text-gray-400">Responsable: {{ area.responsable &&
						area.responsable.res_nombre ? area.responsable.res_nombre : 'No asignado' }}
					</p>
					<p class="text-gray-600 dark:text-gray-400">Edificio: {{ area.edificio && area.edificio.nombre ?
						area.edificio.nombre : 'No asignado' }}
					</p>
				</div>
				<div class="flex gap-2">
					<button @click="editArea(area)"
						class="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium">Editar</button>
					<button @click="openDeleteConfirm(area)"
						class="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition-colors">
						Eliminar
					</button>
				</div>
			</div>
		</div>

		<div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
			<h3 class="text-lg font-medium text-gray-900 dark:text-white">No hay áreas</h3>
			<p class="text-gray-600 dark:text-gray-400">Aún no se ha registrado ninguna área. Haz clic en "Nueva Área"
				para comenzar.</p>
		</div>
		<!-- TABLA DE DEPARTAMENTOS  -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">Departamentos</h2>
				<button @click="openNewDepartmentModal"
					class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm">
					Nuevo Departamento
				</button>
			</div>


			<div class="mb-4">
				<form @submit.prevent class="flex gap-2">
					<input type="text" placeholder="Buscar departamento (próximamente...)" disabled
						class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
					<button type="submit" disabled
						class="px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed">
						Buscar
					</button>
				</form>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
				</table>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Responsable</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Área</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Correo</th>
							<th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						<tr v-for="dept in departments.data" :key="dept.id"
							class="hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								<div class="font-medium text-gray-900 dark:text-white">{{ dept.dep_nombre }}</div>
							</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ dept.dep_resposable || 
								'Sin asignación' }}</td>
							<td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ getAreaName(dept.id_area) }}</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ dept.dep_correo_institucional ||
								'Sin asignación' }}</td>
							<td class="px-4 py-3 flex gap-2 justify-end">
								<button @click="openEditDepartmentModal(dept)"
									class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
									title="Editar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
										</path>
									</svg>
								</button>
								<button @click="openDeleteDepartmentModal(dept)"
									class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
									title="Eliminar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
										</path>
									</svg>
								</button>
							</td>
						</tr>
						<tr v-if="!departments.data || departments.data.length === 0">
							<td colspan="4" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								No se encontraron departamentos.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- TABLA DE EDIFICIOS  -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">Edificios</h2>
				<button @click="openNewBuildingModal"
					class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm">
					Nuevo Edificio
				</button>
			</div>

			<div class="mb-4">
				<form @submit.prevent class="flex gap-2">
					<input type="text" placeholder="Buscar Edificio (próximamente...)" disabled
						class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
					<button type="submit" disabled
						class="px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed">
						Buscar
					</button>
				</form>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>

							<th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						<tr v-if="buildingsData.data.length > 0" v-for="building in buildingsData.data"
							:key="building.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">

							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								<div class="font-medium text-gray-900 dark:text-white">{{ building.nombre }}</div>
							</td>
							<td class="px-4 py-3 flex gap-2 justify-end">
								<button @click="openEditBuildingModal(building)"
									class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
									title="Editar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
										</path>
									</svg>
								</button>
								<button @click="openDeleteBuildingModal(building)"
									class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
									title="Eliminar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
										</path>
									</svg>
								</button>
							</td>
						</tr>

						<tr v-else>
							<td colspan="3" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								No se encontraron edificios.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- TABLA DE OFICINAS -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">Oficinas</h2>
				<button @click="openNewOficinaModal"
					class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm">
					Nueva Oficina
				</button>
			</div>
			<div class="mb-4">
				<form @submit.prevent class="flex gap-2">
					<input type="text" placeholder="Buscar Oficina (próximamente...)" disabled
						class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
					<button type="submit" disabled
						class="px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed">
						Buscar
					</button>
				</form>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Oficina</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Edificio</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Referencia</th>
							<th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">

						<tr v-if="isLoading">
							<td colspan="4" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								Cargando oficinas...
							</td>
						</tr>

						<tr v-else-if="fetchOficinasError">
							<td colspan="4" class="px-4 py-6 text-center text-red-500">
								Error al cargar oficinas: {{ fetchOficinasError.message }}
							</td>
						</tr>

						<tr v-else-if="oficinasData.data && oficinasData.data.length > 0"
							v-for="oficina in oficinasData.data" :key="oficina.id"
							class="hover:bg-gray-50 dark:hover:bg-gray-700">

							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								<div class="font-medium text-gray-900 dark:text-white">
									{{ oficina.nombre }}
								</div>
							</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								{{ getBuildingName(oficina.id_edificio) }}
							</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								{{ oficina.referencia || 'Sin referencia' }}
							</td>
							<td class="px-4 py-3 flex gap-2 justify-end">
								<button @click="openEditOficinaModal(oficina)"
									class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
									title="Editar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
										</path>
									</svg>
								</button>
								<button @click="openDeleteOficinaModal(oficina)"
									class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
									title="Eliminar">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
										</path>
									</svg>
								</button>
							</td>
						</tr>

						<tr v-else>
							<td colspan="4" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								No se encontraron oficinas.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Modal de nuevo Departamento-->
		<div v-if="showNewDepartmentModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Departamento</h2>
					<button @click="showNewDepartmentModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="newDepartmentError"
					class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
					role="alert">
					<span class="font-medium text-sm">{{ newDepartmentError }}</span>
					<button @click="newDepartmentError = null"
						class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input v-model="newDepartmentData.name" type="text" placeholder="Nombre del departamento"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable</label>

						<select v-model="newDepartmentData.responsable"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">

							<option :value="null">Seleccionar un responsable</option>

							<option v-if="jefesDepartamento.length === 0" disabled>-- No hay responsables --</option>

							<option v-else v-for="r in jefesDepartamento" :key="r.id" :value="r.res_nombre">
								{{ r.res_nombre }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo
							Institucional</label>
						<input v-model="newDepartmentData.correo" type="email" placeholder="correo@institucion.com"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Área a la que pertenece
						</label>
						<select v-model="newDepartmentData.id_area"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">

							<option :value="null">Seleccionar un área</option>

							<option v-if="areasList.length === 0" disabled class="text-gray-400">
								-- No hay áreas disponibles --
							</option>

							<option v-for="area in areasList.areas" :key="area.id" :value="area.id">
								{{ area.area_nombre }}
							</option>
						</select>
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewDepartmentModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>

					<button @click="saveNewDepartment" :disabled="isSubmitting"
						class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar' }}
					</button>
				</div>
			</div>
		</div>

		<!-- Modal de editar Departamento-->
		<div v-if="showEditDepartmentModal && editingDepartment"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Departamento</h2>
					<button @click="showEditDepartmentModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="editDepartmentError"
					class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
					role="alert">
					<span class="font-medium text-sm">{{ editDepartmentError }}</span>
					<button @click="editDepartmentError = null"
						class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del
							Departamento</label>
						<input v-model="editingDepartment.name" type="text"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

					<div class="relative z-10">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área a la que
							pertenece</label>
						<select v-model="editingDepartment.id_area"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar un área</option>
							<option v-if="areasList.length === 0" disabled class="text-gray-400">
								-- No hay áreas disponibles --
							</option>
							<option v-for="area in areasList.areas" :key="area.id" :value="area.id">
								{{ area.area_nombre }}
							</option>
						</select>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable</label>

						<select v-model="editingDepartment.responsable"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">

							<option :value="null" disabled>Seleccionar un responsable</option>
							<option v-if="jefesDepartamento.length === 0" disabled>-- No hay responsables --</option>

							<option v-else v-for="r in jefesDepartamento" :key="r.id" :value="r.res_nombre">
								{{ r.res_nombre }}
							</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo
							Institucional</label>
						<input v-model="editingDepartment.correo" type="email"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditDepartmentModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditDepartment" :disabled="isSubmitting"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
					</button>
				</div>
			</div>
		</div>
		<!-- Modal de nueva Área-->
		<div v-if="showNewAreaModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Crear Nueva Área</h2>
					<button @click="showNewAreaModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="newAreaError"
					class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
					role="alert">
					<span class="font-medium text-sm">{{ newAreaError }}</span>
					<button @click="newAreaError = null"
						class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del
							Área</label>
						<input v-model="newAreaData.area_nombre" type="text" placeholder="Nombre del área"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código del
							Área</label>
						<input v-model="newAreaData.area_codigo" type="text" placeholder="Código (ej. LAB-SIS-001)"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable del
							Área</LabeL>
						<select v-model="newAreaData.id_resguardante_responsable"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar responsable</option>
							<option v-if="resguardantes.length === 0" disabled class="text-gray-400">-- No hay
								responsables disponibles --</option>
							<option v-else v-for="r in resguardantes" :key="r.id" :value="r.id">
								{{ r.res_nombre }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
						<select v-model="newAreaData.id_edificio"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar edificio</option>
							<option v-if="buildings.length === 0" disabled class="text-gray-400">-- No hay edificios
								disponibles --</option>
							<option v-else v-for="b in buildings" :key="b.id" :value="b.id">
								{{ b.nombre }}
							</option>
						</select>
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewAreaModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewArea" :disabled="isSubmitting"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Creando...' : 'Crear Área' }}
					</button>
				</div>
			</div>
		</div>
		<!-- Modal de editar área-->
		<div v-if="showEditAreaModal && editingArea"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Área</h2>
					<button @click="showEditAreaModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="editAreaError"
					class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
					role="alert">
					<span class="font-medium text-sm">{{ editAreaError }}</span>
					<button @click="editAreaError = null"
						class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del
							Área</label>
						<input v-model="editingArea.area_nombre" type="text" placeholder="Nombre del área"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código del
							Área</label>
						<input v-model="editingArea.area_codigo" type="text" placeholder="Código (ej. LAB-SIS-001)"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable del
							Área</Label>
						<select v-model="editingArea.id_resguardante_responsable"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar responsable</option>
							<option v-if="resguardantes.length === 0" disabled class="text-gray-400">-- No hay
								responsables disponibles --</option>
							<option v-else v-for="r in resguardantes" :key="r.id" :value="r.id">
								{{ r.res_nombre }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</Label>
						<select v-model="editingArea.id_edificio"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar edificio</option>
							<option v-if="buildings.length === 0" disabled class="text-gray-400">-- No hay edificios
								disponibles --</option>
							<option v-else v-for="b in buildings" :key="b.id" :value="b.id">
								{{ b.nombre }}
							</option>
						</select>
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditAreaModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditArea" :disabled="isSubmitting"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
					</button>
				</div>
			</div>
		</div>
		<!-- Modal de nuevo Edificio-->
		<div v-if="showNewBuildingModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Crear Nuevo Edificio</h2>
					<button @click="showNewBuildingModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="newBuildingError"
					class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
					role="alert">
					<span class="font-medium text-sm">{{ newBuildingError }}</span>
					<button @click="newBuildingError = null"
						class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del
							Edificio</label>
						<input v-model="newBuildingData.nombre" type="text" placeholder="Ej. Edificio A"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewBuildingModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewBuilding" :disabled="isSubmitting"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Creando...' : 'Crear Edificio' }}
					</button>
				</div>
			</div>
		</div>
		<!-- Modal de editar Edificio-->
		<div v-if="showEditBuildingModal && editingBuilding"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Edificio</h2>
					<button @click="showEditBuildingModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="editBuildingError"
					class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
					role="alert">
					<span class="font-medium text-sm">{{ editBuildingError }}</span>
					<button @click="editBuildingError = null"
						class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del
							Edificio</label>
						<input v-model="editingBuilding.nombre" type="text"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditBuildingModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditBuilding" :disabled="isSubmitting"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
					</button>
				</div>
			</div>
		</div>
		<!-- Modal de nueva Oficina-->
		<div v-if="showNewOficinaModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Crear Nueva Oficina</h2>
					<button @click="showNewOficinaModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="newOficinaError"
					class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
					role="alert">
					<span class="font-medium text-sm">{{ newOficinaError }}</span>
					<button @click="newOficinaError = null"
						class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de la
							Oficina</label>
						<input v-model="newOficinaData.nombre" type="text" placeholder="Ej. Oficina 101"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

					<div class="relative z-10">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio al que
							pertenece</label>
						<select v-model="newOficinaData.id_edificio"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null" disabled>Seleccionar un edificio</option>
							<option v-if="buildings.length === 0" disabled>-- No hay edificios --</option>
							<option v-else v-for="b in buildings" :key="b.id" :value="b.id">
								{{ b.nombre }}
							</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewOficinaModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewOficina" :disabled="isSubmitting"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Creando...' : 'Crear Oficina' }}
					</button>
				</div>
			</div>
		</div>
		<!-- Modal de editar oficina -->
		<div v-if="showEditOficinaModal && editingOficina"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Oficina</h2>
					<button @click="showEditOficinaModal = false"
						class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="editOficinaError"
					class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
					role="alert">
					<span class="font-medium text-sm">{{ editOficinaError }}</span>
					<button @click="editOficinaError = null"
						class="font-bold text-xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de la
							Oficina</label>
						<input v-model="editingOficina.nombre" type="text"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

					<div class="relative z-10">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio al que
							pertenece</label>
						<select v-model="editingOficina.id_edificio"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null" disabled>Seleccionar un edificio</option>
							<option v-if="buildings.length === 0" disabled>-- No hay edificios --</option>
							<option v-else v-for="b in buildings" :key="b.id" :value="b.id">
								{{ b.nombre }}
							</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Referencia
							(Opcional)</label>
						<input v-model="editingOficina.referencia" type="text"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditOficinaModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditOficina" :disabled="isSubmitting"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
					</button>
				</div>
			</div>
		</div>
		<ConfirmModal :show="!!deletingArea" :isSubmitting="isSubmitting" :errorMessage="deleteError"
			title="Confirmar Eliminación"
			:message="`¿Estás seguro de que deseas eliminar el área:<br><strong class='font-medium text-lg text-gray-900 dark:text-white'>${deletingArea?.area_nombre}</strong>?`"
			confirmText="Sí, Eliminar" confirmClass="bg-red-600 hover:bg-red-700" @confirm="confirmDeleteArea"
			@cancel="cancelDelete" @clearError="deleteError = null" />

		<ConfirmModal :show="showDeleteDepartmentModal" :isSubmitting="isSubmitting"
			:errorMessage="deleteDepartmentError" title="Confirmar Eliminación"
			:message="`¿Estás seguro de que deseas eliminar el departamento:<br><strong class='font-medium text-lg text-gray-900 dark:text-white'>${deletingDepartment?.dep_nombre}</strong>?`"
			confirmText="Sí, Eliminar" confirmClass="bg-red-600 hover:bg-red-700" @confirm="handleConfirmDelete"
			@cancel="cancelDeleteDepartment" @clearError="deleteDepartmentError = null" />

		<ConfirmModal :show="showDeleteBuildingModal" :isSubmitting="isSubmitting" :errorMessage="deleteBuildingError"
			title="Confirmar Eliminación" :message="deleteBuildingMessage" confirmText="Sí, Eliminar"
			confirmClass="bg-red-600 hover:bg-red-700" @confirm="handleConfirmDeleteBuilding"
			@cancel="cancelDeleteBuilding" @clearError="deleteBuildingError = null" />
		<ConfirmModal :show="showDeleteOficinaModal" :isSubmitting="isSubmitting" :errorMessage="deleteOficinaError"
			title="Confirmar Eliminación" :message="deleteOficinaMessage" confirmText="Sí, Eliminar"
			confirmClass="bg-red-600 hover:bg-red-700" @confirm="handleConfirmDeleteOficina"
			@cancel="cancelDeleteOficina" @clearError="deleteOficinaError = null" />


	</div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import { authenticatedFetch } from '../../../config/api.js'
import ConfirmModal from '@/components/ConfirmModal.vue'

// Paleta de colores para los iconos de las áreas
const colorClasses = [
	{ bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300' },
	{ bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300' },
	{ bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-300' },
	{ bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300' },
	{ bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-300' },
	{ bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-800 dark:text-pink-300' },
	{ bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-800 dark:text-indigo-300' },
	{ bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-800 dark:text-teal-300' },
]

//Función para obtener un par de clases aleatorio
const getRandomColorPair = () => {
	return colorClasses[Math.floor(Math.random() * colorClasses.length)];
}

//Función auxiliar para "aumentar" la lista de áreas con los colores
const assignRandomColors = (areaList) => {
	return areaList.map(area => {
		const colors = getRandomColorPair();
		return {
			...area,
			iconBg: colors.bg,
			iconColor: colors.text
		};
	});
}
// --- Estados Reactivos Generales---
const areas = ref([]) // Aquí se guardarán los datos de la API
const isLoading = ref(true) // Controla el spinner de carga
const error = ref(null) // Guarda el objeto de error si la API falla
const isSubmitting = ref(false)

// Estados para el Modal "Nueva Área"
const showNewAreaModal = ref(false)
const newAreaData = ref({
	area_nombre: '',
	area_codigo: '',
	id_resguardante_responsable: null,
	id_edificio: null,
})
// Estados para el modal "Editar"
const newAreaError = ref(null)
const editAreaError = ref(null)
const showEditAreaModal = ref(false)
const editingArea = ref(null)

// Estados para el Modal "Eliminar Área"
const deletingArea = ref(null) // Guardará el área a eliminar
const deleteError = ref(null) // Para el banner de error del modal de eliminación

//Estados para los datos de los Dropdowns
const resguardantes = ref([])
const buildings = ref([])
const areasList = ref([])

//Estados para departamentos
const departments = ref([])
const jefesDepartamento = ref([])
const showNewDepartmentModal = ref(false)
const newDepartmentData = ref({
	nombre: '',
	responsable: null,
	correo: '',
	id_area: null
})
const newDepartmentError = ref(null) // Para el banner de error
const showDeleteDepartmentModal = ref(false)
const deletingDepartment = ref(null) // Para guardar el { id, dep_nombre, ... }
const deleteDepartmentError = ref(null) // Para el banner de error

const showEditDepartmentModal = ref(false)
const editingDepartment = ref(null) // Para guardar el { id, name, ... }
const editDepartmentError = ref(null) // Para el banner de error


// Estados para la tabla de Edificios
const buildingsData = ref([]) // Para la tabla principal de edificios
const fetchBuildingsError = ref(null) // Error específico de la tabla de edificios

// Estados para el Modal "Nuevo Edificio"
const showNewBuildingModal = ref(false)
const newBuildingData = ref({
	nombre: '',
})
const newBuildingError = ref(null)
const showDeleteBuildingModal = ref(false)
const deletingBuilding = ref(null) // Para guardar el { id, nombre, ... }
const deleteBuildingError = ref(null)
const showEditBuildingModal = ref(false)
const editingBuilding = ref(null) // Para el v-model del formulario
const editBuildingError = ref(null)

// Estados para la tabla de Oficinas
const oficinasData = ref([{ data: [] }])
const fetchOficinasError = ref(null)

// Estados para el Modal "Nueva Oficina"
const newOficinaData = ref({
	nombre: '',
	id_edificio: null
})
const newOficinaError = ref(null)
const showDeleteOficinaModal = ref(false)

//Estados para eliminar oficina
const deletingOficina = ref(null) // Para guardar el { id, nombre, ... }
const deleteOficinaError = ref(null)
const showNewOficinaModal = ref(false)

// Estados para editar oficina
const showEditOficinaModal = ref(false)
const editingOficina = ref(null) // Para el v-model del formulario
const editOficinaError = ref(null)

//Función para cargar las áreas desde la API
const fetchAllData = async () => {
	isLoading.value = true
	error.value = null
	fetchBuildingsError.value = null
	try {
		// Petición principal para las áreas

		const [areasRes, optionsRes, departmentsRes, areasListRes, buildingsRes, oficinasRes] = await Promise.all([
			authenticatedFetch('/areas'),
			authenticatedFetch('/area-form-options'),
			authenticatedFetch('/departamentos'),
			authenticatedFetch('/formularios/departamentos'),
			authenticatedFetch('/edificios'),
			authenticatedFetch('/oficinas')
		]);
		// Verificamos las respuestas
		if (!areasRes.ok) throw new Error('Error al cargar áreas');
		if (!optionsRes.ok) throw new Error('Error al cargar opciones del formulario');
		if (!departmentsRes.ok) throw new Error('Error al cargar departamentos');
		if (!areasListRes.ok) throw new Error('Error al cargar lista de áreas');
		if (!buildingsRes.ok) throw new Error('Error al cargar edificios');
		if (!oficinasRes.ok) throw new Error('Error al cargar oficinas');

		// Asignamos los datos de las áreas
		const fetchedAreas = await areasRes.json()
		areas.value = assignRandomColors(fetchedAreas)
		// Asignamos los datos de los dropdowns (según tu JSON)
		const optionsData = await optionsRes.json()
		departments.value = await departmentsRes.json()
		buildingsData.value = await buildingsRes.json()
		areasList.value = await areasListRes.json()
		oficinasData.value = await oficinasRes.json()

		resguardantes.value = optionsData.responsables || []
		jefesDepartamento.value = areasList.value.responsables || []
		buildings.value = optionsData.edificios || []

	} catch (e) {
		console.error('Error al cargar datos:', e)
		error.value = e
		if (e.message.includes('edificios')) {
			fetchBuildingsError.value = e.message
		}
	} finally {
		isLoading.value = false
	}
}

//función para recargar solo las áreas después de guardar
const fetchAreas = async () => {
	isLoading.value = true // Muestra el overlay
	try {
		const response = await authenticatedFetch('/areas')
		if (!response.ok) throw new Error('Error al recargar áreas')
		const fetchedAreas = await response.json()
		areas.value = assignRandomColors(fetchedAreas)
	} catch (err) {
		console.error(err)
		error.value = err
	} finally {
		isLoading.value = false
	}
}

// Monta todos los datos a la vista de las áreas
onMounted(fetchAllData)

// Busca en la lista de áreas (cargada para los formularios) y devuelve el nombre de un área basado en su ID.
const getAreaName = (areaId) => {
	// 1. Maneja el caso de que no tenga área asignada
	if (!areaId) {
		return 'Sin área asignada';
	}

	// 2. Comprueba que la lista de áreas esté lista y sea un array
	if (!areasList.value || !Array.isArray(areasList.value.areas)) {
		// Esto puede pasar mientras cargan los datos
		return '...';
	}

	// 3. Busca dentro del array correcto: .areas
	const area = areasList.value.areas.find(a => a.id === areaId);

	// 4. Devuelve el nombre o un ID de respaldo
	return area ? area.area_nombre : `ID (${areaId}) Desconocido`;
};
const openNewAreaModal = () => {
	newAreaData.value = {
		area_nombre: '',
		area_codigo: '',
		id_resguardante_responsable: null,
		id_edificio: null,
	}
	newAreaError.value = null
	showNewAreaModal.value = true
}

// Guarda la nueva área en la API
const saveNewArea = async () => {
	newAreaError.value = null
	if (!newAreaData.value.area_nombre || !newAreaData.value.area_codigo) {
		newAreaError.value = 'El Nombre y el Código son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			area_nombre: newAreaData.value.area_nombre,
			area_codigo: newAreaData.value.area_codigo,
			id_resguardante_responsable: newAreaData.value.id_resguardante_responsable,
			id_edificio: newAreaData.value.id_edificio,
		};
		const response = await authenticatedFetch('/areas', {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			// Intenta obtener un mensaje de error más específico de la API
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || `Error ${response.status}: No se pudo crear el área.`);
		}

		// ¡Éxito!
		showNewAreaModal.value = false // Cierra el modal
		await fetchAreas() // Recarga la lista de áreas
		await fetchAreasList();

	} catch (err) {
		console.error('Error al guardar área:', err)
		// Muestra el mensaje de error de la API o uno genérico
		newAreaError.value = err.message
	} finally {
		isSubmitting.value = false // Reactiva el botón de guardar
	}
}


const editArea = (area) => {
	// Creamos una copia del área con los campos que el formulario necesita
	// Mapeamos los IDs de las relaciones (si existen) para los dropdowns
	editingArea.value = {
		id: area.id, // Necesitamos el ID para la URL del PUT
		area_nombre: area.area_nombre,
		area_codigo: area.area_codigo,
		// Usamos ?. (optional chaining) por si la relación es nula
		id_resguardante_responsable: area.responsable?.id || null,
		id_edificio: area.edificio?.id || null
	};

	editAreaError.value = null; // Limpiamos errores anteriores
	showEditAreaModal.value = true; // Mostramos el modal
}

//Función para GUARDAR los cambios del modal de edición
const saveEditArea = async () => {
	if (!editingArea.value) return; // Seguridad, no debería pasar

	editAreaError.value = null; // Limpiamos errores

	// Validación
	if (!editingArea.value.area_nombre || !editingArea.value.area_codigo) {
		editAreaError.value = 'El Nombre y el Código son obligatorios.';
		return;
	}

	isSubmitting.value = true;

	try {
		// Preparamos el payload. Asegúrate que los nombres de las claves
		// coincidan con lo que espera tu API en la petición PUT/PATCH.
		const payload = {
			area_nombre: editingArea.value.area_nombre,
			area_codigo: editingArea.value.area_codigo,
			id_resguardante_responsable: editingArea.value.id_resguardante_responsable,
			id_edificio: editingArea.value.id_edificio,
		};

		// Usamos el ID del área en la URL
		const response = await authenticatedFetch(`/areas/${editingArea.value.id}`, {
			method: 'PUT', // O 'PATCH' si tu API lo prefiere
			body: JSON.stringify(payload)
			// No se necesitan headers, authenticatedFetch los maneja
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo actualizar el área.');
		}

		// ¡Éxito!
		showEditAreaModal.value = false; // Cierra el modal
		await fetchAreas(); // Recarga la lista de áreas
		await fetchAreasList();

	} catch (err) {
		console.error('Error al actualizar área:', err);
		editAreaError.value = err.message; // Muestra el error en el banner
	} finally {
		isSubmitting.value = false;
	}
}

//Recarga SÓLO la lista de áreas usada en los formularios (dropdowns).
const fetchAreasList = async () => {
	try {
		const areasListRes = await authenticatedFetch('/formularios/departamentos');
		if (!areasListRes.ok) {
			throw new Error('Error al recargar lista de áreas');
		}
		areasList.value = await areasListRes.json();
	} catch (e) {
		console.error('Error al actualizar areasList:', e);
	}
}
// Función para ABRIR el modal de confirmación
const openDeleteConfirm = (area) => {
	deletingArea.value = area;
	deleteError.value = null;
	// Ya no necesitamos 'showDeleteConfirmModal.value = true'
}

//Función para CERRAR/CANCELAR el modal
const cancelDelete = () => {
	deletingArea.value = null;
	deleteError.value = null;
	isSubmitting.value = false;
}
// Función para CONFIRMAR Y EJECUTAR la eliminación
const confirmDeleteArea = async () => {
	if (!deletingArea.value) return;

	deleteError.value = null;
	isSubmitting.value = true; // Reutilizamos este estado para bloquear los botones

	try {
		const response = await authenticatedFetch(`/areas/${deletingArea.value.id}`, {
			method: 'DELETE'
			// No se necesita body ni headers, authenticatedFetch se encarga
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));

			// Un error común al borrar es violar una restricción de clave foránea
			// (ej. el área tiene departamentos asociados). La API debería devolver 409 Conflict.
			if (response.status === 409) {
				throw new Error(errData.message || 'No se puede eliminar: Esta área tiene registros asociados.');
			}
			throw new Error(errData.message || 'No se pudo eliminar el área.');
		}

		// ¡Éxito!
		cancelDelete(); // Cierra el modal y limpia los refs
		await fetchAreas(); // Recarga la lista de áreas
		await fetchAreasList();
	} catch (err) {
		console.error('Error al eliminar área:', err);
		deleteError.value = err.message; // Muestra el error en el banner
	} finally {
		// Solo ponemos isSubmitting en false si aún estamos en el modal
		// (es decir, si hubo un error). Si todo salió bien, cancelDelete() ya lo limpió.
		if (deletingArea.value) {
			isSubmitting.value = false;
		}
	}
}
const fetchDepartments = async () => {
	try {
		const response = await authenticatedFetch('/departamentos')
		if (!response.ok) throw new Error('Error al recargar departamentos')
		departments.value = await response.json()
	} catch (err) {
		console.error(err)
		// Opcional: mostrar un error de recarga
	}
}

//Función para ABRIR el modal de nuevo departamento
const openNewDepartmentModal = () => {
	newDepartmentData.value = {
		name: '',
		responsable: null,
		correo: '',
		id_area: null
	}
	newDepartmentError.value = null
	showNewDepartmentModal.value = true
}

//Función para GUARDAR el nuevo departamento
const saveNewDepartment = async () => {
	newDepartmentError.value = null // Limpia error anterior

	// Validación simple
	if (!newDepartmentData.value.name || !newDepartmentData.value.correo) {
		newDepartmentError.value = 'Nombre, Responsable,Área y Correo son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		// Asumo que tu API espera estos campos
		const payload = {
			dep_nombre: newDepartmentData.value.name,
			dep_resposable: newDepartmentData.value.responsable,
			dep_correo_institucional: newDepartmentData.value.correo,
			id_area: newDepartmentData.value.id_area
		}

		const response = await authenticatedFetch('/departamentos', {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo crear el departamento.');
		}

		// ¡Éxito!
		showNewDepartmentModal.value = false
		await fetchDepartments() // Recarga solo la tabla de departamentos

	} catch (err) {
		console.error('Error al guardar departamento:', err)
		newDepartmentError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}
const openEditDepartmentModal = (department) => {
	// IMPORTANTE: Mapeamos los nombres de la API (ej. dep_nombre)
	// a los nombres que usa nuestro formulario (ej. name).

	editingDepartment.value = {
		id: department.id, // ¡Muy importante guardar el ID!
		name: department.dep_nombre,
		responsable: department.dep_responsable,
		correo: department.dep_correo_institucional,
		id_area: department.id_area
	};

	editDepartmentError.value = null // Limpia errores anteriores
	showEditDepartmentModal.value = true // Muestra el modal
}

/**
 * Guarda los cambios del departamento editado.
 */
const saveEditDepartment = async () => {
	if (!editingDepartment.value) return;

	editDepartmentError.value = null // Limpia error anterior

	// Validación (similar a la de crear)
	if (!editingDepartment.value.name || !editingDepartment.value.correo || !editingDepartment.value.id_area) {
		editDepartmentError.value = 'Nombre, Responsable, Correo y Área son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		// Mapeamos los datos del formulario de vuelta al formato de la API
		const payload = {
			dep_nombre: editingDepartment.value.name,
			dep_resposable: editingDepartment.value.responsable,
			dep_correo_institucional: editingDepartment.value.correo,
			id_area: editingDepartment.value.id_area
		}

		const response = await authenticatedFetch(`/departamentos/${editingDepartment.value.id}`, {
			method: 'PUT', // O 'PATCH' si tu API lo prefiere
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo actualizar el departamento.');
		}

		// ¡Éxito!
		showEditDepartmentModal.value = false
		await fetchDepartments() // Recarga la tabla
		editingDepartment.value = null // Limpia el estado

	} catch (err) {
		console.error('Error al actualizar departamento:', err)
		editDepartmentError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}


const openDeleteDepartmentModal = (department) => {
	deletingDepartment.value = department // Guarda el departamento
	deleteDepartmentError.value = null // Limpia errores anteriores
	showDeleteDepartmentModal.value = true // Muestra el modal
}

/**
 * Cierra el modal de eliminación y limpia el estado.
 */
const cancelDeleteDepartment = () => {
	showDeleteDepartmentModal.value = false
	deletingDepartment.value = null
	deleteDepartmentError.value = null // Limpia el error al cancelar
}

/**
 * Se ejecuta cuando el usuario confirma la eliminación en el modal.
 * Llama a la API para eliminar el registro.
 */
const handleConfirmDelete = async () => {
	if (!deletingDepartment.value) return

	isSubmitting.value = true
	deleteDepartmentError.value = null

	try {
		const departmentId = deletingDepartment.value.id
		const response = await authenticatedFetch(`/departamentos/${departmentId}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo eliminar el departamento.');
		}

		// ¡Éxito!
		showDeleteDepartmentModal.value = false // Cierra el modal

		// Recarga la tabla de departamentos (asumo que tienes esta función)
		await fetchDepartments()
		// O si no la tienes, puedes filtrar el array local:
		// departments.value = departments.value.filter(d => d.id !== departmentId)

		deletingDepartment.value = null // Limpia el estado

	} catch (err) {
		console.error('Error al eliminar departamento:', err)
		deleteDepartmentError.value = err.message // Muestra el error en el modal
	} finally {
		isSubmitting.value = false
	}
}

/**
 * Recarga solo la tabla de edificios (para usar después de crear/editar/eliminar)
 */
const fetchBuildings = async () => {
	fetchBuildingsError.value = null
	try {
		const response = await authenticatedFetch('/edificios');
		if (!response.ok) {
			throw new Error('Error al recargar los edificios');
		}
		buildingsData.value = await response.json();

	} catch (e) {
		console.error('Error al recargar edificios:', e);
		fetchBuildingsError.value = e.message;
	}
}


const openNewBuildingModal = () => {
	newBuildingData.value = {
		nombre: ''
	}
	newBuildingError.value = null
	showNewBuildingModal.value = true
}

/**
 * Guarda el nuevo edificio en la API.
 */
const saveNewBuilding = async () => {
	newBuildingError.value = null

	// Validación simple
	if (!newBuildingData.value.nombre) {
		newBuildingError.value = 'El nombre del edificio es obligatorio.'
		return
	}

	isSubmitting.value = true
	try {

		// Ajusta el 'payload' según lo que espere tu API
		const payload = {
			nombre: newBuildingData.value.nombre
		}

		const response = await authenticatedFetch('/edificios', {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo crear el edificio.');
		}

		// ¡Éxito!

		showNewBuildingModal.value = false
		await fetchBuildings() // Recarga la tabla de edificios
		await fetchFormOptions(); // Recarga los datos de los dropdowns

		// (OPCIONAL) Recarga la lista de edificios de los dropdowns
		// await fetchFormOptions() // (Si tienes una función para esto)

	} catch (err) {
		console.error('Error al guardar edificio:', err)
		newBuildingError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}
const deleteBuildingMessage = computed(() => {
	// Usamos 'optional chaining' (?.) por seguridad
	const buildingName = deletingBuilding.value?.nombre;

	return `¿Estás seguro de que deseas eliminar el edificio:<br><strong class='font-medium text-lg text-gray-900 dark:text-white'>${buildingName}</strong>?
    <br><br>`
})

// --- (Añade estas funciones CRUD para "Edificios") ---

/**
 * Abre el modal de confirmación para eliminar un edificio.
 * Llamada por el botón de basura en la tabla.
 */
const openDeleteBuildingModal = (building) => {
	deletingBuilding.value = building // Guarda el edificio a eliminar
	deleteBuildingError.value = null // Limpia errores anteriores
	showDeleteBuildingModal.value = true // Muestra el modal
}

/**
 * Cierra el modal de eliminación.
 */
const cancelDeleteBuilding = () => {
	showDeleteBuildingModal.value = false
	deletingBuilding.value = null
	deleteBuildingError.value = null
}

/**
 * Se ejecuta al confirmar la eliminación. Llama a la API.
 */
const handleConfirmDeleteBuilding = async () => {
	if (!deletingBuilding.value) return

	isSubmitting.value = true
	deleteBuildingError.value = null

	try {
		const buildingId = deletingBuilding.value.id
		const response = await authenticatedFetch(`/edificios/${buildingId}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo eliminar el edificio.');
		}

		// ¡Éxito!
		showDeleteBuildingModal.value = false
		await fetchBuildings() // Recarga la tabla de edificios
		await fetchFormOptions();
		deletingBuilding.value = null

	} catch (err) {
		console.error('Error al eliminar edificio:', err)
		deleteBuildingError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

/**
 * Abre el modal de edición y carga los datos del edificio.
 * Llamada por el botón de lápiz.
 */
const openEditBuildingModal = (building) => {
	// Mapeamos los datos del edificio a nuestro 'ref' de edición.
	// Esto es una copia segura, no necesitamos structuredClone.
	editingBuilding.value = {
		id: building.id,
		nombre: building.nombre
	};

	editBuildingError.value = null // Limpia errores anteriores
	showEditBuildingModal.value = true // Muestra el modal
}

/**
 * Guarda los cambios del edificio en la API (petición PUT).
 */
const saveEditBuilding = async () => {
	if (!editingBuilding.value) return;

	editBuildingError.value = null // Limpia error anterior

	// Validación
	if (!editingBuilding.value.nombre) {
		editBuildingError.value = 'El nombre del edificio es obligatorio.'
		return
	}

	isSubmitting.value = true
	try {
		// Preparamos el payload (lo que la API espera)
		const payload = {
			nombre: editingBuilding.value.nombre,
			ubicacion: editingBuilding.value.ubicacion
		}

		// Enviamos la petición PUT al endpoint con el ID
		const response = await authenticatedFetch(`/edificios/${editingBuilding.value.id}`, {
			method: 'PUT', // O 'PATCH'
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo actualizar el edificio.');
		}

		// ¡Éxito!
		showEditBuildingModal.value = false
		await fetchBuildings() // Recarga la tabla de edificios
		await fetchFormOptions();
		editingBuilding.value = null // Limpia el estado

	} catch (err) {
		console.error('Error al actualizar edificio:', err)
		editBuildingError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

/**
 * Recarga los datos de los dropdowns (Edificios y Responsables)
 * desde el endpoint '/area-form-options'.
 */
const fetchFormOptions = async () => {
	try {
		const optionsRes = await authenticatedFetch('/area-form-options');
		if (!optionsRes.ok) {
			throw new Error('Error al recargar opciones de formulario');
		}

		const optionsData = await optionsRes.json();
		// Actualizamos los 'ref's que usan los dropdowns
		resguardantes.value = optionsData.responsables || [];
		buildings.value = optionsData.edificios || [];


	} catch (e) {
		console.error('Error al recargar fetchFormOptions:', e);
		// Aquí podrías mostrar un error al usuario
	}
}

const fetchOficinas = async () => {
	fetchOficinasError.value = null
	try {
		const response = await authenticatedFetch('/oficinas');
		if (!response.ok) {
			throw new Error('Error al recargar las oficinas');
		}
		oficinasData.value = await response.json();
	} catch (e) {
		console.error('Error al recargar oficinas:', e);
		fetchOficinasError.value = e.message;
	}
}
const openNewOficinaModal = () => {
	// --- CORREGIDO ---
	newOficinaData.value = {
		nombre: '',
		id_edificio: null
	}
	newOficinaError.value = null
	showNewOficinaModal.value = true
}

/**
 * Guarda la nueva oficina en la API.
 */
const saveNewOficina = async () => {
	newOficinaError.value = null

	// --- CORREGIDO (Validación) ---
	if (!newOficinaData.value.nombre || !newOficinaData.value.id_edificio) {
		newOficinaError.value = 'Nombre y Edificio son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		// --- CORREGIDO (Payload) ---
		// Asumo los nombres de columna de tu ERD
		const payload = {
			nombre: newOficinaData.value.nombre,
			id_edificio: newOficinaData.value.id_edificio
		}

		const response = await authenticatedFetch('/oficinas', {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo crear la oficina.');
		}

		showNewOficinaModal.value = false
		await fetchOficinas() // Recarga la tabla

	} catch (err) {
		console.error('Error al guardar oficina:', err)
		newOficinaError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

/**
 * Helper para obtener el nombre del edificio.
 * Usa la lista 'buildings' que ya cargas para los dropdowns.
 */
const getBuildingName = (buildingId) => {
	if (!buildingId) return 'Sin edificio';
	// 'buildings' es el ref que cargas desde '/area-form-options'
	const building = buildings.value.find(b => b.id === buildingId);
	return building ? building.nombre : `ID (${buildingId}) Desconocido`;
}
const deleteOficinaMessage = computed(() => {
	const oficinaName = deletingOficina.value?.nombre; // Asumo que el campo es 'nombre'

	return `¿Estás seguro de que deseas eliminar la oficina:<br><strong class='font-medium text-lg text-gray-900 dark:text-white'>${oficinaName}</strong>?
    <br><br>`
})
/**
 * Abre el modal de confirmación para eliminar una oficina.
 */
const openDeleteOficinaModal = (oficina) => {
	deletingOficina.value = oficina
	deleteOficinaError.value = null
	showDeleteOficinaModal.value = true
}

/**
 * Cierra el modal de eliminación.
 */
const cancelDeleteOficina = () => {
	showDeleteOficinaModal.value = false
	deletingOficina.value = null
	deleteOficinaError.value = null
}

/**
 * Se ejecuta al confirmar la eliminación. Llama a la API.
 */
const handleConfirmDeleteOficina = async () => {
	if (!deletingOficina.value) return

	isSubmitting.value = true
	deleteOficinaError.value = null

	try {
		const oficinaId = deletingOficina.value.id
		const response = await authenticatedFetch(`/oficinas/${oficinaId}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo eliminar la oficina.');
		}

		// ¡Éxito!
		showDeleteOficinaModal.value = false
		await fetchOficinas() // Recarga la tabla de oficinas
		deletingOficina.value = null

	} catch (err) {
		console.error('Error al eliminar oficina:', err)
		deleteOficinaError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const openEditOficinaModal = (oficina) => {
	// Mapeamos los datos de la oficina a nuestro 'ref' de edición
	editingOficina.value = {
		id: oficina.id,
		nombre: oficina.nombre,
		referencia: oficina.referencia,
		id_edificio: oficina.id_edificio
	};

	editOficinaError.value = null // Limpia errores anteriores
	showEditOficinaModal.value = true // Muestra el modal
}

/**
 * Guarda los cambios de la oficina en la API (petición PUT).
 */
const saveEditOficina = async () => {
	if (!editingOficina.value) return;

	editOficinaError.value = null // Limpia error anterior

	// Validación
	if (!editingOficina.value.nombre || !editingOficina.value.id_edificio) {
		editOficinaError.value = 'Nombre y Edificio son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		// Preparamos el payload (lo que la API espera)
		const payload = {
			nombre: editingOficina.value.nombre,
			referencia: editingOficina.value.referencia,
			id_edificio: editingOficina.value.id_edificio
		}

		// Enviamos la petición PUT al endpoint con el ID
		const response = await authenticatedFetch(`/oficinas/${editingOficina.value.id}`, {
			method: 'PUT', // O 'PATCH'
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'No se pudo actualizar la oficina.');
		}

		// ¡Éxito!
		showEditOficinaModal.value = false
		await fetchOficinas() // Recarga la tabla de oficinas
		editingOficina.value = null // Limpia el estado

	} catch (err) {
		console.error('Error al actualizar oficina:', err)
		editOficinaError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}
</script>