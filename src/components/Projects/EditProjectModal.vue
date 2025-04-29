<template>
    <div class="modal fade" id="editProjectModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Project</h5>
          </div>
          <div class="modal-body">
            <form @submit.prevent="$emit('submit', projectData)">
              <div class="mb-3">
                <label for="projectTitle" class="form-label">Project Title*</label>
                <input
                  type="text"
                  class="form-control"
                  id="projectTitle"
                  v-model="projectData.title"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="projectDescription" class="form-label">Description*</label>
                <textarea
                  class="form-control"
                  id="projectDescription"
                  rows="3"
                  v-model="projectData.description"
                  required
                ></textarea>
              </div>
              
              <div class="mb-3">
                <label for="projectIcon" class="form-label">Icon URL</label>
                <input
                  type="url"
                  class="form-control"
                  id="projectIcon"
                  v-model="projectData.icon"
                  placeholder="https://example.com/icon.png"
                />
                <div class="form-text">URL to an image that will be used as the project icon</div>
              </div>
              
              <div class="mb-3">
                <label for="githubLink" class="form-label">GitHub Link</label>
                <input
                  type="url"
                  class="form-control"
                  id="githubLink"
                  v-model="projectData.githubLink"
                  placeholder="https://github.com/username/repository"
                />
              </div>
              
              <div class="mb-3">
                <label class="form-label">Tech Stack</label>
                <div class="input-group mb-2">
                  <input
                    type="text"
                    class="form-control"
                    v-model="newTech"
                    placeholder="Add technology"
                    @keyup.enter.prevent="addTech"
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="addTech"
                  >
                    Add
                  </button>
                </div>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="(tech, index) in projectData.stack"
                    :key="index"
                    class="badge tech-badge d-flex align-items-center"
                  >
                    {{ tech }}
                    <button 
                      type="button" 
                      class="btn-close btn-close-white ms-2" 
                      aria-label="Remove"
                      @click="removeTech(index)"
                      style="font-size: 0.5rem;"
                    ></button>
                  </span>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="$emit('submit', projectData)"
              :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, reactive, ref, watch } from 'vue';
  
  const props = defineProps({
    project: {
      type: Object,
      default: null
    },
    saving: {
      type: Boolean,
      default: false
    }
  });
  
  //const emit = defineEmits(['submit', 'close']);
  
  // Create a reactive copy of the project data
  const projectData = reactive({
    title: '',
    description: '',
    icon: '',
    githubLink: '',
    stack: []
  });
  
  // Watch for changes in the project prop
  watch(() => props.project, (newProject) => {
    if (newProject) {
      projectData.title = newProject.title || '';
      projectData.description = newProject.description || '';
      projectData.icon = newProject.icon || '';
      projectData.githubLink = newProject.githubLink || '';
      projectData.stack = [...(newProject.stack || [])];
    }
  }, { immediate: true });
  
  const newTech = ref('');
  
  // Add new technology to the stack
  const addTech = () => {
    const tech = newTech.value.trim();
    if (tech && !projectData.stack.includes(tech)) {
      projectData.stack.push(tech);
      newTech.value = '';
    }
  };
  
  // Remove technology from the stack
  const removeTech = (index) => {
    projectData.stack.splice(index, 1);
  };
  </script>
  
  <style scoped>
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
  
  /* Override Bootstrap's default modal styles for a modern look */
  :deep(.modal-content) {
    border-radius: 12px;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.modal-header) {
    background: linear-gradient(
      145deg,
      var(--accent-light),
      var(--accent-medium)
    );
    border-bottom: 2px solid var(--accent-color);
    padding: 15px 20px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  
  :deep(.modal-footer) {
    border-top: none;
    padding: 15px 20px;
  }
  
  :deep(.form-control, .input-group) {
    border-radius: 8px;
  }
  
  :deep(.form-control:focus) {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 0.25rem var(--accent-light);
  }
  </style>