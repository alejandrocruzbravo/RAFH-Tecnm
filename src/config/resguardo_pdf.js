import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFResguardo = (resguardante, bienes, tipo = 'RESGUARDO') => {
    // 1. Inicializar documento
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const marginLeft = 15;
    const marginRight = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString('es-MX');

    // --- CONSTANTES ---
    const CONSTANTES = {
        PLANTEL: "INSTITUTO TECNOLÓGICO DE CHETUMAL",
        CLAVE: "115130014",
        CENTRO_TRABAJO: "23DIT0001L"
    };

    // --- HELPER PARA LIMPIAR DATOS "BASURA" ---
    // Devuelve true si el dato es nulo, vacío o es un placeholder como "SIN SERIE"
    const esDatoInvalido = (valor) => {
        if (!valor) return true; // Nulo o undefined
        const v = String(valor).trim().toUpperCase();
        const invalidos = [
            'SIN SERIE', 'S/N', 'S/S', 'SIN NUMERO', 'NO TIENE', 
            'SIN MARCA', 'SIN MODELO', '0', 'N/A'
        ];
        return invalidos.includes(v);
    };

    // --- ENCABEZADO ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const tituloTexto = tipo === 'LIBERACION' 
        ? 'ACTA DE DEVOLUCIÓN DE BIENES MUEBLES' 
        : 'VALE ÚNICO DE RESGUARDO DE BIENES MUEBLES';
        
    doc.text(tituloTexto, pageWidth / 2, 20, { align: 'center' });

    // --- DATOS DEL PLANTEL ---
    doc.setFontSize(8); 
    doc.setFont('helvetica', 'normal');

    let currentY = 35;
    const lineHeight = 7;

    doc.text('PLANTEL', marginLeft, currentY);
    doc.text(CONSTANTES.PLANTEL, marginLeft + 65, currentY - 1, { align: 'center' });
    doc.line(marginLeft + 25, currentY, marginLeft + 110, currentY); 
    
    doc.text('CLAVE:', marginLeft + 115, currentY);
    doc.text(CONSTANTES.CLAVE, marginLeft + 145, currentY - 1, { align: 'center' });
    doc.line(marginLeft + 130, currentY, pageWidth - marginRight, currentY); 

    currentY += lineHeight;

    const nombreArea = resguardante.departamento?.dep_nombre || '';

    doc.text('ÁREA', marginLeft, currentY);
    doc.text(nombreArea, marginLeft + 65, currentY - 1, { align: 'center', maxWidth: 80 }); 
    doc.line(marginLeft + 25, currentY, marginLeft + 110, currentY); 

    doc.text('CENTRO DE TRABAJO', marginLeft + 115, currentY);
    doc.text(CONSTANTES.CENTRO_TRABAJO, marginLeft + 170, currentY - 1, { align: 'center' });
    doc.line(marginLeft + 155, currentY, pageWidth - marginRight, currentY); 

    // --- DATOS DEL SERVIDOR PÚBLICO ---
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('DATOS DEL SERVIDOR PÚBLICO', pageWidth / 2, currentY, { align: 'center' });

    currentY += 3;

    const nombreCompleto = `${resguardante.res_nombre || ''} ${resguardante.res_apellidos || ''}`.trim();
    const rfcCurp = resguardante.res_rfc || resguardante.res_curp || '';

    autoTable(doc, {
        startY: currentY,
        body: [
            [nombreCompleto, rfcCurp, today, ''],
            ['NOMBRE', 'RFC/CURP', 'FECHA DE ELABORACIÓN', 'FIRMA']
        ],
        theme: 'grid',
        styles: { 
            fontSize: 8, halign: 'center', valign: 'middle',
            lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0]
        },
        didParseCell: function(data) {
            if (data.row.index === 0) {
                data.cell.styles.minCellHeight = 15; 
                data.cell.styles.valign = 'bottom'; 
            }
            if (data.row.index === 1) {
                data.cell.styles.fontStyle = 'bold';
            }
        },
        margin: { left: marginLeft, right: marginRight }
    });

    // --- BIENES ASIGNADOS ---
    currentY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('BIENES ASIGNADOS', pageWidth / 2, currentY, { align: 'center' });

    currentY += 3;

    // MAPEO DE DATOS CON LIMPIEZA AGRESIVA
    const bodyBienes = bienes.map((bien, index) => {
        // 1. Limpieza de Marca y Modelo antes de concatenar
        const marcaRaw = bien.bien_marca;
        const modeloRaw = bien.bien_modelo;
        
        let detalleAdicional = '';
        
        // Solo agregamos la marca si NO es "SIN MARCA" o vacía
        if (!esDatoInvalido(marcaRaw)) {
            detalleAdicional += ` MARCA: ${marcaRaw}`;
        }
        
        // Solo agregamos el modelo si NO es "SIN MODELO" o vacío
        if (!esDatoInvalido(modeloRaw)) {
            detalleAdicional += ` MODELO: ${modeloRaw}`;
        }

        const descripcionCompleta = (bien.bien_descripcion || '') + detalleAdicional;

        // 2. Limpieza de Clave/Código
        // Si es "S/N" o vacío, devuelve cadena vacía
        const codigo = esDatoInvalido(bien.bien_codigo) ? '' : bien.bien_codigo;
        
        // 3. Limpieza de Serie
        // Si es "SIN SERIE", "S/N", etc., devuelve cadena vacía
        const serie = esDatoInvalido(bien.bien_serie) ? '' : bien.bien_serie;

        // 4. Limpieza de Precio
        // Si es 0 o inválido, devuelve cadena vacía
        const precioVal = parseFloat(bien.bien_valor_monetario || 0);
        const precio = (precioVal > 0) ? `$${precioVal.toFixed(2)}` : '';

        return [
            index + 1, 
            codigo, 
            descripcionCompleta,       
            precio, 
            serie
        ];
    });

    // Tabla de Bienes
    autoTable(doc, {
        startY: currentY,
        head: [['#', 'CLAVE CAMB', 'NOMBRE Y CARACTERÍSTICAS DEL BIEN', 'PRECIO', 'No. DE SERIE']],
        body: bodyBienes,
        theme: 'grid',
        styles: {
            fontSize: 7, cellPadding: 2, lineColor: [0, 0, 0],
            lineWidth: 0.1, valign: 'middle', textColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [255, 255, 255], textColor: [0, 0, 0],
            fontStyle: 'bold', halign: 'center', lineWidth: 0.1, lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 }, 
            1: { halign: 'center', cellWidth: 35 }, 
            2: { halign: 'left' }, 
            3: { halign: 'right', cellWidth: 25 }, 
            4: { halign: 'center', cellWidth: 35 }  
        },
        margin: { left: marginLeft, right: marginRight },
        foot: [
            [
                { 
                    content: `TOTAL DE BIENES RESGUARDADOS:  ${bienes.length}`, 
                    colSpan: 5, 
                    styles: { 
                        halign: 'right', fontStyle: 'bold',
                        fillColor: [255, 255, 255], textColor: [0, 0, 0]
                    } 
                }
            ]
        ]
    });

    const safeName = (nombreCompleto || 'resguardante').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`Resguardo_${safeName}_${today.replace(/\//g, '-')}.pdf`);
};