<template>
  <div class="container py-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5 loading-container">
      <div class="spinner-border text-accent" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading project details...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger custom-alert" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>

    <!-- Project not found -->
    <div v-else-if="!project" class="text-center py-5 empty-state">
      <i class="bi bi-file-earmark-x display-1 text-muted"></i>
      <p class="mt-3">Project not found.</p>
    </div>

    <!-- Project content -->
    <div v-else class="project-detail-container">
      <!-- Project header -->
      <div class="project-header">
        <div class="d-flex align-items-center mb-4">
          <img
            :src="project.icon || '/default-project-icon.png'"
            alt="Project icon"
            class="project-icon me-3"
            style="object-fit: contain"
          />
          <div>
            <h1 class="text-accent project-title mb-3">{{ project.title }}</h1>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="tech in project.stack"
                :key="tech"
                class="badge tech-badge"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Project description -->
      <div class="project-description card mb-4">
        <div class="card-body">
          <h2 class="card-title h5 mb-3">About this project</h2>
          <p class="project-description-text" style="color: rgb(200, 200, 200)">
            {{ project.description }}
          </p>
        </div>
      </div>

      <!-- Project details section -->
      <div class="row g-4 mb-4">
        <!-- GitHub link -->
        <div class="col-md-6" v-if="project.githubLink">
          <div class="card h-100">
            <div class="card-body">
              <h2 class="card-title h5 mb-3">GitHub Repository</h2>
              <div class="d-flex align-items-center">
                <i class="bi bi-github me-2 fs-3"></i>
                <a
                  :href="project.githubLink"
                  target="_blank"
                  class="btn btn-github"
                >
                  <i class="bi bi-box-arrow-up-right me-2"></i> View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Created by section -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h2 class="card-title h5 mb-3">Project Details</h2>
              <div class="d-flex align-items-center">
                <div>
                  <p class="mb-1">
                    <strong>Created by: </strong>
                    <router-link
                      :to="`/${project.ownerUid}`"
                      class="text-accent"
                    >
                      {{ "@" + owner?.username || "Unknown User" }}
                    </router-link>
                  </p>
                  <p class="mb-0" v-if="project.createdAt">
                    <strong>Added at:</strong>
                    {{ formatDate(project.createdAt) }}
                  </p>
                  <p class="mb-0" v-if="project.updatedAt">
                    <strong>Last updated:</strong>
                    {{ formatDate(project.updatedAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import {
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/firebase/firebase-config";

const route = useRoute();
// const auth = getAuth();

// State variables
const project = ref(null);
const owner = ref(null);
const loading = ref(true);
const error = ref(null);

// Fetch project details based on route param
const fetchProjectDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const projectId = route.params.pid;

    if (!projectId) {
      error.value = "Project ID is missing";
      loading.value = false;
      return;
    }

    // Determine which user's project collection to access
    let projectData = null;
    let projectOwnerUid = null;

    const ownerProjectRef = doc(
      db,
      "users",
      route.params.uid,
      "projects",
      projectId
    );
    const docSnap = await getDoc(ownerProjectRef);

    if (docSnap.exists()) {
      projectData = { id: docSnap.id, ...docSnap.data() };
      projectOwnerUid = route.params.uid;
    }

    if (!projectData) {
      error.value = "Project not found";
      loading.value = false;
      return;
    }

    // Add owner info to the project
    projectData.ownerUid = projectOwnerUid;
    project.value = projectData;

    // Fetch owner details
    if (projectOwnerUid) {
      const ownerDoc = await getDoc(doc(db, "users", projectOwnerUid));
      if (ownerDoc.exists()) {
        owner.value = ownerDoc.data();
      }
    }
  } catch (err) {
    console.error("Error fetching project:", err);
    error.value = "Failed to load project details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Format date function
const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown";

  // Handle Firestore Timestamp objects
  const date =
    timestamp instanceof Timestamp
      ? timestamp.toDate()
      : timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

let unsubscribe;

onMounted(() => {
  // Listen for auth state changes
  unsubscribe = onAuthStateChanged(auth, () => {
    fetchProjectDetails();
  });
});

onUnmounted(() => {
  // Clean up the auth listener
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>
  
<style scoped>
/* Bootstrap icons */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");

/* Modern tech theme with glass morphism */
.container {
  --accent-color: #3a86ff;
  --accent-hover: #2667cc;
  --accent-light: rgba(58, 134, 255, 0.1);
  --accent-medium: rgba(58, 134, 255, 0.2);
  --accent-glow: rgba(58, 134, 255, 0.5);
  --dark-bg: #0f172a;
  --card-bg: #1e293b;
  --text-light: #e2e8f0;
  --border-color: rgba(58, 134, 255, 0.3);
  --shadow-color: rgba(58, 134, 255, 0.2);
}

.project-detail-container {
  max-width: 1000px;
  margin: 0 auto;
}

.project-header {
  margin-bottom: 2rem;
}

.project-title {
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
}

.project-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 3px;
  width: 40%;
  background: linear-gradient(90deg, var(--accent-color), transparent);
  border-radius: 2px;
}

.project-icon {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid var(--accent-color);
  box-shadow: 0 4px 12px var(--shadow-color);
  background-color: white;
  padding: 5px;
}

.project-description-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #333;
}

.tech-badge {
  background: linear-gradient(145deg, var(--accent-color), var(--accent-hover));
  color: white;
  border-radius: 6px;
  padding: 5px 10px;
  font-weight: 500;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.tech-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-github {
  background: linear-gradient(145deg, #333, #222);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  padding: 6px 14px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.btn-github:hover {
  background: linear-gradient(145deg, #444, #333);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.card {
  border-radius: 12px;
  border: 1px solid rgba(229, 231, 235, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 15px 40px var(--shadow-color);
  transform: translateY(-5px);
}

.loading-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner-border.text-accent {
  color: var(--accent-color);
  border-width: 0.2em;
}

.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6b7280;
  background-color: rgba(249, 250, 251, 0.6);
  border-radius: 12px;
  border: 1px dashed #d1d5db;
}

.custom-alert {
  border-radius: 8px;
  border: none;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-left: 4px solid #ef4444;
  padding: 1rem;
}

@media (max-width: 768px) {
  .project-icon {
    width: 60px;
    height: 60px;
  }

  .project-title {
    font-size: 1.8rem;
  }
}
</style>