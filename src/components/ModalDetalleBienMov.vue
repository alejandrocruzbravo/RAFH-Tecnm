<template>
  <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
    
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative bg-white dark:bg-dark-surface rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border border-gray-200 dark:border-gray-700">
      
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Detalles del Bien
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-6">
        <div class="flex flex-col md:flex-row gap-6">
            
            <div class="w-full md:w-1/3 flex flex-col gap-2">
                <div class="aspect-square w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative group">
                    
                    <img 
                        v-if="bien.bien_foto" 
                        :src="getImageUrl(bien.bien_foto)" 
                        alt="Foto del bien" 
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        @error="imageError = true"
                    >
                    
                    <div v-if="!bien.bien_foto || imageError" class="flex flex-col items-center text-gray-400 dark:text-gray-500">
                        <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span class="text-xs">Sin fotografía</span>
                    </div>
                </div>
                
                <div class="text-center">
                    <span :class="[
                        'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                        bien.bien_estado === 'Activo' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        bien.bien_estado === 'En tránsito' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    ]">
                        {{ bien.bien_estado }}
                    </span>
                </div>
            </div>

            <div class="w-full md:w-2/3 space-y-4">
                
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">{{ bien.bien_descripcion }}</h2>
                    <p class="text-sm text-blue-600 dark:text-blue-400 font-mono mt-1">{{ bien.bien_codigo }}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Marca</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ bien.bien_marca || 'N/A' }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Modelo</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ bien.bien_modelo || 'N/A' }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg col-span-1 sm:col-span-2">
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Número de Serie</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white font-mono">{{ bien.bien_serie || 'N/A' }}</p>
                    </div>
                </div>

                <div class="mt-4">
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Características / Observaciones del Bien</p>
                    <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 max-h-24 overflow-y-auto">
                        <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ bien.bien_caracteristicas || 'Sin características registradas.' }}</p>
                    </div>
                </div>

            </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button 
          @click="$emit('close')"
          class="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
        >
          Cerrar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  bien: { type: Object, required: true }
})

defineEmits(['close'])

const imageError = ref(false)

// Resetear error de imagen al cambiar de bien
watch(() => props.bien, () => {
    imageError.value = false;
})

// Función para construir la URL completa de la imagen
const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Ajusta la URL base según tu configuración de Laravel Storage
    // Por defecto Laravel linkea storage en /storage
    return `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8081'}/storage/${path}`;
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>