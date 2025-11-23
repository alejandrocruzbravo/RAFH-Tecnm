<template>
  <div v-if="show && bien"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] flex flex-col">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Reactivar Bien</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div v-if="errorMessage" class="bg-red-700 text-white px-6 py-3 text-sm flex justify-between items-center">
        <span>{{ errorMessage }}</span>
        <button @click="errorMessage = null" class="font-bold">&times;</button>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto">
        
        <div class="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <p class="text-sm font-bold text-gray-900 dark:text-white">{{ bien.bien_descripcion }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Código: {{ bien.bien_codigo }}</p>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
            1. Nueva Ubicación
          </h3>
          
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Área</label>
            <select v-model="selectedArea" :disabled="isLoadingAreas" 
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50">
              <option :value="null" disabled>
                  {{ isLoadingAreas ? 'Cargando áreas...' : 'Selecciona Área' }}
              </option>
              <option v-for="area in areasList" :key="area.id" :value="area.id">{{ area.area_nombre }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Departamento</label>
            <select v-model="selectedDepartment" :disabled="!selectedArea || isLoadingStructure" 
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50">
              <option :value="null" disabled>
                  {{ isLoadingStructure ? 'Cargando estructura...' : 'Selecciona Departamento' }}
              </option>
              <option v-for="dept in departmentsList" :key="dept.id" :value="dept.id">
                  {{ dept.dep_nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Oficina <span class="text-red-500">*</span></label>
            <select v-model="selectedOficina" :disabled="!selectedDepartment" 
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50">
              <option :value="null" disabled>Selecciona Oficina</option>
              <option v-for="ofi in oficinasList" :key="ofi.id" :value="ofi.id">
                  {{ ofi.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
            2. Asignar Resguardante (Opcional)
          </h3>
          <div class="flex gap-2">
            <input v-model="searchResguardanteQuery" type="text" placeholder="Buscar por Nombre, RFC o CURP" 
                   class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <button @click="searchResguardantes" :disabled="isLoadingSearch"
                    class="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
              {{ isLoadingSearch ? '...' : 'Buscar' }}
            </button>
          </div>
          
          <div v-if="resguardantesResults.length > 0" class="max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
            <div v-for="res in resguardantesResults" :key="res.id" @click="selectedResguardante = res"
                 :class="['p-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600', selectedResguardante?.id === res.id ? 'bg-blue-100 dark:bg-blue-900' : '']">
                 <p class="font-medium text-gray-900 dark:text-white">{{ res.res_nombre }} {{ res.res_apellidos }}</p>
                 <p class="text-xs text-gray-500">{{ res.res_rfc || 'Sin RFC' }}</p>
            </div>
          </div>
          
          <div v-if="selectedResguardante" class="mt-2 p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded flex justify-between items-center">
            <div>
              <span class="block text-xs text-green-800 dark:text-green-300 font-bold">Seleccionado:</span>
              <span class="text-sm text-gray-800 dark:text-gray-200">{{ selectedResguardante.res_nombre }} {{ selectedResguardante.res_apellidos }}</span>
            </div>
            <button @click="selectedResguardante = null" class="text-red-500 text-xs hover:underline">Quitar</button>
          </div>
        </div>

      </div>

      <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 transition-colors">Cancelar</button>
        <button @click="handleReactivar" :disabled="!selectedOficina || isSubmitting" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
          {{ isSubmitting ? 'Guardando...' : 'Reactivar Bien' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  bien: { type: Object, default: null },
  fetchFunction: { type: Function, required: true }
});

const emit = defineEmits(['close', 'reactivate-success']);

// --- Estados ---
const isSubmitting = ref(false);
const errorMessage = ref(null);
const isLoadingAreas = ref(false);
const isLoadingStructure = ref(false); // Para cargar Deptos+Oficinas

// Ubicación
const areasList = ref([]);
const departmentsList = ref([]); // Contendrá deptos CON sus oficinas
const oficinasList = ref([]);    // Lista temporal filtrada
const selectedArea = ref(null);
const selectedDepartment = ref(null);
const selectedOficina = ref(null);

// Resguardante
const searchResguardanteQuery = ref('');
const resguardantesResults = ref([]);
const selectedResguardante = ref(null);
const isLoadingSearch = ref(false);

// --- Reset al abrir ---
watch(() => props.show, (val) => {
  if (val) {
    selectedArea.value = null; selectedDepartment.value = null; selectedOficina.value = null;
    searchResguardanteQuery.value = ''; resguardantesResults.value = []; selectedResguardante.value = null;
    errorMessage.value = null;
    departmentsList.value = []; oficinasList.value = [];
    fetchAreas();
  }
});

// --- 1. Cargar Áreas ---
const fetchAreas = async () => {
  isLoadingAreas.value = true;
  try {
    const res = await props.fetchFunction('/areas');
    const data = await res.json();
    areasList.value = data.data || data;
  } catch (e) { console.error(e); } 
  finally { isLoadingAreas.value = false; }
}

// --- 2. Watch Área -> Cargar Estructura Completa ---
watch(selectedArea, async (newVal) => {
  // Reseteamos hijos
  selectedDepartment.value = null; selectedOficina.value = null;
  departmentsList.value = []; oficinasList.value = [];
  
  if (newVal) {
    isLoadingStructure.value = true;
    try {
      // TU NUEVA RUTA: Trae deptos y oficinas de un jalón
      const res = await props.fetchFunction(`/areas/${newVal}/structure`);
      const data = await res.json();
      
      // data es un Array de Departamentos, y cada depto tiene .oficinas
      departmentsList.value = data; 
    } catch (e) { 
        console.error(e); 
        errorMessage.value = "Error al cargar la estructura del área.";
    } finally { 
        isLoadingStructure.value = false; 
    }
  }
});

// --- 3. Watch Departamento -> Filtrar Oficinas Localmente ---
watch(selectedDepartment, (newVal) => {
  // Reseteamos hijo
  selectedOficina.value = null;
  oficinasList.value = [];

  if (newVal) {
    // Buscamos el departamento seleccionado en la lista que YA cargamos
    const deptoSeleccionado = departmentsList.value.find(d => d.id === newVal);
    
    // Si existe, sacamos sus oficinas directamente
    if (deptoSeleccionado && deptoSeleccionado.oficinas) {
        oficinasList.value = deptoSeleccionado.oficinas;
    }
  }
});

// --- Búsqueda Resguardantes (Sin cambios) ---
const searchResguardantes = async () => {
  if (!searchResguardanteQuery.value) return;
  isLoadingSearch.value = true;
  resguardantesResults.value = [];
  try {
    const res = await props.fetchFunction(`/resguardantes?search=${searchResguardanteQuery.value}`);
    const data = await res.json();
    resguardantesResults.value = data.data || data;
  } catch (e) { console.error(e); } 
  finally { isLoadingSearch.value = false; }
}

// --- Guardar Reactivación ---
const handleReactivar = async () => {
  if (!selectedOficina.value) return;
  
  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    const payload = {
      accion: 'reactivar',
      id_oficina: selectedOficina.value,
      //id_resguardante: selectedResguardante.value ? selectedResguardante.value.id : null
    };
    console.log(payload);
    const res = await props.fetchFunction(`/bienes/${props.bien.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Error al reactivar el bien.');

    emit('reactivate-success');
    closeModal();

  } catch (e) {
    errorMessage.value = e.message;
  } finally {
    isSubmitting.value = false;
  }
}

const closeModal = () => emit('close');
</script>