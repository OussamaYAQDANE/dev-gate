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
              class="profile-image img-fluid rounded-circle border border-3 border-primary shadow"
            />
          </div>
        </div>
        <div class="col-md-8">
          <div class="profile-info card bg-dark bg-opacity-50 p-4 h-100">
            <div v-if="isLoading" class="d-flex justify-content-center align-items-center h-100">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="userData" class="profile-content">
              <h1 class="display-4 fw-bold mb-1">
                {{ userData.firstName }} {{ userData.lastName }}
              </h1>
              <h3 class="text-primary fs-4 mb-3">@{{ userData.username }}</h3>
              <div class="profile-bio p-3 rounded mb-3">
                <p class="lead mb-0">{{ userData.bio }}</p>
              </div>
              <div class="profile-actions d-flex gap-2">
                <button class="btn btn-primary">
                  <i class="bi bi-envelope-fill me-2"></i>Contact
                </button>
                
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

    <h2 class="text-center mb-5 glow-text">{{userData?.firstName}}'s Portfolio</h2>

    <div class="row g-4">
      <!-- Competences Card -->
      <div class="col-md-6 col-lg-3">
        <div class="card h-100 card-violet">
          <div class="card-header text-white fw-bold">
            <i class="bi bi-star-fill me-2"></i>Competences
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Frontend Development</li>
              <li class="list-group-item">UI/UX Design</li>
              <li class="list-group-item">Vue.js & React</li>
              <li class="list-group-item">Responsive Design</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Projects Card -->
      <div class="col-md-6 col-lg-3" @click="$router.push(`/projects/${userRoute}`)">
        <div class="card h-100 card-pink">
          <div class="card-header text-white fw-bold">
            <i class="bi bi-code-square me-2"></i>Projects
          </div>
          <div class="card-body">
            <div class="mb-3">
              <h5 class="timeline-date">Portfolio Website</h5>
              <p class="card-text">Personal portfolio built with Vue.js</p>
            </div>
            <div class="mb-3">
              <h5 class="timeline-date">E-commerce App</h5>
              <p class="card-text">Online store with payment integration</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Objectives Card -->
      <div class="col-md-6 col-lg-3">
        <div class="card h-100 card-blue">
          <div class="card-header text-white fw-bold">
            <i class="bi bi-bullseye me-2"></i>Objectives
          </div>
          <div class="card-body">
            <div class="objective-item">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              <span>Master Advanced Vue Patterns</span>
            </div>
            <div class="objective-item">
              <i class="bi bi-circle text-secondary me-2"></i>
              <span>Learn Three.js Visualization</span>
            </div>
            <div class="objective-item">
              <i class="bi bi-circle text-secondary me-2"></i>
              <span>Contribute to Open Source</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Card -->
      <div class="col-md-6 col-lg-3">
        <div class="card h-100 card-green">
          <div class="card-header text-white fw-bold">
            <i class="bi bi-clock-history me-2"></i>Timeline
          </div>
          <div class="card-body p-0">
            <ul class="timeline">
              <li class="timeline-item">
                <span class="timeline-date">2025</span>
                <div class="timeline-content">
                  <h5>Senior Developer</h5>
                  <p>Leading frontend development team</p>
                </div>
              </li>
              <li class="timeline-item">
                <span class="timeline-date">2023</span>
                <div class="timeline-content">
                  <h5>Mid-level Developer</h5>
                  <p>Working on enterprise applications</p>
                </div>
              </li>
              <li class="timeline-item">
                <span class="timeline-date">2021</span>
                <div class="timeline-content">
                  <h5>Junior Developer</h5>
                  <p>Started professional career</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase-config';
import DefaultProfile from "@/assets/default-profile.png"

const route = useRoute();
const userRoute = route.params.uid;
const userData = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userRoute));
    
    if (userDoc.exists()) {
      userData.value = userDoc.data();
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
}

@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";

