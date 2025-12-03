<template>
  <div class="p-6 bg-gray-5">
    
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Métricas Operativas</h2>
      <p class="text-gray-500 text-sm">Visión general financiera y logística</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
        <h3 class="text-gray-700 dark:text-gray-200 font-semibold mb-4">Valor Total por Categoría ($)</h3>
        <div class="relative h-64">
          <ChartFinancialBar :apiData="financialData" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
        <h3 class="text-gray-700 dark:text-gray-200 font-semibold mb-4">Tendencia de Adquisiciones</h3>
        <div class="relative h-64">
          <ChartAcquisitionLine :apiData="acquisitionData" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
        <h3 class="text-gray-700 dark:text-gray-200 font-semibold mb-4">Top 5 Ubicaciones con más Activos</h3>
        <div class="relative h-64">
          <ChartLocationBar :apiData="locationData" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
        <h3 class="text-gray-700 dark:text-gray-200 font-semibold mb-4">Antigüedad de los Activos</h3>
        <div class="relative h-64 flex justify-center">
          <ChartAgePie :apiData="ageData" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Asume que crearás estos 4 archivos en la carpeta components
import ChartFinancialBar from '../../../components/ChartFinancialBar.vue'
import ChartAcquisitionLine from '../../../components/ChartAcquisitionLine.vue'
import ChartLocationBar from '../../../components//ChartLocationBar.vue'
import ChartAgePie from '../../../components/ChartAgePie.vue'

// --- DATOS MOCK (Sustituir con tu API Laravel) ---
// 1. Datos Financieros
const financialData = ref([
  { label: 'Cómputo', value: 120000 },
  { label: 'Mobiliario', value: 45000 },
  { label: 'Vehículos', value: 350000 },
  { label: 'Maquinaria', value: 80000 },
])

// 2. Datos Adquisiciones (Últimos 6 meses)
const acquisitionData = ref([
  { label: 'Jul', value: 5 },
  { label: 'Ago', value: 12 },
  { label: 'Sep', value: 8 },
  { label: 'Oct', value: 20 },
  { label: 'Nov', value: 15 },
  { label: 'Dic', value: 25 },
])

// 3. Datos Ubicación
const locationData = ref([
  { label: 'Almacén Central', value: 150 },
  { label: 'Oficina Ventas', value: 45 },
  { label: 'Sucursal Norte', value: 30 },
  { label: 'Bodega B', value: 25 },
  { label: 'Recepción', value: 10 },
])

// 4. Datos Antigüedad
const ageData = ref([
  { label: '< 1 Año', value: 40 },
  { label: '1 - 3 Años', value: 85 },
  { label: '3 - 5 Años', value: 30 },
  { label: '> 5 Años', value: 15 },
])
</script>