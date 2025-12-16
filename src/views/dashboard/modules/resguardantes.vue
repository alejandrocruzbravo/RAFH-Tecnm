<template>
	<div v-if="isLoading" class="flex items-center justify-center h-64">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
		<p class="ml-4 text-gray-600 dark:text-gray-400">Cargando resguardantes...</p>
	</div>
	<div v-else-if="error" class="p-6 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200">
		<h3 class="font-bold">Error al cargar los resguardantes</h3>
		<p>{{ error.message || 'No se pudo conectar con la API.' }}</p>
		<button @click="fetchResguardantesData" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
			Reintentar
		</button>
	</div>

	<div v-else class="space-y-6">
		<div class="flex justify-between items-center">
			<label
				class="text-2xl font-bold text-gray-900 dark:text-white font-audiowide tracking-wide">Resguardantes</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de
				Chetumal</label>
		</div>

		<div
			class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 space-y-4 border border-gray-100 dark:border-gray-800">
			<div class="flex flex-col md:flex-row gap-4 items-end">
				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar
						resguardante</label>
					<input v-model="searchTerm" type="text" placeholder="Escribe para buscar..."
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<button @click="openNewResguardanteModal"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
					Nuevo Resguardante
				</button>
			</div>
		</div>

		<div
			class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-x-auto relative border border-gray-100 dark:border-gray-800">
			<div v-if="isLoadingResguardantes"
				class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg transition-all duration-300">
				<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-600"></div>
				<p class="ml-4 mt-2 text-gray-600 dark:text-gray-400 font-medium">Actualizando resultados...</p>
			</div>
			<div v-if="filteredResguardantes.length === 0" class="flex items-center justify-center h-64">
				<p class="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">No existen registros</p>
			</div>
			<table v-else class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">RFC</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Apellidos</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Puesto</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Departamento</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="resguardante in filteredResguardantes" :key="resguardante.id"
						class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.res_rfc || 'N/A' }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.res_nombre }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.res_apellidos }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.res_puesto || 'N/A' }}
						</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
							{{ getDepartmentName(resguardante.res_departamento) }}</td>
						<td class="px-4 py-3 flex gap-2">
							<button v-if="!resguardante.usuario_id_rol" @click="openCreateUserModal(resguardante)"
								title="Crear Usuario"
								class="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors">
								<svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
									viewBox="0 0 24 24">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
										stroke-width="2"
										d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
								</svg>

							</button>
							<button @click="viewResguardanteDetails(resguardante)"
								class="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
								title="Ver detalles">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
									</path>
								</svg>
							</button>
							<button @click="openEditResguardanteModal(resguardante)" title="Editar"
								class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
									</path>
								</svg>
							</button>
							<button @click="openDeleteResguardanteModal(resguardante)" title="Eliminar"
								class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
									</path>
								</svg>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Pagination Controls -->
		<div v-if="filteredResguardantes.length > 0"
			class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
			<button @click="prevPage" :disabled="currentPage === 1"
				class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Atrás
			</button>

			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Página {{ currentPage }} de {{ totalPages }} | Total: {{ totalItems }} resultados
			</span>

			<button @click="nextPage" :disabled="currentPage === totalPages"
				class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center gap-2">
				Adelante
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>
	<!-- New Resguardante Modal -->
	<div v-if="showNewResguardanteModal"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
			<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
				<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Resguardante</h2>
				<button @click="showNewResguardanteModal = false"
					class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
			</div>

			<div v-if="newResguardanteError"
				class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
				role="alert">
				<span class="font-medium text-sm">{{ newResguardanteError }}</span>
				<button @click="newResguardanteError = null"
					class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
			</div>

			<div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre(s)</label>
						<input v-model="newResguardanteData.res_nombre" type="text" placeholder="Nombre"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
						<input v-model="newResguardanteData.res_apellidos" type="text" placeholder="Apellidos"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RFC</label>
					<input v-model="newResguardanteData.res_rfc" type="text" placeholder="RFC (Opcional)"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CURP</label>
					<input v-model="newResguardanteData.res_curp" type="text" placeholder="CURP (Opcional)"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo</label>
					<input v-model="newResguardanteData.res_correo" type="email" placeholder="Correo (Opcional)"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puesto</label>
						<input v-model="newResguardanteData.res_puesto" type="text" placeholder="Ej. Encargado de Lab."
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
						<input v-model="newResguardanteData.res_telefono" type="tel" placeholder="Ej. 9831234567"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
					<select v-model="newResguardanteData.res_departamento"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<option :value="null" disabled>Seleccionar Departamento</option>
						<option v-if="!departments || departments.length === 0" disabled>-- Cargando... --
						</option>
						<option v-else v-for="dept in departments" :key="dept.id" :value="dept.id">
							{{ dept.dep_nombre }}
						</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Oficina</label>
					<select v-model="newResguardanteData.id_oficina" :disabled="!newResguardanteData.res_departamento"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed">
						<option :value="null" disabled>
							{{ newResguardanteData.res_departamento ? 'Selecciona una Oficina' : 'Selecciona un departamento primero' }}
						</option>
						<option v-for="oficina in newModalFilteredOficinas" :key="oficina.id" :value="oficina.id">
							{{ oficina.nombre }}
						</option>
						<option v-if="newResguardanteData.res_departamento && newModalFilteredOficinas.length === 0"
							disabled>
							-- No hay oficinas en este departamento --
						</option>
					</select>
				</div>
			</div>
			<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
				<button @click="showNewResguardanteModal = false" :disabled="isSubmitting"
					class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">Cancelar</button>
				<button @click="saveNewResguardante" :disabled="isSubmitting"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
					{{ isSubmitting ? 'Guardando...' : 'Guardar Resguardante' }}
				</button>
			</div>
		</div>
	</div>
	<!-- Edit Resguardante Modal -->
	<div v-if="showEditResguardanteModal && editingResguardante.id"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
			<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
				<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Resguardante</h2>
				<button @click="showEditResguardanteModal = false"
					class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
			</div>
			<div v-if="editResguardanteError"
				class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
				role="alert">
				<span class="font-medium text-sm">{{ editResguardanteError }}</span>
				<button @click="editResguardanteError = null"
					class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
			</div>
			<div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre(s)</label>
						<input v-model="editingResguardante.res_nombre" type="text"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
						<input v-model="editingResguardante.res_apellidos" type="text"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RFC</label>
					<input v-model="editingResguardante.res_rfc" type="text"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CURP</label>
					<input v-model="editingResguardante.res_curp" type="text"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo
						Electrónico</label>
					<input v-model="editingResguardante.res_correo" type="email"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puesto</label>
						<input v-model="editingResguardante.res_puesto" type="text"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
						<input v-model="editingResguardante.res_telefono" type="tel"
							class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
					<select v-model="editingResguardante.res_departamento"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<option :value="null" disabled>Seleccionar Departamento</option>
						<option v-if="!departments || departments.length === 0" disabled>-- Cargando... --
						</option>
						<option v-else v-for="dept in departments" :key="dept.id" :value="dept.id">
							{{ dept.dep_nombre }}
						</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Oficina</label>
					<select v-model="editingResguardante.id_oficina" :disabled="!editingResguardante.res_departamento"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed">
						<option :value="null" disabled>{{ editingResguardante.res_departamento ? 'Selecciona una oficina' : 'Selecciona un departamento primero' }}
						</option>
						<option v-for="oficina in editModalFilteredOficinas" :key="oficina.id" :value="oficina.id">
							{{ oficina.nombre }}
						</option>
						<option v-if="editingResguardante.res_departamento && editModalFilteredOficinas.length === 0"
							disabled>
							-- No hay oficinas en este depto. --
						</option>
					</select>
				</div>
				<div v-if="editingResguardante.usuario_id_rol">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rol de
						Usuario</label>
					<select v-model="editingResguardante.usuario_id_rol"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<option :value="null" disabled>Seleccionar un Rol</option>
						<option v-if="!rolesList || rolesList.length === 0" disabled>-- Cargando roles... --
						</option>
						<option v-else v-for="rol in rolesList" :key="rol.id" :value="rol.id">
							{{ rol.rol_nombre }}
						</option>
					</select>
				</div>
			</div>
			<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
				<button @click="showEditResguardanteModal = false" :disabled="isSubmitting"
					class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">Cancelar</button>
				<button @click="saveEditResguardante" :disabled="isSubmitting"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
					{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
				</button>
			</div>
		</div>
	</div>
	<!-- Resguardante Details Modal -->
	<div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
			<div
				class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6 sticky top-0 bg-white dark:bg-dark-bg z-10">
				<h2 class="text-lg font-bold text-gray-900 dark:text-white pr-8">
					Detalles de Resguardante - {{ selectedResguardante?.res_nombre }}
					{{ selectedResguardante?.res_apellidos }}
				</h2>
				<button @click="showDetailsModal = false"
					class="text-gray-400 hover:text-gray-600 text-2xl flex-shrink-0 focus:outline-none">
					&times;
				</button>
			</div>

			<div class="p-6 space-y-6">
				<!-- Información del Resguardante Section -->
				<div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del
						Resguardante</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre Completo</p>
							<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.res_nombre }}
								{{ selectedResguardante?.res_apellidos }}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">RFC</p>
							<p class="text-gray-900 dark:text-white font-semibold">{{
								selectedResguardante?.res_rfc || 'N/A' }}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Correo Electrónico</p>
							<p class="text-gray-900 dark:text-white font-semibold">{{
								selectedResguardante?.res_correo }}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">CURP</p>
							<p class="text-gray-900 dark:text-white font-semibold">{{
								selectedResguardante?.res_curp || 'N/A' }}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono</p>
							<p class="text-gray-900 dark:text-white font-semibold">{{
								selectedResguardante?.res_telefono || 'N/A' }}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Puesto</p>
							<p class="text-gray-900 dark:text-white font-semibold">{{
								selectedResguardante?.res_puesto || 'N/A' }}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Departamento</p>
							<p class="text-gray-900 dark:text-white font-semibold">{{
								getDepartmentName(selectedResguardante?.res_departamento) }}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Oficina</p>
							<p class="text-gray-900 dark:text-white font-semibold">{{
								selectedResguardante?.oficina.nombre }}</p>
						</div>
					</div>
					<div class="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">

						<div
							class="flex flex-col bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-lg">
							<div
								class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
								<h3 class="font-semibold text-gray-800 dark:text-white">Historial de Movimientos</h3>
							</div>
							<div
								class="flex-1 flex items-center justify-center p-8 text-gray-400 dark:text-gray-500 italic">
								Próximamente: Tabla de historial...
							</div>
						</div>

						<div
							class="flex flex-col bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-lg h-[500px] overflow-hidden min-w-0">

							<div
								class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center gap-2 flex-shrink-0">

								<div class="min-w-0 flex-1">
									<h3 class="font-semibold text-gray-800 dark:text-white truncate">
										Bienes Asignados
										<span class="text-xs font-normal text-gray-500">({{ bienesAsignadosList.total ||
											0 }})</span>
									</h3>
								</div>

								<div class="flex items-center gap-2 flex-shrink-0">

									<button
										v-if="!isReleaseMode && (bienesAsignadosList.data && bienesAsignadosList.data.length > 0)"
										@click="isReleaseMode = true"
										class="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium rounded hover:bg-gray-300 transition-colors whitespace-nowrap">
										Seleccionar
									</button>

									<template v-if="isReleaseMode">
										<button @click="openReleaseConfirmation"
											:disabled="selectedReleaseMap.size === 0"
											class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded disabled:opacity-50 transition-colors whitespace-nowrap">
											Liberar ({{ selectedReleaseMap.size }})
										</button>
										<button @click="isReleaseMode = false; selectedReleaseMap.clear()"
											class="text-gray-500 hover:text-gray-700 dark:text-gray-400 px-1">
											&times;
										</button>
									</template>

									<button @click="showAssignModal = true" v-if="!isReleaseMode"
										class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded flex items-center gap-1 transition-colors whitespace-nowrap">
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M12 4v16m8-8H4"></path>
										</svg>
										Nuevo
									</button>
								</div>
							</div>

							<div
								class="p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg flex-shrink-0">
								<input v-model="searchAsignados" type="text" placeholder="Buscar en asignados..."
									class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
							</div>

							<div
								class="flex-1 overflow-y-auto overflow-x-auto p-0 dark:bg-dark-bg relative max-h-[500px]">

								<div v-if="isLoadingResguardados"
									class="absolute inset-0 z-10 flex justify-center items-center bg-white/80 dark:bg-gray-800/80">
									<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
								</div>

								<table class="w-full text-sm text-left ">
									<thead
										class="text-xs text-gray-500 uppercase bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
										<tr>
											<th v-if="isReleaseMode"
												class="px-2 py-3 text-center w-10 bg-gray-100 dark:bg-gray-700">
												<input type="checkbox" v-model="selectAllPageAsignados"
													class="rounded text-indigo-600 focus:ring-indigo-500">
											</th>
											<th class="px-4 py-3 font-semibold bg-gray-100 dark:bg-gray-700">Bien</th>
											<th class="px-4 py-3 font-semibold text-right bg-gray-100 dark:bg-gray-700">
												Código</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
										<tr v-if="!bienesAsignadosList.data || bienesAsignadosList.data.length === 0">
											<td :colspan="isReleaseMode ? 3 : 2"
												class="p-8 text-center text-gray-500 italic">
												{{ searchAsignados ? 'No hay coincidencias.' : 'No hay bienes asignados.' }}
											</td>
										</tr>
										<tr v-for="bien in bienesAsignadosList.data" :key="bien.id"
											class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
											<td v-if="isReleaseMode" class="px-2 py-3 text-center">
												<input type="checkbox" :checked="selectedReleaseMap.has(bien.id)"
													@change="toggleReleaseSelection(bien)"
													class="rounded text-indigo-600 focus:ring-indigo-500">
											</td>
											<td class="px-4 py-3">
												<div
													class="font-bold text-gray-800 dark:text-gray-200 text-xs md:text-sm">
													{{
														bien.bien_descripcion }}</div>
												<div
													class="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold text-left">
													{{
														bien.bien_codigo }}</div>
											</td>
											<td>
												<div class="text-[10px] text-gray-500 truncate max-w-[200px]">
													{{ bien.bien_marca }}
													{{ bien.bien_modelo }}</div>
											</td>

										</tr>
									</tbody>
								</table>
							</div>

							<div v-if="bienesAsignadosList.last_page > 1"
								class="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-b-lg flex-shrink-0">
								<button @click="changePageAsignados(pageAsignados - 1)" :disabled="pageAsignados === 1"
									class="px-2 py-1 text-xs border rounded disabled:opacity-50 bg-white dark:bg-gray-700 dark:border-gray-600">Ant.</button>
								<span class="text-xs text-gray-500">{{ pageAsignados }} / {{
									bienesAsignadosList.last_page }}</span>
								<button @click="changePageAsignados(pageAsignados + 1)"
									:disabled="pageAsignados === bienesAsignadosList.last_page"
									class="px-2 py-1 text-xs border rounded disabled:opacity-50 bg-white dark:bg-gray-700 dark:border-gray-600">Sig.</button>
							</div>
						</div>
					</div>
					<div
						class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6 sticky bottom-0 bg-white dark:bg-dark-bg">
						<button @click="showDetailsModal = false"
							class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Crear usuario Modal -->
	<div v-if="showCreateUserModal && creatingUserFor"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
			<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
				<h2 class="text-lg font-bold text-gray-900 dark:text-white">Crear Usuario para {{
					creatingUserFor.res_nombre }}</h2>
				<button @click="closeCreateUserModal"
					class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
			</div>

			<div v-if="createUserError"
				class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
				role="alert">
				<span class="font-medium text-sm">{{ createUserError }}</span>
				<button @click="createUserError = null"
					class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
			</div>
			<div class="p-6 space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo
						Electrónico <span class="text-red-500">*</span></label>
					<input v-model="newUserData.correo" type="email" placeholder="correo@institucion.com"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-800">
					<span v-if="creatingUserFor.res_correo" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Se
						usará el correo del resguardante.</span>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rol de
						Usuario
						<span class="text-red-500">*</span></label>
					<select v-model="newUserData.rol_id"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<option :value="null" disabled>Seleccionar un Rol</option>
						<option v-if="!rolesList || rolesList.length === 0" disabled>-- Cargando roles... --
						</option>
						<option v-else v-for="rol in rolesList" :key="rol.id" :value="rol.id">
							{{ rol.rol_nombre }}
						</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña
						<span class="text-red-500">*</span></label>
					<input v-model="newUserData.password" type="password" placeholder="Contraseña para la cuenta"
						class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
			</div>
			<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
				<button @click="closeCreateUserModal" :disabled="isSubmitting"
					class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">Cancelar</button>
				<button @click="saveNewUser" :disabled="isSubmitting"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
					{{ isSubmitting ? 'Creando...' : 'Crear Usuario' }}
				</button>
			</div>
		</div>
	</div>
	<ConfirmModal :show="showReleaseConfirmModal" :isSubmitting="isLoadingResguardados" title="Confirmar Liberación"
		:message="releaseMessage" confirmText="Sí, Liberar Bienes" confirmClass="bg-red-600 hover:bg-red-700"
		@confirm="handleConfirmRelease" @cancel="showReleaseConfirmModal = false" />
	<ConfirmModal :show="showDeleteResguardanteModal" :isSubmitting="isSubmitting"
		:errorMessage="deleteResguardanteError" title="Confirmar Eliminación" :message="deleteResguardanteMessage"
		confirmText="Sí, Eliminar" confirmClass="bg-red-600 hover:bg-red-700" @confirm="handleConfirmDeleteResguardante"
		@cancel="cancelDeleteResguardante" @clearError="deleteResguardanteError = null" />
	<ModalAsignarResguardo :show="showAssignModal" :resguardante="selectedResguardante" @close="showAssignModal = false"
		@confirm="handleAssignConfirm" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ModalAsignarResguardo from '@/components/ModalAsignarResguardo.vue'
