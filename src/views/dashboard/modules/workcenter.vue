<template>
	<div class="space-y-6">
		<!-- Institution Header with Logo -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<div class="flex items-center justify-center gap-6">
				<img src="/images/logoEscuela.png" alt="Institution Logo" class="w-20 h-20 rounded-lg object-cover">
				<div class="text-center flex-1">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Instituto Tecnológico de Chetumal</h1>
					<p class="text-gray-600 dark:text-gray-400 mt-1">Centro de Trabajo Principal</p>
				</div>
			</div>
		</div>

		<!-- Stats Section -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 border border-blue-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Bienes registrados</p>
						<p class="text-4xl font-bold text-gray-900 dark:text-white mt-2">5,642</p>
					</div>
					<button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</button>
				</div>
			</div>

			<div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 border border-blue-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Gestores asignados</p>
						<p class="text-4xl font-bold text-gray-900 dark:text-white mt-2">10</p>
					</div>
					<button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</button>
				</div>
			</div>

			<div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 border border-blue-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Resguardantes registrados</p>
						<p class="text-4xl font-bold text-gray-900 dark:text-white mt-2">532</p>
					</div>
					<button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Configuration Section -->
		<div class="bg-gray-900 dark:bg-gray-800 rounded-lg border border-gray-700 dark:border-gray-600 p-6 space-y-3">
			<div class="flex items-center gap-3 mb-4">
				<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
				</svg>
				<h3 class="text-lg font-bold text-white">Configuración de los bienes</h3>
			</div>

			<button 
				@click="showCategoriesModal = true"
				class="w-full px-4 py-3 text-left text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between group"
			>
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4 text-gray-500 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
					</svg>
					Categorías de los bienes registrados
				</span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</button>

			<button 
				@click="showInformationModal = true"
				class="w-full px-4 py-3 text-left text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between group"
			>
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4 text-gray-500 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					Información de los bienes
				</span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</button>

			<button 
				@click="showKeysModal = true"
				class="w-full px-4 py-3 text-left text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between group"
			>
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4 text-gray-500 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
					</svg>
					Claves de identificación de los bienes
				</span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</button>
		</div>

		<!-- Permissions and Users Section -->
		<div class="bg-gray-900 dark:bg-gray-800 rounded-lg border border-gray-700 dark:border-gray-600 p-6 space-y-3">
			<div class="flex items-center gap-3 mb-4">
				<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
				</svg>
				<h3 class="text-lg font-bold text-white">Permisos y usuarios</h3>
			</div>

			<button 
				@click="showRolesModal = true"
				class="w-full px-4 py-3 text-left text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between group"
			>
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4 text-gray-500 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
					</svg>
					Roles y permisos
				</span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</button>

			<button 
				@click="showTransferPoliciesModal = true"
				class="w-full px-4 py-3 text-left text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between group"
			>
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4 text-gray-500 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3v.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
					</svg>
					Políticas de transferencias
				</span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</button>
		</div>

		<!-- Areas Configuration Section -->
		<div class="bg-gray-900 dark:bg-gray-800 rounded-lg border border-gray-700 dark:border-gray-600 p-6 space-y-3">
			<div class="flex items-center gap-3 mb-4">
				<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>
				<h3 class="text-lg font-bold text-white">Configuración de áreas</h3>
			</div>

			<button 
				@click="showAreasModal = true"
				class="w-full px-4 py-3 text-left text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between group"
			>
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4 text-gray-500 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					Información de las áreas
				</span>
				<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</button>
		</div>

		<!-- Modals -->

		<!-- Categories Modal -->
		<div v-if="showCategoriesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
				<div class="sticky top-0 flex items-center justify-between border-b border-gray-700 dark:border-gray-600 p-6 bg-gray-900">
					<h2 class="text-xl font-bold text-white">Categorías de los bienes registrados</h2>
					<button @click="showCategoriesModal = false" class="text-gray-400 hover:text-gray-300 text-2xl transition">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<!-- Add New Item -->
					<div class="flex gap-2 mb-4">
						<input 
							v-model="newCategoryName"
							type="text" 
							placeholder="Nueva Categoría" 
							class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
						/>
						<button 
							@click="addCategory"
							class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
						>
							Añadir
						</button>
						<button 
							@click="categoryToggle = !categoryToggle"
							:class="['px-4 py-2 rounded-lg transition-colors', categoryToggle ? 'bg-blue-600' : 'bg-gray-700']"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="2"/>
								<circle cx="19" cy="12" r="2"/>
								<circle cx="5" cy="12" r="2"/>
							</svg>
						</button>
					</div>

					<!-- Categories Table -->
					<div class="border border-gray-700 rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-gray-800 border-b border-gray-700">
								<tr>
									<th class="px-4 py-3 text-left text-white font-semibold">Categoría</th>
									<th class="px-4 py-3 text-right text-white font-semibold">Acciones</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-700">
								<tr v-for="(category, index) in categories" :key="index" class="hover:bg-gray-700/50 transition">
									<td class="px-4 py-3 text-gray-300">{{ category }}</td>
									<td class="px-4 py-3 text-right flex justify-end gap-2">
										<button 
											@click="editCategory(index)"
											class="p-2 text-gray-400 hover:text-blue-400 transition"
											title="Editar"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
											</svg>
										</button>
										<button 
											@click="deleteCategory(index)"
											class="p-2 text-gray-400 hover:text-red-400 transition"
											title="Eliminar"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
											</svg>
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end bg-gray-900/50">
					<button 
						@click="showCategoriesModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button 
						@click="showCategoriesModal = false"
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>

		<!-- Edit Category Modal -->
		<div v-if="showEditCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-700 p-6">
					<h2 class="text-xl font-bold text-white">Editar Categoría</h2>
					<button @click="showEditCategoryModal = false" class="text-gray-400 hover:text-gray-300 text-2xl">&times;</button>
				</div>

				<div class="p-6">
					<input 
						v-model="editingCategory"
						type="text"
						class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
					/>
				</div>

				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end">
					<button 
						@click="showEditCategoryModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button 
						@click="saveCategory"
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
					>
						Guardar
					</button>
				</div>
			</div>
		</div>

		<!-- Keys Modal -->
		<div v-if="showKeysModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-96 overflow-y-auto">
				<div class="sticky top-0 flex items-center justify-between border-b border-gray-700 dark:border-gray-600 p-6 bg-gray-900">
					<h2 class="text-xl font-bold text-white">Claves de identificación de los bienes</h2>
					<button @click="showKeysModal = false" class="text-gray-400 hover:text-gray-300 text-2xl transition">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<!-- Add New Item -->
					<div class="flex gap-2 mb-4">
						<input 
							v-model="newKeyName"
							type="text" 
							placeholder="Nueva clave" 
							class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
						/>
						<button 
							@click="addKey"
							class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
						>
							Añadir
						</button>
					</div>

					<!-- Keys Table -->
					<div class="border border-gray-700 rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-gray-800 border-b border-gray-700">
								<tr>
									<th class="px-4 py-3 text-left text-white font-semibold">Nombre</th>
									<th class="px-4 py-3 text-left text-white font-semibold">Clave</th>
									<th class="px-4 py-3 text-right text-white font-semibold">Acciones</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-700">
								<tr v-for="(key, index) in identificationKeys" :key="index" class="hover:bg-gray-700/50 transition">
									<td class="px-4 py-3 text-gray-300">{{ key.name }}</td>
									<td class="px-4 py-3 text-gray-400 font-mono text-sm">{{ key.value }}</td>
									<td class="px-4 py-3 text-right flex justify-end gap-2">
										<button 
											@click="editKey(index)"
											class="p-2 text-gray-400 hover:text-blue-400 transition"
											title="Editar"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
											</svg>
										</button>
										<button 
											@click="deleteKey(index)"
											class="p-2 text-gray-400 hover:text-red-400 transition"
											title="Eliminar"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
											</svg>
										</button>
										<button 
											@click="toggleKeyActive(index)"
											:class="['p-2 rounded transition', identificationKeys[index].active ? 'bg-blue-600 text-blue-300' : 'bg-gray-700 text-gray-400']"
											title="Alternar estado"
										>
											<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
												<circle cx="12" cy="12" r="2"/>
											</svg>
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end bg-gray-900/50">
					<button 
						@click="showKeysModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button 
						@click="showKeysModal = false"
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>

		<!-- Edit Key Modal -->
		<div v-if="showEditKeyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-700 p-6">
					<h2 class="text-xl font-bold text-white">Editar Clave</h2>
					<button @click="showEditKeyModal = false" class="text-gray-400 hover:text-gray-300 text-2xl">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<div>
						<label class="block text-gray-300 text-sm font-medium mb-2">Nombre</label>
						<input 
							v-model="editingKeyName"
							type="text"
							class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
						/>
					</div>
					<div>
						<label class="block text-gray-300 text-sm font-medium mb-2">Clave</label>
						<input 
							v-model="editingKeyValue"
							type="text"
							class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
						/>
					</div>
				</div>

				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end">
					<button 
						@click="showEditKeyModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button 
						@click="saveKey"
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
					>
						Guardar
					</button>
				</div>
			</div>
		</div>

		<!-- Roles Modal -->
		<div v-if="showRolesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-5xl w-full my-8">
				<div class="flex items-center justify-between border-b border-gray-700 dark:border-gray-600 p-6">
					<h2 class="text-xl font-bold text-white">Centro de trabajo — Roles y permiso</h2>
					<button @click="showRolesModal = false" class="text-gray-400 hover:text-gray-300 text-2xl transition">&times;</button>
				</div>

				<div class="p-6">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<!-- Left Column - Roles -->
						<div class="space-y-6">
							<!-- Managers Roles -->
							<div>
								<button 
									@click="showNewRoleForm = !showNewRoleForm"
									class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-semibold mb-4"
								>
									Nuevo rol
								</button>

								<h4 class="text-white font-semibold mb-3">Roles para gestores</h4>
								<div class="space-y-2 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
									<div v-for="(role, index) in managerRoles" :key="role" class="flex items-center justify-between py-2">
										<span class="text-gray-300">{{ role }}</span>
										<div class="flex gap-2">
											<button 
												@click="editRole('manager', index)"
												class="p-1.5 text-gray-400 hover:text-blue-400 transition"
												title="Editar"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
												</svg>
											</button>
											<button 
												@click="deleteRole('manager', index)"
												class="p-1.5 text-gray-400 hover:text-red-400 transition"
												title="Eliminar"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>

							<!-- Custodian Roles -->
							<div>
								<h4 class="text-white font-semibold mb-3">Roles para resguardantes</h4>
								<div class="space-y-2 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
									<div v-for="(role, index) in custodianRoles" :key="role" class="flex items-center justify-between py-2">
										<span class="text-gray-300">{{ role }}</span>
										<div class="flex gap-2">
											<button 
												@click="editRole('custodian', index)"
												class="p-1.5 text-gray-400 hover:text-blue-400 transition"
												title="Editar"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
												</svg>
											</button>
											<button 
												@click="deleteRole('custodian', index)"
												class="p-1.5 text-gray-400 hover:text-red-400 transition"
												title="Eliminar"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Right Column - Privileges -->
						<div class="space-y-4">
							<h4 class="text-white font-semibold">Privilegios de administrador</h4>
							<p class="text-sm text-gray-400">Otorga todos los permisos de administrador al usuario seleccionado. A excepción de la gestión del centro de trabajo al que esta asignado</p>

							<label class="flex items-center gap-3 cursor-pointer">
								<input 
									type="checkbox" 
									v-model="adminPrivileges.adminView"
									class="w-5 h-5"
								/>
								<span class="text-gray-300">Visualización de auditoría</span>
								<svg class="w-4 h-4 text-gray-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</label>

							<p class="text-xs text-gray-500">El usuario tendrá acceso a todo el registro de auditoría que se lleve hasta el momento. Sin embargo, no podrá configurar los parámetros del mismo.</p>

							<div class="border-t border-gray-700 pt-4">
								<label class="flex items-center gap-3 cursor-pointer">
									<input 
										type="checkbox" 
										v-model="adminPrivileges.assetsView"
										class="w-5 h-5"
									/>
									<span class="text-gray-300">Visualización de bienes del área</span>
								</label>

								<p class="text-xs text-gray-500 mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis alias</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end bg-gray-900/50">
					<button 
						@click="showRolesModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button 
						@click="showRolesModal = false"
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>

		<!-- Edit Role Modal -->
		<div v-if="showEditRoleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
				<div class="flex items-center justify-between border-b border-gray-700 p-6">
					<h2 class="text-xl font-bold text-white">Editar Rol</h2>
					<button @click="showEditRoleModal = false" class="text-gray-400 hover:text-gray-300 text-2xl">&times;</button>
				</div>

				<div class="p-6">
					<input 
						v-model="editingRoleName"
						type="text"
						class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
					/>
				</div>

				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end">
					<button 
						@click="showEditRoleModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button 
						@click="saveRole"
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
					>
						Guardar
					</button>
				</div>
			</div>
		</div>

		<!-- Transfer Policies Modal -->
		<div v-if="showTransferPoliciesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full">
				<div class="flex items-center justify-between border-b border-gray-700 dark:border-gray-600 p-6">
					<h2 class="text-xl font-bold text-white">Políticas de transferencias</h2>
					<button @click="showTransferPoliciesModal = false" class="text-gray-400 hover:text-gray-300 text-2xl transition">&times;</button>
				</div>

				<div class="p-6 space-y-6">
					<!-- By Authorization -->
					<div class="flex items-center justify-between">
						<div>
							<h4 class="text-white font-semibold">Por autorización</h4>
							<p class="text-sm text-gray-400 mt-1">Requiere aprobación antes de completar transferencias</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer">
							<input 
								type="checkbox" 
								v-model="transferPolicies.byAuthorization"
								class="sr-only peer"
							/>
							<div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
					</div>

					<!-- By Notification -->
					<div class="flex items-center justify-between">
						<div>
							<h4 class="text-white font-semibold">Por notificación</h4>
							<p class="text-sm text-gray-400 mt-1">Se notifica pero no requiere autorización</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer">
							<input 
								type="checkbox" 
								v-model="transferPolicies.byNotification"
								class="sr-only peer"
							/>
							<div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end bg-gray-900/50">
					<button 
						@click="showTransferPoliciesModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button 
						@click="showTransferPoliciesModal = false"
						class="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-semibold"
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>

		<!-- Information Modal -->
		<div v-if="showInformationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
				<div class="flex items-center justify-between border-b border-gray-700 dark:border-gray-600 p-6">
					<h2 class="text-xl font-bold text-white">Información de los bienes</h2>
					<button @click="showInformationModal = false" class="text-gray-400 hover:text-gray-300 text-2xl transition">&times;</button>
				</div>

				<div class="p-6 space-y-4">
					<p class="text-gray-300 text-sm">Selecciona qué información mostrar en los detalles de los bienes:</p>

					<div class="space-y-3 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.imagen"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Imagen del bien</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.marca"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Marca del bien</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.modelo"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Modelo del bien</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.numeroSerie"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Número de serie</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.categoria"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Categoría</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.area"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Área</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.resguardante"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Resguardante</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.fechaAdquisicion"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Fecha de adquisición</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.valor"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Valor del bien</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.documentoSoporte"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Documento soporte</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.historialMantenimiento"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Historial de Mantenimiento</span>
						</label>

						<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition">
							<input
								v-model="assetInfoFields.ubicacionesRegistradas"
								type="checkbox"
								class="w-5 h-5 accent-blue-600 rounded"
							/>
							<span class="text-gray-300">Ubicaciones Registradas</span>
						</label>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end bg-gray-900/50">
					<button
						@click="showInformationModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button
						@click="saveAssetInfoSettings"
						class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>

		<!-- Areas Modal -->
		<div v-if="showAreasModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full">
				<div class="flex items-center justify-between border-b border-gray-700 dark:border-gray-600 p-6">
					<h2 class="text-xl font-bold text-white">Información de las áreas</h2>
					<button @click="showAreasModal = false" class="text-gray-400 hover:text-gray-300 text-2xl transition">&times;</button>
				</div>

				<div class="p-6">
					<input 
						type="text"
						placeholder="Búsqueda de áreas..."
						class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition mb-4"
					/>
					<div class="space-y-2">
						<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer">
							<span class="text-gray-300">Área Administrativa</span>
							<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</div>
						<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer">
							<span class="text-gray-300">Área Académica</span>
							<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</div>
						<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer">
							<span class="text-gray-300">Área de Servicios</span>
							<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="border-t border-gray-700 p-6 flex gap-3 justify-end bg-gray-900/50">
					<button 
						@click="showAreasModal = false"
						class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
					>
						Cancelar
					</button>
					<button 
						@click="showAreasModal = false"
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

