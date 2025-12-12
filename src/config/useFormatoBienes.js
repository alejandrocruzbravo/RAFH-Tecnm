import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import imgSep from '/images/EDUCACION-LOGO.png';
import imgTecnm from '/images/Logo-TecNM.png';
import imgItch from '/images/logoEscuela.png';
/**
 * Genera el PDF de "Resguardo Interno de Bienes" o "Alta de Bienes"
 * @param {Object} data - Datos generales (Oficina, Depto, Características comunes)
 * @param {Array} items - Lista de bienes (Códigos y Series)
 */
const cargarImagen = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); // Evita problemas de CORS
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
  });
}

export const generarFormatoBienes = async (data, items) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter' // Tamaño Carta
  });
  
  // --- CONFIGURACIÓN DE FUENTES Y MEDIDAS ---
  const marginX = 20;
  let currentY = 20;
  const pageWidth = 216; // Ancho carta aprox

  // --- 1. ENCABEZADO (LOGOS) ---
  // Aquí debes cargar tus imagenes en Base64 o URL.
  // Ejemplo: doc.addImage(logoEducacionBase64, 'PNG', marginX, 10, 40, 15);
  
  // Placeholder visual para los logos (borra esto cuando pongas los reales)
try {
      // Convertimos las 3 imágenes a Base64 simultáneamente
      const [logo1, logo2, logo3] = await Promise.all([
          cargarImagen(imgSep),
          cargarImagen(imgTecnm),
          cargarImagen(imgItch)
      ]);

      // Dibujar Logo Izquierdo (Educación)
      // (imagen, formato, x, y, ancho, alto)
      doc.addImage(logo1, 'PNG', marginX, 10, 50, 15); 

      // Dibujar Logo Central (TecNM)
      // Calculamos el centro: (AnchoPagina / 2) - (AnchoLogo / 2)
      doc.addImage(logo2, 'PNG', (pageWidth / 2) - 15, 10, 30, 15);

      // Dibujar Logo Derecho (ITC)
      doc.addImage(logo3, 'PNG', pageWidth - marginX - 18, 8, 18, 18);

  } catch (error) {
      console.error("Error cargando logos:", error);
      // Si fallan las imágenes, el PDF se genera igual pero sin ellas
  }

  currentY += 20; // Bajamos después de los logos

  // --- 2. FOLIO SIBISEP ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const textFolio = "FOLIO SIBISEP:";
  const folioX = pageWidth - marginX - 60; // Posición calculada a la derecha
  doc.text(textFolio, folioX, currentY);
  doc.line(folioX + 28, currentY + 1, pageWidth - marginX, currentY + 1); // Línea

  currentY += 15;

  // --- 3. DATOS DE UBICACIÓN (Área, Depto, Oficina) ---
  // Función auxiliar para dibujar renglones: "ETIQUETA: _______________"
  const drawLineField = (label, value, y) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, marginX, y);
    
    const labelWidth = doc.getTextWidth(label) + 2;
    const lineStart = marginX + labelWidth;
    const lineEnd = pageWidth - marginX;
    
    doc.line(lineStart, y + 1, lineEnd, y + 1); // Línea base
    
    if (value) {
        doc.setFont("helvetica", "bold"); // Valor en negrita
        doc.text(value.toUpperCase(), lineStart + 2, y);
    }
  };

  drawLineField("ÁREA:", data.area_nombre, currentY);
  currentY += 7;
  drawLineField("DEPARTAMENTO:", data.departamento_nombre, currentY);
  currentY += 7;
  drawLineField("OFICINA:", data.oficina_nombre, currentY);

  currentY += 15;

  // --- 4. TÍTULO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("DATOS DEL BIEN", pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 10;

  // --- 5. DETALLES DEL BIEN (Formulario) ---
  // Usamos la misma lógica pero a veces compartiendo renglón (Marca | Modelo)
  
  doc.setFontSize(10);

  // CAMB
  drawLineField("CAMB:", data.bien_clave, currentY); 
  currentY += 8;
  
  // DESCRIPCIÓN
  drawLineField("DESCRIPCIÓN:", data.bien_descripcion, currentY);
  currentY += 8;

  // CARACTERÍSTICAS
  drawLineField("CARACTERÍSTICAS:", data.bien_caracteristicas, currentY);
  currentY += 8;

  // MARCA Y MODELO (Comparten línea)
  const midPoint = pageWidth / 2;
  
  // Marca
  doc.setFont("helvetica", "normal");
  doc.text("MARCA:", marginX, currentY);
  doc.line(marginX + 15, currentY + 1, midPoint - 5, currentY + 1);
  doc.setFont("helvetica", "bold");
  doc.text((data.bien_marca || '').toUpperCase(), marginX + 17, currentY);

  // Modelo
  doc.setFont("helvetica", "normal");
  doc.text("MODELO:", midPoint, currentY);
  doc.line(midPoint + 18, currentY + 1, pageWidth - marginX, currentY + 1);
  doc.setFont("helvetica", "bold");
  doc.text((data.bien_modelo || '').toUpperCase(), midPoint + 20, currentY);
  
  currentY += 8;

  // CANTIDAD Y VALOR (Comparten línea)
  // Cantidad
  doc.setFont("helvetica", "normal");
  doc.text("CANTIDAD:", marginX, currentY);
  doc.line(marginX + 22, currentY + 1, midPoint - 5, currentY + 1);
  doc.setFont("helvetica", "bold");
  doc.text((data.cantidad || items.length || '1').toString(), marginX + 24, currentY);

  // Valor
  doc.setFont("helvetica", "normal");
  doc.text("VALOR:", midPoint, currentY);
  doc.line(midPoint + 15, currentY + 1, pageWidth - marginX, currentY + 1);
  doc.setFont("helvetica", "bold");
  const valorFmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.bien_valor_monetario || 0);
  doc.text(valorFmt, midPoint + 17, currentY);

  currentY += 8;

  // DOCUMENTACIÓN SOPORTE (Dos líneas en el diseño original)
  doc.setFont("helvetica", "normal");
  doc.text("DOCUMENTACIÓN", marginX, currentY);
  currentY += 5;
  doc.text("SOPORTE:", marginX, currentY);
  // Línea larga al lado de "SOPORTE:"
  doc.line(marginX + 22, currentY + 1, pageWidth - marginX, currentY + 1);
  doc.setFont("helvetica", "bold");
  doc.text((data.bien_numero_factura || '').toUpperCase(), marginX + 25, currentY);

  currentY += 8;

  // FORMA DE ADQUISICIÓN
  // Mapeo rápido de IDs a Texto si es necesario
  const tiposAdq = { 1: 'COMPRA DIRECTA', 2: 'DONACIÓN', 3: 'ALMACÉN' };
  const adqTexto = tiposAdq[data.bien_tipo_adquisicion] || data.bien_tipo_adquisicion || '';
  drawLineField("FORMA DE ADQUISICIÓN:", adqTexto, currentY);

  currentY += 8;

  // FECHA DE ADQUISICIÓN
  drawLineField("FECHA DE ADQUISICIÓN:", data.bien_fecha_alta, currentY);

  currentY += 10;

  // --- 6. TABLA DE CÓDIGOS Y SERIES ---
