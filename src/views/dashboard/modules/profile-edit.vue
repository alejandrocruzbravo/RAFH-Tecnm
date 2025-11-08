<template>
	<div class="max-w-2xl mx-auto">
		<div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 md:p-8">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Editar Perfil</h1>
				<p class="text-gray-600 dark:text-gray-400">Actualiza tu información personal y contraseña</p>
			</div>

			<!-- Loading State -->
			<div v-if="isLoading" class="flex items-center justify-center py-12">
				<div class="text-center">
					<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando perfil...</p>
				</div>
			</div>

			<!-- Form -->
			<form v-else @submit.prevent="handleSubmit" class="space-y-6">
				<!-- Name Field -->
				<div>
					<label for="name" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Nombre Completo
					</label>
					<input
						id="name"
						v-model="formData.usuario_nombre"
						type="text"
						required
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
						placeholder="Ingresa tu nombre completo"
					/>
				</div>

				<!-- Email Field -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Correo Electrónico
					</label>
					<input
						id="email"
						v-model="formData.usuario_correo"
						type="email"
						required
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
						placeholder="Ingresa tu correo electrónico"
					/>
				</div>

				<!-- Divider -->
				<div class="border-t border-gray-300 dark:border-gray-600 pt-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cambiar Contraseña</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
						Deja estos campos vacíos si no deseas cambiar tu contraseña
					</p>
				</div>

				<!-- Current Password Field -->
				<div>
					<label for="currentPassword" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Contraseña Actual
					</label>
					<input
						id="currentPassword"
						v-model="passwordData.currentPassword"
						type="password"
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
						placeholder="Ingresa tu contraseña actual"
					/>
				</div>

				<!-- New Password Field -->
				<div>
					<label for="newPassword" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Nueva Contraseña
					</label>
					<input
						id="newPassword"
						v-model="passwordData.newPassword"
						type="password"
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
						placeholder="Ingresa tu nueva contraseña"
					/>
				</div>

				<!-- Confirm Password Field -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Confirmar Contraseña
					</label>
					<input
						id="confirmPassword"
						v-model="passwordData.confirmPassword"
						type="password"
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
						placeholder="Confirma tu nueva contraseña"
					/>
				</div>

				<!-- Error Message -->
				<div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
					<p class="text-red-600 dark:text-red-400 text-sm">{{ errorMessage }}</p>
				</div>

				<!-- Success Message -->
				<div v-if="successMessage" class="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
					<p class="text-green-600 dark:text-green-400 text-sm">{{ successMessage }}</p>
				</div>

				<!-- Buttons -->
				<div class="flex gap-4 pt-6">
					<button
						type="submit"
						:disabled="isSubmitting"
						class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span v-if="!isSubmitting">Guardar Cambios</span>
						<span v-else>Guardando...</span>
					</button>
					<button
						type="button"
						@click="goBack"
						class="flex-1 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 transition font-semibold"
					>
						Cancelar
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { updateUserProfile } from '../../../config/api.js'

const router = useRouter()
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
	usuario_nombre: '',
	usuario_correo: '',
})

const passwordData = ref({
	currentPassword: '',
	newPassword: '',
	confirmPassword: '',
})

onMounted(() => {
	const userData = JSON.parse(localStorage.getItem('user') || '{}')
	formData.value = {
		usuario_nombre: userData.usuario_nombre || '',
		usuario_correo: userData.usuario_correo || '',
	}
})

const goBack = () => {
	router.push('/dashboard')
}

const handleSubmit = async () => {
	// Reset messages
	errorMessage.value = ''
	successMessage.value = ''

	// Validate password fields
	if (passwordData.value.newPassword || passwordData.value.currentPassword || passwordData.value.confirmPassword) {
		if (!passwordData.value.currentPassword) {
			errorMessage.value = 'Debes proporcionar tu contraseña actual para cambiar la contraseña'
			return
		}
		if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
			errorMessage.value = 'Las nuevas contraseñas no coinciden'
			return
		}
		if (passwordData.value.newPassword.length < 6) {
			errorMessage.value = 'La nueva contraseña debe tener al menos 6 caracteres'
			return
		}
	}

	isSubmitting.value = true

	try {
		const updateData = {
			usuario_nombre: formData.value.usuario_nombre,
			usuario_correo: formData.value.usuario_correo,
		}

		// Only include password fields if user is changing password
		if (passwordData.value.newPassword) {
			updateData.usuario_pass = passwordData.value.newPassword
			updateData.currentPassword = passwordData.value.currentPassword
		}

		const response = await updateUserProfile(updateData)
		const result = await response.json()

		if (!response.ok) {
			errorMessage.value = result.message || 'Error al actualizar el perfil'
			return
		}

		// Update localStorage with new data
		const userData = JSON.parse(localStorage.getItem('user') || '{}')
		userData.usuario_nombre = formData.value.usuario_nombre
		userData.usuario_correo = formData.value.usuario_correo
		localStorage.setItem('user', JSON.stringify(userData))

		successMessage.value = 'Perfil actualizado exitosamente'

		// Clear password fields
		passwordData.value = {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		}

		// Redirect after 2 seconds
		setTimeout(() => {
			router.push('/dashboard')
		}, 2000)
	} catch (error) {
		console.error('Error updating profile:', error)
		errorMessage.value = 'Error al actualizar el perfil. Intenta nuevamente.'
	} finally {
		isSubmitting.value = false
	}
}
</script>
