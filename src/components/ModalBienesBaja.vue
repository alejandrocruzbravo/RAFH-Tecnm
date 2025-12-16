<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4 animate-fade-in backdrop-blur-sm">
    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
      
      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Papelera de Bienes (Baja)</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Historial de bienes dados de baja del inventario.</p>
        </div>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl transition-colors">&times;</button>
      </div>

      <div class="p-6 pb-0">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar por código, descripción, marca o modelo..." 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
      </div>

      <div class="p-6 overflow-y-auto flex-1">
        <div v-if="isLoading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        <table v-else class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th class="px-4 py-3">Código</th>
              <th class="px-4 py-3">Descripción</th>
              <th class="px-4 py-3">Marca/Modelo</th>
              <th class="px-4 py-3">Fecha Baja</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="bienesList.length === 0">
              <td colspan="5" class="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                No se encontraron bienes dados de baja con estos criterios.
              </td>
            </tr>
            <tr v-for="bien in bienesList" :key="bien.id" class="bg-white border-b dark:bg-dark-bg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ bien.bien_codigo }}</td>
              <td class="px-4 py-3">
                <span :title="bien.bien_descripcion">
                    {{ bien.bien_descripcion.length > 40 ? bien.bien_descripcion.substring(0,40)+'...' : bien.bien_descripcion }}
                </span>
              </td>
              <td class="px-4 py-3">{{ bien.bien_marca }} / {{ bien.bien_modelo }}</td>
              
              <td class="px-4 py-3 font-mono text-xs">
                {{ formatDate(bien.updated_at) }}
              </td> 
              
              <td class="px-4 py-3 text-right">
                <button @click="emit('reactivar', bien)" 
                        class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm">
                  Re-activar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 rounded-b-lg">
        
        <div class="flex items-center gap-2" v-if="totalPages > 1">
            <button 
                @click="changePage(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="px-3 py-1 text-xs font-medium rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
                Anterior
            </button>
            <span class="text-xs text-gray-600 dark:text-gray-400">
                Pág. <span class="font-bold">{{ currentPage }}</span> de {{ totalPages }}
            </span>
            <button 
                @click="changePage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-xs font-medium rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
                Siguiente
            </button>
        </div>
        <div v-else></div> <button @click="emit('close')" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm">
            Cerrar Ventana
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  fetchFunction: { type: Function, required: true }
});

const emit = defineEmits(['close', 'reactivar']);

// Estados
const bienesList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
let searchTimeout = null;

// --- Función para obtener datos ---
const fetchBajas = async (page = 1) => {
  isLoading.value = true;
  try {
    // Creamos los Query Params para enviarlos al backend
    const params = new URLSearchParams({
        page: page,
        search: searchQuery.value
    });

    // Llamamos a la función inyectada (asumiendo que espera la URL completa o relativa)
    const res = await props.fetchFunction(`/bienes/bajas?${params.toString()}`); 
    const data = await res.json();
    
    // Asignamos datos de paginación de Laravel
    bienesList.value = data.data; 
    currentPage.value = data.current_page;
    totalPages.value = data.last_page;
    
  } catch (e) {
    console.error("Error cargando bajas:", e);
    bienesList.value = [];
  } finally {
    isLoading.value = false;
  }
}

// --- Paginación ---
const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        fetchBajas(newPage);
    }
}

// --- Formato de Fecha (DD/MM/AAAA HH:MM am/pm) ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

// --- Watchers ---

// 1. Cuando se abre el modal, cargar datos
watch(() => props.show, (val) => {
  if (val) {
      searchQuery.value = ''; // Resetear búsqueda al abrir
      fetchBajas(1);
  }
});

// 2. Buscador con Debounce (espera 500ms antes de buscar)
watch(searchQuery, () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchBajas(1);
    }, 500);
});
</script>