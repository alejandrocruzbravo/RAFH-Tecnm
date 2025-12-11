<template>
    <div v-if="isSessionExpired" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] transition-opacity duration-300">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-bounce-in">
            
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
                <svg class="h-8 w-8 text-red-600 dark:text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                La sesión ha expirado
            </h3>
            
            <p class="text-gray-500 dark:text-gray-300 mb-6">
                Por seguridad, su sesión se ha cerrado automáticamente. Será redirigido al login en unos segundos...
            </p>

            <div class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 overflow-hidden">
                <div class="bg-red-600 h-1.5 rounded-full animate-progress"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { isSessionExpired } from '../config/sessionState.js';
</script>

<style scoped>
/* Animación simple para la barra de progreso de 3 segundos */
@keyframes progress {
    from { width: 0%; }
    to { width: 100%; }
}
.animate-progress {
    animation: progress 3s linear forwards;
}
</style>