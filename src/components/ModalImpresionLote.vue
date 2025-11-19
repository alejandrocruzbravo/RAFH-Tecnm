<template>
  <div v-if="show"
    id="impresion-lote-modal"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 print:hidden"
    @click.self="emit('close')">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col 
               print:shadow-none print:max-h-full print:m-0 print:rounded-none print:w-full print:h-full">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6 print:hidden">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ title }}</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div id="print-area" class="p-6 overflow-y-auto print:overflow-visible print:p-0">
        
        <div class="p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 rounded-lg text-blue-800 dark:text-blue-200 text-sm mb-6 print:hidden">
           Selecciona una opción de descarga a continuación.
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
          <div v-for="item in lista" :key="item.id"
               class="text-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg break-inside-avoid-page print:border-none print:p-2">
            
            <p class="text-sm font-semibold text-gray-900 dark:text-white truncate print:text-black print:text-xs print:block">
              {{ item.nombre }}
            </p>
            
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 print:text-black print:text-[8px] print:block">
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
        
        <button v-if="isBienes" 
                @click="downloadCSV"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
           Descargar CSV
        </button>

        <button @click="downloadPDF"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
           Descargar PDF
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Imprimir Lote de QR' },
  lista: { type: Array, required: true, default: () => [] },
  isBienes: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

// --- Función 1: Descargar PDF ---
const downloadPDF = () => {
  const element = document.getElementById('print-area');
  const opt = {
    margin:       1,
    filename:     'etiquetas_qr.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'cm', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
};

// --- Función 2: Descargar CSV (ACTUALIZADA) ---
const downloadCSV = () => {
  const headers = ['Código de bien', 'Secuencia', 'Oficina', 'Departamento'];
  
  const rows = props.lista.map(item => {
    const codigo = item.ofi_codigo || '';
    const secuencia = codigo.length >= 5 ? codigo.slice(-5) : codigo;
    // Función auxiliar para escapar comillas en el CSV
    const clean = (text) => `"${(text || '').toString().replace(/"/g, '""')}"`;

    return [
      clean(codigo),
      clean(secuencia),
      clean(item.oficina_nombre),
      clean(item.departamento_nombre)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // --- LÓGICA DE NOMBRE DE ARCHIVO ---
  let filename = 'bienes_qr.csv'; // Nombre por defecto
  
  // Si hay datos, usamos el nombre de la oficina del primer ítem
  if (props.lista.length > 0 && props.lista[0].oficina_nombre) {
    // Limpiamos el nombre (quitamos caracteres especiales y espacios por guiones bajos)
    const cleanOficinaName = props.lista[0].oficina_nombre
        .replace(/[^a-zA-Z0-9\s-_]/g, '') // Quita caracteres raros
        .trim()
        .replace(/\s+/g, '_'); // Espacios -> Guiones bajos
        
    filename = `QR_${cleanOficinaName}.csv`;
  }
  // ----------------------------------

  link.setAttribute('href', url);
  link.setAttribute('download', filename); // <-- Usamos el nombre dinámico
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style>
.break-inside-avoid-page {
  page-break-inside: avoid;
}

/* Estilos específicos para que html2pdf capture los colores correctamente */
@media print {
  body > *:not(#impresion-lote-modal) { display: none !important; }
  
  #print-area .print\:text-black { color: #000 !important; }
  #print-area .print\:text-xs { font-size: 0.75rem !important; }
  #print-area .print\:text-\[8px\] { font-size: 8px !important; }
  #print-area .print\:block { display: block !important; }
}
</style>