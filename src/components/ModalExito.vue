<template>
  <div v-if="show" class="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"></div>

    <div class="relative bg-white dark:bg-dark-surface rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all animate-bounce-in overflow-hidden border border-gray-100 dark:border-gray-700">
      
      <div 
        :class="[
          'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 transition-colors',
          type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
        ]"
      >
        <svg 
          v-if="type === 'success'"
          :class="['h-10 w-10 animate-check', type === 'success' ? 'text-green-600 dark:text-green-400' : '']" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>

        <svg 
          v-else
          :class="['h-10 w-10 animate-check', type === 'error' ? 'text-red-600 dark:text-red-400' : '']" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
      
      <div class="mt-6 h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          :class="[
            'h-full animate-progress origin-left transition-colors',
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Definimos las props, incluyendo el nuevo 'type'
const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Notificación' },
  message: { type: String, default: '' },
  // type puede ser 'success' o 'error'
  type: { 
    type: String, 
    default: 'success',
    validator: (value) => ['success', 'error'].includes(value)
  }
})
</script>

<style scoped>
/* Animación de entrada */
.animate-bounce-in {
  animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

/* Animación de dibujo del icono (funciona para el check y la X) */
.animate-check {
  animation: checkDraw 0.6s ease-out forwards;
  stroke-dasharray: 60; /* Aumentado un poco para asegurar que cubra la X */
  stroke-dashoffset: 60;
}
@keyframes checkDraw {
  to { stroke-dashoffset: 0; }
}

/* Animación de la barra de tiempo (4 segundos para que coincida con tu lógica) */
.animate-progress {
  /* Cambiado a 4s para coincidir con el setTimeout de tu componente padre */
  animation: progress 4s linear forwards; 
}
@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
</style>