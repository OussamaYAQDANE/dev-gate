<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-accent heading">{{ pageTitle }}</h1>
      <div class="d-flex align-items-center gap-3">
        <!-- Add Skill Button - Only visible to the owner -->
        <button 
          v-if="isOwner" 
          class="btn btn-accent add-skill-btn"
          @click="openAddModal"
        >
          <i class="bi bi-plus-lg me-2"></i> Add Skill
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
      <p class="mt-2">Loading the skills...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger custom-alert" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>

    <div v-else-if="skills.length === 0" class="text-center py-5 empty-state">
      <i class="bi bi-layers display-1 text-muted"></i>
      <p class="mt-3">{{ isOwner ? "You don't have any skills yet." : "This user doesn't have any skills yet." }}</p>
      <button 
        v-if="isOwner"
        class="btn btn-accent mt-3"
        @click="openAddModal"
      >
        <i class="bi bi-plus-lg me-2"></i> Add Your First Skill
      </button>
    </div>

    <template v-else>
      <!-- Gallery View -->
      <div v-if="displayMode === 'gallery'" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="skill in skills" :key="skill.id" class="col">
          <div class="skill-card">
            <div class="card-header d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
               
                <div>
                  <h5 class="skill-title mb-1">{{ skill.title }}</h5>
                </div>
              </div>
              <div v-if="isOwner" class="skill-actions">
                <button class="btn btn-sm btn-outline-accent me-2" @click="openEditModal(skill)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(skill)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            <div class="card-body">
              <p class="skill-description">{{ skill.description }}</p>
              <div>
                <span class="skill-level" :class="`level-${skill.level.toLowerCase()}`">
                      {{ skill.level }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="skills-list">
        <div v-for="skill in skills" :key="skill.id" class="skill-list-item">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              
              <div>
                <h5 class="skill-title mb-1">{{ skill.title }}</h5>
                <span class="skill-level" :class="`level-${skill.level.toLowerCase()}`">
                  {{ skill.level }}
                </span>
              </div>
            </div>
            <div class="d-flex skill-list-content">
              <p class="skill-description me-4 mb-0">{{ skill.description }}</p>
              <div v-if="isOwner" class="skill-actions">
                <button class="btn btn-sm btn-outline-accent me-2" @click="openEditModal(skill)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(skill)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteConfirmModalLabel">Delete Skill</h5>
            <button type="button" class="btn-close" @click="closeModal('deleteConfirmModal')" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the skill "{{ skillToDelete?.title }}"?</p>
            <p class="text-danger"><small>This action cannot be undone.</small></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('deleteConfirmModal')">Cancel</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deleteSkill"
              :disabled="deleting"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Skill Modal -->
    <div class="modal fade" id="editSkillModal" tabindex="-1" aria-labelledby="editSkillModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editSkillModalLabel">Edit Skill</h5>
            <button type="button" class="btn-close" @click="closeModal('editSkillModal')" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSkill">
              <div class="mb-3">
                <label for="editTitle" class="form-label">Title</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="editTitle" 
                  v-model="skillToEdit.title" 
                  required
                >
              </div>
              <div class="mb-3">
                <label for="editDescription" class="form-label">Description</label>
                <textarea 
                  class="form-control" 
                  id="editDescription" 
                  v-model="skillToEdit.description" 
                  rows="3" 
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="editLevel" class="form-label">Skill Level</label>
                <select class="form-select" id="editLevel" v-model="skillToEdit.level" required>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('editSkillModal')">Cancel</button>
            <button 
              type="button" 
              class="btn btn-accent" 
              @click="saveSkill"
              :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Skill Modal -->
    <div class="modal fade" id="addSkillModal" tabindex="-1" aria-labelledby="addSkillModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addSkillModalLabel">Add New Skill</h5>
            <button type="button" class="btn-close" @click="closeModal('addSkillModal')" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addSkill">
              <div class="mb-3">
                <label for="newTitle" class="form-label">Title</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="newTitle" 
                  v-model="newSkill.title" 
                  required
                >
              </div>
              <div class="mb-3">
                <label for="newDescription" class="form-label">Description</label>
                <textarea 
                  class="form-control" 
                  id="newDescription" 
                  v-model="newSkill.description" 
                  rows="3" 
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="newLevel" class="form-label">Skill Level</label>
                <select class="form-select" id="newLevel" v-model="newSkill.level" required>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('addSkillModal')">Cancel</button>
            <button 
              type="submit" 
              class="btn btn-accent" 
              
              :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ saving ? 'Adding...' : 'Add Skill' }}
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted } from "vue";
import { collection, getDocs, getDoc, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, increment } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRoute } from "vue-router";
import { db } from "@/firebase/firebase-config"; // Adjust the import path as needed