const listaBienes = Array.isArray(items) ? items : (items.data || []);

  // 2. Construcción del cuerpo de la tabla con la validación de 'SIN SERIE'
  if (items.cantidad === 1) {
      // --- CASO 1: UN SOLO BIEN ---
      // Pintamos el Código y Serie como parte del formulario, SIN tabla.
      
      const elBien = listaBienes[0];
      const serieVisible = (elBien.bien_serie === 'SIN SERIE') ? '' : (elBien.bien_serie || '');

      // Opción B: Renglones completos (Más limpio si el código es largo)
      drawLineField("CÓDIGO:", elBien.bien_codigo, currentY);
      currentY += 8;
      drawLineField("NÚMERO DE SERIE:", serieVisible, currentY);

  } else {
      // --- CASO 2: MÚLTIPLES BIENES ---
      // Pintamos la tabla
      
      const tableBody = listaBienes.map(item => {
          const serieVisible = (item.bien_serie === 'SIN SERIE') ? '' : (item.bien_serie || '');
          return [item.bien_codigo || '', serieVisible];
      });

      autoTable(doc, {
        startY: currentY,
        head: [['CÓDIGO', 'NÚMERO DE SERIE']],
        body: tableBody,
        theme: 'plain',
        styles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
          textColor: [0, 0, 0],
          fontSize: 10,
          halign: 'center',
          cellPadding: 2,
        },
        headStyles: {
          fontStyle: 'bold',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.3,
          lineColor: [0, 0, 0]
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.3,
        margin: { left: marginX, right: marginX },
      });
  }

  // --- DESCARGA ---
  const fecha = new Date().toISOString().slice(0,10);
  // Cambiamos el nombre si es único o múltiple para fácil identificación
  const tipoArchivo = items.cantidad === 1 ? 'Resguardo_Unico' : 'Resguardo_Lote';
  const nombreArchivo = `${tipoArchivo}_${data.bien_clave}_${fecha}.pdf`;
  
  doc.save(nombreArchivo);
};