<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-accent heading">{{ pageTitle }}</h1>
      <div class="d-flex align-items-center gap-3">
        <!-- Add Project Button - Only visible to the owner -->
        <button 
          v-if="isOwner" 
          class="btn btn-accent add-project-btn"
          @click="openAddModal"
        >
          <i class="bi bi-plus-lg me-2"></i> Add Project
        </button>
        
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
      <button 
        v-if="isOwner"
        class="btn btn-accent mt-3"
        @click="openAddModal"
      >
        <i class="bi bi-plus-lg me-2"></i> Add Your First Project
      </button>
    </div>

    <template v-else>
      <!-- Gallery View -->
      <ProjectGallery 
        v-if="displayMode === 'gallery'" 
        :projects="projects" 
        :is-owner="isOwner"
        @edit="openEditModal"
        @delete-confirm="confirmDelete"
      />

      <!-- List View -->
      <ProjectList
        v-else
        :projects="projects"
        :is-owner="isOwner"
        @edit="openEditModal"
        @delete-confirm="confirmDelete"
      />
    </template>
    
    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :project="projectToDelete"
      :deleting="deleting"
      @confirm="deleteProject"
      @close="closeModal('deleteConfirmModal')"
    />
    
    <!-- Edit Project Modal -->
    <EditProjectModal
      :project="projectToEdit"
      :saving="saving"
      @submit="saveProject"
      @close="closeModal('editProjectModal')"
    />

    <!-- Add Project Modal -->
    <AddProjectModal
      ref="addProjectModalRef"
      :saving="saving"
      @submit="addProject"
      @close="closeModal('addProjectModal')"
    />
  </div>
</template>
  
<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted } from "vue";
import { collection, getDocs, getDoc, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRoute } from "vue-router";

import { db,auth } from "@/firebase/firebase-config";
import ProjectGallery from "@/components/Projects/ProjectGallery.vue";
import ProjectList from "@/components/Projects/ProjectList.vue";
import DeleteConfirmModal from "@/components/Projects/DeleteConfirmModal.vue";
import EditProjectModal from "@/components/Projects/EditProjectModal.vue";
import AddProjectModal from "@/components/Projects/AddProjectModal.vue";

// const auth = getAuth();
const route = useRoute();


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

// New refs for edit and add functionality
const projectToEdit = ref(null);
const addProjectModalRef = ref(null);
const saving = ref(false);

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
      profileUsername.value = userData.firstName || "User";
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

// Open the add modal
const openAddModal = () => {
  // Reset form if ref is available
  if (addProjectModalRef.value) {
    addProjectModalRef.value.resetForm();
  }
  openModal('addProjectModal');
};

// Add new project
const addProject = async (projectData) => {
  if (!projectData || !isOwner.value) return;
  
  try {
    saving.value = true;
    
    // Add the project to Firestore
    const projectsRef = collection(db, "users", auth.currentUser.uid, "projects");
    const docRef = await addDoc(projectsRef, {
      title: projectData.title,
      description: projectData.description,
      icon: projectData.icon || '',
      githubLink: projectData.githubLink || '',
      stack: projectData.stack || [],
      createdAt: new Date()
    });
    
    // Add the project to the local array with the generated ID
    const newProject = {
      id: docRef.id,
      title: projectData.title,
      description: projectData.description,
      icon: projectData.icon || '',
      githubLink: projectData.githubLink || '',
      stack: projectData.stack || [],
      createdAt: new Date()
    };
    
    projects.value.push(newProject);
    
    // Close the modal
    closeModal('addProjectModal');
    
  } catch (err) {
    console.error("Error adding project:", err);
    alert("Failed to add project. Please try again.");
  } finally {
    saving.value = false;
  }
};

// Open the edit modal
const openEditModal = (project) => {
  projectToEdit.value = { ...project }; // Make a copy of the project
  openModal('editProjectModal');
};

// Save the edited project
const saveProject = async (updatedProject) => {
  
  if (!updatedProject || !isOwner.value) return;
  
  try {
    saving.value = true;
    // Update the project in Firestore
    const projectRef = doc(db, "users", auth.currentUser.uid, "projects", projectToEdit.value.id);
    // Remove the id field before updating
    const { id, ...projectData } = updatedProject;
    await updateDoc(projectRef, projectData);
    // Update the project in the local array
    const index = projects.value.findIndex(p => p.id === projectToEdit.value.id);
    if (index !== -1) {
      projects.value[index] = { ...updatedProject };
    }
    
    // Close the modal
    closeModal('editProjectModal');
    
  } catch (err) {
    console.log("Error updating project:", err);
    alert("Failed to update project. Please try again.");
  } finally {
    saving.value = false;
    projectToEdit.value = null;
  }
};

// Open the delete confirmation modal
const confirmDelete = (project) => {
  projectToDelete.value = project;
  openModal('deleteConfirmModal');
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
    closeModal('deleteConfirmModal');
    
  } catch (err) {
    console.error("Error deleting project:", err);
    alert("Failed to delete project. Please try again.");
  } finally {
    deleting.value = false;
    projectToDelete.value = null;
  }
};

// Utility functions for handling modals
const openModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
};

const closeModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
  
  // Reset the appropriate ref based on which modal was closed
  if (modalId === 'deleteConfirmModal') {
    projectToDelete.value = null;
  } else if (modalId === 'editProjectModal') {
    projectToEdit.value = null;
  }
};

let unsubscribe;

onMounted(() => {
  // Listen for auth state changes
  unsubscribe = onAuthStateChanged(auth, () => {
    checkOwnership();
    fetchProjects();
  });
});

onUnmounted(() => {
  // Clean up the auth listener
  if (unsubscribe) {
    unsubscribe();
  }
  
  // Ensure any open modals are closed
  closeModal('deleteConfirmModal');
  closeModal('editProjectModal');
  closeModal('addProjectModal');
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

.loading-container {
  min-height: 200px;
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

/* Add Project Button styling */
.add-project-btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.add-project-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(58, 134, 255, 0.25);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .heading {
    font-size: 1.8rem;
  }

  .view-toggle .btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .add-project-btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
</style>