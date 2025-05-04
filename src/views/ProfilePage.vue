<template>
  <div class="container py-5">
    <!-- User Profile Section -->
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
      <!-- Competences Card -->

      <div class="col-md-6 col-lg-3" @click="$router.push(`${userRoute}/skills`)">
        <div class="card h-100 card-competences">
          <div class="card-body text-center">
            <h4 class="card-title">Skills: {{ num_competence }}</h4>
          </div>
        </div>
      </div>

      <!-- Projects Card -->
      <div class="col-md-6 col-lg-3" @click="$router.push(`${userRoute}/projects`)">
        <div class="card h-100 card-projects">
          <div class="card-body text-center">
            <h4 class="card-title">Projects: {{ userData?.projects_num || 0 }}</h4>
          </div>
        </div>
      </div>

      <!-- Objectives Card -->
      <div class="col-md-6 col-lg-3" @click="$router.push(`${userRoute}/objectives`)">
        <div class="card h-100 card-objectives">
          <div class="card-body text-center">
            <h4 class="card-title">Objectives : {{ objectives.length }}</h4>
          </div>
        </div>
      </div>

      <!-- Timeline Card -->
      <div class="col-md-6 col-lg-3" @click="$router.push(`${userRoute}/timeline`)">
        <div class="card h-100 card-timeline">
          <div class="card-body text-center">
            <h4 class="card-title">Timeline</h4>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db,auth } from '@/firebase/firebase-config';
import DefaultProfile from "@/assets/default-profile.png"
import LastActivities from '@/components/LastActivities.vue';
import ObjectivesChart from '@/components/ObjectivesChart.vue';
import { onAuthStateChanged } from 'firebase/auth';

import chartForCompetences from '@/components/chartForCompetences.vue';
import ChartForProgrression from '@/components/chartForProgrression.vue';
const route = useRoute();
const userRoute = route.params.uid;
const userData = ref(null);
const isLoading = ref(true);
const objectives = ref([]);
const currentUser = ref('')

async function getObjectives(){
  const docSnap = await getDocs(collection(db, "users", userRoute, "objectives"))
  objectives.value = docSnap.docs.map((doc)=>({id:doc.id, ...doc.data()}))
} 
getObjectives()

onAuthStateChanged(auth, (user)=>{
    currentUser.value = user.uid;
})



let num_competence = ref(0)
onMounted(async () => {
  try {
    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userRoute));
    if (userDoc.exists()) {
      userData.value = userDoc.data();
      num_competence.value = (userDoc.data().numbeginner||0)+ (userDoc.data().numintermediate||0) + (userDoc.data().numexpert||0) + (userDoc.data().numadvanced||0)
      console.log(num_competence, "ayaya")
    } else {
      console.log("No such user document!");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    isLoading.value = false;
  }
});

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


/* Profile section styles */
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

/* Section title styling */
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

/* Card styles */
.card {
  border: none;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  cursor: pointer;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card:hover {
  transform: translateY(-5px);
  
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-weight: 600;
  margin-bottom: 0;
}

/* Color variations for cards */
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

/* Responsive adjustments */
@media (max-width: 767px) {
  .card {
    margin-bottom: 20px;
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
}
</style>