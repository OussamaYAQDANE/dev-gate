<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-accent heading">{{ pageTitle }}</h1>
      <div class="btn-group view-toggle m-0">
        <button
          @click="displayMode = 'gallery'"
          class="btn m-0"
          :class="
            displayMode === 'gallery' ? 'btn-accent' : 'btn-outline-accent'
          "
        >
          <i class="bi bi-grid-3x3-gap"></i> Gallery
        </button>
        <button
          @click="displayMode = 'list'"
          class="btn m-0"
          :class="displayMode === 'list' ? 'btn-accent' : 'btn-outline-accent'"
        >
          <i class="bi bi-list-ul"></i> List
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5 loading-container">
      <div class="spinner-border text-accent" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading the projects...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger custom-alert" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>

    <div v-else-if="projects.length === 0" class="text-center py-5 empty-state">
      <i class="bi bi-folder-x display-1 text-muted"></i>
      <p class="mt-3">{{ isOwner ? "You don't have any projects yet." : "This user doesn't have any projects yet." }}</p>
    </div>

    <template v-else>
      <!-- Gallery View -->
      <div
        v-if="displayMode === 'gallery'"
        class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
      >
        <div v-for="project in projects" :key="project.id" class="col">
          <div
            class="card h-100 shadow-sm project-card"
            style="cursor: pointer"
          >
            <div
              class="card-header d-flex align-items-center justify-content-between custom-card-header"
            >
              <div class="d-flex align-items-center">
                <img
                  :src="project.icon"
                  alt="Project icon"
                  class="me-2 project-icon"
                  style="width: 32px; height: 32px; object-fit: contain"
                />
                <h5 class="card-title mb-0 text-truncate project-title">
                  {{ project.title }}
                </h5>
              </div>
              
              <div v-if="isOwner" class="dropdown">
                <button class="btn btn-sm btn-outline-secondary" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><button class="dropdown-item" @click="editProject(project)">
                    <i class="bi bi-pencil me-2"></i> Edit
                  </button></li>
                  <li><button class="dropdown-item text-danger" @click="confirmDelete(project)">
                    <i class="bi bi-trash me-2"></i> Delete
                  </button></li>
                </ul>
              </div>
            </div>
            <div class="card-body">
              <p class="card-text" style="color: #242424">
                {{ project.description }}
              </p>
              <div class="d-flex flex-wrap gap-1 mb-2">
                <span
                  v-for="tech in project.stack"
                  :key="tech"
                  class="badge tech-badge me-1"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            <div class="card-footer border-top-0">
              <a
                v-if="project.githubLink"
                :href="project.githubLink"
                target="_blank"
                class="btn btn-sm btn-github"
              >
                <i class="bi bi-github"></i> View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="list-group shadow-sm">
        <div
          v-for="project in projects"
          :key="project.id"
          class="list-group-item list-group-item-action d-flex gap-3 py-3 project-list-item align-items-center"
          style="cursor: pointer"
        >
          <img
            :src="project.icon"
            alt="Project icon"
            width="48"
            height="48"
            class="flex-shrink-0 project-icon"
            style="object-fit: contain"
          />
          <div class="d-flex gap-2 w-100 justify-content-between">
            <div>
              <h6 class="mb-0 project-title">{{ project.title }}</h6>
              <p class="mb-0 opacity-75" style="color: #242424">
                {{ project.description }}
              </p>
              <div class="mt-1">
                <span
                  v-for="tech in project.stack"
                  :key="tech"
                  class="badge tech-badge me-1"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <div v-if="isOwner" class="dropdown">
                <button class="btn btn-sm btn-outline-secondary" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><button class="dropdown-item" @click="editProject(project)">
                    <i class="bi bi-pencil me-2"></i> Edit
                  </button></li>
                  <li><button class="dropdown-item text-danger" @click="confirmDelete(project)">
                    <i class="bi bi-trash me-2"></i> Delete
                  </button></li>
                </ul>
              </div>
              
              <a
                v-if="project.githubLink"
                :href="project.githubLink"
                target="_blank"
                class="btn btn-sm btn-github"
              >
                <i class="bi bi-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Project</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ projectToDelete?.title }}</strong>?</p>
            <p class="text-danger mb-0"><small>This action cannot be undone.</small></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteProject" :disabled="deleting">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ deleting ? 'Deleting...' : 'Delete Project' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { collection, getDocs, getDoc, doc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRoute, useRouter } from "vue-router";

import { db } from "@/firebase/firebase-config";

const auth = getAuth();
const route = useRoute();
const router = useRouter();

const projects = ref([]);
const loading = ref(true);
const error = ref(null);
const displayMode = ref("gallery"); // Default to gallery view
const pageTitle = ref("Projects");
const isOwner = ref(false);
const currentUserUid = ref(null);
const profileUserUid = ref(route.params.uid);
const profileUsername = ref("");
const projectToDelete = ref(null);
const deleting = ref(false);

// Check if the current user is the owner of the profile
const checkOwnership = () => {
  if (auth.currentUser) {
    currentUserUid.value = auth.currentUser.uid;
    isOwner.value = currentUserUid.value === profileUserUid.value;
    
    // Set the page title based on ownership
    if (isOwner.value) {
      pageTitle.value = "My Projects";
    } else {
      fetchUsername();
    }
  } else {
    isOwner.value = false;
    fetchUsername();
  }
};

