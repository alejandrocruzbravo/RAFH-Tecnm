<template>
  <div v-if="show"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-sm w-full">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Generador QR</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div class="p-6 text-center">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
        
        <p classS="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ value }}</p>

        <div class="flex justify-center p-4 bg-white rounded-lg">
          <QrcodeVue
            ref="qrCodeCanvas"
            :value="value"
            :size="256"
            level="H"
          />
        </div>
      </div>

      <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
        <button @click="emit('close')"
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
          Cerrar
        </button>
        <button @click="downloadQR"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
          Descargar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QrcodeVue from 'qrcode.vue'; // <-- Importa la librería que instalamos

// --- Props ---
const props = defineProps({
  show: { type: Boolean, required: true },
  // El título legible, ej. "Oficina de Almacén"
  title: { type: String, default: 'Código QR' },
  // El valor a codificar, ej. "OFI-ALM-001"
  value: { type: String, required: true }
});

// --- Emits ---
const emit = defineEmits(['close']);

// --- Lógica de Descarga ---
const qrCodeCanvas = ref(null);

const downloadQR = () => {
  if (!qrCodeCanvas.value || !qrCodeCanvas.value.canvas) return;

  // Obtenemos el elemento <canvas> de la librería
  const canvas = qrCodeCanvas.value.canvas;
  
  // Convertimos el canvas a una URL de imagen PNG
  const dataUrl = canvas.toDataURL('image/png');

  // Creamos un link temporal para la descarga
  const link = document.createElement('a');
  link.href = dataUrl;
  // Usamos el 'value' como nombre de archivo
  link.download = `${props.value}.png`;
  
  // Simulamos el clic
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>