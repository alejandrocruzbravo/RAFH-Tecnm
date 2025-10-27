<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Detalles del Bien</label>
			<button class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">Volver</button>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de serie</label>
					<p class="text-lg text-gray-900 dark:text-white font-semibold">ABC123456</p>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modelo</label>
					<p class="text-lg text-gray-900 dark:text-white font-semibold">OptiPlex 7090</p>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marca</label>
					<p class="text-lg text-gray-900 dark:text-white font-semibold">Dell</p>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
					<p class="text-lg text-gray-900 dark:text-white font-semibold">Equipo de Computo</p>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área</label>
					<p class="text-lg text-gray-900 dark:text-white font-semibold">Sistemas</p>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resguardante</label>
					<p class="text-lg text-gray-900 dark:text-white font-semibold">Juan Pérez</p>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
					<span class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">Bueno</span>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor</label>
					<p class="text-lg text-gray-900 dark:text-white font-semibold">$2,500.00</p>
				</div>
			</div>

			<div class="border-t border-gray-300 dark:border-gray-600 pt-6">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones</label>
				<p class="text-gray-600 dark:text-gray-400">En buen estado, sin daños visibles.</p>
			</div>

			<div class="mt-6 flex gap-4">
				<button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Editar</button>
				<button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">Eliminar</button>
			</div>
		</div>
	</div>
</template>

<script setup>
</script>
