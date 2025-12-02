<template>
  <div v-if="show"
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4 transition-opacity duration-300"
    @click.self="closeModal">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nuevo Resguardo</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Asignando a: <span class="font-bold text-gray-800 dark:text-gray-200">
              {{ resguardante?.res_nombre }} {{ resguardante?.res_apellidos }}
            </span>
          </p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        
        <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Búsqueda Directa (Por Código)</label>
            <div class="flex gap-2">
              <input 
                v-model="searchQuery" 
                @keyup.enter="handleSearch"
                type="text" 
                placeholder="Escribe la clave exacta y presiona Enter..." 
                class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
              <button 
                @click="handleSearch" 
                :disabled="isSearching"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {{ isSearching ? 'Buscando...' : 'Buscar' }}
              </button>
            </div>
          </div>

          <div v-if="searchMessage" 
               :class="[
                 'p-3 rounded-lg text-sm font-medium border',
                 searchMessage.type === 'error' ? 'bg-red-100 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300' : 
                 'bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300'
               ]">
             <div class="flex items-center gap-2">
               <svg v-if="searchMessage.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
               
               {{ searchMessage.text }}
             </div>
          </div>

          <div v-if="searchResult" class="space-y-2">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Resultado encontrado (Click para agregar):</p>
            
            <button 
              @click="addSearchResult"
              class="w-full text-left p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group relative overflow-hidden">
              
              <div :class="['absolute left-0 top-0 bottom-0 w-1', officeMismatch ? 'bg-orange-500' : 'bg-green-500']"></div>

              <div class="flex justify-between items-start pl-3">
                <div>
                  <h3 class="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {{ searchResult.bien_descripcion }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Código: <span class="font-mono font-bold">{{ searchResult.bien_codigo }}</span> | 
                    Serie: <span class="font-mono">{{ searchResult.bien_serie || 'S/N' }}</span>
                  </p>
                  
                  <div class="mt-2 flex items-center gap-2">
                    <span class="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      Ubicación: {{ searchResult.oficina?.nombre || 'Sin Oficina' }}
                    </span>
                    
                    <span v-if="officeMismatch" class="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200">
                      ⚠️ Pertenece a otra oficina
                    </span>
                  </div>
                </div>

                <div class="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-600 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
              </div>
            </button>
          </div>

        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[400px]">
          
          <div class="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/30 relative">
             <div v-if="isLoadingLeft" class="absolute inset-0 z-10 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-lg">
               <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/10 flex justify-between items-center">
              <h3 class="font-semibold text-gray-700 dark:text-gray-200">
                Disponibles en Oficina
                <span class="text-xs font-normal text-gray-500">({{ totalItems }} encontrados)</span>
              </h3>
              <button 
                @click="assignCheckedItems"
                :disabled="checkedGoodsMap.size === 0"
                class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-md flex items-center gap-1 transition-colors">
                Asignar ({{ checkedGoodsMap.size }})
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
              </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-0">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 z-0">
                  <tr>
                    <th class="p-2 text-center w-10">
                      <input type="checkbox" v-model="isAllPageSelected" class="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600">
                    </th>
                    <th class="p-2">Bien</th>
                    <th class="p-2">Código</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr v-for="bien in availableGoods" :key="bien.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td class="p-2 text-center">
                      <input type="checkbox" 
                             :checked="checkedGoodsMap.has(bien.id) || isAlreadySelected(bien.id)"
                             :disabled="isAlreadySelected(bien.id)"
                             @change="toggleCheck(bien)" 
                             class="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 disabled:opacity-50">
                    </td>
                    <td class="p-2" :class="{ 'opacity-50': isAlreadySelected(bien.id) }">
                      <div class="font-medium text-gray-900 dark:text-white">{{ bien.bien_descripcion }}</div>
                      <div class="text-xs text-gray-500">{{ bien.bien_marca }} {{ bien.bien_modelo }}</div>
                      <span v-if="isAlreadySelected(bien.id)" class="text-[10px] text-green-600 font-bold">YA AGREGADO</span>
                    </td>
                    <td class="p-2 text-xs font-mono text-gray-600 dark:text-gray-400" :class="{ 'opacity-50': isAlreadySelected(bien.id) }">
                      {{ bien.bien_codigo }}
                    </td>
                  </tr>
                  <tr v-if="availableGoods.length === 0">
                    <td colspan="3" class="p-8 text-center text-gray-500">No se encontraron bienes en esta oficina.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-b-lg">
               <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 disabled:opacity-50">Anterior</button>
               <span class="text-xs text-gray-500">Pág {{ currentPage }} de {{ lastPage }}</span>
               <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage" class="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 disabled:opacity-50">Siguiente</button>
            </div>
          </div>

          <div class="flex flex-col border border-blue-300 dark:border-blue-800 rounded-lg bg-blue-50/30 dark:bg-blue-900/10">
            <div class="p-3 border-b border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/30 flex justify-between items-center">
              <h3 class="font-semibold text-blue-800 dark:text-blue-200">Lista para Resguardar</h3>
              <span class="text-xs font-bold bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-white px-2 py-1 rounded-full">
                {{ selectedGoods.length }} items
              </span>
            </div>

            <div class="flex-1 overflow-y-auto p-2">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-500 uppercase bg-blue-50/50 dark:bg-blue-900/20 sticky top-0">
                  <tr>
                    <th class="p-2">Bien</th>
                    <th class="p-2">Código</th>
                    <th class="p-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-blue-100 dark:divide-blue-800/30">
                  <tr v-for="(bien, index) in selectedGoods" :key="bien.id">
                    <td class="p-2">
                      <div class="font-medium text-gray-900 dark:text-white">{{ bien.bien_descripcion }}</div>
                      <div v-if="bien.id_oficina !== resguardante?.id_oficina" class="text-[10px] text-orange-600 font-bold">⚠️ De otra oficina</div>
                    </td>
                    <td class="p-2 text-xs font-mono text-gray-600 dark:text-gray-400">{{ bien.bien_codigo }}</td>
                    <td class="p-2 text-center">
                      <button @click="removeSelected(index)" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="selectedGoods.length === 0">
                    <td colspan="3" class="p-8 text-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg m-4">
                      Selecciona bienes de la izquierda para agregarlos.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <div class="flex justify-end gap-3 border-t border-gray-300 dark:border-gray-600 p-6 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
        <button @click="confirmAssignment" :disabled="selectedGoods.length === 0" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:shadow-none transition-all">Confirmar y Guardar ({{ selectedGoods.length }})</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { authenticatedFetch } from '../config/api.js';

