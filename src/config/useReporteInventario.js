import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importa tus logotipos (ajusta las rutas si es necesario)
import imgSep from '/images/EDUCACION-LOGO.png';
import imgTecnm from '/images/Logo-TecNM.png';
import imgItch from '/images/logoEscuela.png';

const cargarImagen = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
  });
};

/**
 * Genera el reporte PDF de inventario por oficina.
 * @param {Object} datosOficina - { nombre, area, departamento, jefe_departamento }
 * @param {Array} bienes - Array de objetos bien provenientes de la API
 */
export const generarReporteInventario = async (datosOficina, bienes) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const marginX = 15;
  let currentY = 15;
  const pageWidth = 216;

  // --- 1. CARGA DE LOGOS ---
  try {
    const [logo1, logo2, logo3] = await Promise.all([
      cargarImagen(imgSep),
      cargarImagen(imgTecnm),
      cargarImagen(imgItch)
    ]);
    // Ajuste de posiciones de logos
    doc.addImage(logo1, 'PNG', marginX, 10, 50, 15);
    doc.addImage(logo2, 'PNG', (pageWidth / 2) - 15, 10, 30, 15);
    doc.addImage(logo3, 'PNG', pageWidth - marginX - 18, 8, 18, 18);
  } catch (error) {
    console.error("Error cargando logos:", error);
  }

  currentY += 25;

  // --- 2. TÍTULO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("INVENTARIO DE BIENES MUEBLES", pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  // --- 3. ENCABEZADO (DATOS DE LA OFICINA) ---
  doc.setFontSize(9);
  
  const labelX = marginX;
  const valueX = marginX + 45; // Alineación de los valores
  const lineHeight = 6;

  const printLine = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, labelX, currentY);
      doc.setFont("helvetica", "normal");
      doc.text((value || 'SIN DATO').toString().toUpperCase(), valueX, currentY);
      currentY += lineHeight;
  };

  printLine("ÁREA:", datosOficina.area);
  printLine("DEPARTAMENTO:", datosOficina.departamento);
  printLine("JEFE DE DEPARTAMENTO:", datosOficina.jefe_departamento);
  printLine("OFICINA:", datosOficina.nombre);

  currentY += 2; // Espacio extra antes de la tabla

  // --- 4. PREPARACIÓN DE DATOS DE LA TABLA ---
  const tableBody = bienes.map(bien => {
    // A. Concatenación Código + Secuencia (si existe)
    const codigo = (bien.bien_codigo || '') + (bien.bien_sec_alfabetica || '');

    // B. Lógica para la columna "RESGUARDANTE"
    let infoResguardo = '';

    // Revisamos si el array 'resguardos' tiene elementos (según tu imagen backend)
    if (bien.resguardos && bien.resguardos.length > 0) {
        // Tomamos el primero (asumiendo que es el activo)
        const resguardo = bien.resguardos[0];
        if (resguardo.resguardante) {
            infoResguardo = `${resguardo.resguardante.res_nombre} ${resguardo.resguardante.res_apellidos}`;
        } else {
            // Fallback por si la relación viene incompleta
            infoResguardo = 'ASIGNADO (S/N)';
        }
    } else {
        // SI NO ESTÁ ASIGNADO -> Mostrar nombre del DEPARTAMENTO
        infoResguardo = datosOficina.departamento;
    }

    return [
      codigo,
      bien.bien_descripcion || '',
      bien.bien_serie || 'S/N',
      infoResguardo.toUpperCase() // Convertimos a mayúsculas para uniformidad
    ];
  });

  // --- 5. GENERAR TABLA ---
  autoTable(doc, {
    startY: currentY,
    head: [['CÓDIGO', 'DESCRIPCIÓN', 'SERIE', 'RESGUARDANTE / UBICACIÓN']],
    body: tableBody,
    theme: 'plain', // Diseño limpio
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      lineColor: [0, 0, 0], // Bordes negros finos
    },
    headStyles: {
      fillColor: [220, 220, 220], // Gris claro para encabezado
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 35, halign: 'center' }, // Código
      1: { cellWidth: 'auto' },               // Descripción
      2: { cellWidth: 30, halign: 'center' }, // Serie
      3: { cellWidth: 50, halign: 'center' }  // Resguardante
    },
    // Pie de página en cada hoja
    didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        
        doc.setFontSize(8);
        doc.text(
            `Página ${data.pageNumber}`, 
            pageWidth - marginX, 
            pageHeight - 10, 
            { align: 'right' }
        );
        
        const fecha = new Date().toLocaleDateString('es-MX');
        doc.text(`Fecha de emisión: ${fecha}`, marginX, pageHeight - 10);
    }
  });

  // --- DESCARGA ---
  const fechaStr = new Date().toISOString().slice(0, 10);
  const nombreArchivo = `Inventario_${datosOficina.nombre.replace(/[^a-zA-Z0-9]/g, '_')}_${fechaStr}.pdf`;
  doc.save(nombreArchivo);
};