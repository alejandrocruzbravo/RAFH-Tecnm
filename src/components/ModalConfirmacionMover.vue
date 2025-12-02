<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
    <div class="bg-white dark:bg-dark-bg rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all scale-100">
      
      <div class="p-6 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
          <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
      </div>

      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex gap-3 justify-center">
        <button 
          @click="$emit('cancel')" 
          class="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="$emit('confirm')" 
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 transition-colors"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: 'Confirmación' },
  message: { type: String, default: '¿Estás seguro de realizar esta acción?' }
})
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>