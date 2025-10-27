<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Usuarios Resguardantes</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
			<form class="flex gap-2">
				<input type="text" placeholder="Buscar usuario" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
				<button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Buscar</button>
			</form>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Correo</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Área</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Bienes Asignados</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">Juan Pérez</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">juan@example.com</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">Sistemas</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">5</td>
						<td class="px-4 py-3 flex gap-2">
							<button class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							</button>
							<button class="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
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
</template>

<script setup>
</script>
