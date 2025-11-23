<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Registro de Movimientos</label>
			<label class="text-sm md:text-base text-gray-600 dark:text-gray-400">Instituto Tecnológico de Chetumal</label>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por usuario</label>
				<input v-model="searchUser" type="text" placeholder="Usuario" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por tipo de usuario</label>
				<select v-model="filterUserType" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					<option value="">Sin filtro</option>
					<option value="Gestor">Gestor</option>
					<option value="Resguardante">Resguardante</option>
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por rol</label>
				<select v-model="filterRole" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					<option value="">Sin filtro</option>
					<option value="Administrador">Administrador</option>
					<option value="Gestor superior">Gestor superior</option>
					<option value="Jefe de departamento">Jefe de departamento</option>
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por acción</label>
				<select v-model="filterAction" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
					<option value="">Sin filtro</option>
					<option value="Actualizar centro de trabajo">Actualizar centro de trabajo</option>
					<option value="Crear gestor">Crear gestor</option>
					<option value="Modificar gestor">Modificar gestor</option>
					<option value="Eliminar gestor">Eliminar gestor</option>
					<option value="Crear resguardante">Crear resguardante</option>
					<option value="Modificar resguardante">Modificar resguardante</option>
					<option value="Eliminar resguardante">Eliminar resguardante</option>
				</select>
			</div>
		</div>

		<div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-x-auto">
			<div v-if="filteredAuditorias.length === 0" class="flex items-center justify-center h-64">
				<p class="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">No existen registros</p>
			</div>
			<table v-else class="w-full text-sm">
				<thead class="bg-gray-100 dark:bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Usuario</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Tipo</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Rol</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acción</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Fecha</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
					<tr v-for="(auditoria, index) in filteredAuditorias" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ auditoria.usuario }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ auditoria.tipo }}</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ auditoria.rol }}</td>
						<td class="px-4 py-3">
							<span 
								v-if="auditoria.accion === 'Crear'" 
								class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold"
							>
								{{ auditoria.accion }}
							</span>
							<span 
								v-else-if="auditoria.accion === 'Modificar'" 
								class="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold"
							>
								{{ auditoria.accion }}
							</span>
							<span 
								v-else 
								class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold"
							>
								{{ auditoria.accion }}
							</span>
						</td>
						<td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ auditoria.fecha }}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Pagination Controls -->
		<div v-if="filteredAuditorias.length > 0" class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
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
				Página {{ currentPage }} de {{ totalPages }} | Total: {{ allFiltered.length }} resultados
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
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const auditorias = ref([
	{ usuario: 'Juan Pérez', tipo: 'Gestor', rol: 'Administrador', accion: 'Modificar', fecha: '2024-01-15 10:30' },
	{ usuario: 'María García', tipo: 'Resguardante', rol: 'Gestor', accion: 'Crear', fecha: '2024-01-15 09:15' },
	{ usuario: 'Carlos López', tipo: 'Gestor', rol: 'Gestor superior', accion: 'Modificar', fecha: '2024-01-14 14:45' },
	{ usuario: 'Ana Rodríguez', tipo: 'Resguardante', rol: 'Jefe de departamento', accion: 'Crear', fecha: '2024-01-14 11:20' },
	{ usuario: 'Juan Pérez', tipo: 'Gestor', rol: 'Administrador', accion: 'Actualizar centro de trabajo', fecha: '2024-01-13 08:00' },
	{ usuario: 'María García', tipo: 'Resguardante', rol: 'Gestor', accion: 'Modificar', fecha: '2024-01-13 16:30' },
])

const searchUser = ref('')
const filterUserType = ref('')
const filterRole = ref('')
const filterAction = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

const allFiltered = computed(() => {
	return auditorias.value.filter(auditoria => {
		const matchUser = auditoria.usuario.toLowerCase().includes(searchUser.value.toLowerCase())
		const matchUserType = !filterUserType.value || auditoria.tipo === filterUserType.value
		const matchRole = !filterRole.value || auditoria.rol === filterRole.value
		const matchAction = !filterAction.value || auditoria.accion === filterAction.value

		return matchUser && matchUserType && matchRole && matchAction
	})
})

const totalPages = computed(() => {
	return Math.ceil(allFiltered.value.length / itemsPerPage) || 1
})

const filteredAuditorias = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage
	const end = start + itemsPerPage
	return allFiltered.value.slice(start, end)
})

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++
	}
}

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--
	}
}

watch([searchUser, filterUserType, filterRole, filterAction], () => {
	currentPage.value = 1
})

</script>
