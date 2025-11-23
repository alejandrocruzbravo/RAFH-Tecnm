<template>
	<div>
		<!-- Hero Section -->
		<section class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 py-16 px-4 transition-colors duration-300">
			<div class="max-w-7xl mx-auto text-center">
				<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 font-audiowide">
					CONTÁCTANOS
				</h1>
				<h2 class="text-lg md:text-2xl lg:text-3xl text-blue-600 dark:text-blue-400 font-semibold">RAFH System</h2>
			</div>
		</section>

		<!-- Contact Section -->
		<section class="py-16 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
			<div class="max-w-7xl mx-auto">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Left Content -->
					<div class="lg:col-span-2">
						<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ponte en Contacto</h1>
						<p class="text-lg text-gray-700 dark:text-gray-300 mb-8">
							¿Tienes alguna pregunta o necesitas ayuda? No dudes en contactarnos. Estamos aquí para ayudarte.
						</p>

						<!-- Social Media Links -->
						<div class="flex justify-center lg:justify-start space-x-6 mt-8">
							<a href="#" class="text-gray-400 hover:text-blue-500 transition-colors duration-300">
								<img src="/icons/whatsapp.png" alt="WhatsApp" class="w-8 h-8 hover:scale-110 transition-transform">
							</a>
							<a href="#" class="text-gray-400 hover:text-blue-500 transition-colors duration-300">
								<img src="/icons/twitter.png" alt="Twitter" class="w-8 h-8 hover:scale-110 transition-transform">
							</a>
							<a href="#" class="text-gray-400 hover:text-blue-500 transition-colors duration-300">
								<img src="/icons/youtube.png" alt="YouTube" class="w-8 h-8 hover:scale-110 transition-transform">
							</a>
						</div>
					</div>

					<!-- Contact Form -->
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
						<form @submit.prevent="handleSubmit" class="space-y-6">
							<!-- Name Field -->
							<div>
								<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
								<input
									id="name"
									v-model="formData.name"
									type="text"
									placeholder="Ingresa tu nombre"
									class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
								>
							</div>

							<!-- Email Field -->
							<div>
								<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
								<input
									id="email"
									v-model="formData.email"
									type="email"
									placeholder="tu@email.com"
									class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
								>
							</div>

							<!-- Message Field -->
							<div>
								<label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensaje</label>
								<textarea
									id="message"
									v-model="formData.message"
									placeholder="Escribe tu mensaje aquí"
									rows="5"
									class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-300"
								></textarea>
							</div>

							<!-- Submit Button -->
							<button
								type="submit"
								class="w-full px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300 font-semibold"
							>
								Enviar Mensaje
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
	name: '',
	email: '',
	message: ''
})

const handleSubmit = () => {
	console.log('Form submitted:', formData)
	// Add your form submission logic here
	formData.name = ''
	formData.email = ''
	formData.message = ''
}
</script>
