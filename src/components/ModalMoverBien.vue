<template>
  <div v-if="show && bien"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-lg w-full">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Mover Bien</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div v-if="errorMessage"
        class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center" role="alert">
        <span class="font-medium text-sm">{{ errorMessage }}</span>
        <button @click="errorMessage = null" class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
      </div>

      <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        
        <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ bien.bien_descripcion }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Código: {{ bien.bien_codigo || 'N/A' }}</p>
        </div>
        
        <p class="text-sm text-gray-600 dark:text-gray-400">Selecciona la nueva ubicación para el bien:</p>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paso 1: Selecciona un Área</label>
          <select v-model="selectedArea" :disabled="isLoadingAreas"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50">
            <option :value="null" disabled>
              {{ isLoadingAreas ? 'Cargando áreas...' : 'Selecciona un área' }}
            </option>
            <option v-for="area in areasList" :key="area.id" :value="area.id">
              {{ area.area_nombre }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paso 2: Selecciona un Departamento</label>
          <select v-model="selectedDepartment" :disabled="!selectedArea || isLoadingDepartments"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed">
            <option :value="null" disabled>
              {{ isLoadingDepartments ? 'Cargando...' : (selectedArea ? 'Selecciona un depto' : '...') }}
            </option>
            <option v-for="dept in departmentsList" :key="dept.id" :value="dept.id">
              {{ dept.dep_nombre }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paso 3: Selecciona una Oficina</label>
          <select v-model="selectedOficina" :disabled="!selectedDepartment || isLoadingOficinas"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed">
            <option :value="null" disabled>
              {{ isLoadingOficinas ? 'Cargando...' : (selectedDepartment ? 'Selecciona una oficina' : '...') }}
            </option>
            <option v-for="oficina in oficinasList" :key="oficina.id" :value="oficina.id">
              {{ oficina.nombre }}
            </option>
          </select>
        </div>
        
      </div>

      <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
        <button @click="closeModal" :disabled="isSubmitting"
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">
          Cancelar
        </button>
        <button @click="handleMove" :disabled="!selectedOficina || isSubmitting"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
          {{ isSubmitting ? 'Moviendo...' : 'Confirmar Movimiento' }}
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

const emit = defineEmits(['close', 'move-success']);

// Estados de carga internos
const isLoadingAreas = ref(false);
const isLoadingDepartments = ref(false);
const isLoadingOficinas = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref(null);

// Listas para los dropdowns
const areasList = ref([]);
const departmentsList = ref([]);
const oficinasList = ref([]);

// v-models para los selects
const selectedArea = ref(null);
const selectedDepartment = ref(null);
const selectedOficina = ref(null);

// Carga la lista inicial de Áreas cuando se abre el modal
watch(() => props.show, (newVal) => {
  if (newVal === true) {
    // Resetea todo al abrir
    resetForm();
    fetchAreas();
  }
});

const resetForm = () => {
  areasList.value = [];
  departmentsList.value = [];
  oficinasList.value = [];
  selectedArea.value = null;
  selectedDepartment.value = null;
  selectedOficina.value = null;
  errorMessage.value = null;
  isSubmitting.value = false;
}

const fetchAreas = async () => {
  isLoadingAreas.value = true;
  try {
    const response = await props.fetchFunction('/areas'); // (Ajusta la ruta)
    if (!response.ok) throw new Error('Error al cargar las áreas');
    const data = await response.json();
    areasList.value = data.data || data;
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoadingAreas.value = false;
  }
}

// Carga Departamentos cuando 'selectedArea' cambia
watch(selectedArea, (newAreaId) => {
  selectedDepartment.value = null;
  selectedOficina.value = null;
  departmentsList.value = [];
  oficinasList.value = [];
  if (newAreaId) {
    isLoadingDepartments.value = true;
    props.fetchFunction(`/areas/${newAreaId}/structure`)
      .then(res => res.json())
      .then(data => { 
        // La API devuelve directamente un array de departamentos
        departmentsList.value = Array.isArray(data) ? data : (data.data || data);
      })
      .catch(err => { errorMessage.value = err.message; })
      .finally(() => { isLoadingDepartments.value = false; });
  }
});

// Carga Oficinas cuando 'selectedDepartment' cambia
watch(selectedDepartment, (newDeptId) => {
  selectedOficina.value = null;
  oficinasList.value = [];
  if (newDeptId) {
    // Busca el departamento en la lista y extrae sus oficinas
    const dept = departmentsList.value.find(d => d.id === newDeptId);
    if (dept && dept.oficinas) {
      oficinasList.value = dept.oficinas;
    }
  }
});

const closeModal = () => {
  emit('close');
}

// Lógica de API (PUT)
const handleMove = async () => {
  if (!selectedOficina.value || !props.bien) return;

  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    // Esta es la nueva ruta que debes crear en tu API
    const response = await props.fetchFunction(`/bienes/${props.bien.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        acciones: 'mover',
        id_oficina_nueva: selectedOficina.value
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'No se pudo mover el bien.');
    }

    emit('move-success'); // Notifica al padre que refresque
    closeModal();

  } catch (err) {
    console.error('Error al mover el bien:', err);
    errorMessage.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>