<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Resguardantes</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-end">
			<div class="flex-1">
				<input v-model="searchTerm" type="text" placeholder="Buscar usuario" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
			</div>
			<button @click="openNewResguardanteModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">Nuevo Resguardante</button>
			<button @click="showReportModal = true" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2zm2-6a2 2 0 11-4 0 2 2 0 014 0z"></path>
				</svg>
				Reporte
			</button>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
			<div v-if="filteredResguardantes.length === 0" class="flex items-center justify-center h-64">
				<p class="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">No existen registros</p>
			</div>
			<table v-else class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Apellidos</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Correo</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Área</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="(resguardante, index) in filteredResguardantes" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.nombre }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.apellido1 }} {{ resguardante.apellido2 }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.correo }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ resguardante.departamento }}</td>
						<td class="px-4 py-3 flex gap-2">
							<button @click="viewResguardanteDetails(resguardante)" class="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors" title="Ver detalles">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							</button>
							<button @click="editResguardante(resguardante)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
							<button @click="deleteResguardante(resguardante)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- New Resguardante Modal -->
		<div v-if="showNewResguardanteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Resguardante</h2>
					<button @click="showNewResguardanteModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input v-model="newResguardanteData.nombre" type="text" placeholder="Nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primer Apellido</label>
						<input v-model="newResguardanteData.apellido1" type="text" placeholder="Primer apellido" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Segundo Apellido</label>
						<input v-model="newResguardanteData.apellido2" type="text" placeholder="Segundo apellido (opcional)" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo</label>
						<input v-model="newResguardanteData.correo" type="email" placeholder="correo@institucion.com" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
						<input v-model="newResguardanteData.teléfono" type="tel" placeholder="987654321" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puesto</label>
						<input v-model="newResguardanteData.puesto" type="text" placeholder="Ej. Jefe de departamento" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<input v-model="newResguardanteData.departamento" type="text" placeholder="Ej. Sistemas" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Oficina</label>
						<select v-model="newResguardanteData.oficina" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option value="">Seleccionar Oficina</option>
							<option v-for="oficina in oficinas" :key="oficina.id" :value="oficina.id">
								{{ oficina.nombre }} ({{ oficina.edificio }})
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
						<input v-model="newResguardanteData.password" type="password" placeholder="Contraseña" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rol</label>
						<select v-model="newResguardanteData.rol" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option value="">Seleccionar Rol</option>
							<option>Administrador</option>
							<option>Resguardante Senior</option>
							<option>Resguardante</option>
							<option>Jefe de Departamento</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewResguardanteModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewResguardante" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Resguardante Modal -->
		<div v-if="showEditResguardanteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Resguardante</h2>
					<button @click="showEditResguardanteModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
						<input v-model="editingResguardante.nombre" type="text" placeholder="Nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primer Apellido</label>
						<input v-model="editingResguardante.apellido1" type="text" placeholder="Primer apellido" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Segundo Apellido</label>
						<input v-model="editingResguardante.apellido2" type="text" placeholder="Segundo apellido (opcional)" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo</label>
						<input v-model="editingResguardante.correo" type="email" placeholder="correo@institucion.com" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
						<input v-model="editingResguardante.teléfono" type="tel" placeholder="987654321" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puesto</label>
						<input v-model="editingResguardante.puesto" type="text" placeholder="Ej. Jefe de departamento" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento</label>
						<input v-model="editingResguardante.departamento" type="text" placeholder="Ej. Sistemas" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Oficina</label>
						<select v-model="editingResguardante.oficina" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option value="">Seleccionar Oficina</option>
							<option v-for="oficina in oficinas" :key="oficina.id" :value="oficina.id">
								{{ oficina.nombre }} ({{ oficina.edificio }})
							</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rol</label>
						<select v-model="editingResguardante.rol" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							<option>Administrador</option>
							<option>Resguardante Senior</option>
							<option>Resguardante</option>
							<option>Jefe de Departamento</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditResguardanteModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditResguardante" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Resguardante Details Modal -->
		<div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6 sticky top-0 bg-white dark:bg-gray-800">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalles de Resguardante - {{ selectedResguardante?.nombre }} {{ selectedResguardante?.apellido1 }} {{ selectedResguardante?.apellido2 }}</h2>
					<button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>

				<div class="p-6 space-y-6">
					<!-- Información del Resguardante Section -->
					<div>
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Resguardante</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre Completo</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.nombre }} {{ selectedResguardante?.apellido1 }} {{ selectedResguardante?.apellido2 }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Correo Electrónico</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.correo }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.teléfono }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Puesto</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.puesto }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Departamento</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.departamento }}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Rol</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ selectedResguardante?.rol }}</p>
							</div>
							<div class="md:col-span-2">
								<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Oficina Asignada</p>
								<p class="text-gray-900 dark:text-white font-semibold">{{ getOficinaNombre(selectedResguardante?.oficina) }}</p>
							</div>
						</div>
					</div>

					<!-- Bienes Asignados Section -->
					<div>
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bienes Asignados</h3>
						
						<!-- Search and Filter Controls -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar bien</label>
								<input v-model="assetSearchQuery" type="text" placeholder="Buscar por código o nombre" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por estado</label>
								<select v-model="assetStatusFilter" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
									<option value="">Todos los estados</option>
									<option value="Activo">Activo</option>
									<option value="En Mantenimiento">En Mantenimiento</option>
									<option value="Perdido">Perdido</option>
								</select>
							</div>
						</div>

						<!-- Assigned Assets Table -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-x-auto">
							<table class="w-full text-sm">
								<thead class="bg-gray-100 dark:bg-gray-700">
									<tr>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Código Primario</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Código Secundario</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Estado</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
									<tr v-for="(asset, index) in filteredAssignedAssets" :key="index" class="hover:bg-gray-100 dark:hover:bg-gray-600">
										<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ asset.codigoPrimario }}</td>
										<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ asset.codigoSecundario }}</td>
										<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ asset.nombre }}</td>
										<td class="px-4 py-3">
											<span :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold', asset.estado === 'Activo' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : asset.estado === 'En Mantenimiento' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200']">{{ asset.estado }}</span>
										</td>
										<td class="px-4 py-3">
											<button class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" title="Ver detalles">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
												</svg>
											</button>
										</td>
									</tr>
								</tbody>
							</table>
							<div v-if="filteredAssignedAssets.length === 0" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								No se encontraron bienes asignados.
							</div>
						</div>
					</div>

					<!-- Recent Transactions Section -->
					<div class="border-t border-gray-200 dark:border-gray-700 pt-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Últimos Movimientos</h3>
						
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-x-auto">
							<table class="w-full text-sm">
								<thead class="bg-gray-100 dark:bg-gray-700">
									<tr>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Tipo</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Gestor encargado</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Bien involucrado</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Área</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Fecha</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
									<tr v-for="(transaction, index) in resguardanteTransactions" :key="index" class="hover:bg-gray-100 dark:hover:bg-gray-600">
										<td class="px-4 py-3 text-gray-600 dark:text-gray-400">
											<span :class="['inline-block px-2 py-1 rounded text-xs font-semibold', transaction.tipo === 'Transferencia' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : transaction.tipo === 'Registro' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300']">{{ transaction.tipo }}</span>
										</td>
										<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ transaction.gestorEncargado }}</td>
										<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ transaction.bienInvolucrado }}</td>
										<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ transaction.area }}</td>
										<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ transaction.fecha }}</td>
									</tr>
								</tbody>
							</table>
							<div v-if="resguardanteTransactions.length === 0" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
								No hay movimientos registrados.
							</div>
						</div>
					</div>
				</div>

				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6 sticky bottom-0 bg-white dark:bg-gray-800">
					<button @click="showDetailsModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
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
					<p class="text-gray-600 dark:text-gray-400">¿Está seguro de que desea eliminar este resguardante?</p>
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

