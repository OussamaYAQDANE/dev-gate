<template>
  <div class="container py-5">
    
    <div class="profile-section mb-5">
      <div class="row">
        <div class="col-md-4 text-center text-md-start mb-4 mb-md-0">
          <div class="profile-image-container">
            <img 
              :src="userData?.profilePic || DefaultProfile" 
              :alt="`${userData?.firstName || 'User'}'s profile`" 
              class="profile-image img-fluid rounded-circle border border-3 border-primary"
            />
          </div>
        </div>
        <div class="col-md-8">
          <div class="profile-info card p-4 h-100">
            <div v-if="isLoading" class="d-flex justify-content-center align-items-center h-100">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="userData" class="profile-content">
              <h1 class="display-5 fw-bold mb-1">
                {{ userData.firstName }} {{ userData.lastName }}
              </h1>
              <h3 class="text-primary fs-5 mb-3">@{{ userData.username }}</h3>
              <div class="profile-bio p-3 rounded mb-3">
                <p class="lead mb-0">{{ userData.bio }}</p>
              </div>
              <div class="profile-actions d-flex gap-2">
                <a href="https://real-time-chat-7ab21.web.app/search">
                  <button class="btn btn-primary" v-if="userRoute != currentUser">
                    <i class="bi bi-envelope-fill me-2"></i>Contact
                  </button>
                </a>
              </div>
            </div>
            <div v-else class="text-center p-4">
              <i class="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3"></i>
              <p class="lead">User profile not found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="text-center mb-5 section-title">{{userData?.firstName}}'s Portfolio</h2>

    <div class="row g-4" >

      <div class="col-md-6 col-lg-3" @click="$router.push(`${userRoute}/skills`)">
        <div class="card h-100 card-competences">
          <div class="card-body text-center">
            <h4 class="card-title">Skills: {{ num_competence }}</h4>
          </div>
        </div>
      </div>

     
      <div class="col-md-6 col-lg-3" @click="$router.push(`${userRoute}/projects`)">
        <div class="card h-100 card-projects">
          <div class="card-body text-center">
            <h4 class="card-title">Projects: {{ userData?.projects_num || 0 }}</h4>
          </div>
        </div>
      </div>

    
      <div class="col-md-6 col-lg-3" @click="$router.push(`${userRoute}/objectives`)">
        <div class="card h-100 card-objectives">
          <div class="card-body text-center">
            <h4 class="card-title">Objectives: {{ objectives.length }}</h4>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3" @click="$router.push(`${userRoute}/timeline`)">
        <div class="card h-100 card-timeline">
          <div class="card-body text-center">
            <h4 class="card-title">Timeline</h4>
          </div>
        </div>
      </div>
    </div>
    
  
    <div class="coding-hours-section my-5">
      <h2 class="text-center mb-4 section-title">Coding Hours</h2>
      <div class="row g-4">
        
        <div v-if="isOwner" class="col-md-5">
          <div class="card h-100 card-coding-hours">
            <div class="card-body">
              <h4 class="card-title mb-4 text-center">Record My Hours</h4>
              <div class="mb-3">
                <label for="hours" class="form-label">Hours coded today:</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="hours" 
                  v-model="hoursToday" 
                  min="0" 
                  max="24" 
                  step="0.5"
                />
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Date:</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="date" 
                  v-model="selectedDate"
                />
              </div>
              <button @click="saveHours" class="btn btn-primary w-100">
                <i class="bi bi-save me-2"></i>Save
              </button>
              <div v-if="saveMessage" :class="['alert mt-3', messageStatus === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
                {{ saveMessage }}
              </div>
            </div>
          </div>
        </div>
        
     
        <div :class="isOwner ? 'col-md-7' : 'col-md-10 mx-auto'">
          <div class="card h-100">
            <div class="card-body">
              <h4 class="card-title mb-4 text-center">Daily Coding Hours ({{ currentMonthName }})</h4>
              <div class="coding-chart-container" ref="chartContainer" style="height: 300px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex_horizental">
      <LastActivities style="height: 100%;width: 40%; background-color: rgba(0, 0, 0, 0.2); margin-top: 40px;"/>
      <div class="objective_chart">
        <ObjectivesChart style="width: 100%; height:100%" :objectives="objectives"/>
      </div>
    </div>

    <br>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <chartForCompetences/>
      <ChartForProgrression/>
    </div>
  </div>
