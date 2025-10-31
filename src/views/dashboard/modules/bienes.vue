<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Bienes Materiales</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<!-- Filters and Actions -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Search -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del bien</label>
					<input v-model="searchTerm" type="text" placeholder="Bien" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				</div>

				<!-- Filter by Area -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por área</label>
					<select v-model="filterArea" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<option value="">Sin filtro</option>
						<option value="Sistemas">Laboratorio de sistemas</option>
						<option value="RR.HH">RR.HH</option>
					</select>
				</div>

				<!-- Filter by Category -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por categoría</label>
					<select v-model="filterCategory" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						<option value="">Sin filtro</option>
						<option value="Equipo de computo">Electrónicos</option>
						<option value="Oficina">Oficina</option>
						<option value="Jardinería">Jardinería</option>
					</select>
				</div>

				<!-- Actions -->
				<div class="flex items-end gap-2">
					<button @click="showNewBienModal = true" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Nuevo Bien</button>
					<button @click="showReportModal = true" class="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2zm2-6a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
						Reporte
					</button>
				</div>
			</div>
		</div>

		<!-- Table -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
			<div v-if="filteredBienes.length === 0" class="flex items-center justify-center h-64">
				<p class="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">No existen registros</p>
			</div>
			<table v-else class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Número de serie</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Modelo</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Marca</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Área</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Resguardante</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Estado</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="(bien, index) in filteredBienes" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ bien.serie }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ bien.modelo }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ bien.marca }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ bien.area }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ bien.resguardante }}</td>
						<td class="px-4 py-3"><span :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold', bien.estado === 'Bueno' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : bien.estado === 'Regular' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200']">{{ bien.estado }}</span></td>
						<td class="px-4 py-3 flex gap-2">
							<button @click="viewBienDetails(index)" class="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors" title="Ver detalles">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							</button>
							<button @click="editBien(index)" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" title="Editar">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
							<button @click="deleteBien(index)" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" title="Eliminar">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- New Bien Modal -->
		<div v-if="showNewBienModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Nuevo Bien</h2>
					<button @click="showNewBienModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de serie</label>
							<input type="text" placeholder="Número de serie" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modelo</label>
							<input type="text" placeholder="Modelo" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marca</label>
							<input type="text" placeholder="Marca" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de adquisición</label>
							<input type="date" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor del bien</label>
							<input type="text" placeholder="Valor" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Documento soporte</label>
							<select class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
								<option>Seleccionar un tipo</option>
								<option>Factura</option>
								<option>Proveedor</option>
								<option>Donación</option>
								<option>Otros conceptos</option>
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
							<select class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
								<option>Seleccionar categoría</option>
								<option>Mueble de oficina</option>
								<option>Equipo de computo</option>
								<option>Equipo de laboratorio</option>
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área</label>
							<select class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
								<option>Seleccionar área</option>
								<option>RR.HH</option>
								<option>Sistemas</option>
								<option>Administración</option>
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resguardante</label>
							<select class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
								<option>Seleccionar resguardante</option>
								<option>Juan Pérez</option>
								<option>María García</option>
								<option>Carlos López</option>
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
							<select class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
								<option>Seleccionar estado</option>
								<option>Bueno</option>
								<option>Regular</option>
								<option>Malo</option>
							</select>
						</div>
						<div class="md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones</label>
							<textarea placeholder="Observaciones" rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
						</div>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showNewBienModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveNewBien" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
				</div>
			</div>
		</div>

		<!-- Edit Bien Modal -->
		<div v-if="showEditBienModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Bien</h2>
					<button @click="showEditBienModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de serie</label>
							<input v-model="editingBien.serie" type="text" placeholder="Número de serie" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modelo</label>
							<input v-model="editingBien.modelo" type="text" placeholder="Modelo" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marca</label>
							<input v-model="editingBien.marca" type="text" placeholder="Marca" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área</label>
							<select v-model="editingBien.area" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
								<option>Sistemas</option>
								<option>RR.HH</option>
								<option>Administración</option>
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resguardante</label>
							<select v-model="editingBien.resguardante" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
								<option>Juan Pérez</option>
								<option>María García</option>
								<option>Carlos López</option>
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
							<select v-model="editingBien.estado" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
								<option>Bueno</option>
								<option>Regular</option>
								<option>Malo</option>
							</select>
						</div>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showEditBienModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
					<button @click="saveEditBien" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
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
					<p class="text-gray-600 dark:text-gray-400">Selecciona el formato del reporte:</p>
					<div class="space-y-2">
						<button class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">📊 Exportar a PDF</button>
						<button class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">📋 Exportar a Excel</button>
						<button class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">🖨️ Imprimir</button>
					</div>
				</div>
				<div class="border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showReportModal = false" class="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
				</div>
			</div>
		</div>

		<!-- View Details Modal -->
		<div v-if="showDetailsBienModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalles del Bien</h2>
					<button @click="showDetailsBienModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div v-if="selectedBienDetails" class="p-6 space-y-6">
					<!-- Asset Information Section -->
					<div v-if="showLoadingSettings" class="text-center text-gray-600 dark:text-gray-400">Cargando configuración...</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Left Column: Basic Info -->
						<div class="space-y-4">
							<div>
								<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Información del Bien</h3>
								<div class="space-y-2 text-sm">
									<div v-if="assetInfoSettings.imagen" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Clave de bien:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.serie }}</span>
									</div>
									<div v-if="assetInfoSettings.area" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Área:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.area }}</span>
									</div>
									<div v-if="assetInfoSettings.numeroSerie" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Número de serie:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.serie }}</span>
									</div>
									<div v-if="assetInfoSettings.categoria" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Categoría:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.categoria }}</span>
									</div>
									<div v-if="assetInfoSettings.modelo" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Modelo:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.modelo }}</span>
									</div>
									<div v-if="assetInfoSettings.marca" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Marca:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.marca }}</span>
									</div>
									<div v-if="assetInfoSettings.fechaAdquisicion" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Fecha de adquisición:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.fechaAdquisicion }}</span>
									</div>
									<div v-if="assetInfoSettings.valor" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Valor del bien:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.valor }}</span>
									</div>
									<div v-if="assetInfoSettings.documentoSoporte" class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Documento soporte:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.documentoSoporte }}</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Right Column: Status Info -->
						<div class="space-y-4">
							<div>
								<div class="flex items-center justify-between mb-4">
									<h3 class="text-sm font-semibold text-gray-900 dark:text-white">Estado del Bien</h3>
									<span :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold', selectedBienDetails.estado === 'Bueno' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : selectedBienDetails.estado === 'Regular' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200']">
										{{ selectedBienDetails.estado }}
									</span>
								</div>
								<div v-if="assetInfoSettings.resguardante" class="space-y-2 text-sm">
									<div class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Resguardante:</span>
										<span class="text-gray-900 dark:text-white font-medium">{{ selectedBienDetails.resguardante }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Maintenance History Section -->
					<div v-if="assetInfoSettings.historialMantenimiento" class="border-t border-gray-200 dark:border-gray-700 pt-6">
						<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Historial de Mantenimiento</h3>
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-x-auto">
							<table class="w-full text-xs">
								<thead class="bg-gray-100 dark:bg-gray-700">
									<tr>
										<th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-medium">Fecha de mantenimiento</th>
										<th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-medium">Responsable del mantenimiento</th>
										<th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-medium">Estado del mantenimiento</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
									<tr v-for="(mant, index) in selectedBienDetails.historialMantenimiento" :key="index" class="hover:bg-gray-100 dark:hover:bg-gray-600">
										<td class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ mant.fecha }}</td>
										<td class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ mant.responsable }}</td>
										<td class="px-4 py-2">
											<span class="inline-block px-2 py-1 rounded text-xs font-semibold" :class="mant.estado === 'Finalizado' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'">
												{{ mant.estado }}
											</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Locations Registry Section -->
					<div v-if="assetInfoSettings.ubicacionesRegistradas" class="border-t border-gray-200 dark:border-gray-700 pt-6">
						<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Ubicaciones Registradas</h3>
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-x-auto">
							<table class="w-full text-xs">
								<thead class="bg-gray-100 dark:bg-gray-700">
									<tr>
										<th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-medium">Fecha de registro</th>
										<th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-medium">Ubicación</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
									<tr v-for="(ubicacion, index) in selectedBienDetails.ubicacionesRegistradas" :key="index" class="hover:bg-gray-100 dark:hover:bg-gray-600">
										<td class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ ubicacion.fecha }}</td>
										<td class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ ubicacion.ubicacion }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="generateBienReport" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2zm2-6a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
						Reporte
					</button>
					<button @click="showDetailsBienModal = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
				</div>
			</div>
		</div>

		<!-- Property Details Report Modal -->
		<div v-if="showDetailsBienReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Generar Reporte</h2>
					<button @click="showDetailsBienReportModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
				</div>
				<div class="p-6 space-y-4">
					<p class="text-gray-600 dark:text-gray-400">Selecciona el formato para el reporte del bien:</p>
					<div class="space-y-2">
						<button @click="exportBienToPDF" class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
							</svg>
							📊 Exportar a PDF
						</button>
						<button @click="exportBienToExcel" class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
							</svg>
							📋 Exportar a Excel
						</button>
						<button @click="printBienReport" class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2zm2-6a2 2 0 11-4 0 2 2 0 014 0z"></path>
							</svg>
							🖨️ Imprimir
						</button>
					</div>
				</div>
				<div class="border-t border-gray-300 dark:border-gray-600 p-6">
					<button @click="showDetailsBienReportModal = false" class="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cerrar</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showNewBienModal = ref(false)
