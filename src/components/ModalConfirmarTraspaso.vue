<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-700">
      
      <div class="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          Confirmar Traspaso
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
      </div>

      <div class="p-6">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Estás a punto de autorizar la transferencia del siguiente bien:
        </p>

        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
          <p class="font-bold text-blue-900 dark:text-blue-100 text-sm">{{ bienDescripcion }}</p>
          <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">Código: {{ bienCodigo }}</p>
        </div>

        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 px-2">
          <div class="text-center">
            <p class="text-xs uppercase font-bold text-red-500 mb-1">Origen</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ nombreOrigen }}</p>
          </div>
          
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>

          <div class="text-center">
            <p class="text-xs uppercase font-bold text-green-500 mb-1">Destino</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ nombreDestino }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button 
          @click="$emit('confirm')" 
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          :disabled="isSubmitting"
        >
          <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isSubmitting ? 'Procesando...' : 'Autorizar Traspaso' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  isSubmitting: Boolean,
  bienDescripcion: String,
  bienCodigo: String,
  nombreOrigen: String,
  nombreDestino: String
});
</script>