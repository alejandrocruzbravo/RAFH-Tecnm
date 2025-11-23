<template>
    <div v-if="show && bien" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

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
                            class="aspect-square bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                            <span class="text-gray-400 dark:text-gray-500">(Espacio para imagen)</span>
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
                            <InfoBien label="Proveedor" :value="bien.bien_proveedor" />
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
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Historial de Resguardos
                        </h4>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">(Lógica de historial de resguardos aún no
                            implementada)</p>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 min-h-[200px]">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Historial de Ubicaciones
                        </h4>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">(Lógica de historial de ubicaciones aún no
                            implementada)</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import InfoBien from './InfoBien.vue';

const props = defineProps({
    show: { type: Boolean, required: true },
    bien: { type: Object, default: null }
});

const emit = defineEmits(['close', 'open-baja-modal', 'open-move-modal']);

const closeModal = () => {
    emit('close');
}

// Función para los colores de estado (la que hicimos antes)
const estadoClasses = (estado) => {
    const base = "inline-block px-3 py-1 rounded-full text-xs font-semibold";
    if (estado === 'Activo') return `${base} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200`;
    if (estado === 'En tránsito') return `${base} bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200`;
    if (estado === 'Extravíado') return `${base} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200`;
    if (estado === 'Baja') return `${base} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
    return `${base} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
};
</script>