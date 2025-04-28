<template>
  <div class="container py-5">
    <h1 class="text-center mb-5 glow-text">My Portfolio</h1>

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
      <div class="col-md-6 col-lg-3">
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
</script>
  
  <style scoped>
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";

:root {
  --primary-color: #a210ee;
  --primary-glow: #d275ff;
  --card-violet: #8e44ad;
  --card-pink: #c71585;
  --card-blue: #4834d4;
  --card-green: #16a085;
}

body {
  background-color: #121212;
  color: #e0e0e0;
  font-family: "Poppins", sans-serif;
}

.glow-text {
  color: var(--primary-glow);
  text-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color);
  font-weight: bold;
  margin-bottom: 2rem;
}

/* Card styles with neon accents */
.card {
  border: none;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(162, 16, 238, 0.3);
}

.card-header {
  padding: 15px;
  font-size: 1.1rem;
}

.card-violet .card-header {
  background-color: var(--card-violet);
}

.card-pink .card-header {
  background-color: var(--card-pink);
}

.card-blue .card-header {
  background-color: var(--card-blue);
}

.card-green .card-header {
  background-color: var(--card-green);
}

.list-group-item {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-color: #333;
  padding: 12px 15px;
}

/* Timeline styling */
.timeline {
  list-style: none;
  padding: 0;
  position: relative;
}

.timeline-item {
  position: relative;
  padding: 15px 20px;
  border-left: 2px solid var(--card-green);
}

.timeline-item:not(:last-child) {
  border-bottom: 1px solid #333;
}

.timeline-date {
  font-weight: bold;
  color: var(--primary-glow);
  margin-bottom: 5px;
  display: block;
}

.timeline-content h5 {
  font-size: 1rem;
  margin-bottom: 5px;
}

.timeline-content p {
  font-size: 0.85rem;
  margin-bottom: 0;
  color: #bbb;
}

/* Objectives styling */
.objective-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

/* General card body styling */
.card-body {
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 15px;
}

.card-title {
  color: var(--primary-glow);
  font-size: 1.1rem;
  margin-bottom: 5px;
}
</style>