<template>
  <div class="relative w-full h-full flex justify-center items-center">
    <Pie v-if="hasData" :data="processedData" :options="chartOptions" />
    <p v-else class="text-gray-400 text-sm">Sin datos de antigüedad.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  apiData: { type: Array, default: () => [] }
})

const hasData = computed(() => props.apiData && props.apiData.length > 0);

const processedData = computed(() => ({
  labels: props.apiData.map(d => d.label),
  datasets: [{
    data: props.apiData.map(d => d.value),
    backgroundColor: [
      '#60A5FA', // Blue-400
      '#34D399', // Emerald-400
      '#FBBF24', // Amber-400
      '#F87171'  // Red-400
    ],
    borderWidth: 2,
    borderColor: 'transparent'
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: { 
        usePointStyle: true, 
        boxWidth: 8,
        color: '#9CA3AF' // Color del texto de leyenda
      }
    }
  }
}
</script>