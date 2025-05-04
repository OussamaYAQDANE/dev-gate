<template>
    <div class="w-full mx-auto add">
      <h2 class="text-lg font-semibold mb-4">Monthly progression</h2>
      <canvas ref="chartCanvas" class="w-full h-64" width= "450" height = "300"></canvas>
    </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import { collection, getDocs, Timestamp } from 'firebase/firestore'
  import { db } from '@/firebase/firebase-config'
  import { useRoute } from 'vue-router'
  import { format } from 'date-fns'
  import { subMonths } from 'date-fns'

  Chart.register(...registerables)
  
  const chartCanvas = ref(null)
  const route = useRoute()
  const userId = route.params.uid 
  
  const getMonthlyCounts = async (subcollectionName) => {
    const monthlyData = {}
    const subColRef = collection(db, 'users', userId, subcollectionName)
    const snapshot = await getDocs(subColRef)
    const now = new Date()
  
    snapshot.forEach(doc => {
      const data = doc.data()
      const timestamp = data.createdAt
  
      if (timestamp instanceof Timestamp) {
        const date = timestamp.toDate()
  
        if (date <= now) {
          const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' })
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
        }
      }
    })
  
    return monthlyData
  }
  function getPreviousMonths(count = 6) {
  const months = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const pastDate = subMonths(now, i)
    const monthKey = format(pastDate, 'MMM yyyy')
    months.push(monthKey)
  }
  return months
}
  onMounted(async () => {
    try{
    const competencesData = await getMonthlyCounts('competences')
    const projetsData = await getMonthlyCounts('projects')
    let recentMonths = getPreviousMonths(6);
  
    const competencesCounts = recentMonths.map(month => competencesData[month] || 0)
    const projetsCounts = recentMonths.map(month => projetsData[month] || 0)
  
    const ctx = chartCanvas.value.getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: recentMonths,
        datasets: [
          {
            label: 'Skills',
            data: competencesCounts,
            borderColor: '#5c7cfa',
            backgroundColor: 'rgba(153, 102, 204, 0.2)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Projects',
            data: projetsCounts,
            borderColor: '#51cf66',
            backgroundColor: 'rgba(81, 207, 102, 0.2)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff' 
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff' 
      },
      grid: {
        color: '#444' 
      }
    },
    y: {
      ticks: {
        color: '#ffffff' 
      },
      grid: {
        color: '#444'
      }
    }
  }
}
    }
      
)}catch(err){
  console.log()
}
  })
  </script>
  
  <style scoped>
  canvas {
    max-height: 600px;
  }
  canvas {
  background-color: #1e1e1e; 
  border-radius: 8px;
}
.add{
  background-color: #1e1e2f; 
  padding: 20px;
  border-radius: 15px;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px); 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.add:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 25px rgba(255, 255, 255, 0.15);
}
  </style>
  