const props = defineProps({
  show: Boolean,
  resguardante: Object 
});

const emit = defineEmits(['close', 'confirm']);

// --- ESTADO ---
const isLoadingLeft = ref(false);
const isSearching = ref(false);
const searchQuery = ref('');

// Resultado de Búsqueda Individual
const searchResult = ref(null);
const searchMessage = ref(null); // { type: 'error'|'warning', text: '...' }

// Datos API (Tabla Izquierda)
const availableGoods = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);
const totalItems = ref(0);

// Listas de Selección
const checkedGoodsMap = ref(new Map()); 
const selectedGoods = ref([]); 

// --- COMPUTED: Alerta de Oficina en Búsqueda ---
const officeMismatch = computed(() => {
  if (!searchResult.value || !props.resguardante) return false;
  // Comparar ID oficina (convertir a int por si acaso)
  return Number(searchResult.value.id_oficina) !== Number(props.resguardante.id_oficina);
});

// --- LÓGICA DE BÚSQUEDA (API) ---
const handleSearch = async () => {
  const term = searchQuery.value.trim();
  if (!term) return;

  isSearching.value = true;
  searchResult.value = null;
  searchMessage.value = null;

  try {
    const response = await authenticatedFetch(`/bienes/buscar-codigo/${encodeURIComponent(term)}`);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      // Manejo de errores 404, 409, etc.
      if (response.status === 404) {
        searchMessage.value = { type: 'error', text: 'El bien no existe en el sistema.' };
        return;
      }
      if (response.status === 409) {
        searchMessage.value = { type: 'error', text: 'El bien existe pero está dado de BAJA.' };
        // Opcional: podrías mostrar el resultado pero deshabilitar el botón de agregar
        searchResult.value = errData.data; 
        return;
      }
      throw new Error(errData.message || 'Error al buscar');
    }

    const json = await response.json();
    const item = json.data;

    // Validar si ya está en la lista derecha
    if (isAlreadySelected(item.id)) {
       searchMessage.value = { type: 'warning', text: 'Este bien ya está en la lista de asignación.' };
       return;
    }

    // Éxito: Mostrar previsualización
    searchResult.value = item;
    
    // Advertencia inmediata si es de otra oficina
    if (Number(item.id_oficina) !== Number(props.resguardante?.id_oficina)) {
        searchMessage.value = { 
            type: 'warning', 
            text: `Advertencia: Este bien pertenece a otra oficina (${item.oficina?.nombre || 'Desconocida'}).` 
        };
    }

  } catch (error) {
    console.error(error);
    searchMessage.value = { type: 'error', text: 'Error de conexión al buscar.' };
  } finally {
    isSearching.value = false;
  }
};

