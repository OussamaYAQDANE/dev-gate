<template>
    <div
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
          <p class="mb-0 opacity-75 list-text" style="color: #242424">
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
            @click="(e)=>e.stopPropagation()"
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><button class="dropdown-item" @click.stop="$emit('edit', project)">
                <i class="bi bi-pencil me-2"></i> Edit
              </button></li>
              <li><button class="dropdown-item text-danger" @click.stop="$emit('delete-confirm', project)">
                <i class="bi bi-trash me-2"></i> Delete
              </button></li>
            </ul>
          </div>
          
          <a
            v-if="project.githubLink"
            :href="project.githubLink"
            target="_blank"
            class="btn btn-sm btn-github"
            @click="(e)=>e.stopPropagation()"
          >
            <i class="bi bi-github"></i> GitHub
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  defineProps({
    project: {
      type: Object,
      required: true
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['edit', 'delete-confirm']);
  </script>
  
  <style scoped>
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
  
  .list-text{
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>