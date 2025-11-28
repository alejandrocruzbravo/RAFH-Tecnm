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

      <div v-if="itemsProcesados.length > 0" class="p-6 text-center">
        
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
             {{ itemsProcesados[0].titulo_principal }}
        </h3>
        
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono">
            {{ itemsProcesados[0].codigo_visible }}
        </p>

        <div class="flex justify-center p-4 bg-white rounded-lg">
          <QrcodeVue
            :value="itemsProcesados[0].valor_qr" 
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
import { ref, computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const props = defineProps({
  show: { type: Boolean, required: true },
  // Props opcionales para compatibilidad
  title: { type: String, default: '' },
  value: { type: String, default: '' },
  // El objeto principal
  item: { type: Object, default: () => ({}) },
  isBienes: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

// --- 1. NORMALIZACIÓN DE DATOS (Adaptado para 1 solo ítem) ---
const itemsProcesados = computed(() => {
    // Envolvemos el item único en un array para que el 'for' del PDF funcione igual
    const rawItem = props.item || {};
    
    let processedItem = {};

    if (props.isBienes) {
        processedItem = {
            original: rawItem,
            // Buscamos en el objeto o usamos los props de respaldo
            titulo_principal: rawItem.nombre || rawItem.bien_descripcion || props.title || 'Sin Descripción',
            codigo_visible: rawItem.codigo || rawItem.bien_codigo || props.value || 'S/N',
            valor_qr: rawItem.codigo || rawItem.bien_codigo || props.value || 'S/N'
        };
    } else {
        processedItem = {
            original: rawItem,
            titulo_principal: rawItem.nombre || props.title || 'Oficina Sin Nombre',
            codigo_visible: rawItem.ofi_codigo || props.value || 'S/N',
            valor_qr: rawItem.ofi_codigo || props.value || 'S/N'
        };
    }

    return [processedItem]; // Retornamos un array de 1 elemento
});


// --- 2. GENERACIÓN DE PDF (Diseño 91mm x 24mm) ---
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

// --- 3. DESCARGA CSV (Corregida) ---
const downloadCSV = () => {
    let headers = [];
    let rowData = [];
    
    // Usamos el ÚNICO item procesado (posición 0)
    const currentItem = itemsProcesados.value[0];

    if (props.isBienes) {
        headers = ['Código', 'Nombre', 'Descripción', 'Departamento'];
        rowData = [
            currentItem.codigo_visible,
            currentItem.titulo_principal,
            currentItem.original.bien_caracteristicas || currentItem.original.descripcion || '',
            currentItem.original.departamento_nombre || ''
        ];
    } else {
        headers = ['Código Oficina', 'Nombre'];
        rowData = [
            currentItem.codigo_visible,
            currentItem.titulo_principal
        ];
    }

    const clean = (text) => `"${(text || '').toString().replace(/"/g, '""')}"`;
    const csvContent = [headers.join(','), rowData.map(clean).join(',')].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().slice(0,10);
    const safeName = currentItem.titulo_principal.replace(/[^a-zA-Z0-9]/g, '_');
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR_${safeName}_${date}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>