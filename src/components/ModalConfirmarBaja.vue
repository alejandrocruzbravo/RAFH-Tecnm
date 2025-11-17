<template>
  <div v-if="show && bien"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Confirmar Baja de Bien</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div v-if="errorMessage"
        class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center" role="alert">
        <span class="font-medium text-sm">{{ errorMessage }}</span>
        <button @click="emit('clearError')" class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
      </div>

      <div class="p-6 space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Estás a punto de dar de baja el siguiente bien:
        </p>
        <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p class="font-bold text-gray-900 dark:text-white">{{ bien.bien_descripcion }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Código: {{ bien.bien_codigo || 'N/A' }}</p>
        </div>
        <p class="font-medium text-red-600 dark:text-red-400">
          Esta acción cambiará su estado a "Baja" y no se podrá deshacer.
        </p>
      </div>

      <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
        <button @click="emit('close')" :disabled="isSubmitting"
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">
          Cancelar
        </button>
        <button @click="emit('confirm-baja')" :disabled="isSubmitting"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50">
          {{ isSubmitting ? 'Procesando...' : 'Confirmar Baja' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
  bien: { type: Object, default: null },
  isSubmitting: { type: Boolean, default: false },
  errorMessage: { type: String, default: null }
});

const emit = defineEmits(['close', 'confirm-baja', 'clearError']);
</script>