</template>
  
<script setup>
/*eslint-disable*/
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebase-config';
import DefaultProfile from "@/assets/default-profile.png";
import LastActivities from '@/components/LastActivities.vue';
import ObjectivesChart from '@/components/ObjectivesChart.vue';
import { onAuthStateChanged } from 'firebase/auth';
import Chart from 'chart.js/auto';

import chartForCompetences from '@/components/chartForCompetences.vue';
import ChartForProgrression from '@/components/chartForProgrression.vue';

const route = useRoute();
const userRoute = route.params.uid;
const userData = ref(null);
const isLoading = ref(true);
const objectives = ref([]);
const currentUser = ref('');


const hoursToday = ref(0);
const selectedDate = ref(formatDate(new Date()));
const saveMessage = ref('');
const messageStatus = ref('');
const chartContainer = ref(null);
const chartInstance = ref(null);
const codingHours = ref([]);
const isOwner = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());


function formatDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  
  return [year, month, day].join('-');
}

const currentMonthName = computed(() => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[currentMonth.value];
});

async function getObjectives(){
  const docSnap = await getDocs(collection(db, "users", userRoute, "objectives"))
  objectives.value = docSnap.docs.map((doc)=>({id:doc.id, ...doc.data()}))
} 

const fetchCodingHours = async () => {
  try {
    const userRef = doc(db, "users", userRoute);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.codingHours) {
        codingHours.value = userData.codingHours;
      }
    }
  } catch (error) {
    console.error("Error fetching coding hours:", error);
  }
};

const saveHours = async () => {
  if (hoursToday.value < 0 || hoursToday.value > 24) {
    saveMessage.value = "Please enter a value between 0 and 24 hours";
    messageStatus.value = "error";
    return;
  }
  
  try {
    const dateToSave = new Date(selectedDate.value);
    const entry = {
      date: dateToSave,
      hours: parseFloat(hoursToday.value),
      month: dateToSave.getMonth(),
      year: dateToSave.getFullYear(),
      timestamp: new Date()
    };

    const userRef = doc(db, "users", userRoute);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      let updatedHours = userData.codingHours || [];
      
      const existingEntryIndex = updatedHours.findIndex(item => 
        item.date && new Date(item.date.seconds * 1000).toDateString() === dateToSave.toDateString()
      );
      
      if (existingEntryIndex >= 0) {
        updatedHours[existingEntryIndex].hours = entry.hours;
        updatedHours[existingEntryIndex].timestamp = entry.timestamp;
      } else {
        updatedHours.push(entry);
      }
      
      await updateDoc(userRef, {
        codingHours: updatedHours
      });
      
      codingHours.value = updatedHours;
      renderCodingHoursChart();
      
      saveMessage.value = "Hours successfully recorded!";
      messageStatus.value = "success";
      
      setTimeout(() => {
        saveMessage.value = "";
      }, 3000);
    }
  } catch (error) {
    console.error("Error saving hours:", error);
    saveMessage.value = "Error saving hours";
    messageStatus.value = "error";
  }
};

const dailyChartData = computed(() => {
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const daysData = Array(daysInMonth).fill(0);
  
  codingHours.value.forEach(entry => {
    const entryDate = entry.date instanceof Date ? 
      entry.date : new Date(entry.date.seconds * 1000);
    
    if (entryDate.getMonth() === currentMonth.value && entryDate.getFullYear() === currentYear.value) {
      const day = entryDate.getDate() - 1; 
      daysData[day] += entry.hours;
    }
  });
  
  return daysData;
});


const renderCodingHoursChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  
  if (chartContainer.value) {
    const ctx = document.createElement('canvas');
    chartContainer.value.innerHTML = '';
    chartContainer.value.appendChild(ctx);
    
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    const dayLabels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    
    chartInstance.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dayLabels,
        datasets: [{
          label: 'Coding Hours',
          data: dailyChartData.value,
          backgroundColor: 'rgba(77, 171, 247, 0.6)',
          borderColor: 'rgba(77, 171, 247, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Hours',
              color: '#e2e8f0'
            },
            ticks: {
              color: '#e2e8f0'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Day',
              color: '#e2e8f0'
            },
            ticks: {
              color: '#e2e8f0'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#e2e8f0'
            }
          }
        }
      }
    });
  }
};

let num_competence = ref(0);

onMounted(async () => {
  try {


    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser.value = user.uid;
        isOwner.value = (user.uid === route.params.uid);
      }
    });
    

    const userDoc = await getDoc(doc(db, "users", userRoute));
    if (userDoc.exists()) {
      userData.value = userDoc.data();
      num_competence.value = (userDoc.data().numbeginner||0) + 
                             (userDoc.data().numintermediate||0) + 
                             (userDoc.data().numexpert||0) + 
                             (userDoc.data().numadvanced||0);
    } else {
      console.log("No such user document!");
    }
    
    await fetchCodingHours();
    renderCodingHoursChart();
    
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    isLoading.value = false;
  }
});

getObjectives();
</script>
  
<style scoped>
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";

.container {
  --primary-color: #4dabf7; 
  --secondary-color: #9ca3af;
  --bg-color: #242424;
  --card-bg: #2a2a2a;
  --text-color: #e2e8f0;
  --border-color: #3f3f3f;
  --card-blue: #4dabf7;
  --card-green: #40c057;
  --card-yellow: #fcc419;  
  --card-red: #fa5252;
  --card-purple: #ae3ec9;
  color: var(--text-color);
}

.flex_horizental{
  display: flex;
  flex-direction: row;
  min-height: 450px;
}

.objective_chart{
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.2);
  height: auto;
  width: 60%;
  margin-top: 40px;
  margin-left: 40px;
  border-radius: 10px;
}


.profile-section {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  border: 1px solid var(--border-color);
}

.profile-image-container {
  position: relative;
  display: inline-block;
}

.profile-image {
  width: 160px;
  height: 160px;
  object-fit: cover;
  object-position: top center;
  aspect-ratio: 1/1;
  border-color: var(--primary-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
}

.profile-info {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.profile-bio {
  background-color: rgba(255, 255, 255, 0.05);
  border-left: 3px solid var(--primary-color);
}

.profile-actions .btn {
  border-radius: 6px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.profile-actions .btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}


.section-title {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 2rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
  opacity: 0.8;
}


.card {
  border: none;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
}

.row .card {
  cursor: pointer;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row .card:hover {
  transform: translateY(-5px);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-weight: 600;
  margin-bottom: 0;
}


.card-competences {
  border-top: 4px solid var(--card-blue);
}

.card-projects {
  border-top: 4px solid var(--card-green);
}

.card-objectives {
  border-top: 4px solid var(--card-yellow);
}

.card-timeline {
  border-top: 4px solid var(--card-red);
}


.card-coding-hours {
  border-left: 4px solid var(--card-purple);
}

.coding-hours-section .card {
  height: auto;
  min-height: 400px;
  cursor: default;
}

.coding-hours-section .card:hover {
  transform: none;
}

.coding-chart-container {
  width: 100%;
  height: 300px;
}

.form-control {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--primary-color);
  color: var(--text-color);
  box-shadow: 0 0 0 0.25rem rgba(77, 171, 247, 0.25);
}

.form-label {
  color: var(--text-color);
}


@media (max-width: 767px) {
  .card {
    margin-bottom: 20px;
  }
  
  .row .card {
    height: 120px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .profile-image {
    width: 130px;
    height: 130px;
  }
  
  .profile-section {
    padding: 1.5rem;
  }
  
  .coding-hours-section .card {
    min-height: 300px;
  }
}
</style>