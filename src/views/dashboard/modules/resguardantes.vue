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
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Resguardantes</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 space-y-4">
			<div class="flex flex-col md:flex-row gap-4 items-end">
				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar resguardante</label>
					<input v-model="searchTerm" type="text" placeholder="Escribe para buscar..." class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>
				<button @click="openNewResguardanteModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
					Nuevo Resguardante
				</button>
				<button @click="showReportModal = true" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2zm2-6a2 2 0 11-4 0 2 2 0 014 0z"></path>
					</svg>
					Reporte
				</button>
			</div>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-x-auto">
			<div v-if="filteredResguardantes.length === 0" class="flex items-center justify-center h-64">
				<p class="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">No existen registros</p>
			</div>
			<table v-else class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">RFC</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Apellidos</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Correo</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Departamento</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="resguardante in filteredResguardantes" :key="resguardante.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.res_rfc || 'N/A' }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.res_nombre }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.res_apellidos }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.res_correo }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ getDepartmentName(resguardante.res_departamento) }}</td>
						<td class="px-4 py-3 flex gap-2">
							<button @click="viewResguardanteDetails(resguardante)" class="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors" title="Ver detalles">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							</button>
							<button @click="openEditResguardanteModal(resguardante)" title="Editar" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
							<button @click="openDeleteResguardanteModal(resguardante)" title="Eliminar" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Pagination Controls -->
		<div v-if="filteredResguardantes.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
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

		<!-- New Resguardante Modal -->
		<div v-if="showNewResguardanteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Resguardante</h2>
					<button @click="showNewResguardanteModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div v-if="newResguardanteError" class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center" role="alert">
					<span class="font-medium text-sm">{{ newResguardanteError }}</span>
					<button @click="newResguardanteError = null" class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre(s)</label>
							<input v-model="newResguardanteData.res_nombre" type="text" placeholder="Nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
							<input v-model="newResguardanteData.res_apellidos" type="text" placeholder="Apellidos" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RFC</label>
						<input v-model="newResguardanteData.res_rfc" type="text" placeholder="RFC (Opcional)" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
						<input v-model="newResguardanteData.res_correo" type="email" placeholder="correo@institucion.com" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puesto</label>
							<input v-model="newResguardanteData.res_puesto" type="text" placeholder="Ej. Encargado de Lab." class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tel��fono</label>
							<input v-model="newResguardanteData.res_telefono" type="tel" placeholder="Ej. 9831234567" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<select v-model="newResguardanteData.res_departamento" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null" disabled>Seleccionar Departamento</option>
							<option v-if="!departments || departments.length === 0" disabled>-- Cargando... --</option>
							<option v-else v-for="dept in departments" :key="dept.id" :value="dept.id">
								{{ dept.dep_nombre }}
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rol de Usuario</label>
						<select v-model="newResguardanteData.usuario_id_rol" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="3">Resguardante</option>
							<option v-if="!rolesList || rolesList.length === 0" disabled>-- Cargando roles... --</option>
							<option v-else v-for="rol in rolesList" :key="rol.id" :value="rol.id">
								{{ rol.rol_nombre }}
							</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
						<input v-model="newResguardanteData.usuario_pass" type="password" placeholder="Contraseña para su cuenta" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewResguardanteModal = false" :disabled="isSubmitting" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">Cancelar</button>
					<button @click="saveNewResguardante" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar Resguardante' }}
					</button>
				</div>
			</div>
		</div>

		<!-- Edit Resguardante Modal -->
		<div v-if="showEditResguardanteModal && editingResguardante.id" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Resguardante</h2>
					<button @click="showEditResguardanteModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div v-if="editResguardanteError" class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center" role="alert">
					<span class="font-medium text-sm">{{ editResguardanteError }}</span>
					<button @click="editResguardanteError = null" class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
				</div>

				<div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre(s)</label>
							<input v-model="editingResguardante.res_nombre" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
							<input v-model="editingResguardante.res_apellidos" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RFC</label>
						<input v-model="editingResguardante.res_rfc" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
						<input v-model="editingResguardante.res_correo" type="email" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puesto</label>
							<input v-model="editingResguardante.res_puesto" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
							<input v-model="editingResguardante.res_telefono" type="tel" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<select v-model="editingResguardante.res_departamento" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null" disabled>Seleccionar Departamento</option>
							<option v-if="!departments || departments.length === 0" disabled>-- Cargando... --</option>
							<option v-else v-for="dept in departments" :key="dept.id" :value="dept.id">
								{{ dept.dep_nombre }}
							</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rol de Usuario</label>
						<select v-model="editingResguardante.usuario_id_rol" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option :value="null" disabled>Seleccionar un Rol</option>
							<option v-if="!rolesList || rolesList.length === 0" disabled>-- Cargando roles... --</option>
							<option v-else v-for="rol in rolesList" :key="rol.id" :value="rol.id">
								{{ rol.rol_nombre }}
							</option>
						</select>
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditResguardanteModal = false" :disabled="isSubmitting" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">Cancelar</button>
					<button @click="saveEditResguardante" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
						{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
					</button>
				</div>
			</div>
		</div>

		<!-- Resguardante Details Modal -->
		<div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6 sticky top-0 bg-white dark:bg-dark-bg">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalles de Resguardante - {{ selectedResguardante?.res_nombre }} {{ selectedResguardante?.res_apellidos }}</h2>
					<button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div class="p-6 space-y-6">
					<!-- Información del Resguardante Section -->
					<div>
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Resguardante</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre Completo</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.res_nombre }} {{ selectedResguardante?.res_apellidos }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">RFC</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.res_rfc || 'N/A' }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Correo Electrónico</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.res_correo }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.res_telefono || 'N/A' }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Puesto</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.res_puesto || 'N/A' }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Departamento</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ getDepartmentName(selectedResguardante?.res_departamento) }}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6 sticky bottom-0 bg-white dark:bg-dark-bg">
					<button @click="showDetailsModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
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
		<ConfirmModal
			:show="showDeleteResguardanteModal"
			:isSubmitting="isSubmitting"
			:errorMessage="deleteResguardanteError"
			title="Confirmar Eliminación"
			:message="deleteResguardanteMessage"
			confirmText="Sí, Eliminar"
			confirmClass="bg-red-600 hover:bg-red-700"
			@confirm="handleConfirmDeleteResguardante"
			@cancel="cancelDeleteResguardante"
			@clearError="deleteResguardanteError = null"
		/>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { authenticatedFetch } from '../../../config/api.js'
import ConfirmModal from '@/components/ConfirmModal.vue'

const isLoading = ref(true)
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
const departments = ref([])
const rolesList = ref([])
const selectedResguardante = ref(null)

const newResguardanteData = ref({
	res_rfc: '',
	res_nombre: '',
	res_apellidos: '',
	res_correo: '',
	res_puesto: '',
	res_telefono: '',
	res_departamento: null,
	usuario_id_rol: 3,
	usuario_pass: ''
})

const editingResguardante = ref({
	id: null,
	res_rfc: '',
	res_nombre: '',
	res_apellidos: '',
	res_correo: '',
	res_puesto: '',
	res_telefono: '',
	res_departamento: null,
	usuario_id_rol: null
})

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

		const [resguardantesRes, departmentsRes, rolesRes] = await Promise.all([
			authenticatedFetch(`/resguardantes?${params.toString()}`),
			authenticatedFetch('/departamentos'),
			authenticatedFetch('/formularios/resguardantes')
		])

		if (!resguardantesRes.ok) throw new Error('Error al cargar resguardantes')
		if (!departmentsRes.ok) throw new Error('Error al cargar departamentos')
		if (!rolesRes.ok) throw new Error('Error al cargar roles')

		const resguardantesData = await resguardantesRes.json()
		resguardantesList.value = resguardantesData
		totalItems.value = resguardantesData.total || 0
		currentPage.value = page

		const deptData = await departmentsRes.json()
		departments.value = deptData.data || deptData

		const rolesData = await rolesRes.json()
		rolesList.value = rolesData.data || rolesData
	} catch (e) {
		console.error('Error al cargar datos:', e)
		error.value = e
		resguardantesList.value = { data: [] }
	} finally {
		isLoading.value = false
	}
}

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
	clearTimeout(searchTimeout)
	searchTimeout = setTimeout(() => {
		currentPage.value = 1
		fetchResguardantesData(1)
	}, 300)
})