// --- AGREGAR RESULTADO BUSCADO A LA DERECHA ---
const addSearchResult = () => {
  if (!searchResult.value) return;

  selectedGoods.value.push(searchResult.value);
  
  // Limpieza post-agregado
  searchResult.value = null;
  searchQuery.value = '';
  searchMessage.value = null;
};


const fetchGoods = async (page = 1) => {
  if (!props.resguardante?.id_oficina) {
    availableGoods.value = [];
    return;
  }
  isLoadingLeft.value = true;
  try {
    const url = `/oficinas/${props.resguardante.id_oficina}/bienes?page=${page}&estado=Activo&sin_resguardo=true`;
    const response = await authenticatedFetch(url);
    if (!response.ok) throw new Error('Error al cargar bienes');
    const json = await response.json();
    availableGoods.value = json.data || [];
    currentPage.value = json.current_page || 1;
    lastPage.value = json.last_page || 1;
    totalItems.value = json.total || 0;
  } catch (err) {
    console.error(err);
    availableGoods.value = [];
  } finally {
    isLoadingLeft.value = false;
  }
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= lastPage.value) {
    fetchGoods(newPage);
  }
};

const isAlreadySelected = (id) => {
  return selectedGoods.value.some(b => b.id === id);
};

const toggleCheck = (bien) => {
  if (checkedGoodsMap.value.has(bien.id)) {
    checkedGoodsMap.value.delete(bien.id);
  } else {
    checkedGoodsMap.value.set(bien.id, bien);
  }
};

const isAllPageSelected = computed({
  get() {
    if (availableGoods.value.length === 0) return false;
    const validGoods = availableGoods.value.filter(b => !isAlreadySelected(b.id));
    if (validGoods.length === 0) return false;
    return validGoods.every(b => checkedGoodsMap.value.has(b.id));
  },
  set(value) {
    const validGoods = availableGoods.value.filter(b => !isAlreadySelected(b.id));
    if (value) {
      validGoods.forEach(b => checkedGoodsMap.value.set(b.id, b));
    } else {
      validGoods.forEach(b => checkedGoodsMap.value.delete(b.id));
    }
  }
});

const assignCheckedItems = () => {
  const itemsToAdd = Array.from(checkedGoodsMap.value.values());
  const uniqueItems = itemsToAdd.filter(b => !isAlreadySelected(b.id));
  selectedGoods.value.push(...uniqueItems);
  checkedGoodsMap.value.clear();
};

const removeSelected = (index) => {
  selectedGoods.value.splice(index, 1);
};

const confirmAssignment = () => {
  emit('confirm', selectedGoods.value);
};

const closeModal = () => {
  emit('close');
  setTimeout(() => {
    selectedGoods.value = [];
    checkedGoodsMap.value.clear();
    searchQuery.value = '';
    searchResult.value = null;
    searchMessage.value = null;
    currentPage.value = 1;
  }, 300);
};

watch(() => props.show, (newVal) => {
  if (newVal && props.resguardante) {
    fetchGoods(1);
  }
});
</script>