const auth = getAuth();
const route = useRoute();

const skills = ref([]);
const loading = ref(true);
const error = ref(null);
const displayMode = ref("gallery"); // Default to gallery view
const pageTitle = ref("Skills");
const isOwner = ref(false);
const currentUserUid = ref(null);
const profileUserUid = ref(route.params.uid);
const profileUsername = ref("");

// Refs for delete functionality
const skillToDelete = ref(null);
const deleting = ref(false);

// Refs for edit functionality
const skillToEdit = ref({});
const saving = ref(false);

// Ref for add functionality
const newSkill = ref({
  title: "",
  description: "",
  level: "beginner"
});

// Check if the current user is the owner of the profile
const checkOwnership = () => {
  if (auth.currentUser) {
    currentUserUid.value = auth.currentUser.uid;
    isOwner.value = currentUserUid.value === profileUserUid.value;
    
    // Set the page title based on ownership
    if (isOwner.value) {
      pageTitle.value = "My Skills";
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
      pageTitle.value = `${profileUsername.value}'s Skills`;
    } else {
      pageTitle.value = "User's Skills";
    }
  } catch (err) {
    console.error("Error fetching username:", err);
    pageTitle.value = "User's Skills";
  }
};

// Fetch skills from Firestore
const fetchSkills = async () => {
  try {
    loading.value = true;
    error.value = null;

    const skillsRef = collection(
      db,
      "users",
      profileUserUid.value,
      "competences"
    );
    const skillsSnapshot = await getDocs(skillsRef);

    const skillsList = [];
    skillsSnapshot.forEach((doc) => {
      skillsList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    skills.value = skillsList;
  } catch (err) {
    console.error("Error fetching skills:", err);
    error.value = "Failed to load skills. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Open the add modal
const openAddModal = () => {
  // Reset the new skill form
  newSkill.value = {
    title: "",
    description: "",
    level: "beginner"
  };
  openModal('addSkillModal');
};

// Add new skill
const addSkill = async () => {
  if (!isOwner.value) return;
  
  try {
    saving.value = true;
    
    // Add the skill to Firestore
    const skillsRef = collection(db, "users", auth.currentUser.uid, "competences");
    const docRef = await addDoc(skillsRef, {
      title: newSkill.value.title,
      description: newSkill.value.description,
      level: newSkill.value.level,
      createdAt: serverTimestamp(),
      upvoters: [],
      downvoters: [],
      authorId: auth.currentUser.uid
    });
    const activityRef = collection(db, "users", auth.currentUser.uid, "activities");
    const activity = await addDoc(activityRef, {
      time: serverTimestamp(),
      type: "skill",
      T1: `Skill ${newSkill.value.title} has been added`,
      T2: `Current level ${newSkill.value.level}`
    })
    const userRef = doc(db, "users", auth.currentUser.uid);
    if (newSkill.value.level=="beginner") {
      const current = await getDoc(userRef)
      if (current.exists){
        const addTo = current.data().numbeginner || 0
        await updateDoc(userRef, {
        numbeginner: addTo+1
      })}
    }
    if (newSkill.value.level=="intermediate") {
      const current = await getDoc(userRef)
      if (current.exists){
        const addTo = current.data().numintermediate || 0
        await updateDoc(userRef, {
        numintermediate: addTo+1
      })}
    }
    if (newSkill.value.level=="advanced") {
      const current = await getDoc(userRef)
      if (current.exists){
        const addTo = current.data().numadvanced || 0
        await updateDoc(userRef, {
        numadvanced: addTo+1
      })}
    }
    if (newSkill.value.level=="expert") {
      const current = await getDoc(userRef)
      if (current.exists){
        const addTo = current.data().numexpert || 0
        await updateDoc(userRef, {
        numexpert: addTo+1
      })}
    }
    // Add the skill to the local array with the generated ID
    const newSkillWithId = {
      id: docRef.id,
      title: newSkill.value.title,
      description: newSkill.value.description,
      level: newSkill.value.level,
      createdAt: new Date()
    };
    
    skills.value.push(newSkillWithId);
    
    // Close the modal
    closeModal('addSkillModal');
    
  } catch (err) {
    console.error("Error adding skill:", err);
    alert("Failed to add skill. Please try again.");
  } finally {
    saving.value = false;
  }
};

// Open the edit modal
const openEditModal = (skill) => {
  skillToEdit.value = { ...skill }; // Make a copy of the skill
  openModal('editSkillModal');
};

// Save the edited skill
const saveSkill = async () => {
  if (!skillToEdit.value || !isOwner.value) return;
  
  try {
    saving.value = true;
    const userRef = doc(db , "users", auth.currentUser.uid)
    const skillRef = doc(db, "users", auth.currentUser.uid, "competences", skillToEdit.value.id);
    const oldSkill = await getDoc(skillRef)
    const oldLevel = oldSkill.exists() ? oldSkill.data().level : 0
    await updateDoc(userRef ,{
      [`num${oldLevel}`]: increment(-1)
    })
    // Update the skill in Firestore
    
    // Remove the id field before updating
    const { id, ...skillData } = skillToEdit.value;
    await updateDoc(skillRef, skillData);
    await updateDoc(userRef ,{
      [`num${skillData.level}`]: increment(1)
    })
    if (oldLevel!=skillData.level){
      const activityRef = collection(db, "users", auth.currentUser.uid, "activities");
      const activity = await addDoc(activityRef, {
      time: serverTimestamp(),
      type: "skill",
      T1: `Progression in '${skillToEdit.value.title}'`,
      T2: `Current level ${skillData.level}`
    })
    }
    // Update the skill in the local array
    const index = skills.value.findIndex(s => s.id === id);
    if (index !== -1) {
      skills.value[index] = { ...skillToEdit.value };
    }
    
    // Close the modal
    closeModal('editSkillModal');
    
  } catch (err) {
    console.error("Error updating skill:", err);
    alert("Failed to update skill. Please try again.");
  } finally {
    saving.value = false;
  }
};

// Open the delete confirmation modal
const confirmDelete = (skill) => {
  skillToDelete.value = skill;
  openModal('deleteConfirmModal');
};

// Delete the skill
const deleteSkill = async () => {
  if (!skillToDelete.value || !isOwner.value) return;
  
  try {
    deleting.value = true;
    const docc = doc(db, "users", auth.currentUser.uid, "competences", skillToDelete.value.id)
    let level_to_decrement = await getDoc(docc)
    level_to_decrement = level_to_decrement.data().level
    await deleteDoc(
      docc
    );
    const userRef = doc(db , "users", auth.currentUser.uid)
    await updateDoc(userRef, {
      [`num${level_to_decrement}`]: increment(-1)
    })
    // Remove the skill from the local array
    skills.value = skills.value.filter(s => s.id !== skillToDelete.value.id);
    
    // Close the modal
    closeModal('deleteConfirmModal');
    
  } catch (err) {
    console.error("Error deleting skill:", err);
    alert("Failed to delete skill. Please try again.");
  } finally {
    deleting.value = false;
    skillToDelete.value = null;
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
    skillToDelete.value = null;
  } else if (modalId === 'editSkillModal') {
    skillToEdit.value = {};
  }
};

let unsubscribe;

onMounted(() => {
  // Listen for auth state changes
  unsubscribe = onAuthStateChanged(auth, () => {
    checkOwnership();
    fetchSkills();
  });
});

onUnmounted(() => {
  // Clean up the auth listener
  if (unsubscribe) {
    unsubscribe();
  }
  
  // Ensure any open modals are closed
  closeModal('deleteConfirmModal');
  closeModal('editSkillModal');
  closeModal('addSkillModal');
});
</script>


<style scoped>
/* Bootstrap icons are needed for this component */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");

/* Modern tech theme with glass morphism */
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
  
  /* Accent color variables for buttons and UI elements */
  --accent-color: var(--primary-glow);
  --accent-hover: #4cd3b0;
  --accent-light: rgba(100, 255, 218, 0.1);
  --accent-medium: rgba(100, 255, 218, 0.2);
  --accent-glow: rgba(100, 255, 218, 0.5);
}

.heading {
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
  color: var(--accent-color);
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
  color: var(--bg-dark);
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  color: var(--bg-dark);
}



.btn-outline-danger {
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
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
  background-color: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px dashed #2d3748;
}

.custom-alert {
  border-radius: 8px;
  border: none;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-left: 4px solid #ef4444;
  padding: 1rem;
}

/* Add Skill Button styling */
.add-skill-btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.add-skill-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(100, 255, 218, 0.25);
}




.card-header {
  background-color: rgba(30, 41, 59, 0.8);
  border-bottom: 1px solid var(--border-subtle);
  padding: 1rem;
}

.card-body {
  padding: 1rem;
}


/* List View Styling */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-list-item {
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  padding: 1rem;
  transition: all 0.3s ease;
}

.skill-list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-glow);
}

