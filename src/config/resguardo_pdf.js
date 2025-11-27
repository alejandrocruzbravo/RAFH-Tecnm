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

    // --- CONSTANTES SOLICITADAS ---
    const CONSTANTES = {
        PLANTEL: "INSTITUTO TECNOLÓGICO DE CHETUMAL",
        CLAVE: "115130014",
        CENTRO_TRABAJO: "23DIT0001L"
    };

    // --- ENCABEZADO PRINCIPAL ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const tituloTexto = tipo === 'LIBERACION' 
        ? 'ACTA DE DEVOLUCIÓN DE BIENES MUEBLES' 
        : 'VALE ÚNICO DE RESGUARDO DE BIENES MUEBLES';
        
    doc.text(tituloTexto, pageWidth / 2, 20, { align: 'center' });

    // --- DATOS DEL PLANTEL (Líneas superiores) ---
    doc.setFontSize(8); // Ajusté un poco el tamaño para que quepa bien el nombre largo
    doc.setFont('helvetica', 'normal');

    let currentY = 35;
    const lineHeight = 7;

    // Fila 1: Plantel y Clave
    doc.text('PLANTEL', marginLeft, currentY);
    // Texto del Plantel centrado sobre la línea
    doc.text(CONSTANTES.PLANTEL, marginLeft + 65, currentY - 1, { align: 'center' });
    doc.line(marginLeft + 25, currentY, marginLeft + 110, currentY); 
    
    doc.text('CLAVE:', marginLeft + 115, currentY);
    doc.text(CONSTANTES.CLAVE, marginLeft + 145, currentY - 1, { align: 'center' });
    doc.line(marginLeft + 130, currentY, pageWidth - marginRight, currentY); 

    currentY += lineHeight;

    // Fila 2: Área y Centro de Trabajo
    // Intentamos sacar el área del objeto departamento si existe
    const nombreArea = resguardante.departamento?.dep_nombre || '';

    doc.text('ÁREA', marginLeft, currentY);
    doc.text(nombreArea, marginLeft + 65, currentY - 1, { align: 'center', maxWidth: 80 }); // MaxWidth por si es muy largo
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

    // Preparar Nombre Completo (Concatenando nombre y apellidos de tu DB)
    const nombreCompleto = `${resguardante.res_nombre || ''} ${resguardante.res_apellidos || ''}`.trim();
    // RFC o CURP
    const rfcCurp = resguardante.res_rfc || resguardante.res_curp || '';

    // Tabla Invertida (Datos arriba, Etiquetas abajo)
    autoTable(doc, {
        startY: currentY,
        body: [
            [
                nombreCompleto, 
                rfcCurp, 
                today, 
                '' 
            ],
            ['NOMBRE', 'RFC/CURP', 'FECHA DE ELABORACIÓN', 'FIRMA']
        ],
        theme: 'grid',
        styles: { 
            fontSize: 8, 
            halign: 'center', 
            valign: 'middle',
            lineColor: [0, 0, 0], 
            lineWidth: 0.1,
            textColor: [0, 0, 0]
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

    // MAPEO DE DATOS SEGÚN TU CAPTURA DE PANTALLA
    const bodyBienes = bienes.map((bien, index) => {
        // Construimos una descripción rica con Marca y Modelo
        const desc = bien.bien_descripcion || '';
        const marca = bien.bien_marca ? ` MARCA: ${bien.bien_marca}` : '';
        const modelo = bien.bien_modelo ? ` MODELO: ${bien.bien_modelo}` : '';
        const descripcionCompleta = `${desc}${marca}${modelo}`;

        return [
            index + 1, 
            bien.bien_codigo || 'S/N', // Clave CAMB
            descripcionCompleta,       // Nombre y Características
            `$${parseFloat(bien.bien_valor_monetario || 0).toFixed(2)}`, // Precio
            bien.bien_serie || 'S/N'   // Serie
        ];
    });

    // Tabla de Bienes (Sin color verde)
    autoTable(doc, {
        startY: currentY,
        head: [['CANTIDAD', 'CLAVE CAMB', 'NOMBRE Y CARACTERÍSTICAS DEL BIEN', 'PRECIO', 'No. DE SERIE']],
        body: bodyBienes,
        theme: 'grid',
        styles: {
            fontSize: 7,
            cellPadding: 2,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            valign: 'middle',
            textColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [255, 255, 255], // BLANCO
            textColor: [0, 0, 0],       // NEGRO
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
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
                        halign: 'right', 
                        fontStyle: 'bold',
                        fillColor: [255, 255, 255],
                        textColor: [0, 0, 0]
                    } 
                }
            ]
        ]
    });

    // Guardar el archivo
    const safeName = (nombreCompleto || 'resguardante').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`Resguardo_${safeName}_${today.replace(/\//g, '-')}.pdf`);
};