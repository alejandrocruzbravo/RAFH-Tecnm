<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
    <div class="bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
      
      <div class="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Papelera de Bienes (Baja)</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>

      <div class="p-6 overflow-y-auto flex-1">
        <div v-if="isLoading" class="text-center py-10 text-gray-500">Cargando bajas...</div>
        
        <table v-else class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-4 py-3">Código</th>
              <th class="px-4 py-3">Descripción</th>
              <th class="px-4 py-3">Marca/Modelo</th>
              <th class="px-4 py-3">Fecha Baja</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="bienesList.length === 0">
              <td colspan="5" class="px-4 py-6 text-center">No hay bienes dados de baja.</td>
            </tr>
            <tr v-for="bien in bienesList" :key="bien.id" class="bg-white border-b dark:bg-dark-bg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ bien.bien_codigo }}</td>
              <td class="px-4 py-3">{{ bien.bien_descripcion }}</td>
              <td class="px-4 py-3">{{ bien.bien_marca }} / {{ bien.bien_modelo }}</td>
              <td class="px-4 py-3">{{ bien.updated_at || 'N/A' }}</td> <td class="px-4 py-3 text-right">
                <button @click="emit('reactivar', bien)" 
                        class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
                  Re-activar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-gray-300 dark:border-gray-600 flex justify-end">
        <button @click="emit('close')" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  fetchFunction: { type: Function, required: true }
});

const emit = defineEmits(['close', 'reactivar']);

const bienesList = ref([]);
const isLoading = ref(false);

const fetchBajas = async () => {
  isLoading.value = true;
  try {
    // Asumo ruta que filtra por estado
    // Si tu API usa query params: /api/bienes?estado=Baja
    const res = await props.fetchFunction('/bienes/bajas'); 
    const data = await res.json();
    bienesList.value = data.data || data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

watch(() => props.show, (val) => {
  if (val) fetchBajas();
});
</script>