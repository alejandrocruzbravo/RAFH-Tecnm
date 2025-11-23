<template>
  <div v-if="show"
    id="impresion-lote-modal"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 print:hidden"
    @click.self="emit('close')">

    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col 
                print:shadow-none print:max-h-full print:m-0 print:rounded-none print:w-full print:h-full">

      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6 print:hidden">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ title }} 
            <span class="text-sm font-normal text-gray-500 ml-2">({{ itemsProcesados.length }} elementos)</span>
        </h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
      </div>

      <div id="print-area" class="p-6 overflow-y-auto print:overflow-visible print:p-0">
        
        <div class="p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 rounded-lg text-blue-800 dark:text-blue-200 text-sm mb-6 print:hidden">
           Estás visualizando un lote de: <strong>{{ isBienes ? 'BIENES' : 'OFICINAS' }}</strong>.
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
          <div v-for="(item, index) in itemsProcesados" :key="index"
               class="text-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg break-inside-avoid-page print:border-none print:p-2 flex flex-col items-center justify-between h-full">
            
            <p class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 print:text-black print:text-xs print:block mb-1">
              {{ item.titulo_principal }}
            </p>
            
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 print:text-black print:text-[8px] print:block font-mono">
              {{ item.codigo_visible }}
            </p>
            
            <div class="bg-white p-2 rounded">
              <QrcodeVue
                :value="item.valor_qr"
                :size="120"
                level="H"
                render-as="canvas"
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
        
        <button @click="downloadCSV"
               title="Descargar listado en Excel/CSV"
               class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
           CSV
        </button>

        <button @click="downloadPDF"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
           Imprimir / PDF
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Impresión de Etiquetas' },
  lista: { type: Array, required: true, default: () => [] },
  isBienes: { type: Boolean, default: false } // Bandera crucial
});

const emit = defineEmits(['close']);

/**
 * PROPIEDAD COMPUTADA: Normalización de Datos
 * Esta es la validación visual. Transforma cualquier objeto (Bien u Oficina)
 * a una estructura común para que el template no tenga lógica compleja.
 */
const itemsProcesados = computed(() => {
    return props.lista.map(item => {
        if (props.isBienes) {
            // Estructura para BIENES
            return {
                original: item, // Guardamos referencia al original
                titulo_principal: item.nombre || item.bien_descripcion || 'Sin Descripción',
                codigo_visible: item.codigo,
                valor_qr: item.codigo // El QR del bien es su código único
            };
        } else {
            // Estructura para OFICINAS
            return {
              
                original: item,
                titulo_principal: item.nombre || 'Oficina Sin Nombre',
                codigo_visible: item.ofi_codigo,
                valor_qr: item.ofi_codigo // El QR de oficina es su código único
            };
        }
    });
});

// --- Función 1: Descargar PDF ---
const downloadPDF = () => {
  const element = document.getElementById('print-area');
  
  // Ajustes para que se vea bien según si son muchos o pocos
  const opt = {
    margin:       0.5,
    filename:     props.isBienes ? 'etiquetas_bienes.pdf' : 'etiquetas_oficinas.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'cm', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
};

// --- Función 2: Descargar CSV Dinámico ---
const downloadCSV = () => {
  let headers = [];
  let rows = [];

  // VALIDACIÓN LÓGICA: Definir columnas según el tipo
  if (props.isBienes) {
      headers = ['Código', 'Nombre', 'Descripción', 'Departamento'];
      rows = props.lista.map(item => [
          item.codigo,
          item.nombre,
          item.descripcion,
          item.departamento_nombre
      ]);
  } else {
      // Lógica para OFICINAS
      headers = ['Código Oficina', 'Nombre'];
      rows = props.lista.map(item => [
          item.ofi_codigo,
          item.nombre,
      ]);
  }

  // Generación del archivo
  const clean = (text) => `"${(text || '').toString().replace(/"/g, '""')}"`;
  
  const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.map(clean).join(','))
  ].join('\n');

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  // Nombre dinámico
  const date = new Date().toISOString().slice(0,10);
  let filename = 'codigos_qr.csv'; // Nombre por defecto


if (props.lista.length > 0) {
    const primerItem = props.lista[0];

    // Función auxiliar para limpiar el nombre (Quitar acentos, espacios -> guiones)
    const limpiarTexto = (texto) => {
        if (!texto) return 'general';
        return texto.toString()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes (á -> a)
            .replace(/[^a-zA-Z0-9\s-_]/g, '') // Quita caracteres especiales
            .trim()
            .replace(/\s+/g, '_'); // Reemplaza espacios por guiones bajos
    };

    if (props.isBienes) {

        const nombreOfi = limpiarTexto(primerItem.oficina_nombre);
        filename = `QR_bienes_${nombreOfi}`;
    } else {

        const nombreDep = limpiarTexto(
            primerItem.departamento_nombre || 
            (primerItem.departamento ? primerItem.departamento.dep_nombre : '') || 
            'Departamento'
        );
        filename = `QR_oficinas_${nombreDep}`;
    }
}
  
  link.setAttribute('download', `${filename}_${date}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style>
.break-inside-avoid-page {
  page-break-inside: avoid;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ajustes de impresión para ocultar elementos de UI */
@media print {
  body > *:not(#impresion-lote-modal) { display: none !important; }
  
  #print-area { 
      padding: 0; 
      margin: 0; 
      width: 100%;
  }

  #print-area .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* 3 columnas forzadas en papel */
      gap: 10px;
  }

  /* Aseguramos textos negros para ahorro de tinta y legibilidad */
  #print-area * {
      color: black !important;
      border-color: #ddd !important;
  }
}
</style>