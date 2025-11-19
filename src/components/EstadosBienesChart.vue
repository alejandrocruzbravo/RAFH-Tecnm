<template>
  <div class="relative h-24 w-full flex justify-center items-center">
    <Doughnut v-if="hasData" :data="processedData" :options="chartOptions" />
    <p v-else class="text-gray-500 dark:text-gray-400 text-sm">No hay datos para mostrar.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

// Recibimos el Array directo de la API
// Ej: [{ bien_estado: 'Activo', total: 10 }, ...]
const props = defineProps({
  apiData: {
    type: Array,
    default: () => []
  }
})

const hasData = computed(() => props.apiData && props.apiData.length > 0);

// Mapa de colores según el estado
const colorMap = {
    'Activo': '#10B981',       // Green-500
    'En tránsito': '#F97316',  // Orange-500
    'Extravíado': '#DC2626',   // Red-600
    'Baja': '#6B7280'          // Gray-500
};

// Procesamos los datos para Chart.js
const processedData = computed(() => {
  const labels = props.apiData.map(item => item.bien_estado);
  const values = props.apiData.map(item => item.total);
  
  // Generamos los colores dinámicamente basado en la etiqueta
  const bgColors = labels.map(label => colorMap[label] || '#3B82F6'); // Azul por defecto

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: bgColors,
        data: values,
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right', // Leyenda a la derecha para ahorrar espacio vertical
      labels: {
        color: '#9CA3AF', // Gray-400
        font: { family: 'sans-serif', size: 11 },
        boxWidth: 10,
        usePointStyle: true
      }
    },
    tooltip: {
      backgroundColor: '#1F2937',
      titleColor: '#F3F4F6',
      bodyColor: '#F3F4F6',
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: function(context) {
            return ` ${context.label}: ${context.raw}`;
        }
      }
    }
  },
  cutout: '75%' // Anillo más fino
}
</script>