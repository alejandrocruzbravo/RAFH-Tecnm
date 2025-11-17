<template>
  <div v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out"
    @click.self="closeModal">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-2xl w-full transition-transform duration-300 ease-out">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Añadir Nuevo(s) Bien(es)</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div v-if="step === 1" class="p-6 space-y-4">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Paso 1: Buscar en Catálogo CUCOP / CAMB</h3>
        
        <form @submit.prevent="handleSearch" class="flex gap-2">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Ingresa Clave CUCOP o CAMB" 
            class="flex-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
          <button 
            type="submit"
            :disabled="isLoadingSearch || !searchQuery"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {{ isLoadingSearch ? 'Buscando...' : 'Buscar' }}
          </button>
        </form>

        <div v-if="searchError" class="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
          {{ searchError }}
        </div>

        <div v-if="searchResults.length > 0" class="space-y-2 max-h-[30vh] overflow-y-auto">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Selecciona un bien del catálogo:</p>
          <button
            v-for="item in searchResults"
            :key="item.camb"
            @click="selectItem(item)"
            class="w-full text-left p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/50"
          >
            <p class="font-semibold text-gray-900 dark:text-white">{{ item.descripcion }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              CUCOP: {{ item.clave_cucop }} | CAMB: {{ item.camb }}
            </p>
          </button>
        </div>
      </div>

      <div v-if="step === 2" class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        
        <div class="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600">
          <div class="flex justify-between items-center">
             <h3 class="text-base font-semibold text-gray-900 dark:text-white">Paso 2: Completar Registro</h3>
             <button @click="resetSearch" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">Volver a buscar</button>
          </div>
          <div v-if="formError" class="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
            <strong>Error:</strong> {{ formError }}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" :value="`CUCOP: ${selectedCatalogoItem.clave_cucop}`" disabled class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
            <input type="text" :value="`CAMB: ${selectedCatalogoItem.camb}`" disabled class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
          </div>
        </div>
        
        <div class="space-y-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción (Nombre) <span class="text-red-500">*</span></label>
            <textarea v-model="newBienData.bien_descripcion" rows="3" placeholder="Descripción del bien (editable)" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cantidad a Registrar <span class="text-red-500">*</span></label>
            <input v-model.number="newBienData.cantidad" type="number" min="1" placeholder="Ej. 1" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marca</label>
              <input v-model="newBienData.bien_marca" type="text" placeholder="Marca del bien" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modelo</label>
              <input v-model="newBienData.bien_modelo" type="text" placeholder="Modelo del bien" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Serie (Opcional)</label>
            <input v-model="newBienData.bien_serie" type="text" placeholder="Número de serie de fábrica" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor Monetario (por unidad)</label>
              <input v-model.number="newBienData.bien_valor_monetario" type="number" min="0" placeholder="Ej. 15000" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Factura</label>
              <input v-model="newBienData.bien_numero_factura" type="text" placeholder="Factura" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proveedor</label>
            <input v-model="newBienData.bien_proveedor" type="text" placeholder="Nombre del proveedor" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo Adquisición</label>
              <select v-model="newBienData.bien_tipo_adquisicion" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="1">Compra Directa</option>
                <option value="2">Donación</option>
                <option value="3">Entrada por Almacén</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
              <select v-model="newBienData.bien_estado" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Activo</option>
                <option>En Tránsito</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
        <button @click="closeModal"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">
          Cancelar
        </button>
        <button @click="handleSave"
          :disabled="step === 1 || isSubmitting"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
          {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// --- Props y Emits ---
const props = defineProps({
  show: { type: Boolean, default: false },
  fetchFunction: { type: Function, required: true },
  idOficina: { type: Number, default: null }
});
const emit = defineEmits(['close', 'save']);

// --- Estado Interno ---
const step = ref(1); // 1: Buscar, 2: Rellenar

// --- Estado de Búsqueda ---
const searchQuery = ref('');
const isLoadingSearch = ref(false);
const searchError = ref(null);
const searchResults = ref([]);
const selectedCatalogoItem = ref(null);

const isSubmitting = ref(false); // Para el estado de carga del botón
const formError = ref(null);     // Para el banner de error en el Paso 2
// --- Estado de Formularios (Unificado) ---
const formSearchData = {
  clave_cucop: '',
  camb: ''
}


// Formulario Unificado
const formResetData = {
  ...formSearchData,
  bien_descripcion: '', 
  cantidad: 1,
  bien_marca: '',
  bien_modelo: '',
  bien_serie: '',
  bien_tipo_adquisicion: '1',
  bien_valor_monetario: '',
  bien_proveedor: '',
  bien_numero_factura: '',
  bien_estado: 'Activo'
}
const newBienData = ref({ ...formResetData }); // <-- Ref unificado


// --- Funciones de Interacción ---
const handleSearch = async () => {
  isLoadingSearch.value = true;
  searchError.value = null;
  searchResults.value = [];
  try {
    const response = await props.fetchFunction(`/catalogo-cucop?search=${searchQuery.value}`);
    if (!response.ok) {
      throw new Error('Error al buscar en el catálogo.');
    }
    const data = await response.json();
    // La API puede devolver un array directo o un objeto paginado { data: [...] }
    const items = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    if (items.length === 0) {
      searchError.value = 'No se encontraron bienes con esa clave. Añadirlos al catalógo CAMB/CUCOP de ser necesario.';
      return;
    }
    searchResults.value = items;
  } catch (err) {
    searchError.value = err.message;
  } finally {
    isLoadingSearch.value = false;
  }
};

const selectItem = (item) => {
  selectedCatalogoItem.value = item;
  step.value = 2;
}

const resetSearch = () => {
  step.value = 1;
  searchQuery.value = '';
  searchResults.value = [];
  selectedCatalogoItem.value = null;
  searchError.value = null;
  newBienData.value = { ...formResetData };
}

const closeModal = () => {
  emit('close');
}

const handleSave = async () => {
  if (step.value !== 2) return; 

  formError.value = null;
  
  // --- Validación Frontend ---
  const formData = newBienData.value;
  if (!props.idOficina) {
      formError.value = "Error: No se ha seleccionado una oficina (ID de oficina nulo).";
      return;
  }
  if (!formData.bien_descripcion) {
      formError.value = "La 'Descripción' es un campo obligatorio.";
      return;
  }
  if (!formData.cantidad || formData.cantidad < 1) {
      formError.value = "La 'Cantidad' debe ser al menos 1.";
      return;
  }

  isSubmitting.value = true;
  try {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    const currentYear = today.getFullYear().toString();

    // 1. Construimos el payload unificado
    const payload = {
      id_oficina: props.idOficina, 
      bien_clave: selectedCatalogoItem.value.camb,
      bien_fecha_alta: currentDate,
      bien_y: currentYear,
      bien_descripcion: formData.bien_descripcion,
      cantidad: formData.cantidad, // El backend leerá esto
      bien_modelo: formData.bien_modelo || 'SIN MODELO',
      bien_serie: formData.bien_serie || 'SIN SERIE', 
      bien_tipo_adquisicion: formData.bien_tipo_adquisicion || 3,
      bien_valor_monetario: formData.bien_valor_monetario || 0,
      bien_provedor: formData.bien_proveedor || 'SIN PROVEEDOR',
      bien_numero_factura: formData.bien_numero_factura || 'SIN FACTURA',
      bien_estado: formData.bien_estado,
      bien_marca: formData.bien_marca || 'SIN MARCA'
    };
    
    // 2. ¡Llamada a la API!
    const response = await props.fetchFunction('/bienes', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        // Muestra el error de validación de Laravel (ej. "bien_serie unique")
        const message = errData.message || (errData.errors ? Object.values(errData.errors).join(', ') : 'No se pudo registrar el bien.');
        throw new Error(message);
    }

    // 3. ¡Éxito!
    emit('save'); // Notifica al padre que recargue la tabla
    closeModal(); // Cierra este modal

  } catch (err) {
    console.error('Error al guardar el bien:', err);
    formError.value = err.message; // Muestra el error en el banner
  } finally {
    isSubmitting.value = false; // Reactiva los botones
  }
};


// --- Watchers (Lógica Reactiva) ---
watch(selectedCatalogoItem, (item) => {
  if (item) {
    const data = {
      clave_cucop: item.clave_cucop,
      camb: item.camb,
      bien_descripcion: item.descripcion
    };
    newBienData.value = { ...newBienData.value, ...data }; // <-- Corregido
  }
});

watch(() => props.show, (newVal) => {
  if (newVal === false) {
    setTimeout(() => {
      // activeTab.value = 'unico'; // <-- ELIMINADO
      resetSearch();
    }, 300);
  }
});
</script>