const getDepartmentName = (deptId) => {
	if (!deptId || !departments.value) return 'Sin asignar'
	const dept = departments.value.find(d => d.id === deptId)
	return dept ? dept.dep_nombre : `ID (${deptId}) Desconocido`
}

onMounted(() => {
	fetchResguardantesData(1)
})

const openNewResguardanteModal = () => {
	newResguardanteData.value = {
		res_rfc: '',
		res_nombre: '',
		res_apellidos: '',
		res_correo: '',
		res_puesto: '',
		res_telefono: '',
		res_departamento: null,
		usuario_pass: '',
		usuario_id_rol: 3
	}
	newResguardanteError.value = null
	showNewResguardanteModal.value = true
}

const saveNewResguardante = async () => {
	newResguardanteError.value = null
	if (!newResguardanteData.value.res_nombre ||
		!newResguardanteData.value.res_apellidos ||
		!newResguardanteData.value.res_correo ||
		!newResguardanteData.value.res_departamento ||
		!newResguardanteData.value.usuario_id_rol ||
		!newResguardanteData.value.usuario_pass) {
		newResguardanteError.value = 'Nombre, Apellidos, Correo, Departamento y Contraseña son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			res_rfc: newResguardanteData.value.res_rfc,
			res_nombre: newResguardanteData.value.res_nombre,
			res_apellidos: newResguardanteData.value.res_apellidos,
			res_correo: newResguardanteData.value.res_correo,
			res_puesto: newResguardanteData.value.res_puesto,
			res_telefono: newResguardanteData.value.res_telefono,
			res_departamento: newResguardanteData.value.res_departamento,
			usuario_id_rol: newResguardanteData.value.usuario_id_rol,
			usuario_pass: newResguardanteData.value.usuario_pass
		}

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

const openEditResguardanteModal = (resguardante) => {
	editingResguardante.value = {
		id: resguardante.id,
		res_rfc: resguardante.res_rfc,
		res_nombre: resguardante.res_nombre,
		res_apellidos: resguardante.res_apellidos,
		res_correo: resguardante.res_correo,
		res_puesto: resguardante.res_puesto,
		res_telefono: resguardante.res_telefono,
		res_departamento: resguardante.res_departamento,
		usuario_id_rol: resguardante.usuario_id_rol
	}
	editResguardanteError.value = null
	showEditResguardanteModal.value = true
}

const saveEditResguardante = async () => {
	if (!editingResguardante.value.id) return
	editResguardanteError.value = null

	if (!editingResguardante.value.res_nombre ||
		!editingResguardante.value.res_apellidos ||
		!editingResguardante.value.res_correo ||
		!editingResguardante.value.res_departamento ||
		!editingResguardante.value.usuario_id_rol) {
		editResguardanteError.value = 'Nombre, Apellidos, Correo, Departamento y Rol son obligatorios.'
		return
	}

	isSubmitting.value = true
	try {
		const payload = {
			res_rfc: editingResguardante.value.res_rfc,
			res_nombre: editingResguardante.value.res_nombre,
			res_apellidos: editingResguardante.value.res_apellidos,
			res_correo: editingResguardante.value.res_correo,
			res_puesto: editingResguardante.value.res_puesto,
			res_telefono: editingResguardante.value.res_telefono,
			res_departamento: editingResguardante.value.res_departamento,
			usuario_id_rol: editingResguardante.value.usuario_id_rol
		}

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
	showDetailsModal.value = true
}
</script>