// Modal states
const showCategoriesModal = ref(false)
const showEditCategoryModal = ref(false)
const showKeysModal = ref(false)
const showEditKeyModal = ref(false)
const showRolesModal = ref(false)
const showEditRoleModal = ref(false)
const showTransferPoliciesModal = ref(false)
const showInformationModal = ref(false)
const showAreasModal = ref(false)
const showNewRoleForm = ref(false)

// Categories data
const categories = ref(['Mueble de oficina', 'Equipo de computo', 'Jardinería'])
const newCategoryName = ref('')
const categoryToggle = ref(false)
const editingCategoryIndex = ref(null)
const editingCategory = ref('')

// Keys data
const identificationKeys = ref([
	{ name: 'Primera clave', value: 'xxxx-xxxx-xxxx', active: true },
	{ name: 'Segunda clave', value: 'xxxx-xxxx-xxxx', active: true },
	{ name: 'Tercera clave clave', value: 'xxxx-xxxx-xxxx', active: false },
])
const newKeyName = ref('')
const editingKeyIndex = ref(null)
const editingKeyName = ref('')
const editingKeyValue = ref('')

// Roles data
const managerRoles = ref(['Gestor', 'Administrador', 'Gestor Global'])
const custodianRoles = ref(['Docente', 'Jefe de...'])
const editingRoleType = ref('')
const editingRoleIndex = ref(null)
const editingRoleName = ref('')

