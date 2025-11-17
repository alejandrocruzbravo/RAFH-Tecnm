<template>
  <div v-if="show && bien"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-red-600 ">Confirmar Eliminación</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div v-if="internalErrorMessage"
        class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
        role="alert">
        <span class="font-medium text-sm">{{ internalErrorMessage }}</span>
        <button @click="internalErrorMessage = null"
          class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
      </div>

      <div class="p-6 space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Esta acción <strong>no se puede deshacer</strong>. Esto eliminará permanentemente el bien.
        </p>
        <p class="text-gray-700 dark:text-gray-300">
          Para confirmar, escribe
          <strong class="text-gray-900 dark:text-white">{{ requiredText }}</strong>
          en la caja de abajo:
        </p>
        
        <input 
          v-model="confirmationText"
          type="text"
          :class="[
            'w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
            isMatch ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
          ]"
          placeholder="Escribe el código para confirmar..."
        >
      </div>

      <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
        <button @click="closeModal" 
                :disabled="internalIsSubmitting"
                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">
          Cancelar
        </button>
        <button @click="handleConfirmDelete" 
                :disabled="!isMatch || internalIsSubmitting"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:bg-red-400 dark:disabled:bg-red-800">
          {{ internalIsSubmitting ? 'Eliminando...' : 'Eliminar este bien' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  bien: { type: Object, default: null },
  // 1. Recibimos la función fetch como prop
  fetchFunction: { type: Function, required: true } 
  // 'isSubmitting' y 'errorMessage' ya no se reciben como props
});

// 2. 'confirm' se elimina, 'delete-success' se añade
const emit = defineEmits(['close', 'delete-success']);

// 3. Estados internos para carga y error
const internalIsSubmitting = ref(false);
const internalErrorMessage = ref(null);

const confirmationText = ref('');

const requiredText = computed(() => {
  if (!props.bien) return '';
  return props.bien.bien_codigo || props.bien.numero_serie;
});

const isMatch = computed(() => {
  return confirmationText.value === requiredText.value;
});

const closeModal = () => {
  emit('close');
}

// 4. Lógica de API movida aquí
const handleConfirmDelete = async () => {
  if (!isMatch.value || !props.bien) return;

  internalIsSubmitting.value = true;
  internalErrorMessage.value = null;
  console.log(props.bien.id)
  try {
    const response = await props.fetchFunction(`/bienes/${props.bien.id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'No se pudo eliminar el bien.');
    }

    // 5. Emite el nuevo evento de éxito
    emit('delete-success');
    closeModal();

  } catch (err) {
    console.error('Error al eliminar el bien:', err);
    internalErrorMessage.value = err.message; // Muestra el error en el modal
  } finally {
    internalIsSubmitting.value = false;
  }
}

// Limpia el estado interno cuando el modal se abre
watch(() => props.show, (newVal) => {
  if (newVal === true) {
    confirmationText.value = '';
    internalErrorMessage.value = null;
  }
});
</script>