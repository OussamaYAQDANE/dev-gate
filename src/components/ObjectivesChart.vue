<script setup>
/* eslint-disable*/
import { defineProps, onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const props = defineProps({
  objectives: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return Array.isArray(value) && 
             value.every(item => {
               const status = item.status?.toLowerCase().replace(/\s+/g, '');
               return 'createdAt' in item && 
                      'name' in item && 
                      ['complete', 'inprogress', 'notstarted'].includes(status);
             });
    }
  }
});

const chartRef = ref(null);
const chartInstance = ref(null);

const updateChart = () => {
  if (!props.objectives.length) return;

  // Normalize statuses first
  const normalizedObjectives = props.objectives.map(obj => ({
    ...obj,
    status: obj.status.toLowerCase().replace(/\s+/g, '')
  }));

  const statusCounts = normalizedObjectives.reduce((acc, obj) => {
    acc[obj.status] = (acc[obj.status] || 0) + 1;
    return acc;
  }, {});

  const total = props.objectives.length;
  const data = [
    (statusCounts['complete'] || 0) / total * 100,
    (statusCounts['inprogress'] || 0) / total * 100,
    (statusCounts['notstarted'] || 0) / total * 100
  ];

  const ctx = chartRef.value?.getContext('2d');
  if (!ctx) return;

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Complete', 'In Progress', 'Not Started'],
      datasets: [{
        data: data,
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderWidth: 0
      }]
    },
    options: {
      circumference: 180,
      rotation: -90,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.label}: ${context.raw.toFixed(1)}% (${Math.round(context.raw / 100 * total)})`;
            }
          }
        }
      }
    }
  });
};

onMounted(updateChart);
watch(() => props.objectives, updateChart, { deep: true });
</script>

<template>
    <h2 style="text-align: center; margin-top: 30px; font-weight: 600;">Objectives Advancement</h2>
  <div class="chart-container">
    <canvas ref="chartRef" />
    <div v-if="!objectives.length" class="empty-state">
      No objectives to display
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  aspect-ratio: 2 / 1; // Wider than tall for semi-circle

  canvas {
    display: block;
    width: 100% !important;
    height: auto !important;
  }

  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #666;
    font-style: italic;
  }
}
</style>