import { generarPDFResguardo } from '../../../config/resguardo_pdf.js';

const isLoading = ref(true)
const isLoadingResguardantes = ref(false)
const error = ref(null)
const isSubmitting = ref(false)
const showNewResguardanteModal = ref(false)
const newResguardanteError = ref(null)
const showEditResguardanteModal = ref(false)
const editResguardanteError = ref(null)
const showDeleteResguardanteModal = ref(false)
const showReportModal = ref(false)
const showDetailsModal = ref(false)
const deletingResguardante = ref(null)
const deleteResguardanteError = ref(null)
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 15
const totalItems = ref(0)

const resguardantesList = ref({ data: [] })
const departments = ref({ data: [] })
const rolesList = ref([])
const selectedResguardante = ref(null)
const oficinasList = ref([])

const showCreateUserModal = ref(false)
const createUserError = ref(null)
const creatingUserFor = ref(null) // Para guardar el resguardante que estamos editando

const showAssignModal = ref(false)

const newResguardanteData = ref({
	res_nombre: '',
	res_apellidos: '',
	res_puesto: '',
	res_departamento: null, // Asume que es el ID del departamento
	res_rfc: '',
	res_curp: '',
	res_telefono: '',
	id_oficina: null,     // Asume que es el ID de la oficina
	res_correo: '',
})

