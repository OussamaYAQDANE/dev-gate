<script setup>
/* eslint-disable*/
import { db } from '@/firebase/firebase-config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const userId = ref('');
const TimeLine = ref([]);
const route = useRoute();
const loading = ref(true);

userId.value = route.params.uid;

// Format date for display
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

// Group timeline items by date for display
const groupedTimeline = computed(() => {
  const grouped = {};
  
  TimeLine.value.forEach(item => {
    const date = item.time?.toDate ? item.time.toDate() : new Date(item.time);
    const dateKey = date.toDateString();
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push({
      ...item,
      formattedTime: formatDate(item.time)
    });
  });
  
  // Convert to array and sort
  return Object.entries(grouped)
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Get appropriate icon based on activity type
const getActivityIcon = (type) => {
  switch(type?.toLowerCase()) {
    case 'competence':
      return 'bi-star-fill';
    case 'objective':
      return 'bi-bullseye';
    case 'project':
      return 'bi-briefcase-fill';
    default:
      return 'bi-clock-history';
  }
};

// Get appropriate color based on activity type
const getActivityColor = (type) => {
  switch(type?.toLowerCase()) {
    case 'competence':
      return 'activity-competence';
    case 'objective':
      return 'activity-objective';
    case 'project':
      return 'activity-project';
    default:
      return '';
  }
};

async function getTimeLine() {
  try {
    // Use query and orderBy to sort by time descending
    const timelineQuery = query(
      collection(db, 'users', userId.value, 'activities'),
      orderBy('time', 'desc')
    );
    
    onSnapshot(timelineQuery, (snapshot) => {
      TimeLine.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      loading.value = false;
    });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    loading.value = false;
  }
}

getTimeLine();
</script>

<template>
  <div class="timeline-container">
    <h1 class="timeline-title">Activity Timeline</h1>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading your timeline...</p>
    </div>
    
    <div v-else-if="TimeLine.length === 0" class="empty-timeline">
      <i class="bi bi-calendar3 empty-icon"></i>
      <p>No activities to show yet</p>
    </div>
    
    <div v-else class="timeline">
      <div v-for="group in groupedTimeline" :key="group.date" class="timeline-group">
        <div class="timeline-date">
          <span>{{ new Date(group.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) }}</span>
        </div>
        
        <div class="timeline-items">
          <div 
            v-for="activity in group.items" 
            :key="activity.id" 
            class="timeline-item"
            :class="getActivityColor(activity.type)"
          >
            <div class="timeline-marker">
              <div class="timeline-dot">
                <i :class="`bi ${getActivityIcon(activity.type)}`"></i>
              </div>
              <div class="timeline-line"></div>
            </div>
            
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="activity-type" :class="getActivityColor(activity.type)">
                  {{ activity.type || 'Activity' }}
                </span>
                <span class="activity-time">{{ activity.formattedTime }}</span>
              </div>
              
              <div class="timeline-body">
                <p class="primary-text">{{ activity.T1 }}</p>
                <span class="activity-T2" :class="'T2-' + activity.T2.replace(/\s+/g, '-')">
                     {{ activity.T2 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-container {
  --primary-blue: #4dabf7;
  --secondary-blue: #3b82f6;
  --bg-color: #242424;
  --card-bg: #2a2a2a;
  --text-color: #e2e8f0;
  --border-color: #3f3f3f;
  --complete: #40c057;
  --in-progress: #fcc419;
  --not-started: #fa5252;
  color: var(--text-color);
  padding: 1.25rem;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(160deg, rgba(30, 58, 138, 0.03) 0%, var(--bg-color) 100%);
}

.timeline-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--primary-blue);
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

.timeline-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--primary-blue) 0%,
    rgba(59, 130, 246, 0.3) 100%
  );
  border-radius: 3px;
}

/* For an even cooler effect, add this: */
.timeline-title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 30%;
  height: 1px;
  background: rgba(59, 130, 246, 0.5);
  filter: blur(1px);
}

.timeline {
  position: relative;
  margin: 1.5rem 0;
}

.timeline-group {
  margin-bottom: 2rem;
}

.timeline-date {
  font-weight: 500;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3); /* Blue-tinged border */
  color: var(--primary-blue);
  font-size: 0.9rem;
  letter-spacing: 0.3px;
}

.timeline-items {
  position: relative;
  padding-left: 20px;
}

.timeline-items::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--secondary-blue) 20%,
    var(--secondary-blue) 80%,
    transparent 100%
  );
  opacity: 0.6;
}

.timeline-item {
  position: relative;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.timeline-item:hover {
  transform: translateX(2px);
}

.timeline-marker {
  position: absolute;
  left: -20px;
  top: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 2px solid var(--secondary-blue); /* Consistent blue border */
}

/* Activity type colors with blue base */
.timeline-marker.competence {
  background-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.timeline-marker.objective {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: #40c057;
}

.timeline-marker.project {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: #fcc419;
}

.timeline-content {
  background-color: var(--card-bg);
  border-radius: 6px;
  padding: 0.9rem;
  border-left: 2px solid var(--secondary-blue); /* Blue left border */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.timeline-content:hover {
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.1);
}

/* Activity type specific accents */
.timeline-content.competence {
  border-left-color: var(--secondary-blue);
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.03) 0%, var(--card-bg) 20%);
}

.timeline-content.objective {
  border-left-color: #40c057;
}

.timeline-content.project {
  border-left-color: #fcc419;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.4rem;
}

.activity-type {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  background-color: rgba(59, 130, 246, 0.1); /* Blue background */
  color: var(--primary-blue); /* Blue text */
}

.timeline-time {
  font-size: 0.7rem;
  color: var(--secondary-color);
  opacity: 0.8;
}

.timeline-body {
  margin-bottom: 0.4rem;
}

.primary-text {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  line-height: 1.4;
  color: var(--text-color);
}

.secondary-text {
  font-size: 0.8rem;
  color: var(--secondary-color);
  line-height: 1.4;
  margin-bottom: 0.3rem;
}

/* T2 Status text */
.activity-T2 {
  font-size: 0.75rem;
  font-weight: 600;
  font-style: italic;
  margin-top: 0.2rem;
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
}

.T2-complete {
  color: var(--complete);
  background-color: rgba(64, 192, 87, 0.1);
}

.T2-in-progress {
  color: var(--in-progress);
  background-color: rgba(252, 196, 25, 0.1);
}

.T2-not-started {
  color: var(--not-started);
  background-color: rgba(250, 82, 82, 0.1);
}

/* Loading and empty states */
.loading-container,
.empty-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  gap: 0.8rem;
  color: var(--secondary-color);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 2rem;
  opacity: 0.3;
  color: var(--primary-blue);
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .timeline-container {
    padding: 1rem;
  }
  
  .timeline-items {
    padding-left: 18px;
  }
  
  .timeline-items::before {
    left: 8px;
  }
  
  .timeline-marker {
    width: 16px;
    height: 16px;
    left: -18px;
  }
  
  .timeline-content {
    padding: 0.8rem;
  }
}

</style>