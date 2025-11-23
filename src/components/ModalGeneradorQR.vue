<template>
  <div v-if="show"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-sm w-full">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Generador QR 
            <span class="text-xs font-normal text-gray-500 ml-1">({{ isBienes ? 'Bien' : 'Oficina' }})</span>
        </h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div class="p-6 text-center">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ datosDisplay.titulo }}
        </h3>
        
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono">
            {{ datosDisplay.codigo }}
        </p>

        <div class="flex justify-center p-4 bg-white rounded-lg">
          <QrcodeVue
            ref="qrCodeCanvas"
            :value="datosDisplay.codigo" 
            :size="256"
            level="H"
          />
        </div>
      </div>

      <div class="flex gap-2 justify-end border-t border-gray-300 dark:border-gray-600 p-6">
        <button @click="emit('close')" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
          Cerrar
        </button>
        <button @click="downloadCSV" title="Descargar datos en CSV" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          CSV
        </button>
        <button @click="downloadQR" title="Descargar imagen PNG" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          PNG
        </button>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; // <--- Importar computed
import QrcodeVue from 'qrcode.vue'; 

const props = defineProps({
  show: { type: Boolean, required: true },
  // Dejamos title y value como opcionales por si los quieres usar manualmente
  title: { type: String, default: '' },
  value: { type: String, default: '' },
  item: { type: Object, default: () => ({}) },
  isBienes: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

// --- COMPUTED: Normalización de datos para visualización ---
const datosDisplay = computed(() => {
    // Si es un Bien
    if (props.isBienes) {
        return {
            titulo: props.item.bien_descripcion || props.item.nombre || props.title || 'Sin Descripción',
            codigo: props.item.bien_codigo || props.item.codigo || props.value || 'N/A'
        };
    } 
    // Si es Oficina
    else {
        return {
            titulo: props.item.nombre || props.title || 'Oficina Sin Nombre',
            codigo: props.item.ofi_codigo || props.value || 'N/A'
        };
    }
});

// --- Lógica de Descarga PNG ---
const qrCodeCanvas = ref(null);

const downloadQR = () => {
  if (!qrCodeCanvas.value) return;
  const canvas = qrCodeCanvas.value.canvas || qrCodeCanvas.value.$el;
  if (!canvas || typeof canvas.toDataURL !== 'function') return;
  
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  // Usamos el código computado para el nombre del archivo
  link.download = `QR-${datosDisplay.value.codigo}.png`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- Lógica de Descarga CSV ---
const downloadCSV = () => {
    let headers = [];
    let rowData = [];

    // Usamos datosDisplay para asegurar consistencia
    if (props.isBienes) {
        console.log(props.item);
        headers = ['Código', 'Nombre','Descripción', 'Departamento'];
        rowData = [
            datosDisplay.value.codigo,
            datosDisplay.value.titulo,
            props.item.bien_caracteristicas || 'SIN DESCRIPCIÓN',
            props.item.departamento_nombre || 'SIN DEPARTAMENTO'
        ];
    } else {
        headers = ['Código Oficina', 'Nombre'];
        rowData = [
            datosDisplay.value.codigo,
            datosDisplay.value.titulo,
        ];
    }

    const clean = (text) => `"${(text || '').toString().replace(/"/g, '""')}"`;
    const csvContent = [headers.join(','), rowData.map(clean).join(',')].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Nombre dinámico (Simplificado)
    const date = new Date().toISOString().slice(0,10);
    const safeName = datosDisplay.value.titulo.replace(/[^a-zA-Z0-9]/g, '_');
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR_${safeName}_${date}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>