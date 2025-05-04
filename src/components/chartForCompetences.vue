<template>
  <div class="container" :class="{'add': totaaal}">
  <div v-show="!totaaal" class="w-full max-w-sm mx-auto">
  <h2 class="text-lg font-semibold mb-4 text-center">Skills statistics</h2>
  <div class="text-center py-5 empty-state">
      <i class="bi bi-layers display-1 text-muted"></i>
      <p class="mt-3">{{ isOwner ? "You don't have any skills yet." : "This user doesn't have any skills yet." }}</p>
      <button 
        v-if="isOwner"
        class="btn btn-accent mt-3"
        @click="$router.push(`${auth.currentUser.uid}/skills`)"
      >
        <i class="bi bi-plus-lg me-2"></i> Add Your First Skill
      </button>
    </div>
  </div>
  <div v-show="totaaal" class="w-full max-w-sm mx-auto">
    <h2 class="text-lg font-semibold mb-4 text-center">Skills statistics</h2>
    <div class="w-[280px] h-[280px] mx-auto relative">
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    </div>
    <div style="display: flex; justify-content: center;">
    <div class="chart-legend mt-3 chartLegend" >
        <div class="legend-item d-inline-block mr-3">
          <span class="legend-color beginner">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="levels">Beginner ({{ skillLevels.beginner || 0 }})</span>
        </div>
        <div class="legend-item d-inline-block mr-3">
          <span class="legend-color intermediate">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="levels">Intermediate ({{ skillLevels.intermediate || 0 }})</span>
        </div>
        <div class="legend-item d-inline-block mr-3">
          <span class="legend-color advanced">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="levels">Advanced ({{ skillLevels.advanced || 0}})</span>
        </div>
        <div class="legend-item d-inline-block mr-3">
          <span class="legend-color expert">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="levels">Expert ({{ skillLevels.expert || 0}})</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import { doc, getDoc } from 'firebase/firestore'
import { db , auth} from '@/firebase/firebase-config'
let totaaal = ref('')
watch(totaaal, ()=>{console.log(totaaal.value, 'lkshflkshslhfshdlkhs')})
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const route = useRoute()
let isOwner = ref('')
isOwner = (route.params.uid == auth.currentUser.uid)
const chartCanvas = ref(null)
let chartInstance = null

const skillLevels = ref({
  beginner: 0,
  intermediate: 0,
  advanced: 0,
  expert: 0
})


const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      datasets: [{
        data: [
          skillLevels.value.beginner,
          skillLevels.value.intermediate,
          skillLevels.value.advanced,
          skillLevels.value.expert
        ],
        backgroundColor: ['#FFD43B', '#4dabf7', '#69db7c', '#845ef7'],
        borderWidth: 0
      }]
    },
    options: {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%', 
  plugins: {
    legend: { display: false }
  }
}

  })
}

const uploadData = async (uid) => {
  const userRef = doc(db, 'users', uid)
  const userData = await getDoc(userRef)
  if (userData.exists()) {
    const data = userData.data()
    skillLevels.value = {
      beginner: data.numbeginner || 0,
      intermediate: data.numintermediate || 0,
      advanced: data.numadvanced || 0,
      expert: data.numexpert || 0
    }
    totaaal.value = skillLevels.value.beginner+skillLevels.value.intermediate+skillLevels.value.advanced+skillLevels.value.expert
    
    try{
    createChart()
    }catch(err){
      console.log()
    }
  }
}

onMounted(() => {
  try{
    uploadData(route.params.uid)
  }catch(err){
    console.log()
  }
})
</script>
<style scoped>
.container {
  --primary-glow: #64ffda;
  --card-violet: #4a00e0;
  --card-pink: #7928ca;
  --card-blue: #0070f3;
  --card-green: #00b894;
  --bg-dark: #0f172a;
  --card-bg: #1e293b;
  --text-light: #e2e8f0;
  --border-subtle: #2d3748;

  --accent-color: var(--primary-glow);
  --accent-hover: #4cd3b0;
  --accent-light: rgba(100, 255, 218, 0.1);
  --accent-medium: rgba(100, 255, 218, 0.2);
  --accent-glow: rgba(100, 255, 218, 0.5);
  max-width: 500px;
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
.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.beginner {
  background-color: rgba(255, 193, 7, 0.8);
}

.intermediate {
  background-color: rgba(52, 152, 219, 0.8);
}

.advanced {
  background-color: rgba(46, 204, 113, 0.8);
}

.expert {
  background-color: rgba(155, 89, 182, 0.8);
}
.levels{
  margin-right: 20px;
}
.empty-state {
  min-height: 200px;
  display: flex;
  min-width: 500px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6b7280;
  background-color: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px dashed #2d3748;
}
.btn {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
.btn-accent {
  background: linear-gradient(145deg, var(--accent-color), var(--accent-hover));
  color: var(--bg-dark);
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  color: var(--bg-dark);
}
.btn {
  border-radius: 8px;
  margin: 0 3px;
  font-weight: 500;
  padding: 8px 16px;
}
</style>