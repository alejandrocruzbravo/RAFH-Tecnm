<template>
  <div class="relative w-full h-full flex justify-center items-center">
    <Line v-if="hasData" :data="processedData" :options="chartOptions" />
    <p v-else class="text-gray-400 text-sm">Sin historial de adquisiciones.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const props = defineProps({
  apiData: { type: Array, default: () => [] }
})

const hasData = computed(() => props.apiData && props.apiData.length > 0);

const processedData = computed(() => ({
  labels: props.apiData.map(d => d.label),
  datasets: [{
    label: 'Nuevos Activos',
    data: props.apiData.map(d => d.value),
    borderColor: '#8B5CF6', // Violet-500
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#8B5CF6'
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { 
      beginAtZero: true,
      grid: { color: '#374151' },
      ticks: { color: '#9CA3AF' }
    },
    x: { 
      grid: { display: false },
      ticks: { color: '#9CA3AF' }
    }
  }
}
</script>