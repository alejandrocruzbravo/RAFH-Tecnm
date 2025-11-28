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
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

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
const downloadPDF = async () => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
    });

    const labelWidth = 91;
    const labelHeight = 24;
    const marginX = 10; 
    const marginY = 10; 
    const gapX = 3;
    const gapY = 0; 

    let col = 0;
    let row = 0;

    for (const item of itemsProcesados.value) {
        
        let curX = marginX + (col * (labelWidth + gapX));
        let curY = marginY + (row * (labelHeight + gapY));

        // Salto de página
        if (curY + labelHeight > 270) {
            doc.addPage();
            col = 0; 
            row = 0;
            curX = marginX; 
            curY = marginY;
        }

        // --- BORDES ---
        doc.setLineWidth(0.3);
        doc.setDrawColor(0);
        doc.rect(curX, curY, labelWidth, labelHeight);
        doc.setLineWidth(0.1);
        doc.rect(curX + 1, curY + 1, labelWidth - 2, labelHeight - 2);

        // --- QR ---
        const qrSize = 18; 
        const qrX = curX + labelWidth - qrSize - 3; 
        const qrY = curY + (labelHeight - qrSize) / 2;

        try {
            const qrDataUrl = await QRCode.toDataURL(item.valor_qr, { margin: 0, width: 100 });
            doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
        } catch (err) { console.error(err); }

        // --- TEXTOS ---
        const textX = curX + 3;
        const maxTextWidth = labelWidth - qrSize - 7; 
        let cursorY = curY + 5; 

        if (props.isBienes) {
            // Diseño Bienes REORGANIZADO
            const txtTitulo = (item.titulo_principal || 'SIN TITULO').toString().toUpperCase();
            const txtDesc = (item.original.bien_caracteristicas || item.original.descripcion || item.original.bien_descripcion || 'SIN CARACTERÍSTICAS').toString();
            const txtDepto = (item.original.departamento_nombre || 'SIN DEPARTAMENTO').toString();
            const txtCodigo = (item.codigo_visible || 'S/N').toString();

            // 1. CÓDIGO (Ahora va arriba - Fuente 11 Negrita)
            doc.setFont("helvetica", "bold"); 
            doc.setFontSize(11);
            doc.text(txtCodigo, textX, cursorY);
            cursorY += 5; // Espacio después del código

            // 2. NOMBRE / TÍTULO (Bajó de posición - Fuente 8 Normal)
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            const titleLines = doc.splitTextToSize(txtTitulo, maxTextWidth);
            doc.text(titleLines, textX, cursorY);
            cursorY += (titleLines.length * 3.5); 

            // 3. DESCRIPCIÓN (Debajo del nombre - Fuente 8 Normal)
            // doc.setFont("helvetica", "normal"); // Ya está seteada arriba
            // doc.setFontSize(8);                 // Ya está seteada arriba
            const descLines = doc.splitTextToSize(txtDesc, maxTextWidth);
            // Calculamos cuánto espacio nos queda antes de chocar con el borde inferior o depto
            const maxDescLines = titleLines.length > 1 ? 1 : 2; 
            const descLinesLimited = descLines.slice(0, maxDescLines);
            doc.text(descLinesLimited, textX, cursorY);
            cursorY += (descLinesLimited.length * 3.5);

            // 4. DEPARTAMENTO (Al final, letras pequeñas o negritas según gusto)
            doc.setFont("helvetica");
            doc.setFontSize(8); // Reduje un poco para asegurar que quepa
            const deptoCorto = txtDepto.length > 40 ? txtDepto.substring(0, 40) + '...' : txtDepto;
            doc.text(deptoCorto, textX, curY + labelHeight - 2); // Lo anclo al fondo de la etiqueta

        } else {
            // Diseño Oficinas (Se mantiene igual)
            const txtNombre = (item.titulo_principal || 'OFICINA').toString();
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11); 
            const nameLines = doc.splitTextToSize(txtNombre, maxTextWidth);
            
            const startY = nameLines.length === 1 ? cursorY + 1 : cursorY;
            doc.text(nameLines, textX, startY);
        }

        col++;
        if (col > 1) { col = 0; row++; }
    }

    const prefix = props.isBienes ? 'etiqueta_bien' : 'etiqueta_oficina';
    doc.save(`${prefix}_${new Date().toISOString().slice(0,10)}.pdf`);
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