const oficinas = ref([
	{ id: 1, nombre: 'Oficina 101', edificio: 'Edificio A' },
	{ id: 2, nombre: 'Oficina 102', edificio: 'Edificio A' },
	{ id: 3, nombre: 'Oficina 201', edificio: 'Edificio B' },
	{ id: 4, nombre: 'Oficina 301', edificio: 'Edificio C' },
	{ id: 5, nombre: 'Sala de Sistemas', edificio: 'Edificio A' },
])

const resguardantes = ref([
	{ nombre: 'Juan', apellido1: 'Pérez', apellido2: '', correo: 'juan@example.com', departamento: 'Sistemas', teléfono: '987654321', puesto: 'Jefe de departamento', oficina: 1, rol: 'Resguardante con privilegios' },
	{ nombre: 'María', apellido1: 'García', apellido2: '', correo: 'maria@example.com', departamento: 'Administración', teléfono: '987654322', puesto: 'Resguardante Senior', oficina: 2, rol: 'Resguardante' },
	{ nombre: 'Carlos', apellido1: 'López', apellido2: '', correo: 'carlos@example.com', departamento: 'RR.HH', teléfono: '987654323', puesto: 'Resguardante', oficina: 3, rol: 'Resguardante' },
])

const assignedAssets = ref([
	{ codigoPrimario: 'XXXX-XXXX-XXX', codigoSecundario: 'SEC-001', nombre: 'Computadora', estado: 'Activo', resguardante: 'Juan Pérez' },
	{ codigoPrimario: 'XXXX-XXXX-XXX', codigoSecundario: 'SEC-002', nombre: 'Impresora', estado: 'Activo', resguardante: 'Juan Pérez' },
	{ codigoPrimario: 'XXXX-XXXX-XXX', codigoSecundario: 'SEC-003', nombre: 'Silla de madera', estado: 'Activo', resguardante: 'Juan Pérez' },
	{ codigoPrimario: 'XXXX-XXXX-XXX', codigoSecundario: 'SEC-004', nombre: 'Laptop HP', estado: 'En Mantenimiento', resguardante: 'Juan Pérez' },
	{ codigoPrimario: 'XXXX-XXXX-XXX', codigoSecundario: 'SEC-005', nombre: 'Mesa de oficina', estado: 'Activo', resguardante: 'Juan Pérez' },
	{ codigoPrimario: 'XXXX-XXXX-XXX', codigoSecundario: 'SEC-006', nombre: 'Fichero de metal', estado: 'Perdido', resguardante: 'Juan Pérez' },
	{ codigoPrimario: 'XXXX-XXXX-XXX', codigoSecundario: 'SEC-007', nombre: 'Computadores portátil', estado: 'Activo', resguardante: 'Juan Pérez' },
	{ codigoPrimario: 'XXXX-XXXX-XXX', codigoSecundario: 'SEC-008', nombre: 'Impresora láser', estado: 'Activo', resguardante: 'Juan Pérez' },
	{ codigoPrimario: 'YYYY-YYYY-YYY', codigoSecundario: 'SEC-009', nombre: 'Monitor LG', estado: 'Activo', resguardante: 'María García' },
	{ codigoPrimario: 'YYYY-YYYY-YYY', codigoSecundario: 'SEC-010', nombre: 'Teclado inalámbrico', estado: 'Activo', resguardante: 'María García' },
	{ codigoPrimario: 'ZZZZ-ZZZZ-ZZZ', codigoSecundario: 'SEC-011', nombre: 'Escritorio', estado: 'Activo', resguardante: 'Carlos López' },
])

