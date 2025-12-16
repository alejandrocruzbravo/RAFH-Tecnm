<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Inventario de Departamento</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Visión global de todos los bienes asignados a su departamento.
        </p>
      </div>
    </div>

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input v-model="searchQuery" type="text" placeholder="Código o descripción..."
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
            <select v-model="selectedStatus" @change="fetchBienes"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="En tránsito">En tránsito</option>
                <option value="Baja">Baja</option>
            </select>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-stone-950 overflow-hidden border border-gray-200 dark:border-gray-700">
        
        <div v-if="isLoading" class="p-10 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-500">Cargando inventario departamental...</p>
        </div>

        <div v-else-if="bienes.length === 0" class="p-8 text-center text-gray-500">
            No se encontraron bienes en el departamento.
        </div>

        <div v-else class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase font-bold text-xs">
                    <tr>
                        <th class="px-4 py-3">Código</th>
                        <th class="px-4 py-3">Descripción</th>
                        <th class="px-4 py-3">Ubicación (Oficina)</th>
                        <th class="px-4 py-3">Resguardante Actual</th>
                        <th class="px-4 py-3 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr v-for="bien in bienes" :key="bien.id" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {{ bien.bien_codigo + (bien.bien_sec_alfabetica || '') }}
                        </td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {{ bien.bien_descripcion }}
                            <div class="text-xs text-gray-400">{{ bien.bien_marca }} - {{ bien.bien_modelo }}</div>
                        </td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {{ bien.oficina ? bien.oficina.nombre : 'Sin Oficina' }}
                        </td>
                        <td class="px-4 py-3">
                            <div v-if="bien.resguardos && bien.resguardos.length > 0" class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                <span class="font-medium text-gray-700 dark:text-gray-200">
                                    {{ bien.resguardos[0].resguardante?.res_nombre }} {{ bien.resguardos[0].resguardante?.res_apellidos }}
                                </span>
                            </div>
                            <div v-else class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                                <span class="text-gray-500 italic">Sin asignar (En Stock)</span>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-center">
                            <span :class="getStatusClass(bien.bien_estado)" class="px-2 py-1 rounded-full text-xs font-semibold">
                                {{ bien.bien_estado }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="totalPages > 1" class="flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                class="px-3 py-1 mx-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50">
                Anterior
            </button>
            <span class="px-3 py-1 mx-1 text-gray-600 dark:text-gray-300">
                Pág {{ currentPage }} de {{ totalPages }}
            </span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-3 py-1 mx-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50">
                Siguiente
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { authenticatedFetch } from '../../config/api.js'; // Ajusta la ruta

const bienes = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
let searchTimeout = null;

const fetchBienes = async () => {
    isLoading.value = true;
    try {
        const params = new URLSearchParams();
        params.append('page', currentPage.value);
        if (searchQuery.value) params.append('search', searchQuery.value);
        if (selectedStatus.value) params.append('estado', selectedStatus.value);

        const response = await authenticatedFetch(`/jefe/bienes-departamento?${params.toString()}`);
        if (!response.ok) throw new Error('Error cargando bienes');
        
        const data = await response.json();
        bienes.value = data.data;
        totalPages.value = data.last_page || 1;
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchBienes();
    }
};

const getStatusClass = (status) => {
    if (status === 'Activo') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (status === 'En tránsito') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (status === 'Baja') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800';
};

watch(searchQuery, () => {
    currentPage.value = 1;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(fetchBienes, 500);
});

onMounted(fetchBienes);
</script>