const editingResguardante = ref({
	id: null,
	res_nombre: '',
	res_apellidos: '',
	res_puesto: '',
	res_departamento: null,
	res_rfc: '',
	res_curp: '',
	res_telefono: '',
	id_oficina: null,
	res_correo: '',
	res_id_usuario: null,
	usuario_id_rol: null
})

const newUserData = ref({
	correo: '',
	rol_id: null,
	password: ''
})

const bienesAsignadosList = ref({ data: [] }); // Objeto paginado
const isLoadingResguardados = ref(false);
const selectedReleaseMap = ref(new Map()); // Map<ID, Bien> para liberar
const isReleaseMode = ref(false); // Activar checkboxes
const searchAsignados = ref('');
const pageAsignados = ref(1);

// Modal de Confirmación de Liberación
const showReleaseConfirmModal = ref(false);
const releaseMessage = ref('');

const totalPages = computed(() => {
	return Math.ceil(totalItems.value / itemsPerPage) || 1
})

const filteredResguardantes = computed(() => {
	return resguardantesList.value.data || []
})


const deleteResguardanteMessage = computed(() => {
	if (!deletingResguardante.value) return ''
	const name = `${deletingResguardante.value.res_nombre} ${deletingResguardante.value.res_apellidos || ''}`.trim()
	return `¿Estás seguro de que deseas eliminar al resguardante:<br><strong class='font-medium text-lg text-gray-900 dark:text-white'>${name}</strong>?`
})

