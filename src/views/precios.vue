<template>
	<div>
		<!-- Hero Section -->
		<section class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 py-16 px-4 transition-colors duration-300">
			<div class="max-w-7xl mx-auto text-center">
				<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 font-audiowide">
					PRECIOS
				</h1>
				<h2 class="text-lg md:text-2xl lg:text-3xl text-blue-600 dark:text-blue-400 font-semibold">RAFH System</h2>
			</div>
		</section>

		<!-- Pricing Section -->
		<section class="py-16 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
			<div class="max-w-7xl mx-auto">
				<h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Nuestros Planes</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<!-- Basic Plan -->
					<div class="bg-gray-800 dark:bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-700">
						<div class="p-8">
							<h3 class="text-2xl font-bold mb-2">Básico</h3>
							<div class="mb-6">
								<span class="text-4xl font-bold">$999</span>
								<span class="text-gray-400">/mes</span>
							</div>
							
							<ul class="space-y-3 mb-8">
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Gestión básica de inventario</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Hasta 1000 registros</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Soporte por email</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Reportes básicos</span>
								</li>
							</ul>
							
							<button class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300">
								Seleccionar Plan
							</button>
						</div>
					</div>

					<!-- Professional Plan (Featured) -->
					<div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 md:scale-105 border border-blue-500">
						<div class="bg-blue-500 px-4 py-2 text-center font-semibold text-sm">Más Popular</div>
						<div class="p-8">
							<h3 class="text-2xl font-bold mb-2">Profesional</h3>
							<div class="mb-6">
								<span class="text-4xl font-bold">$1,999</span>
								<span class="text-blue-100">/mes</span>
							</div>
							
							<ul class="space-y-3 mb-8">
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Todo lo del plan Básico</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Hasta 5000 registros</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Soporte prioritario 24/7</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Reportes avanzados</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>API access</span>
								</li>
							</ul>
							
							<button class="w-full px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors duration-300">
								Seleccionar Plan
							</button>
						</div>
					</div>

					<!-- Enterprise Plan -->
					<div class="bg-gray-800 dark:bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-700">
						<div class="p-8">
							<h3 class="text-2xl font-bold mb-2">Enterprise</h3>
							<div class="mb-6">
								<span class="text-4xl font-bold">$3,999</span>
								<span class="text-gray-400">/mes</span>
							</div>
							
							<ul class="space-y-3 mb-8">
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Todo lo del plan Profesional</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Registros ilimitados</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Soporte dedicado</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Personalización completa</span>
								</li>
								<li class="flex items-center space-x-3">
									<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
									<span>Implementación guiada</span>
								</li>
							</ul>
							
							<button class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300">
								Contactar Ventas
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
</script>