const showEditBienModal = ref(false)
const showReportModal = ref(false)
const showDetailsBienModal = ref(false)
const showDetailsBienReportModal = ref(false)
const editingIndex = ref(null)
const selectedBienDetails = ref(null)
const searchTerm = ref('')
const filterArea = ref('')
const filterCategory = ref('')
const assetInfoSettings = ref({
	imagen: true,
	marca: true,
	modelo: true,
	numeroSerie: true,
	categoria: true,
	area: true,
	resguardante: true,
	fechaAdquisicion: true,
	valor: true,
	documentoSoporte: true,
	historialMantenimiento: true,
	ubicacionesRegistradas: true,
})
const showLoadingSettings = ref(false)

// Load asset info settings from localStorage
const loadAssetInfoSettings = () => {
	const saved = localStorage.getItem('assetInfoFields')
	if (saved) {
		assetInfoSettings.value = JSON.parse(saved)
	}
}

const bienes = ref([
	{
		serie: 'ABC123456',
		modelo: 'OptiPlex 7090',
		marca: 'Dell',
		area: 'Sistemas',
		resguardante: 'Juan Pérez',
		estado: 'Bueno',
		categoria: 'Equipo de computo',
		fechaAdquisicion: '23/01/2025',
		valor: '$8,500 MXN',
		documentoSoporte: 'Factura',
		historialMantenimiento: [
			{ fecha: '15/02/2025', responsable: 'John Doe', estado: 'Finalizado' },
			{ fecha: '17/02/2025', responsable: 'John Doe', estado: 'Finalizado' },
			{ fecha: '22/02/2025', responsable: 'John Doe', estado: 'Finalizado' },
			{ fecha: '01/04/2025', responsable: 'Juan Doe', estado: 'En Curso' },
		],
		ubicacionesRegistradas: [
			{ fecha: '15/02/2025', ubicacion: 'Edificio P' },
			{ fecha: '17/02/2025', ubicacion: 'Laboratorio de computo' },
			{ fecha: '22/02/2025', ubicacion: 'Edificio P' },
			{ fecha: '01/04/2025', ubicacion: 'Laboratorio de computo', actualmenteLocalizacion: true },
		]
	},
	{
		serie: 'XYZ789012',
		modelo: 'ThinkPad E15',
		marca: 'Lenovo',
		area: 'RR.HH',
		resguardante: 'María García',
		estado: 'Regular',
		categoria: 'Equipo de computo',
		fechaAdquisicion: '15/03/2024',
		valor: '$12,000 MXN',
		documentoSoporte: 'Factura',
		historialMantenimiento: [
			{ fecha: '10/02/2025', responsable: 'John Doe', estado: 'Finalizado' },
			{ fecha: '25/02/2025', responsable: 'John Doe', estado: 'Finalizado' },
		],
		ubicacionesRegistradas: [
			{ fecha: '10/02/2025', ubicacion: 'Edificio A' },
			{ fecha: '25/02/2025', ubicacion: 'Edificio B', actualmenteLocalizacion: true },
		]
	},
])