body {
  background-color: var(--bg-dark);
}

/* Profile section styles */
.profile-section {
  background-color: var(--card-bg);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  position: relative;
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

.profile-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--card-violet), var(--card-pink), var(--card-blue), var(--card-green));
}

.profile-image-container {
  position: relative;
  display: inline-block;
}

.profile-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  object-position: top center;
  aspect-ratio: 1/1;
  border-color: var(--primary-glow) ;
}

.profile-info {
  background-color: rgba(30, 41, 59, 0.7) !important;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-subtle);
}

.profile-bio {
  background-color: rgba(15, 23, 42, 0.5);
  border-left: 3px solid var(--primary-glow);
}

.profile-actions .btn {
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.profile-actions .btn-primary {
  background-color: var(--primary-glow);
  border-color: var(--primary-glow);
  color: #0f172a;
}

.profile-actions .btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Original styles */
.glow-text {
  color: var(--primary-glow);
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.5), 0 0 20px rgba(100, 255, 218, 0.3);
  font-weight: 800;
  margin-bottom: 2.5rem;
  letter-spacing: 1px;
  position: relative;
}

.glow-text::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: var(--primary-glow);
  border-radius: 2px;
}

/* Card styles with modern accents */
.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  background-color: var(--card-bg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-7px);
  box-shadow: 0 7px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(100, 255, 218, 0.2);
}

.card-header {
  padding: 18px 20px;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
}

.card-violet .card-header {
  background: linear-gradient(135deg, var(--card-violet), #6d5dfc);
}

.card-pink .card-header {
  background: linear-gradient(135deg, var(--card-pink), #ff0080);
}

.card-blue .card-header {
  background: linear-gradient(135deg, var(--card-blue), #1da1f2);
}

.card-green .card-header {
  background: linear-gradient(135deg, var(--card-green), #38ef7d);
}

.list-group-item {
  background-color: var(--card-bg);
  color: var(--text-light);
  border-color: var(--border-subtle);
  padding: 14px 18px;
  transition: background-color 0.2s ease;
  position: relative;
}

.list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.list-group-item::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--primary-glow);
  margin-left: 5px;
}

/* Timeline styling */
.timeline {
  list-style: none;
  padding: 0;
  position: relative;
  margin: 0;
}

.timeline-item {
  position: relative;
  padding: 18px 20px;
  border-left: 3px solid var(--card-green);
  background-color: var(--card-bg);
  transition: background-color 0.3s ease;
}

.timeline-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.timeline-item:not(:last-child) {
  border-bottom: 1px solid var(--border-subtle);
}

.timeline-date {
  font-weight: 700;
  color: var(--primary-glow);
  margin-bottom: 6px;
  display: block;
  letter-spacing: 0.5px;
}

.timeline-content h5 {
  font-size: 1rem;
  margin-bottom: 5px;
  font-weight: 600;
}

.timeline-content p {
  font-size: 0.9rem;
  margin-bottom: 0;
  color: #a0aec0;
  line-height: 1.5;
}

/* Objectives styling */
.objective-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
  position: relative;
  padding-left: 8px;
  transition: transform 0.2s ease;
}

.objective-item:hover {
  transform: translateX(5px);
}

.objective-item i {
  font-size: 18px;
}

.objective-item i.text-success {
  color: var(--primary-glow) !important;
}

/* General card body styling */
.card-body {
  background-color: var(--card-bg);
  color: var(--text-light);
  padding: 20px;
}

.card-text {
  line-height: 1.6;
  color: #a0aec0;
}

/* Add subtle animations */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(100, 255, 218, 0); }
  100% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0); }
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .card {
    margin-bottom: 20px;
  }
  
  .glow-text {
    font-size: 1.8rem;
  }
  
  .profile-image {
    width: 150px;
    height: 150px;
  }
  
  .profile-section {
    padding: 1.5rem;
  }
}
</style>