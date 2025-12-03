<template>
  <div class="relative w-full h-full flex justify-center items-center">
    <Bar v-if="hasData" :data="processedData" :options="chartOptions" />
    <p v-else class="text-gray-400 text-sm">Sin datos financieros.</p>
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
    label: 'Valor ($)',
    data: props.apiData.map(d => d.value),
    backgroundColor: '#3B82F6', // Blue-500
    borderRadius: 4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { 
       beginAtZero: true,
       ticks: { 
         callback: (val) => '$' + val,
         color: '#9CA3AF'
       },
       grid: { color: '#374151' }
    },
    x: { 
      grid: { display: false },
      ticks: { color: '#9CA3AF' }
    }
  }
}
</script>