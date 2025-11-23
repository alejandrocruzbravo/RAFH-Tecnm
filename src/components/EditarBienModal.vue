<template>
  <div v-if="show && formData"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-2xl w-full">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Bien</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div v-if="errorMessage"
        class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
        role="alert">
        <span class="font-medium text-sm">{{ errorMessage }}</span>
        <button @click="errorMessage = null"
          class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
      </div>

      <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción (Nombre) <span class="text-red-500">*</span></label>
          <textarea v-model="formData.bien_descripcion" rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Características Detalladas</label>
          <textarea v-model="formData.bien_caracteristicas" rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marca</label>
            <input v-model="formData.bien_marca" type="text" placeholder="Marca del bien" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modelo</label>
            <input v-model="formData.bien_modelo" type="text" placeholder="Modelo del bien" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Serie</label>
          <input v-model="formData.bien_serie" type="text" placeholder="Número de serie de fábrica" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor Monetario</label>
            <input v-model.number="formData.bien_valor_monetario" type="number" min="0" placeholder="Ej. 15000" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Factura</label>
            <input v-model="formData.bien_numero_factura" type="text" placeholder="Factura" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proveedor</label>
          <input v-model="formData.bien_proveedor" type="text" placeholder="Nombre del proveedor" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo Adquisición</label>
            <select v-model="formData.bien_tipo_adquisicion" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="1">Compra Directa</option>
                <option value="2">Donación</option>
                <option value="3">Entrada por Almacén</option>
              </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
            <select v-model="formData.bien_estado" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Activo</option>
              <option>En tránsito</option>
              <option>Extravíado</option>
            </select>
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
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
          {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
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
  fetchFunction: { type: Function, required: true },
  allOficinas: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'edit-success']);

// Estados internos
const isSubmitting = ref(false);
const errorMessage = ref(null);

// Objeto 'ref' para el formulario
const formData = ref(null);

// --- FUNCIÓN 'setFormData' (ACTUALIZADA) ---
// Copia todos los campos de tu validación
const setFormData = (sourceBien) => {
  if (sourceBien) {
    formData.value = {
      bien_descripcion: sourceBien.bien_descripcion,
      bien_caracteristicas: sourceBien.bien_caracteristicas,
      bien_codigo: sourceBien.bien_codigo,
      bien_modelo: sourceBien.bien_modelo, 
      bien_serie: sourceBien.bien_serie, 
      bien_tipo_adquisicion: sourceBien.bien_tipo_adquisicion,
      bien_valor_monetario: sourceBien.bien_valor_monetario,
      bien_provedor: sourceBien.bien_proveedor,
      bien_numero_factura: sourceBien.bien_numero_factura,
      id_oficina: sourceBien.id_oficina,
      bien_marca: sourceBien.bien_marca, 
      bien_estado: sourceBien.bien_estado  
    };
  } else {
    formData.value = null;
  }
}

// Observa la 'prop' 'bien' y actualiza el formulario
watch(() => props.bien, (newBien) => {
  setFormData(newBien);
  errorMessage.value = null;
}, { immediate: true });

const closeModal = () => {
  emit('close');
}

// --- FUNCIÓN 'handleSave' (ACTUALIZADA) ---
const handleSave = async () => {
  if (!props.bien) return;

  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    // Validar que la descripción no esté vacía
    if (!formData.value.bien_descripcion || formData.value.bien_descripcion.trim() === '') {
      errorMessage.value = "La Descripción es un campo obligatorio.";
      isSubmitting.value = false;
      return;
    }

    // El payload ahora incluye todos los campos del formulario

    const payload = formData.value; 
    payload.bien_caracteristicas = payload.bien_caracteristicas || "SIN CARACTERÍSTICAS";
    payload.bien_marca = payload.bien_marca || "SIN MARCA";
    payload.bien_modelo = payload.bien_modelo || "SIN MODELO";
    payload.bien_serie = payload.bien_serie || "SIN SERIE";
    payload.bien_proveedor = payload.bien_provedor || "SIN PROVEEDOR";
    payload.bien_numero_factura = payload.bien_numero_factura || "SIN FACTURA";

    const response = await props.fetchFunction(`/bienes/${props.bien.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData.message || (errData.errors ? Object.values(errData.errors).join(', ') : 'No se pudo actualizar.');
      throw new Error(message);
    }

    emit('edit-success');
    closeModal();

  } catch (err) {
    console.error('Error al actualizar el bien:', err);
    errorMessage.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>