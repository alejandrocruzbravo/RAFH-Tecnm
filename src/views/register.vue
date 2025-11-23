<template>
	<section class="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 transition-colors duration-300">
		<div class="w-full max-w-4xl">
			<div class="bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-2xl overflow-hidden transition-colors duration-300">
				<div class="grid grid-cols-1 md:grid-cols-2">
					<!-- Form Side -->
					<div class="p-8 md:p-10">
						<h1 class="text-3xl font-bold mb-8 font-audiowide">Registro</h1>
						
						<form @submit.prevent="handleSubmit" class="space-y-6">
							<!-- Name Field -->
							<div>
								<label for="nombre" class="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
								<input
									id="nombre"
									type="text"
									name="nombre"
									v-model="formData.nombre"
									placeholder="Tu Nombre"
									required
									class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
								>
							</div>

							<!-- Email Field -->
							<div>
								<label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
								<input
									id="email"
									type="email"
									name="email"
									v-model="formData.email"
									placeholder="Tu Email"
									required
									class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
								>
							</div>

							<!-- Password Field -->
							<div>
								<label for="contraseña" class="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
								<input
									id="contraseña"
									type="password"
									name="contraseña"
									v-model="formData.contraseña"
									placeholder="Contraseña"
									required
									class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
								>
							</div>

							<!-- Confirm Password Field -->
							<div>
								<label for="repetir_contraseña" class="block text-sm font-medium text-gray-300 mb-2">Repite tu contraseña</label>
								<input
									id="repetir_contraseña"
									type="password"
									name="repetir_contraseña"
									v-model="formData.repetir_contraseña"
									placeholder="Repite tu contraseña"
									required
									class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
								>
							</div>

							<!-- Terms Checkbox -->
							<div class="flex items-center space-x-3">
								<input
									id="terms"
									type="checkbox"
									v-model="formData.terms"
									required
									class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 cursor-pointer"
								>
								<label for="terms" class="text-sm text-gray-300">
									Acepto todos los
									<a href="#" class="text-blue-400 hover:text-blue-300 transition-colors">términos de servicio</a>
								</label>
							</div>

							<!-- Submit Button -->
							<button
								type="submit"
								class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
							>
								Registrarse
							</button>

							<!-- Login Link -->
							<div class="text-center">
								<p class="text-gray-400">
									¿Ya tienes una cuenta?
									<RouterLink to="/login" class="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
										Inicia sesión aquí
									</RouterLink>
								</p>
							</div>
						</form>
					</div>

					<!-- Image Side -->
					<div class="hidden md:flex items-center justify-center bg-gray-800 p-8">
						<img
							src="/images/form.png"
							alt="Illustration"
							class="w-full h-auto object-contain max-h-96"
						>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const formData = reactive({
	nombre: '',
	email: '',
	contraseña: '',
	repetir_contraseña: '',
	terms: false
})

const handleSubmit = () => {
	if (formData.contraseña !== formData.repetir_contraseña) {
		alert('Las contraseñas no coinciden')
		return
	}

	if (!formData.terms) {
		alert('Debes aceptar los términos de servicio')
		return
	}

	console.log('Form submitted:', {
		nombre: formData.nombre,
		email: formData.email,
		contraseña: formData.contraseña
	})

	// Reset form
	formData.nombre = ''
	formData.email = ''
	formData.contraseña = ''
	formData.repetir_contraseña = ''
	formData.terms = false

	// Redirect to login or dashboard
	router.push('/login')
}
</script>
