<template>
    <div v-if="show && bien" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

        <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">

            <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6 flex-shrink-0">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalles del Bien</h2>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
            </div>

            <div class="p-6 space-y-6 overflow-y-auto">

                <div class="flex flex-col md:flex-row gap-6">

                    <div class="w-full md:w-1/3 flex-shrink-0">
                        <div class="relative aspect-square bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden group border border-gray-200 dark:border-gray-600">
                            
                            <img v-if="bien.foto_url" 
                                 :src="bien.foto_url" 
                                 class="w-full h-full object-cover" 
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

                            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload">
                        </div>
                    </div>

                    <div class="flex-1 space-y-4">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ bien.bien_descripcion || 'Sin Descripción' }}</h3>

                        <div class="flex flex-wrap gap-4 items-center">
                            <div>
                                <span :class="estadoClasses(bien.bien_estado)">
                                    {{ bien.bien_estado || 'N/A' }}
                                </span>
                            </div>

                            <button @click="emit('open-baja-modal')" v-if="bien.bien_estado !== 'Baja'"
                                class="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm">
                                Dar de Baja
                            </button>
                            <button @click="emit('open-move-modal')" v-if="bien.bien_estado !== 'Baja'"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm">
                                Mover a...
                            </button>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-600">
                            <InfoBien label="Código" :value="bien.bien_codigo" />
                            <InfoBien label="Marca" :value="bien.bien_marca" />
                            <InfoBien label="Modelo" :value="bien.bien_modelo" />
                            <InfoBien label="N/S" :value="bien.bien_serie" />
                            <InfoBien label="Valor" :value="`$${bien.bien_valor_monetario || 0}`" />
                            <InfoBien label="Proveedor" :value="bien.bien_provedor" />
                            <InfoBien label="Factura" :value="bien.bien_numero_factura" />
                            <InfoBien label="Adquisición" :value="bien.bien_tipo_adquisicion" />
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Características</h4>
                            <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                                {{ bien.bien_caracteristicas || 'N/A' }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 min-h-[200px]">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Historial de Resguardos</h4>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">(Lógica de historial de resguardos aún no implementada)</p>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 min-h-[200px]">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Historial de Ubicaciones</h4>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">(Lógica de historial de ubicaciones aún no implementada)</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'; // Agregamos ref
import InfoBien from './InfoBien.vue';
import { authenticatedFetch } from '../config/api.js';

const props = defineProps({
    show: { type: Boolean, required: true },
    bien: { type: Object, default: null }
});

const emit = defineEmits(['close', 'open-baja-modal', 'open-move-modal']);

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
        // CORRECCIÓN: Usamos la llave real que vi en tu captura
        const token = localStorage.getItem('auth_token'); 

        // Asegúrate de mantener el puerto 8081 si ese es el que te conecta
        const response = await fetch(`http://127.0.0.1:8081/api/bienes/${props.bien.id}/foto`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviamos el token correcto
                'Accept': 'application/json'
                // SIN Content-Type
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al subir la imagen');
        }

        const data = await response.json();
        props.bien.foto_url = data.foto_url;
        
        // Opcional: Feedback visual rápido
        // alert('Imagen actualizada');

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
</script>