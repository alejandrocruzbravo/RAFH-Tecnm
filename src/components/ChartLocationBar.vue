<template>
  <div class="relative w-full h-full flex justify-center items-center">
    <Bar v-if="hasData" :data="processedData" :options="chartOptions" />
    <p v-else class="text-gray-400 text-sm">Sin datos de ubicación.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const props = defineProps({
  apiData: { type: Array, default: () => [] }
})

const hasData = computed(() => props.apiData && props.apiData.length > 0);

const processedData = computed(() => ({
  labels: props.apiData.map(d => d.label),
  datasets: [{
    label: 'Cantidad',
    data: props.apiData.map(d => d.value),
    backgroundColor: '#10B981', // Emerald-500
    borderRadius: 4,
    barThickness: 20
  }]
}))

const chartOptions = {
  indexAxis: 'y', // ESTO HACE LAS BARRAS HORIZONTALES
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { 
      grid: { display: true, color: '#374151' },
      ticks: { color: '#9CA3AF' }
    },
    y: { 
      grid: { display: false },
      ticks: { color: '#9CA3AF' }
    }
  }
}
</script>