.skill-list-content {
  align-items: center;
}

/* Modal styling */
.modal-content {
  background-color: var(--card-bg);
  color: var(--text-light);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
}

.modal-header {
  border-bottom: 1px solid var(--border-subtle);
}

.modal-footer {
  border-top: 1px solid var(--border-subtle);
}

.btn-close {
  color: var(--text-light);
  filter: invert(1) brightness(200%);
}

.form-control, .form-select {
  background-color: rgba(30, 41, 59, 0.8);
  border: 1px solid var(--border-subtle);
  color: var(--text-light);
}

.form-control:focus, .form-select:focus {
  background-color: rgba(30, 41, 59, 0.9);
  border-color: var(--primary-glow);
  box-shadow: 0 0 0 0.25rem rgba(100, 255, 218, 0.25);
  color: var(--text-light);
}

.form-label {
  color: var(--text-light);
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
  
  .add-skill-btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .skill-list-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .skill-list-content .skill-description {
    margin-bottom: 0.5rem;
  }
  
  .skill-actions {
    margin-top: 0.5rem;
  }
}
/* Skill Cards Styling */

/* Overall card styling */
.skill-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  overflow: hidden;
}

.skill-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Card header */
.card-header {
  background-color: rgb(59, 59, 59);
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem;
}



/* Skill title */
.skill-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #e0dddd;
}

/* Skill level badges */
.skill-level {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

.level-beginner {
  background-color: #e6f7ff;
  color: #0096c7;
}

.level-intermediate {
  background-color: #e6f6e6;
  color: #2c974b;
}

.level-advanced {
  background-color: #fff3e6;
  color: #f76707;
}

.level-expert {
  background-color: #f5e6ff;
  color: #9c36b5;
}

/* Card body */
.card-body {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}

.skill-description {
  color: #e0dddd;
  font-size: 0.9rem;
  margin-bottom: 0;
  line-height: 1.5;
}

/* Button styling */
.skill-actions .btn {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.btn-outline-accent {
  border-color: #6366f1;
  color: #6366f1;
}

.btn-outline-accent:hover {
  background-color: #6366f1;
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  
  .skill-title {
    font-size: 1rem;
  }
}
</style>