const editingBien = ref({
	serie: '', modelo: '', marca: '', area: '', resguardante: '', estado: ''
})

const filteredBienes = computed(() => {
	return bienes.value.filter(bien => {
		const matchSearch = !searchTerm.value ||
			bien.serie.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
			bien.modelo.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
			bien.marca.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
			bien.area.toLowerCase().includes(searchTerm.value.toLowerCase())

		const matchArea = !filterArea.value || bien.area === filterArea.value
		const matchCategory = !filterCategory.value || bien.categoria === filterCategory.value

		return matchSearch && matchArea && matchCategory
	})
})

const viewBienDetails = (index) => {
	loadAssetInfoSettings()
	selectedBienDetails.value = { ...bienes.value[index] }
	showDetailsBienModal.value = true
}

const generateBienReport = () => {
	showDetailsBienReportModal.value = true
}

const exportBienToPDF = () => {
	if (selectedBienDetails.value) {
		const reportContent = generateReportContent(selectedBienDetails.value)
		console.log('Generando PDF:', reportContent)
		alert('Reporte PDF generado para: ' + selectedBienDetails.value.serie)
		showDetailsBienReportModal.value = false
	}
}

const exportBienToExcel = () => {
	if (selectedBienDetails.value) {
		const reportContent = generateReportContent(selectedBienDetails.value)
		console.log('Generando Excel:', reportContent)
		alert('Reporte Excel generado para: ' + selectedBienDetails.value.serie)
		showDetailsBienReportModal.value = false
	}
}

const printBienReport = () => {
	if (selectedBienDetails.value) {
		const reportContent = generateReportContent(selectedBienDetails.value)
		console.log('Imprimiendo reporte:', reportContent)
		window.print()
		showDetailsBienReportModal.value = false
	}
}

const generateReportContent = (bien) => {
	return {
		titulo: 'Reporte de Bien',
		bien: bien,
		fecha: new Date().toLocaleDateString('es-ES'),
		incluye: [
			'Información del bien',
			'Estado actual',
			'Historial de mantenimiento',
			'Ubicaciones registradas'
		]
	}
}

const editBien = (index) => {
	editingIndex.value = index
	editingBien.value = { ...bienes.value[index] }
	showEditBienModal.value = true
}

const saveEditBien = () => {
	if (editingIndex.value !== null) {
		bienes.value[editingIndex.value] = { ...editingBien.value }
		showEditBienModal.value = false
	}
}

const deleteBien = (index) => {
	if (confirm('¿Estás seguro de que quieres eliminar este bien?')) {
		bienes.value.splice(index, 1)
	}
}

const saveNewBien = () => {
	showNewBienModal.value = false
}
</script>