// Fetch the username of the profile owner
const fetchUsername = async () => {
  try {
    const userDoc = await getDoc(doc(db, "users", profileUserUid.value));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      profileUsername.value =  userData.firstName || "User";
      pageTitle.value = `${profileUsername.value}'s Projects`;
    } else {
      pageTitle.value = "User's Projects";
    }
  } catch (err) {
    console.error("Error fetching username:", err);
    pageTitle.value = "User's Projects";
  }
};

const fetchProjects = async () => {
  try {
    loading.value = true;
    error.value = null;

    const projectsRef = collection(
      db,
      "users",
      profileUserUid.value,
      "projects"
    );
    const projectsSnapshot = await getDocs(projectsRef);

    const projectsList = [];
    projectsSnapshot.forEach((doc) => {
      projectsList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    projects.value = projectsList;
  } catch (err) {
    console.error("Error fetching projects:", err);
    error.value = "Failed to load projects. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Handle project editing (you'll need to implement the edit form elsewhere)
const editProject = (project) => {
  // Navigate to edit page or open edit modal
  router.push(`/edit-project/${project.id}`);
};

// Open the delete confirmation modal
const confirmDelete = (project) => {
  projectToDelete.value = project;
  // Find the modal element
  const modalElement = document.getElementById('deleteConfirmModal');
  
  // Check if Bootstrap is available and use it, otherwise use a fallback
  
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  
};

// Delete the project
const deleteProject = async () => {
  if (!projectToDelete.value || !isOwner.value) return;
  
  try {
    deleting.value = true;
    
    await deleteDoc(
      doc(db, "users", auth.currentUser.uid, "projects", projectToDelete.value.id)
    );
    
    // Remove the project from the local array
    projects.value = projects.value.filter(p => p.id !== projectToDelete.value.id);
    
    // Close the modal
    const modalElement = document.getElementById('deleteConfirmModal');
    
    
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    
    
    // Reset the project to delete
    projectToDelete.value = null;
    
  } catch (err) {
    console.error("Error deleting project:", err);
    alert("Failed to delete project. Please try again.");
  } finally {
    deleting.value = false;
  }
};

// For handling Bootstrap modal backdrop issues
const closeModal = () => {
  const modalElement = document.getElementById('deleteConfirmModal');
  if (modalElement) {
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
};

let unsubscribe;

onMounted(() => {
  // Listen for auth state changes
  unsubscribe = onAuthStateChanged(auth, () => {
    checkOwnership();
    fetchProjects();
  });
  
  // Add event listeners for modal buttons
  const cancelBtn = document.querySelector('#deleteConfirmModal .btn-secondary');
  const closeBtn = document.querySelector('#deleteConfirmModal .btn-close');
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
});

onUnmounted(() => {
  // Clean up the auth listener
  if (unsubscribe) {
    unsubscribe();
  }
  
  // Remove event listeners
  const cancelBtn = document.querySelector('#deleteConfirmModal .btn-secondary');
  const closeBtn = document.querySelector('#deleteConfirmModal .btn-close');
  
  if (cancelBtn) {
    cancelBtn.removeEventListener('click', closeModal);
  }
  
  if (closeBtn) {
    closeBtn.removeEventListener('click', closeModal);
  }
});
</script>
  
<style scoped>
/* Bootstrap icons are needed for this component */
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

.heading {
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
}

.heading::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 3px;
  width: 40%;
  background: linear-gradient(90deg, var(--accent-color), transparent);
  border-radius: 2px;
}

.text-accent {
  color: var(--accent-color);
  text-shadow: 0 0 15px var(--accent-glow);
}

.btn-accent {
  background: linear-gradient(145deg, var(--accent-color), var(--accent-hover));
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  color: white;
}

.btn-outline-accent {
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-accent:hover {
  background: var(--accent-light);
  color: var(--accent-color);
  transform: translateY(-2px);
}

.view-toggle .btn {
  border-radius: 8px;
  margin: 0 3px;
  font-weight: 500;
  padding: 8px 16px;
}

.custom-card-header {
  background: linear-gradient(
    145deg,
    var(--accent-light),
    var(--accent-medium)
  );
  border-bottom: 2px solid var(--accent-color);
  padding: 15px;
}

.project-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(229, 231, 235, 0.1);
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  backdrop-filter: blur(10px);
}

.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px var(--shadow-color) !important;
  border-color: var(--accent-color);
}

.project-card .card-body {
  padding: 1.5rem;
}

.project-card .card-footer {
  background-color: rgba(249, 250, 251, 0.8);
  padding: 1rem 1.5rem;
}

.project-icon {
  border-radius: 8px;
  padding: 4px;
  background-color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.tech-badge {
  background: linear-gradient(145deg, var(--accent-color), var(--accent-hover));
  color: white;
  border-radius: 6px;
  padding: 5px 10px;
  font-weight: 500;
  font-size: 0.8rem;
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

.project-list-item {
  border-left: 4px solid;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  background-color: white;
}

.project-list-item:hover {
  background-color: var(--accent-light);
  border-left-color: var(--accent-color);
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.project-title {
  color: #111827;
  font-weight: 600;
  letter-spacing: 0.2px;
}

/* Override the standard list-group-item-action hover effect */
.list-group-item-action:hover {
  background-color: var(--accent-light);
}

.spinner-border.text-accent {
  color: var(--accent-color);
  border-width: 0.2em;
}

.loading-container {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-state {
  min-height: 200px;
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

.card-text{
 
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;


}

/* Responsive adjustments */
@media (max-width: 768px) {
  .heading {
    font-size: 1.8rem;
  }

  .project-card {
    margin-bottom: 15px;
  }

  .view-toggle .btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
</style>