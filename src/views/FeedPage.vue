<template>
  <div class="feed-page">
    <div class="feed-container">
      <div class="feed-header">
        <h2 class="feed-title">{{ activeView === 'Projects' ? 'Projects Feed' : 'Competences Feed' }}</h2>
        
        <div class="feed-filters">
          <div class="view-selector">
            <button 
              class="view-btn" 
              :class="{ 'active': activeView === 'Projects' }"
              @click="switchView('Projects')"
            >
              <i class="bi bi-kanban"></i> Projects
            </button>
            <button 
              class="view-btn" 
              :class="{ 'active': activeView === 'Competences' }"
              @click="switchView('Competences')"
            >
              <i class="bi bi-award"></i> Competences
            </button>
          </div>
        </div>
      </div>
      
      <div class="feed-content">
        <div v-if="activeView === 'Projects'" class="projects-feed">
          <div v-if="projects.length === 0 && !isLoading" class="empty-state">
            <i class="bi bi-tools"></i>
            <h4>No projects to show.</h4>
          </div>
          <project-div
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
          
          <div v-if="projects.length > 0" class="load-more">
            <button class="load-more-btn" @click="getProjects">
              Load More
            </button>
          </div>
        </div>

        <div v-else class="competences-feed">
          <div v-if="competences.length === 0 && !isLoading" class="empty-state">
            <i class="bi bi-award"></i>
            <h4>No competences to show.</h4>
          </div>
          <competence-div
            v-for="competence in competences"
            :key="competence.id"
            :competence="competence"
          />
          
          <div v-if="competences.length > 0" class="load-more">
            <button class="load-more-btn" @click="getCompetences">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { db } from "@/firebase/firebase-config";
import { ref, watch } from "vue";

import {
  collectionGroup,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import ProjectDiv from "@/components/Feed/ProjectDiv.vue";
import CompetenceDiv from "@/components/Feed/CompetenceDiv.vue";


let lastProjectDoc = null;
let lastCompetenceDoc = null;
const projects = ref([]);
const competences = ref([]);
const activeView = ref('Projects');
const isLoading = ref(false);



watch(activeView, () => {
  resetFeed();
});

function resetFeed() {
  projects.value = [];
  competences.value = [];
  lastProjectDoc = null;
  lastCompetenceDoc = null;
  
  if (activeView.value === 'Projects') {
    getProjects();
  } else {
    getCompetences();
  }
}

async function getProjects() {
  isLoading.value = true;
  try {
    const q = lastProjectDoc
      ? query(
          collectionGroup(db, "projects"),
          orderBy("createdAt", "desc"),
          limit(10),
          startAfter(lastProjectDoc)
        )
      : query(
          collectionGroup(db, "projects"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return;
    }
    
    snapshot.docs.forEach((doc) => {
      projects.value.push({ id: doc.id, ...doc.data() });
      lastProjectDoc = doc;
    });
    
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    isLoading.value = false;
  }
}

async function getCompetences() {
  isLoading.value = true;
  try {
    const q = lastCompetenceDoc
      ? query(
          collectionGroup(db, "competences"),
          orderBy("createdAt", "desc"),
          limit(10),
          startAfter(lastCompetenceDoc)
        )
      : query(
          collectionGroup(db, "competences"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return;
    }
    
    snapshot.docs.forEach((doc) => {
      competences.value.push({ id: doc.id, ...doc.data() });
      console.log(doc.data());
      lastCompetenceDoc = doc;
    });
    
  } catch (error) {
    console.error("Error fetching competences:", error);
  } finally {
    isLoading.value = false;
  }
}

function switchView(view) {
  activeView.value = view;
}

getProjects();
</script>
    
<style scoped>
.feed-page {
  width: 100%;
  min-height: 100%;
  background-color: #121418;
  padding: 20px 0;
}

.feed-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
}

.feed-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.feed-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.feed-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.view-selector {
  display: flex;
  gap: 8px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.08);
  color: #b3cad5;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.view-btn.active {
  background-color: rgba(79, 93, 115, 0.7);
  color: #ffffff;
}

.feed-content {
  margin-top: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #86a2ae;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-state h4 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #b3cad5;
}

.empty-state p {
  font-size: 0.9rem;
  max-width: 300px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.load-more-btn {
  background-color: rgba(255, 255, 255, 0.08);
  color: #b3cad5;
  border: none;
  border-radius: 20px;
  padding: 8px 24px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

@media (max-width: 576px) {
  .feed-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .view-selector {
    width: 100%;
  }
  
  .view-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>