const recentTransactions = ref([
	{ tipo: 'Transferencia', gestorEncargado: 'Juan Pérez', resguardanteResponsable: 'Juan Pérez', bienInvolucrado: 'ESCRITORIO DE MADERA', area: 'Servicios escolares', fecha: '2024-01-15' },
	{ tipo: 'Registro', gestorEncargado: 'Juan Pérez', resguardanteResponsable: 'Juan Pérez', bienInvolucrado: 'SILLA ESCOLAR', area: 'Sistemas', fecha: '2024-01-14' },
	{ tipo: 'Mantenimiento', gestorEncargado: 'Tyler Doe', resguardanteResponsable: 'María García', bienInvolucrado: 'COMPUTADORA DELL', area: 'sistemas', fecha: '2024-01-13' },
	{ tipo: 'Transferencia', gestorEncargado: 'Juan Pérez', resguardanteResponsable: 'Carlos López', bienInvolucrado: 'IMPRESORA HP', area: 'Servicios escolares', fecha: '2024-01-12' },
])

const showNewResguardanteModal = ref(false)
const showEditResguardanteModal = ref(false)
const showReportModal = ref(false)
const showDeleteConfirm = ref(false)
const showDetailsModal = ref(false)
const editingIndex = ref(null)

const selectedResguardante = ref(null)
const assetSearchQuery = ref('')
const assetStatusFilter = ref('')
const searchTerm = ref('')