// Privileges
const adminPrivileges = ref({
	adminView: true,
	assetsView: true,
})

// Transfer policies
const transferPolicies = ref({
	byAuthorization: true,
	byNotification: true,
})

// Asset information fields visibility settings
const assetInfoFields = ref({
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

// Load asset info settings from localStorage on component mount
const loadAssetInfoSettings = () => {
	const saved = localStorage.getItem('assetInfoFields')
	if (saved) {
		assetInfoFields.value = JSON.parse(saved)
	}
}

// Save asset info settings to localStorage
const saveAssetInfoSettings = () => {
	localStorage.setItem('assetInfoFields', JSON.stringify(assetInfoFields.value))
	showInformationModal.value = false
}

// Initialize on mount
loadAssetInfoSettings()

// Category methods
const addCategory = () => {
	if (newCategoryName.value.trim()) {
		categories.value.push(newCategoryName.value)
		newCategoryName.value = ''
	}
}

const editCategory = (index) => {
	editingCategoryIndex.value = index
	editingCategory.value = categories.value[index]
	showEditCategoryModal.value = true
}

const saveCategory = () => {
	if (editingCategory.value.trim() && editingCategoryIndex.value !== null) {
		categories.value[editingCategoryIndex.value] = editingCategory.value
		showEditCategoryModal.value = false
		editingCategoryIndex.value = null
		editingCategory.value = ''
	}
}

const deleteCategory = (index) => {
	categories.value.splice(index, 1)
}

// Key methods
const addKey = () => {
	if (newKeyName.value.trim()) {
		identificationKeys.value.push({
			name: newKeyName.value,
			value: 'xxxx-xxxx-xxxx',
			active: true,
		})
		newKeyName.value = ''
	}
}

const editKey = (index) => {
	editingKeyIndex.value = index
	editingKeyName.value = identificationKeys.value[index].name
	editingKeyValue.value = identificationKeys.value[index].value
	showEditKeyModal.value = true
}

const saveKey = () => {
	if (editingKeyName.value.trim() && editingKeyIndex.value !== null) {
		identificationKeys.value[editingKeyIndex.value].name = editingKeyName.value
		identificationKeys.value[editingKeyIndex.value].value = editingKeyValue.value
		showEditKeyModal.value = false
		editingKeyIndex.value = null
		editingKeyName.value = ''
		editingKeyValue.value = ''
	}
}

const deleteKey = (index) => {
	identificationKeys.value.splice(index, 1)
}

const toggleKeyActive = (index) => {
	identificationKeys.value[index].active = !identificationKeys.value[index].active
}

// Role methods
const editRole = (type, index) => {
	editingRoleType.value = type
	editingRoleIndex.value = index
	if (type === 'manager') {
		editingRoleName.value = managerRoles.value[index]
	} else {
		editingRoleName.value = custodianRoles.value[index]
	}
	showEditRoleModal.value = true
}

const saveRole = () => {
	if (editingRoleName.value.trim() && editingRoleIndex.value !== null) {
		if (editingRoleType.value === 'manager') {
			managerRoles.value[editingRoleIndex.value] = editingRoleName.value
		} else {
			custodianRoles.value[editingRoleIndex.value] = editingRoleName.value
		}
		showEditRoleModal.value = false
		editingRoleType.value = ''
		editingRoleIndex.value = null
		editingRoleName.value = ''
	}
}

const deleteRole = (type, index) => {
	if (type === 'manager') {
		managerRoles.value.splice(index, 1)
	} else {
		custodianRoles.value.splice(index, 1)
	}
}
</script>
