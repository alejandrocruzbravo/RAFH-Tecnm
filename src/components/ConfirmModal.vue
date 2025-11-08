<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

            <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ title }}</h2>
                <button @click="emit('cancel')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div v-if="errorMessage"
                class="bg-red-700 text-white px-6 py-4 border-b border-red-900 flex justify-between items-center"
                role="alert">
                <span class="font-medium text-sm">{{ errorMessage }}</span>
                <button @click="emit('clearError')"
                    class="font-bold text-2xl text-white opacity-70 hover:opacity-100 leading-none">&times;</button>
            </div>

            <div class="p-6">
                <p class="text-gray-700 dark:text-gray-300" v-html="message"></p>

                <p v-if="confirmClass.includes('red')" class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                    Esta acción no se puede deshacer.
                </p>
            </div>

            <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
                <button @click="emit('cancel')" :disabled="isSubmitting"
                    class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">
                    Cancelar
                </button>
                <button @click="emit('confirm')" :disabled="isSubmitting"
                    :class="['px-4 py-2 text-white rounded-lg transition-colors font-medium disabled:opacity-50', confirmClass]">
                    {{ isSubmitting ? 'Eliminando...' : confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

import { defineProps, defineEmits } from 'vue'

// Definimos las "props" que el componente padre (Areas.vue) le enviará
defineProps({
    show: { type: Boolean, required: true },
    title: { type: String, default: 'Confirmar' },
    message: { type: String, required: true }, // Usaremos v-html para este
    errorMessage: { type: String, default: null },
    isSubmitting: { type: Boolean, default: false },
    confirmText: { type: String, default: 'Confirmar' },
    confirmClass: { type: String, default: 'bg-red-600 hover:bg-red-700' } // Rojo por defecto
})

// Definimos los eventos que le enviaremos al padre
const emit = defineEmits(['confirm', 'cancel', 'clearError'])
</script>