const fetchResguardantesData = async (page = 1) => {
	isLoading.value = true
	error.value = null

	try {
		const params = new URLSearchParams()
		params.append('page', page)

		if (searchTerm.value.trim()) {
			params.append('search', searchTerm.value.toUpperCase())
		}

		const [resguardantesRes, formDataRes] = await Promise.all([
			authenticatedFetch(`/resguardantes?${params.toString()}`),
			authenticatedFetch('/formularios/resguardantes')
		])

		if (!resguardantesRes.ok) throw new Error('Error al cargar resguardantes')
		if (!formDataRes.ok) throw new Error('Error al cargar datos del formulario')

		// 2. Procesar Lista Principal
		const resguardantesData = await resguardantesRes.json()
		resguardantesList.value = resguardantesData
		totalItems.value = resguardantesData.total || 0
		currentPage.value = page

		// 3. Procesar Catálogos (Departamentos, Roles, Oficinas)
		const formData = await formDataRes.json()

		// Extraemos todo del mismo objeto JSON
		departments.value = formData.departamentos || []
		rolesList.value = formData.roles || []
		oficinasList.value = formData.oficinas || []

	} catch (e) {
		console.error('Error al cargar datos:', e)
		error.value = e
		resguardantesList.value = { data: [] }
	} finally {
		isLoading.value = false
		isLoadingResguardantes.value = false
	}
}

