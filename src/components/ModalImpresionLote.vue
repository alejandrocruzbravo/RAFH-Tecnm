<template>
  <div v-if="show"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ title }}</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div id="print-area-clone" class="print-area-clone"></div>

      <div class="p-6 overflow-y-auto">
        
        <div class="p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 rounded-lg text-blue-800 dark:text-blue-200 text-sm mb-6 print:hidden">
          Ajusta la configuración de impresión (escala, márgenes) en la ventana de tu navegador para que las etiquetas se ajusten correctamente.
        </div>

        <div id="print-area" class="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2 print-content">
          
          <div v-for="item in lista" :key="item.id"
               class="text-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg break-inside-avoid-page print:border print:border-gray-300 print:p-3 print:bg-white">
            
            <p class="text-sm font-semibold text-gray-900 dark:text-white print:text-black print:text-xs print:block print:font-bold">
              {{ item.nombre }}
            </p>
            
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 print:text-gray-800 print:text-[10px] print:block print:mb-2">
              {{ item.ofi_codigo || 'N/A' }}
            </p>
            
            <div class="flex justify-center bg-white p-2 rounded">
              <QrcodeVue
                :value="item.ofi_codigo || 'N/A'"
                :size="150"
                level="H"
              />
            </div>
          </div>

        </div>
      </div>

      <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6 print:hidden">
        <button @click="emit('close')"
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
          Cerrar
        </button>
        <button @click="printQRs"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
          Imprimir
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';

// --- Props ---
const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Imprimir Lote de QR' },
  lista: { type: Array, required: true, default: () => [] }
});

// --- Emits ---
const emit = defineEmits(['close']);

</script>