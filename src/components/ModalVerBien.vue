<template>
    <div v-if="show && bienData" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

        <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">

            <div
                class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6 flex-shrink-0">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalles del Bien</h2>
                <button @click="closeModal"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
            </div>

            <div class="p-6 space-y-6 overflow-y-auto">

                <div class="flex flex-col md:flex-row gap-6">

                    <div class="w-full md:w-1/3 flex-shrink-0">
                        <div
                            class="relative aspect-square bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden group border border-gray-200 dark:border-gray-600">

                            <img v-if="bienData.foto_url" :src="bienData.foto_url" class="w-full h-full object-cover"
                                alt="Foto del bien" />

                            <div v-else class="text-center p-4">
                                <span class="text-4xl block mb-2">📷</span>
                                <span class="text-gray-400 dark:text-gray-500 text-sm">(Clic para agregar foto)</span>
                            </div>

                            <div @click="triggerFileInput"
                                class="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                                <span class="text-white font-bold text-lg mb-1">
                                    {{ isUploading ? 'Subiendo...' : 'Cambiar Imagen' }}
                                </span>
                                <span v-if="!isUploading" class="text-gray-200 text-xs">Max 2MB (jpg, png)</span>
                            </div>

                            <input type="file" ref="fileInput" class="hidden" accept="image/*"
                                @change="handleFileUpload">
                        </div>
                    </div>

                    <div class="flex-1 space-y-4">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ bienData.bien_descripcion || 'Sin Descripción' }}</h3>

                        <div class="flex flex-wrap gap-4 items-center">
                            <div>
                                <span :class="estadoClasses(bienData.bien_estado)">
                                    {{ bienData.bien_estado || 'N/A' }}
                                </span>
                            </div>

                            <button @click="emit('open-baja-modal')" v-if="bienData.bien_estado !== 'Baja'"
                                class="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm">
                                Dar de Baja
                            </button>
                            <button @click="emit('open-move-modal')" v-if="bienData.bien_estado !== 'Baja'"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm">
                                Mover a...
                            </button>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-600">
                            <InfoBien label="Código" :value="bienData.bien_codigo" />
                            <InfoBien label="Marca" :value="bienData.bien_marca" />
                            <InfoBien label="Modelo" :value="bienData.bien_modelo" />
                            <InfoBien label="N/S" :value="bienData.bien_serie" />
                            <InfoBien label="Valor" :value="`$${bienData.bien_valor_monetario || 0}`" />
                            <InfoBien label="Proveedor" :value="bienData.bien_provedor" />
                            <InfoBien label="Factura" :value="bienData.bien_numero_factura" />
                            <InfoBien label="Adquisición" :value="bienData.bien_tipo_adquisicion" />
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Características</h4>
                            <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                                {{ bienData.bien_caracteristicas || 'N/A' }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 min-h-[200px] flex flex-col">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Historial de Resguardos</h4>
                        <span v-if="isLoadingDetails" class="text-xs text-blue-600 animate-pulse font-medium">Actualizando...</span>
                    </div>

                    <div class="overflow-y-auto max-h-[150px] pr-1">
                        <table class="w-full text-left text-xs">
                            <thead class="text-gray-500 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th class="pb-2 font-medium">Fecha</th>
                                    <th class="pb-2 font-medium">Resguardante</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                                <tr v-if="isLoadingDetails && historialResguardos.length === 0">
                                    <td colspan="2" class="py-4 text-center">
                                        <div class="flex justify-center items-center gap-2">
                                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else-if="historialResguardos.length === 0">
                                    <td colspan="2" class="py-4 text-center text-gray-400 italic">
                                        Sin cambios registrados.
                                    </td>
                                </tr>
                                <tr v-else v-for="item in historialResguardos" :key="item.id">
                                    <td class="py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                        {{ item.fecha }}
                                    </td>
                                    <td class="py-2 font-medium text-gray-800 dark:text-gray-200 uppercase">
                                        {{ item.resguardante }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 min-h-[200px] flex flex-col">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Historial de Ubicaciones</h4>
                        <span v-if="isLoadingDetails" class="text-xs text-blue-600 animate-pulse font-medium">Actualizando...</span>
                    </div>

                    <div class="overflow-y-auto max-h-[150px] pr-1">
                        <table class="w-full text-left text-xs">
                            <thead class="text-gray-500 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th class="pb-2 font-medium">Fecha</th>
                                    <th class="pb-2 font-medium">Destino</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                                <tr v-if="isLoadingDetails && historialUbicaciones.length === 0">
                                    <td colspan="2" class="py-4 text-center">
                                        <div class="flex justify-center items-center gap-2">
                                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span class="text-gray-500 text-[10px]">Cargando movimientos...</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else-if="historialUbicaciones.length === 0">
                                    <td colspan="2" class="py-4 text-center text-gray-400 italic">
                                        Sin movimientos registrados.
                                    </td>
                                </tr>
                                <tr v-else v-for="item in historialUbicaciones" :key="item.id">
                                    <td class="py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                        {{ item.fecha }}
                                    </td>
                                    <td class="py-2 font-medium text-gray-800 dark:text-gray-200">
                                        {{ item.destino }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'; 
import InfoBien from './InfoBien.vue';
import { authenticatedFetch } from '../config/api.js';

const props = defineProps({
    show: { type: Boolean, required: true },
    bien: { type: Object, default: null }
});

const emit = defineEmits(['close', 'open-baja-modal', 'open-move-modal']);

// --- NUEVO: Estado local para manejar la carga de detalles ---
const bienData = ref(null); 
const isLoadingDetails = ref(false);

// --- Watcher para inicializar datos y buscar detalles ---
watch(() => props.bien, (newVal) => {
    if (newVal) {
        // 1. Copia inmediata de los props (para mostrar lo básico al instante)
        bienData.value = { ...newVal };
        
        // 2. Si el modal se va a mostrar, buscamos la data completa en la API
        if (props.show) {
            fetchFullData(newVal.id);
        }
    }
}, { immediate: true });

// --- Función para obtener detalles completos (Show) ---
const fetchFullData = async (id) => {
    isLoadingDetails.value = true;
    try {
        // Petición al endpoint SHOW de Laravel: Route::get('/bienes/{id}', ...)
        const response = await authenticatedFetch(`/bienes/${id}`);
        
        if (!response.ok) {
            // Si falla, no rompemos todo, nos quedamos con la data básica
            console.warn('No se pudieron cargar detalles adicionales');
            return;
        }
        
        const data = await response.json();
        
        // Actualizamos bienData con la respuesta completa que incluye relaciones
        // (movimientos_bien, resguardos, etc.)
        bienData.value = data.data || data; // Maneja si viene envuelto en 'data' o directo
        
    } catch (error) {
        console.error("Error obteniendo detalles del bien:", error);
    } finally {
        isLoadingDetails.value = false;
    }
};

// Lógica de Imagen
const fileInput = ref(null);
const isUploading = ref(false);

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    isUploading.value = true;
    const formData = new FormData();
    formData.append('imagen', file);

    try {
        const token = localStorage.getItem('auth_token');

        // Usamos bienData.value.id
        const response = await fetch(`http://192.168.1.24:5174/api/bienes/${bienData.value.id}/foto`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al subir la imagen');
        }

        const data = await response.json();
        
        // Actualizamos la URL en nuestro objeto local
        bienData.value.foto_url = data.foto_url;

    } catch (error) {
        console.error(error);
        alert('Error: ' + error.message);
    } finally {
        isUploading.value = false;
        event.target.value = '';
    }
};

const closeModal = () => {
    emit('close');
}

const estadoClasses = (estado) => {
    const base = "inline-block px-3 py-1 rounded-full text-xs font-semibold";
    if (estado === 'Activo') return `${base} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200`;
    if (estado === 'En tránsito') return `${base} bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200`;
    if (estado === 'Extravíado') return `${base} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200`;
    if (estado === 'Baja') return `${base} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
    return `${base} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
};

// Helper para fecha
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(date);
};

// 1. HISTORIAL DE RESGUARDOS (Usando bienData)
const historialResguardos = computed(() => {
    // Verificamos sobre bienData.value
    if (!bienData.value?.resguardos) return [];

    return bienData.value.resguardos.map((r, index) => {
        const nombre = r.res_nombre || r.resguardante?.res_nombre || '';
        const apellidos = r.res_apellidos || r.resguardante?.res_apellidos || '';
        
        return {
            id: r.id || index, 
            fecha: formatDate(r.resguardo_fecha_asignacion),
            resguardante: `${nombre} ${apellidos}`.trim() || 'SIN NOMBRE'
        };
    });
});

// 2. HISTORIAL DE UBICACIONES (Usando bienData)
const historialUbicaciones = computed(() => {
    // Verificamos sobre bienData.value
    const rawData = bienData.value?.movimientos_bien;
    
    if (!rawData || rawData.length === 0) {
        return [];
    }

    const finalData = rawData.map((m, index) => {
        const destinoNombre = m.destino_oficina || m.departamento?.dep_nombre || 'Ubicación Desconocida';

        return {
            id: m.id || index,
            fecha: formatDate(m.movimiento_fecha || m.created_at),
            destino: destinoNombre
        };
    });
    
    return finalData;
});
</script>