const fetchBienesDelResguardante = async (resguardanteId, page = 1) => {
	if (!resguardanteId) return;

	isLoadingResguardados.value = true;
	// Limpiamos selección al recargar si no estamos en modo selección (opcional)
	// selectedReleaseMap.value.clear(); 

	try {
		const params = new URLSearchParams();
		params.append('page', page);
		if (searchAsignados.value.trim()) {
			params.append('search', searchAsignados.value.toUpperCase());
		}

		const response = await authenticatedFetch(`/resguardantes/${resguardanteId}/bienes?${params.toString()}`);

		if (response.ok) {
			const json = await response.json();
			bienesAsignadosList.value = json; // Guardamos la respuesta paginada completa
			pageAsignados.value = page;
		}
	} catch (e) {
		console.error("Error cargando bienes asignados:", e);
	} finally {
		isLoadingResguardados.value = false;
	}
};


const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		fetchResguardantesData(currentPage.value + 1)
	}
}

const prevPage = () => {
	if (currentPage.value > 1) {
		fetchResguardantesData(currentPage.value - 1)
	}
}

let searchTimeout
watch(searchTerm, () => {
	if (searchTimeout) clearTimeout(searchTimeout)

	isLoadingResguardantes.value = true

	searchTimeout = setTimeout(() => {
		currentPage.value = 1
		fetchResguardantesData(1)
	}, 500)
})

