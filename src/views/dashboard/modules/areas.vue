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

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950  p-4 space-y-4">
			<div class="flex flex-col md:flex-row gap-4 items-end">
				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar por nombre o
						código</label>
					<input v-model="searchQuery" type="text" placeholder="Escribe para buscar..."
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<button @click="openNewAreaModal"
					class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
					Nueva Área
				</button>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por
						Responsable</label>
					<select v-model="filterResponsable"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<option value="">Todos los responsables</option>
						<option v-for="responsable in resguardantes" :key="responsable.id" :value="responsable.id">
							{{ responsable.res_nombre }}
						</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por
						Edificio</label>
					<select v-model="filterEdificio"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<option value="">Todos los edificios</option>
						<option v-for="building in buildings" :key="building.id" :value="building.id">
							{{ building.nombre }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<!-- TARJETAS DE ÁREAS -->
		<div v-if="filteredAreas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div v-for="area in filteredAreas" :key="area.id"
				class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 hover:shadow-lg transition-shadow duration-300">
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
						area.responsable.res_nombre ? area.responsable.res_nombre : 'No asignado' }}</p>
					<p class="text-gray-600 dark:text-gray-400">Edificio: {{ area.edificio && area.edificio.nombre ?
						area.edificio.nombre : 'No asignado' }}</p>
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

		<!-- Pagination Controls -->
		<div v-if="filteredAreas.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
			<button
				@click="prevPage"
				:disabled="currentPage === 1"
				class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Atrás
			</button>

			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Página {{ currentPage }} de {{ totalPages }} | Total: {{ totalItems }} resultados
			</span>

			<button
				@click="nextPage"
				:disabled="currentPage === totalPages"
				class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
			>
				Adelante
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>

		<div v-else class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-6 text-center">
			<h3 class="text-lg font-medium text-gray-900 dark:text-white">No existen registros</h3>
			<p class="text-gray-600 dark:text-gray-400" v-if="areas.length === 0">Aún no se ha registrado ninguna área.
				Haz clic en "Nueva Área" para comenzar.</p>
			<p class="text-gray-600 dark:text-gray-400" v-else>No hay áreas que coincidan con tu búsqueda o filtros.</p>
		</div>

		<!-- TABLA DE DEPARTAMENTOS -->
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">Departamentos</h2>
				<button @click="openNewDepartmentModal"
					class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm">
					Nuevo Departamento
				</button>
			</div>

			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar
					departamento</label>
				<input v-model="searchDepartment" type="text" placeholder="Escribe para buscar..."
					class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Código</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Responsable</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Área</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Correo</th>
							<th class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						<tr v-for="dept in departmentPaginatedData" :key="dept.id"
							class="hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								<div class="font-medium text-gray-900 dark:text-white">{{ dept.dep_nombre }}</div>
							</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								{{ dept.dep_codigo || 'N/A' }}
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
						<tr v-if="departmentPaginatedData.length === 0">
							<td colspan="6" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								No existen registros
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination Controls for Departamentos -->
			<div v-if="filteredDepartments.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
				<button
					@click="departmentCurrentPage = departmentCurrentPage > 1 ? departmentCurrentPage - 1 : 1"
					:disabled="departmentCurrentPage === 1"
					class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Atrás
				</button>

				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
					Página {{ departmentCurrentPage }} de {{ departmentTotalPages }} | Total: {{ filteredDepartments.length }} resultados
				</span>

				<button
					@click="departmentCurrentPage = departmentCurrentPage < departmentTotalPages ? departmentCurrentPage + 1 : departmentTotalPages"
					:disabled="departmentCurrentPage === departmentTotalPages"
					class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
				>
					Adelante
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>

		<!-- TABLA DE EDIFICIOS -->
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">Edificios</h2>
				<button @click="openNewBuildingModal"
					class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm">
					Nuevo Edificio
				</button>
			</div>

			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar edificio</label>
				<input v-model="searchBuilding" type="text" placeholder="Escribe para buscar..."
					class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
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
						<tr v-for="building in buildingPaginatedData" :key="building.id"
							class="hover:bg-gray-50 dark:hover:bg-gray-700">
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

						<tr v-if="buildingPaginatedData.length === 0">
							<td colspan="2" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								No existen registros
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination Controls for Edificios -->
			<div v-if="filteredBuildings.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
				<button
					@click="buildingCurrentPage = buildingCurrentPage > 1 ? buildingCurrentPage - 1 : 1"
					:disabled="buildingCurrentPage === 1"
					class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Atrás
				</button>

				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
					Página {{ buildingCurrentPage }} de {{ buildingTotalPages }} | Total: {{ filteredBuildings.length }} resultados
				</span>

				<button
					@click="buildingCurrentPage = buildingCurrentPage < buildingTotalPages ? buildingCurrentPage + 1 : buildingTotalPages"
					:disabled="buildingCurrentPage === buildingTotalPages"
					class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
				>
					Adelante
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>

		<!-- TABLA DE OFICINAS -->
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950  p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">Oficinas</h2>
				<button @click="openNewOficinaModal"
					class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm">
					Nueva Oficina
				</button>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar oficina</label>
				<input v-model="searchOficina" type="text" placeholder="Escribe para buscar..."
					class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-100 dark:bg-gray-700">
						<tr>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Oficina</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Código</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Edificio</th>
							<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Departamento
							</th>
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
						<tr v-else-if="oficinaPaginatedData.length > 0" v-for="oficina in oficinaPaginatedData"
							:key="oficina.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								<div class="font-medium text-gray-900 dark:text-white">
									{{ oficina.nombre }}
								</div>
							</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								{{ oficina.ofi_codigo || 'N/A' }}
							</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								{{ getBuildingName(oficina.id_edificio) }}
							</td>
							<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
								{{ getDepartmentName(oficina.id_departamento) }}
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

						<tr v-else-if="!isLoading && !fetchOficinasError">
							<td colspan="6" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								No existen registros
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination Controls for Oficinas -->
			<div v-if="filteredOficinas.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
				<button
					@click="oficinaCurrentPage = oficinaCurrentPage > 1 ? oficinaCurrentPage - 1 : 1"
					:disabled="oficinaCurrentPage === 1"
					class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Atrás
				</button>

				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
					Página {{ oficinaCurrentPage }} de {{ oficinaTotalPages }} | Total: {{ filteredOficinas.length }} resultados
				</span>

				<button
					@click="oficinaCurrentPage = oficinaCurrentPage < oficinaTotalPages ? oficinaCurrentPage + 1 : oficinaTotalPages"
					:disabled="oficinaCurrentPage === oficinaTotalPages"
					class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
				>
					Adelante
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Modal de nuevo Departamento -->
		<div v-if="showNewDepartmentModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">

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
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código del
							Departamento</label>
						<input v-model="newDepartmentData.codigo" type="text" placeholder="Ej. 001"
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
							��rea a la que pertenece
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

		<!-- Modal de editar Departamento -->
		<div v-if="showEditDepartmentModal && editingDepartment"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

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
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código del
							Departamento</label>
						<input v-model="editingDepartment.codigo" type="text" placeholder="Ej. DEP-SIST"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

					<div class="relative z-10">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área a la que
							pertenece</label>
						<select v-model="editingDepartment.id_area"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar un área</option>
							<option v-if="areasList.length === 0" disabled class="text-gray-400">
								-- No hay ��reas disponibles --
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

		<!-- Modal de nueva Área -->
		<div v-if="showNewAreaModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

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
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área</label>
						<input v-model="newAreaData.area_nombre" type="text" placeholder="Nombre del área"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código del
							Área</label>
						<input v-model="newAreaData.area_codigo" type="text" placeholder="Ej: 001"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable del
							��rea</label>
						<select v-model="newAreaData.id_resguardante_responsable"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar responsable</option>
							<option v-if="resguardantes.length === 0" disabled class="text-gray-400">-- No hay responsables disponibles --</option>
							<option v-else v-for="r in resguardantes" :key="r.id" :value="r.id">
								{{ r.res_nombre }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
						<select v-model="newAreaData.id_edificio" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar edificio</option>
							<option v-if="buildings.length === 0" disabled class="text-gray-400">-- No hay edificios disponibles --</option>
							<option v-else v-for="b in buildings" :key="b.id" :value="b.id">
								{{ b.nombre }}
							</option>
						</select>
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewAreaModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewArea" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Creando...' : 'Crear Área' }}
					</button>
				</div>
			</div>
		</div>

		<!-- Modal de editar área -->
		<div v-if="showEditAreaModal && editingArea" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Área</h2>
					<button @click="showEditAreaModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="editAreaError" class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center" role="alert">
					<span class="font-medium text-sm">{{ editAreaError }}</span>
					<button @click="editAreaError = null" class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Área</label>
						<input v-model="editingArea.area_nombre" type="text" placeholder="Nombre del área" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código del Área</label>
						<input v-model="editingArea.area_codigo" type="text" placeholder="Código (ej. LAB-SIS-001)" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsable del Área</label>
						<select v-model="editingArea.id_resguardante_responsable" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null">Seleccionar responsable</option>
							<option v-if="resguardantes.length === 0" disabled class="text-gray-400">-- No hay responsables disponibles --</option>
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

		<!-- Modal de editar área -->
		<div v-if="showEditAreaModal && editingArea"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

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
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área</label>
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
							Área</label>
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
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
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

		<!-- Modal de nuevo Edificio -->
		<div v-if="showNewBuildingModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

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
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
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

		<!-- Modal de editar Edificio -->
		<div v-if="showEditBuildingModal && editingBuilding"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

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
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edificio</label>
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

		<!-- Modal de nueva Oficina -->
		<div v-if="showNewOficinaModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

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
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Oficina</label>
						<input v-model="newOficinaData.nombre" type="text" placeholder="Nombre de la oficina"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código de
							Oficina</label>
						<input v-model="newOficinaData.codigo" type="text" placeholder="Ej: 001"
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
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<select v-model="newOficinaData.id_departamento"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null" disabled>Seleccionar un departamento</option>
							<option v-if="!departments.data || departments.data.length === 0" disabled>-- Cargando... --
							</option>
							<option v-else v-for="dept in departments.data" :key="dept.id" :value="dept.id">
								{{ dept.dep_nombre }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Referencia
							(Opcional)</label>
						<input v-model="newOficinaData.referencia" type="text"
							placeholder="Ej. Planta baja, junto a recepción"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
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

			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

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
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código de
							Oficina</label>
						<input v-model="editingOficina.codigo" type="text" placeholder="Ej: 001"
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
import { ref, onMounted, computed, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js'
import ConfirmModal from '@/components/ConfirmModal.vue'

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

const getRandomColorPair = () => {
	return colorClasses[Math.floor(Math.random() * colorClasses.length)]
}

const assignRandomColors = (areaList) => {
	return areaList.map(area => {
		const colors = getRandomColorPair()
		return {
			...area,
			iconBg: colors.bg,
			iconColor: colors.text
		}
	})
}

const areas = ref({ data: [] })
const isLoading = ref(true)
const error = ref(null)
const isSubmitting = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 15
const totalItems = ref(0)
const filterResponsable = ref('')
const filterEdificio = ref('')
const searchDepartment = ref('')
const searchBuilding = ref('')
const searchOficina = ref('')

const departmentCurrentPage = ref(1)
const departmentItemsPerPage = 15
const buildingCurrentPage = ref(1)
const buildingItemsPerPage = 15
const oficinaCurrentPage = ref(1)
const oficinaItemsPerPage = 15

const showNewAreaModal = ref(false)
const newAreaData = ref({
	area_nombre: '',
	area_codigo: '',
	id_resguardante_responsable: null,
	id_edificio: null,
})
const newAreaError = ref(null)
const editAreaError = ref(null)
const showEditAreaModal = ref(false)
const editingArea = ref(null)

const deletingArea = ref(null)
const deleteError = ref(null)

const resguardantes = ref([])
const buildings = ref([])
const areasList = ref([])

const departments = ref([])
const jefesDepartamento = ref([])
const showNewDepartmentModal = ref(false)
const newDepartmentData = ref({
	name: '',
	responsable: null,
	correo: '',
	id_area: null,
	codigo: ''
})
const newDepartmentError = ref(null)
const showDeleteDepartmentModal = ref(false)
const deletingDepartment = ref(null)
const deleteDepartmentError = ref(null)

const showEditDepartmentModal = ref(false)
const editingDepartment = ref(null)
const editDepartmentError = ref(null)

const buildingsData = ref({ data: [] })
const fetchBuildingsError = ref(null)

const showNewBuildingModal = ref(false)
const newBuildingData = ref({
	nombre: '',
})
const newBuildingError = ref(null)
const showDeleteBuildingModal = ref(false)
const deletingBuilding = ref(null)
const deleteBuildingError = ref(null)
const showEditBuildingModal = ref(false)
const editingBuilding = ref(null)
const editBuildingError = ref(null)

const oficinasData = ref({ data: [] })
const fetchOficinasError = ref(null)

const newOficinaData = ref({
	nombre: '',
	codigo: '',
	id_edificio: null,
	id_departamento: null
})
const newOficinaError = ref(null)
const showDeleteOficinaModal = ref(false)

const deletingOficina = ref(null)
const deleteOficinaError = ref(null)
const showNewOficinaModal = ref(false)

const showEditOficinaModal = ref(false)
const editingOficina = ref(null)
const editOficinaError = ref(null)

const totalPages = computed(() => {
	return Math.ceil(totalItems.value / itemsPerPage) || 1
})

const departmentTotalPages = computed(() => {
	return Math.ceil(filteredDepartments.value.length / departmentItemsPerPage) || 1
})

const departmentPaginatedData = computed(() => {
	const start = (departmentCurrentPage.value - 1) * departmentItemsPerPage
	const end = start + departmentItemsPerPage
	return filteredDepartments.value.slice(start, end)
})

const buildingTotalPages = computed(() => {
	return Math.ceil(filteredBuildings.value.length / buildingItemsPerPage) || 1
})

const buildingPaginatedData = computed(() => {
	const start = (buildingCurrentPage.value - 1) * buildingItemsPerPage
	const end = start + buildingItemsPerPage
	return filteredBuildings.value.slice(start, end)
})

const oficinaTotalPages = computed(() => {
	return Math.ceil(filteredOficinas.value.length / oficinaItemsPerPage) || 1
})

const oficinaPaginatedData = computed(() => {
	const start = (oficinaCurrentPage.value - 1) * oficinaItemsPerPage
	const end = start + oficinaItemsPerPage
	return filteredOficinas.value.slice(start, end)
})

const filteredAreas = computed(() => {
	const baseAreas = areas.value.data || []
	return baseAreas.filter(area => {
		const matchesResponsable = !filterResponsable.value ||
			(area.responsable && area.responsable.id === parseInt(filterResponsable.value))

		const matchesEdificio = !filterEdificio.value ||
			(area.edificio && area.edificio.id === parseInt(filterEdificio.value))

		return matchesResponsable && matchesEdificio
	})
})

const filteredDepartments = computed(() => {
	if (!departments.value.data || !Array.isArray(departments.value.data)) {
		return []
	}
	const deptArray = Array.isArray(departments.value.data) ? departments.value.data : departments.value
	return deptArray.filter(dept => {
		return !searchDepartment.value ||
			dept.dep_nombre.toLowerCase().includes(searchDepartment.value.toLowerCase()) ||
			(dept.dep_resposable && dept.dep_resposable.toLowerCase().includes(searchDepartment.value.toLowerCase())) ||
			(dept.dep_correo_institucional && dept.dep_correo_institucional.toLowerCase().includes(searchDepartment.value.toLowerCase()))
	})
})

const filteredBuildings = computed(() => {
	if (!buildingsData.value || !buildingsData.value.data) {
		return []
	}
	return buildingsData.value.data.filter(building => {
		return !searchBuilding.value ||
			building.nombre.toLowerCase().includes(searchBuilding.value.toLowerCase())
	})
})

const filteredOficinas = computed(() => {
	if (!oficinasData.value || !oficinasData.value.data) {
		return []
	}
	return oficinasData.value.data.filter(oficina => {
		return !searchOficina.value ||
			oficina.nombre.toLowerCase().includes(searchOficina.value.toLowerCase()) ||
			(oficina.referencia && oficina.referencia.toLowerCase().includes(searchOficina.value.toLowerCase()))
	})
})

const fetchAllData = async () => {
	isLoading.value = true
	error.value = null
	fetchBuildingsError.value = null
	try {
		const [areasRes, optionsRes, departmentsRes, areasListRes, buildingsRes, oficinasRes] = await Promise.all([
			authenticatedFetch('/areas?page=1'),
			authenticatedFetch('/area-form-options'),
			authenticatedFetch('/departamentos'),
			authenticatedFetch('/formularios/departamentos'),
			authenticatedFetch('/edificios'),
			authenticatedFetch('/oficinas')
		])

		if (!areasRes.ok) throw new Error('Error al cargar áreas')
		if (!optionsRes.ok) throw new Error('Error al cargar opciones del formulario')
		if (!departmentsRes.ok) throw new Error('Error al cargar departamentos')
		if (!areasListRes.ok) throw new Error('Error al cargar lista de áreas')
		if (!buildingsRes.ok) throw new Error('Error al cargar edificios')
		if (!oficinasRes.ok) throw new Error('Error al cargar oficinas')

		const fetchedAreas = await areasRes.json()
		areas.value = fetchedAreas
		totalItems.value = fetchedAreas.total || 0
		currentPage.value = 1
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

const fetchAreas = async (page = 1) => {
	isLoading.value = true
	try {
		const params = new URLSearchParams()
		params.append('page', page)

		if (searchQuery.value.trim()) {
			params.append('search', searchQuery.value.toUpperCase())
		}

		const response = await authenticatedFetch(`/areas?${params.toString()}`)
		if (!response.ok) throw new Error('Error al recargar áreas')
		const fetchedAreas = await response.json()
		areas.value = fetchedAreas
		totalItems.value = fetchedAreas.total || 0
		currentPage.value = page
	} catch (err) {
		console.error(err)
		error.value = err
		areas.value = { data: [] }
	} finally {
		isLoading.value = false
	}
}

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		fetchAreas(currentPage.value + 1)
	}
}

const prevPage = () => {
	if (currentPage.value > 1) {
		fetchAreas(currentPage.value - 1)
	}
}

watch(searchQuery, () => {
	currentPage.value = 1
	fetchAreas(1)
})

watch(searchDepartment, () => {
	departmentCurrentPage.value = 1
})

watch(searchBuilding, () => {
	buildingCurrentPage.value = 1
})

watch(searchOficina, () => {
	oficinaCurrentPage.value = 1
})

const fetchAreasList = async () => {
	try {
		const response = await authenticatedFetch('/formularios/departamentos')
		if (!response.ok) throw new Error('Error al recargar lista de áreas')
		areasList.value = await response.json()
	} catch (err) {
		console.error(err)
	}
}

onMounted(fetchAllData)

const getAreaName = (areaId) => {
	if (!areaId) {
		return 'Sin área asignada'
	}

	if (!areasList.value || !Array.isArray(areasList.value.areas)) {
		return '...'
	}

	const area = areasList.value.areas.find(a => a.id === areaId)
	return area ? area.area_nombre : `ID (${areaId}) Desconocido`
}

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
		}
		const response = await authenticatedFetch('/areas', {
			method: 'POST',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || `Error ${response.status}: No se pudo crear el área.`)
		}

		showNewAreaModal.value = false
		await fetchAreas(1)
		await fetchAreasList()

	} catch (err) {
		console.error('Error al guardar área:', err)
		newAreaError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const editArea = (area) => {
	editingArea.value = {
		id: area.id,
		area_nombre: area.area_nombre,
		area_codigo: area.area_codigo,
		id_resguardante_responsable: area.responsable?.id || null,
		id_edificio: area.edificio?.id || null
	}

	editAreaError.value = null
	showEditAreaModal.value = true
}

const saveEditArea = async () => {
	if (!editingArea.value) return

	editAreaError.value = null

	if (!editingArea.value.area_nombre || !editingArea.value.area_codigo) {
		editAreaError.value = 'El Nombre y el Código son obligatorios.'
		return
	}

	isSubmitting.value = true

	try {
		const payload = {
			area_nombre: editingArea.value.area_nombre,
			area_codigo: editingArea.value.area_codigo,
			id_resguardante_responsable: editingArea.value.id_resguardante_responsable,
			id_edificio: editingArea.value.id_edificio,
		}

		const response = await authenticatedFetch(`/areas/${editingArea.value.id}`, {
			method: 'PUT',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || `Error ${response.status}: No se pudo actualizar el área.`)
		}

		showEditAreaModal.value = false
		await fetchAreas(1)
		await fetchAreasList()
		editingArea.value = null

	} catch (err) {
		console.error('Error al actualizar área:', err)
		editAreaError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const openDeleteConfirm = (area) => {
	deletingArea.value = area
	deleteError.value = null
}

const cancelDelete = () => {
	deletingArea.value = null
	deleteError.value = null
}

const confirmDeleteArea = async () => {
	isSubmitting.value = true;
	try {
		const response = await authenticatedFetch(`/areas/${deletingArea.value.id}`, {
			method: 'DELETE'
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))

			if (response.status === 409) {
				throw new Error(errData.message || 'No se puede eliminar: Esta área tiene registros asociados.')
			}
			throw new Error(errData.message || 'No se pudo eliminar el área.')
		}

		cancelDelete()
		await fetchAreas(1)
		await fetchAreasList()
	} catch (err) {
		console.error('Error al eliminar área:', err)
		deleteError.value = err.message
	} finally {
		isSubmitting.value = false

	}
}

const fetchDepartments = async () => {
	try {
		const response = await authenticatedFetch('/departamentos')
		if (!response.ok) throw new Error('Error al recargar departamentos')
		departments.value = await response.json()
	} catch (err) {
		console.error(err)
	}
}

const openNewDepartmentModal = () => {
	newDepartmentData.value = {
		name: '',
		responsable: null,
		correo: '',
		id_area: null,
		codigo: ''
	}
	newDepartmentError.value = null
	showNewDepartmentModal.value = true
}

const saveNewDepartment = async () => {
	newDepartmentError.value = null

	if (!newDepartmentData.value.name || !newDepartmentData.value.correo) {
		newDepartmentError.value = 'Nombre, Responsable, Área y Correo son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			dep_nombre: newDepartmentData.value.name,
			dep_codigo: newDepartmentData.value.codigo,
			dep_resposable: newDepartmentData.value.responsable,
			dep_correo_institucional: newDepartmentData.value.correo,
			id_area: newDepartmentData.value.id_area
		}

		const response = await authenticatedFetch('/departamentos', {
			method: 'POST',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo crear el departamento.')
		}

		showNewDepartmentModal.value = false
		await fetchDepartments()

	} catch (err) {
		console.error('Error al guardar departamento:', err)
		newDepartmentError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const openEditDepartmentModal = (department) => {
	editingDepartment.value = {
		id: department.id,
		name: department.dep_nombre,
		codigo: department.dep_codigo,
		responsable: department.dep_responsable,
		correo: department.dep_correo_institucional,
		id_area: department.id_area
	}

	editDepartmentError.value = null
	showEditDepartmentModal.value = true
}

const saveEditDepartment = async () => {
	if (!editingDepartment.value) return

	editDepartmentError.value = null

	if (!editingDepartment.value.name || !editingDepartment.value.correo || !editingDepartment.value.id_area) {
		editDepartmentError.value = 'Nombre, Responsable, Correo y Área son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			dep_nombre: editingDepartment.value.name,
			dep_codigo: editingDepartment.value.codigo,
			dep_resposable: editingDepartment.value.responsable,
			dep_correo_institucional: editingDepartment.value.correo,
			id_area: editingDepartment.value.id_area
		}

		const response = await authenticatedFetch(`/departamentos/${editingDepartment.value.id}`, {
			method: 'PUT',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo actualizar el departamento.')
		}

		showEditDepartmentModal.value = false
		await fetchDepartments()
		editingDepartment.value = null

	} catch (err) {
		console.error('Error al actualizar departamento:', err)
		editDepartmentError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const openDeleteDepartmentModal = (department) => {
	deletingDepartment.value = department
	deleteDepartmentError.value = null
	showDeleteDepartmentModal.value = true
}

const cancelDeleteDepartment = () => {
	showDeleteDepartmentModal.value = false
	deletingDepartment.value = null
	deleteDepartmentError.value = null
}

const handleConfirmDelete = async () => {
	if (!deletingDepartment.value) return

	isSubmitting.value = true
	deleteDepartmentError.value = null

	try {
		const departmentId = deletingDepartment.value.id
		const response = await authenticatedFetch(`/departamentos/${departmentId}`, {
			method: 'DELETE'
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo eliminar el departamento.')
		}

		showDeleteDepartmentModal.value = false

		await fetchDepartments()

		deletingDepartment.value = null

	} catch (err) {
		console.error('Error al eliminar departamento:', err)
		deleteDepartmentError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const fetchBuildings = async () => {
	fetchBuildingsError.value = null
	try {
		const response = await authenticatedFetch('/edificios')
		if (!response.ok) {
			throw new Error('Error al recargar los edificios')
		}
		buildingsData.value = await response.json()

	} catch (e) {
		console.error('Error al recargar edificios:', e)
		fetchBuildingsError.value = e.message
	}
}

const openNewBuildingModal = () => {
	newBuildingData.value = {
		nombre: ''
	}
	newBuildingError.value = null
	showNewBuildingModal.value = true
}

const saveNewBuilding = async () => {
	newBuildingError.value = null

	if (!newBuildingData.value.nombre) {
		newBuildingError.value = 'El nombre del edificio es obligatorio.'
		return
	}

	isSubmitting.value = true
	try {

		const payload = {
			nombre: newBuildingData.value.nombre
		}

		const response = await authenticatedFetch('/edificios', {
			method: 'POST',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo crear el edificio.')
		}

		showNewBuildingModal.value = false
		await fetchBuildings()
		await fetchFormOptions()

	} catch (err) {
		console.error('Error al guardar edificio:', err)
		newBuildingError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const deleteBuildingMessage = computed(() => {
	const buildingName = deletingBuilding.value?.nombre

	return `¿Estás seguro de que deseas eliminar el edificio:<br><strong class='font-medium text-lg text-gray-900 dark:text-white'>${buildingName}</strong>?
    <br><br>`
})

const openDeleteBuildingModal = (building) => {
	deletingBuilding.value = building
	deleteBuildingError.value = null
	showDeleteBuildingModal.value = true
}

const cancelDeleteBuilding = () => {
	showDeleteBuildingModal.value = false
	deletingBuilding.value = null
	deleteBuildingError.value = null
}

const handleConfirmDeleteBuilding = async () => {
	if (!deletingBuilding.value) return

	isSubmitting.value = true
	deleteBuildingError.value = null

	try {
		const buildingId = deletingBuilding.value.id
		const response = await authenticatedFetch(`/edificios/${buildingId}`, {
			method: 'DELETE'
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo eliminar el edificio.')
		}

		showDeleteBuildingModal.value = false
		await fetchBuildings()
		await fetchFormOptions()
		deletingBuilding.value = null

	} catch (err) {
		console.error('Error al eliminar edificio:', err)
		deleteBuildingError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const openEditBuildingModal = (building) => {
	editingBuilding.value = {
		id: building.id,
		nombre: building.nombre
	}

	editBuildingError.value = null
	showEditBuildingModal.value = true
}

const saveEditBuilding = async () => {
	if (!editingBuilding.value) return

	editBuildingError.value = null

	if (!editingBuilding.value.nombre) {
		editBuildingError.value = 'El nombre del edificio es obligatorio.'
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			nombre: editingBuilding.value.nombre,
			ubicacion: editingBuilding.value.ubicacion
		}

		const response = await authenticatedFetch(`/edificios/${editingBuilding.value.id}`, {
			method: 'PUT',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo actualizar el edificio.')
		}

		showEditBuildingModal.value = false
		await fetchBuildings()
		await fetchFormOptions()
		editingBuilding.value = null

	} catch (err) {
		console.error('Error al actualizar edificio:', err)
		editBuildingError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const fetchFormOptions = async () => {
	try {
		const optionsRes = await authenticatedFetch('/area-form-options')
		if (!optionsRes.ok) {
			throw new Error('Error al recargar opciones de formulario')
		}

		const optionsData = await optionsRes.json()
		resguardantes.value = optionsData.responsables || []
		buildings.value = optionsData.edificios || []


	} catch (e) {
		console.error('Error al recargar fetchFormOptions:', e)
	}
}

const fetchOficinas = async () => {
	fetchOficinasError.value = null
	try {
		const response = await authenticatedFetch('/oficinas')
		if (!response.ok) {
			throw new Error('Error al recargar las oficinas')
		}
		oficinasData.value = await response.json()
	} catch (e) {
		console.error('Error al recargar oficinas:', e)
		fetchOficinasError.value = e.message
	}
}

const openNewOficinaModal = () => {
	newOficinaData.value = {
		nombre: '',
		codigo: '',
		referencia:'',
		id_edificio: null,
		id_departamento: null
	}
	newOficinaError.value = null
	showNewOficinaModal.value = true
}

const saveNewOficina = async () => {
	newOficinaError.value = null

	if (!newOficinaData.value.nombre || !newOficinaData.value.codigo || !newOficinaData.value.id_edificio || !newOficinaData.value.id_departamento) {
		newOficinaError.value = 'Nombre, Código, Edificio y Departamento son obligatorios.' // <-- Mensaje actualizado
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			nombre: newOficinaData.value.nombre,
			referencia: newOficinaData.value.referencia,
			ofi_codigo: newOficinaData.value.codigo,
			id_edificio: newOficinaData.value.id_edificio,
			id_departamento: newOficinaData.value.id_departamento
		}
		const response = await authenticatedFetch('/oficinas', {
			method: 'POST',
			body: JSON.stringify(payload)
		})
		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo crear la oficina.')
		}
		showNewOficinaModal.value = false
		await fetchOficinas()
	} catch (err) {
		console.error('Error al guardar oficina:', err)
		newOficinaError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const getBuildingName = (buildingId) => {
	if (!buildingId) return 'Sin edificio'
	const building = buildings.value.find(b => b.id === buildingId)
	return building ? building.nombre : `ID (${buildingId}) Desconocido`
}

const deleteOficinaMessage = computed(() => {
	const oficinaName = deletingOficina.value?.nombre

	return `¿Estás seguro de que deseas eliminar la oficina:<br><strong class='font-medium text-lg text-gray-900 dark:text-white'>${oficinaName}</strong>?
    <br><br>`
})

const openDeleteOficinaModal = (oficina) => {
	deletingOficina.value = oficina
	deleteOficinaError.value = null
	showDeleteOficinaModal.value = true
}

const cancelDeleteOficina = () => {
	showDeleteOficinaModal.value = false
	deletingOficina.value = null
	deleteOficinaError.value = null
}

const handleConfirmDeleteOficina = async () => {
	if (!deletingOficina.value) return

	isSubmitting.value = true
	deleteOficinaError.value = null

	try {
		const oficinaId = deletingOficina.value.id
		const response = await authenticatedFetch(`/oficinas/${oficinaId}`, {
			method: 'DELETE'
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo eliminar la oficina ya que tiene bienes asignados.')
		}

		showDeleteOficinaModal.value = false
		await fetchOficinas()
		deletingOficina.value = null

	} catch (err) {
		console.error('Error al eliminar oficina:', err)
		deleteOficinaError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const openEditOficinaModal = (oficina) => {
	editingOficina.value = {
		id: oficina.id,
		nombre: oficina.nombre,
		codigo: oficina.ofi_codigo,
		referencia: oficina.referencia,
		id_edificio: oficina.id_edificio,
		id_departamento: oficina.id_departamento
	}

	editOficinaError.value = null
	showEditOficinaModal.value = true
}

const saveEditOficina = async () => {
	if (!editingOficina.value) return

	editOficinaError.value = null

	if (!editingOficina.value.nombre || !editingOficina.value.codigo || !editingOficina.value.id_edificio || !editingOficina.value.id_departamento) {
		editOficinaError.value = 'Nombre, Código, Edificio y Departamento son obligatorios.' // <-- Mensaje actualizado
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			nombre: editingOficina.value.nombre,
			ofi_codigo: editingOficina.value.codigo,
			referencia: editingOficina.value.referencia,
			id_edificio: editingOficina.value.id_edificio,
			id_departamento: editingOficina.value.id_departamento
		}

		const response = await authenticatedFetch(`/oficinas/${editingOficina.value.id}`, {
			method: 'PUT',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			throw new Error(errData.message || 'No se pudo actualizar la oficina.')
		}

		showEditOficinaModal.value = false
		await fetchOficinas()
		editingOficina.value = null

	} catch (err) {
		console.error('Error al actualizar oficina:', err)
		editOficinaError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}
const getDepartmentName = (deptId) => {
	if (!deptId) return 'N/A';

	// Asumiendo que 'departments.value' es paginado ({ data: [...] })
	const deptList = Array.isArray(departments.value.data) ? departments.value.data : [];
	const dept = deptList.find(d => d.id === deptId);

	return dept ? dept.dep_nombre : 'ID Desconocido';
};
</script>