const newResguardanteData = ref({
	nombre: '',
	apellido1: '',
	apellido2: '',
	correo: '',
	teléfono: '',
	puesto: '',
	departamento: '',
	oficina: '',
	password: '',
	rol: '',
})

const editingResguardante = ref({
	nombre: '',
	apellido1: '',
	apellido2: '',
	correo: '',
	teléfono: '',
	puesto: '',
	departamento: '',
	oficina: '',
	password: '',
	rol: '',
})

const filteredResguardantes = computed(() => {
	return resguardantes.value.filter(resguardante => {
		return !searchTerm.value ||
			resguardante.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
			resguardante.apellido1.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
			resguardante.apellido2.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
			resguardante.correo.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
			resguardante.departamento.toLowerCase().includes(searchTerm.value.toLowerCase())
	})
})

const filteredAssignedAssets = computed(() => {
	if (!selectedResguardante.value) return []
	const fullName = `${selectedResguardante.value.nombre} ${selectedResguardante.value.apellidos}`
	return assignedAssets.value.filter(asset => {
		const isBelongsToResguardante = asset.resguardante === fullName
		const matchesSearch = !assetSearchQuery.value || 
			asset.codigoPrimario.toLowerCase().includes(assetSearchQuery.value.toLowerCase()) ||
			asset.codigoSecundario.toLowerCase().includes(assetSearchQuery.value.toLowerCase()) ||
			asset.nombre.toLowerCase().includes(assetSearchQuery.value.toLowerCase())
		
		const matchesStatus = !assetStatusFilter.value || asset.estado === assetStatusFilter.value
		
		return isBelongsToResguardante && matchesSearch && matchesStatus
	})
})

const resguardanteTransactions = computed(() => {
	if (!selectedResguardante.value) return []
	const fullName = `${selectedResguardante.value.nombre} ${selectedResguardante.value.apellidos}`
	return recentTransactions.value.filter(t => t.resguardanteResponsable === fullName)
})

const openNewResguardanteModal = () => {
	newResguardanteData.value = { nombre: '', apellido1: '', apellido2: '', correo: '', password: '', rol: '', departamento: '', teléfono: '', puesto: '', oficina: '' }
	showNewResguardanteModal.value = true
}

const saveNewResguardante = () => {
	if (newResguardanteData.value.nombre && newResguardanteData.value.apellido1 && newResguardanteData.value.correo && newResguardanteData.value.password && newResguardanteData.value.rol && newResguardanteData.value.departamento && newResguardanteData.value.teléfono && newResguardanteData.value.puesto && newResguardanteData.value.oficina) {
		resguardantes.value.push({ ...newResguardanteData.value })
		showNewResguardanteModal.value = false
		newResguardanteData.value = { nombre: '', apellido1: '', apellido2: '', correo: '', password: '', rol: '', departamento: '', teléfono: '', puesto: '', oficina: '' }
	}
}

const editResguardante = (resguardante) => {
	editingIndex.value = resguardantes.value.findIndex(r => r === resguardante)
	editingResguardante.value = { ...resguardante }
	showEditResguardanteModal.value = true
}

const saveEditResguardante = () => {
	resguardantes.value[editingIndex.value] = { ...editingResguardante.value }
	showEditResguardanteModal.value = false
}

const deleteResguardante = (resguardante) => {
	editingIndex.value = resguardantes.value.findIndex(r => r === resguardante)
	showDeleteConfirm.value = true
}

const confirmDelete = () => {
	resguardantes.value.splice(editingIndex.value, 1)
	showDeleteConfirm.value = false
}

const getOficinaNombre = (id) => {
	const oficina = oficinas.value.find(o => o.id === id)
	return oficina ? `${oficina.nombre} (${oficina.edificio})` : 'Sin asignar'
}

const viewResguardanteDetails = (resguardante) => {
	selectedResguardante.value = resguardante
	assetSearchQuery.value = ''
	assetStatusFilter.value = ''
	showDetailsModal.value = true
}

const filterAssignedAssets = () => {
	// Filtering is handled by the computed property
}
</script>
