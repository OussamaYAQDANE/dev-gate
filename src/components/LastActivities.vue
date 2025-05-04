<script setup>
import { db } from '@/firebase/firebase-config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const recentActivities = ref([]);
const loading = ref(true);
const error = ref(null);

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

const fetchRecentActivities = async () => {
  try {
    const activitiesQuery = query(
      collection(db, 'users', route.params.uid, 'activities'),
      orderBy('time', 'desc'),
      limit(5)
    );
    
    const querySnapshot = await getDocs(activitiesQuery);
    recentActivities.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Error fetching recent activities:", err);
    error.value = "Failed to load recent activities";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRecentActivities();
});
</script>

<template>
  <div class="recent-activities">
    <h3 class="section-title">Recent Activities</h3>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading recent activities...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <i class="bi bi-exclamation-triangle"></i>
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="recentActivities.length === 0" class="empty-state">
      <i class="bi bi-calendar3"></i>
      <p>No recent activities found</p>
    </div>
    
    <ul v-else class="activity-list">
      <li v-for="activity in recentActivities" :key="activity.id" class="activity-item">
        <div class="activity-icon" :class="getActivityColor(activity.type)">
          <i :class="`bi ${getActivityIcon(activity.type)}`"></i>
        </div>
        <div class="activity-content">
          <p class="activity-title">{{ activity.T1 }}</p>
          <div class="activity-meta">
            <span class="activity-type">{{ activity.type || 'Activity' }}</span>
            <span class="activity-time">{{ formatDate(activity.time) }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.recent-activities {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-blue);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  color: var(--secondary-color);
}

.loading-state .spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

.error-state i {
  font-size: 1.5rem;
  color: var(--not-started);
  margin-bottom: 0.5rem;
}

.empty-state i {
  font-size: 1.5rem;
  opacity: 0.5;
  margin-bottom: 0.5rem;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-blue);
}

.activity-icon.activity-competence {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-blue);
}

.activity-icon.activity-objective {
  background-color: rgba(64, 192, 87, 0.1);
  color: #40c057;
}

.activity-icon.activity-project {
  background-color: rgba(252, 196, 25, 0.1);
  color: #fcc419;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--secondary-color);
}

.activity-type {
  text-transform: capitalize;
}

.activity-time {
  opacity: 0.8;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>