const getDepartmentName = (deptId) => {
	if (!deptId || !departments.value) return 'Sin asignar'
	const dept = departments.value.find(d => d.id === deptId)
	return dept ? dept.dep_nombre : `ID (${deptId}) Desconocido`
}

onMounted(() => {
	fetchResguardantesData()
})

const openNewResguardanteModal = () => {
	newResguardanteData.value = {
		res_nombre: '',
		res_apellidos: '',
		res_puesto: '',
		res_departamento: null,
		res_rfc: '',
		res_curp: '',
		res_telefono: '',
		id_oficina: null,
		res_correo: '',
	};
	newResguardanteError.value = null;
	showNewResguardanteModal.value = true;
};

const saveNewResguardante = async () => {
	newResguardanteError.value = null
	if (!newResguardanteData.value.res_nombre ||
		!newResguardanteData.value.res_apellidos ||
		!newResguardanteData.value.res_puesto ||
		!newResguardanteData.value.res_departamento) {
		newResguardanteError.value = 'Nombre, Apellidos, Puesto y Departamento son obligatorios.';
		return;
	}

	isSubmitting.value = true
	try {
		const payload = {
			res_nombre: newResguardanteData.value.res_nombre,
			res_apellidos: newResguardanteData.value.res_apellidos,
			res_puesto: newResguardanteData.value.res_puesto,
			res_departamento: newResguardanteData.value.res_departamento,
			res_rfc: newResguardanteData.value.res_rfc || null, // Envía null si está vacío
			res_curp: newResguardanteData.value.res_curp || null,
			res_telefono: newResguardanteData.value.res_telefono || null,
			id_oficina: newResguardanteData.value.id_oficina || null,
			res_correo: newResguardanteData.value.res_correo || null,
		};

		const response = await authenticatedFetch('/resguardantes', {
			method: 'POST',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			const message = errData.message || (errData.errors ? Object.values(errData.errors).join(', ') : 'No se pudo crear el resguardante.')
			throw new Error(message)
		}

		showNewResguardanteModal.value = false
		await fetchResguardantesData()
	} catch (err) {
		console.error('Error al guardar resguardante:', err)
		newResguardanteError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}
const newModalFilteredOficinas = computed(() => {
	const deptId = newResguardanteData.value.res_departamento;
	if (!deptId) {
		return []; // Sin departamento, no hay oficinas
	}
	// Filtra la lista completa de oficinas
	return oficinasList.value.filter(oficina => oficina.id_departamento === deptId);
});

watch(() => newResguardanteData.value.res_departamento, () => {
	// Si el usuario cambia el departamento, resetea la oficina seleccionada
	newResguardanteData.value.id_oficina = null;
});

const openEditResguardanteModal = (resguardante) => {
	editingResguardante.value = {
		id: resguardante.id,
		res_nombre: resguardante.res_nombre,
		res_apellidos: resguardante.res_apellidos,
		res_puesto: resguardante.res_puesto,
		res_departamento: resguardante.res_departamento, // Asume que tu API envía el ID
		res_rfc: resguardante.res_rfc,
		res_curp: resguardante.res_curp,
		res_telefono: resguardante.res_telefono,
		id_oficina: resguardante.id_oficina, // Asume que tu API envía el ID
		res_correo: resguardante.res_correo,
		res_id_usuario: resguardante.res_id_usuario, // <-- AÑADIR ESTA LÍNEA
		usuario_id_rol: resguardante.usuario_id_rol  // <-- AÑADIR ESTA LÍNEA
	};
	editResguardanteError.value = null;
	showEditResguardanteModal.value = true;
};
const editModalFilteredOficinas = computed(() => {
	const deptId = editingResguardante.value.res_departamento;
	if (!deptId) {
		return [];
	}
	return oficinasList.value.filter(oficina => oficina.id_departamento === deptId);
});
watch(() => editingResguardante.value.res_departamento, (newDeptId, oldDeptId) => {
	if (newDeptId !== oldDeptId) {
		editingResguardante.value.id_oficina = null;
	}
});
const saveEditResguardante = async () => {
	if (!editingResguardante.value.id) return
	editResguardanteError.value = null

	if (!editingResguardante.value.res_nombre ||
		!editingResguardante.value.res_apellidos ||
		!editingResguardante.value.res_puesto ||
		!editingResguardante.value.res_departamento) {
		editResguardanteError.value = 'Nombre, Apellidos, Puesto y Departamento son obligatorios.';
		return;
	}

	isSubmitting.value = true
	try {
		const payload = {
			res_nombre: editingResguardante.value.res_nombre,
			res_apellidos: editingResguardante.value.res_apellidos,
			res_puesto: editingResguardante.value.res_puesto,
			res_departamento: editingResguardante.value.res_departamento,
			res_rfc: editingResguardante.value.res_rfc || null,
			res_curp: editingResguardante.value.res_curp || null,
			res_telefono: editingResguardante.value.res_telefono || null,
			id_oficina: editingResguardante.value.id_oficina || null,
			res_correo: editingResguardante.value.res_correo || null,
		};
		console.log('Payload de edición:', payload);
		console.log('/resguardantes/' + editingResguardante.value.id);
		const response = await authenticatedFetch(`/resguardantes/${editingResguardante.value.id}`, {
			method: 'PUT',
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			const message = errData.message || (errData.errors ? Object.values(errData.errors).join(', ') : 'No se pudo actualizar.')
			throw new Error(message)
		}

		showEditResguardanteModal.value = false
		await fetchResguardantesData()
	} catch (err) {
		console.error('Error al actualizar resguardante:', err)
		editResguardanteError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const openDeleteResguardanteModal = (resguardante) => {
	deletingResguardante.value = resguardante
	deleteResguardanteError.value = null
	showDeleteResguardanteModal.value = true
}

const cancelDeleteResguardante = () => {
	showDeleteResguardanteModal.value = false
	deletingResguardante.value = null
	deleteResguardanteError.value = null
}

const handleConfirmDeleteResguardante = async () => {
	if (!deletingResguardante.value) return

	isSubmitting.value = true
	deleteResguardanteError.value = null

	try {
		const resguardanteId = deletingResguardante.value.id
		const response = await authenticatedFetch(`/resguardantes/${resguardanteId}`, {
			method: 'DELETE'
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}))
			console.log(errData)
			const message = errData.message || 'No se pudo eliminar el resguardante.'
			throw new Error(message)
		}

		showDeleteResguardanteModal.value = false
		await fetchResguardantesData()
		deletingResguardante.value = null
	} catch (err) {
		console.error('Error al eliminar resguardante:', err)
		deleteResguardanteError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}

const viewResguardanteDetails = (resguardante) => {
	selectedResguardante.value = resguardante
	console.log(resguardante)
	showDetailsModal.value = true
	fetchBienesDelResguardante(resguardante.id);
}

/**
 * Abre el modal para crear un usuario para un resguardante.
 */
const openCreateUserModal = (resguardante) => {
	creatingUserFor.value = resguardante // Guarda el resguardante completo
	// Rellena el formulario
	newUserData.value = {
		// Pre-llena el correo si el resguardante tiene uno
		correo: resguardante.res_correo || '',
		rol_id: null,
		password: ''
	}

	createUserError.value = null
	showCreateUserModal.value = true
}

/**
 * Cierra el modal de creación de usuario.
 */
const closeCreateUserModal = () => {
	showCreateUserModal.value = false
	creatingUserFor.value = null
}

/**
 * Guarda el nuevo USUARIO y lo enlaza al resguardante.
 */
const saveNewUser = async () => {
	if (!creatingUserFor.value) return; // 'creatingUserFor' tiene el resguardante
	createUserError.value = null
	// Validación
	if (!newUserData.value.correo || !newUserData.value.password) {
		createUserError.value = 'Correo y Contraseña son obligatorios.';
		return;
	}

	isSubmitting.value = true
	try {
		// El payload ahora solo necesita los datos del nuevo usuario.
		// Tu backend obtendrá el resguardante desde la URL.
		const payload = {
			usuario_nombre: `${creatingUserFor.value.res_nombre} ${creatingUserFor.value.res_apellidos}`,
			usuario_correo: newUserData.value.correo,
			usuario_pass: newUserData.value.password,
			usuario_id_rol: newUserData.value.rol_id
		}
		const resguardanteId = creatingUserFor.value.id;
		const response = await authenticatedFetch(`/resguardantes/${resguardanteId}/crear-usuario`, {
			method: 'POST',
			body: JSON.stringify(payload)
		});
		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			const message = errData.message || (errData.errors ? Object.values(errData.errors).join(', ') : 'No se pudo crear el usuario.');
			throw new Error(message);
		}

		// ¡Éxito!
		showCreateUserModal.value = false
		await fetchResguardantesData() // Recarga la tabla

	} catch (err) {
		console.error('Error al crear usuario:', err)
		createUserError.value = err.message
	} finally {
		isSubmitting.value = false
	}
}
const handleAssignConfirm = async (selectedGoods) => {
	if (!selectedResguardante.value || selectedGoods.length === 0) return;

	const payload = {
		accion: 'create', 
		id_resguardante: selectedResguardante.value.id,
		bienes_ids: selectedGoods.map(b => b.id) 
	};

	isLoading.value = true;

	try {
		const response = await authenticatedFetch('/resguardos', {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.message || 'Error al asignar los bienes.');
		}

		const data = await response.json();
		imprimirValeActualizado(selectedResguardante.value.id);

		showAssignModal.value = false;

		await fetchBienesDelResguardante(selectedResguardante.value.id);

	} catch (error) {
		console.error(error);
		alert('Error: ' + error.message);
	} finally {
		isLoading.value = false;
	}
};

const imprimirValeActualizado = async (resguardanteId) => {
    try {
        console.log("Generando vale consolidado...");
        const response = await authenticatedFetch(`/resguardantes/${resguardanteId}/bienes-activos`);
        
        if (!response.ok) throw new Error("Error al obtener el listado actualizado de bienes");

        const responseData = await response.json();
        const todosLosBienes = responseData.data || [];

        if (todosLosBienes.length > 0) {
            generarPDFResguardo(selectedResguardante.value, todosLosBienes, 'RESGUARDO');
        }

    } catch (e) {
        console.error("Error al generar el PDF actualizado:", e);
        alert("Los bienes se asignaron, pero hubo un error generando el PDF.");
    }
};

// --- 5. LÓGICA DE LIBERACIÓN ---
const openReleaseConfirmation = () => {
	const count = selectedReleaseMap.value.size;
	if (count === 0) return;

	releaseMessage.value = `Estás a punto de liberar <strong>${count} bienes</strong> del resguardo.<br><br>
                            <span class="text-sm text-gray-500">Nota: Esta acción generará un nuevo vale de resguardo actualizado (Próximamente).</span>`;
	showReleaseConfirmModal.value = true;
};

const handleConfirmRelease = async () => {
	isLoadingResguardados.value = true;

	try {
		const bienesIds = Array.from(selectedReleaseMap.value.keys());

		const response = await authenticatedFetch('/resguardos', {
			method: 'POST', 
			body: JSON.stringify({
				accion: 'release', 
				bienes_ids: bienesIds
			})
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			const msg = errData.message || errData.error || 'Error desconocido en el servidor';
			throw new Error(msg);
		}
		// Éxito
		showReleaseConfirmModal.value = false;
		selectedReleaseMap.value.clear();
		isReleaseMode.value = false;

		// Recargar la tabla
		await fetchBienesDelResguardante(selectedResguardante.value.id, pageAsignados.value);
		console.log(bienesAsignadosList.value);

		// Generar el PDF del resguardo actualizado
		const bienesAsignadosListo = computed(() => {
			return bienesAsignadosList.value.data || [];
		});

		console.log(bienesAsignadosList.value.data);

		if (bienesAsignadosList.value.data && bienesAsignadosList.value.data.length > 0) {
			generarPDFResguardo(selectedResguardante.value, bienesAsignadosListo.value, 'RESGUARDO');
		} else {
			console.warn("El resguardante se quedó sin bienes, no se generó PDF.");
		}

	} catch (error) {
		console.error(error);
		alert('Error: ' + error.message);
	} finally {
		isLoadingResguardados.value = false;
	}
};

// Al cerrar el modal principal, limpiar todo
watch(showDetailsModal, (val) => {
	if (!val) {
		selectedReleaseMap.value.clear();
		searchAsignados.value = '';
		isReleaseMode.value = false;
	}
});
let searchAsignadosTimeout;
watch(searchAsignados, () => {
	if (searchAsignadosTimeout) clearTimeout(searchAsignadosTimeout);
	searchAsignadosTimeout = setTimeout(() => {
		// Al buscar, volvemos a la pág 1
		fetchBienesDelResguardante(selectedResguardante.value?.id, 1);
	}, 500);
});

// --- 3. PAGINACIÓN DERECHA ---
const changePageAsignados = (newPage) => {
	if (newPage >= 1 && newPage <= (bienesAsignadosList.value.last_page || 1)) {
		fetchBienesDelResguardante(selectedResguardante.value?.id, newPage);
	}
};

const toggleReleaseSelection = (bien) => {
	if (selectedReleaseMap.value.has(bien.id)) {
		selectedReleaseMap.value.delete(bien.id);
	} else {
		selectedReleaseMap.value.set(bien.id, bien);
	}
};
const selectAllPageAsignados = computed({
	get() {
		const data = bienesAsignadosList.value.data || [];
		if (data.length === 0) return false;
		return data.every(b => selectedReleaseMap.value.has(b.id));
	},
	set(value) {
		const data = bienesAsignadosList.value.data || [];
		if (value) {
			data.forEach(b => selectedReleaseMap.value.set(b.id, b));
		} else {
			data.forEach(b => selectedReleaseMap.value.delete(b.id));
		}
	}
});



</script>
