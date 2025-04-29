<template>
    <div class="card h-100 shadow-sm project-card" style="cursor: pointer">
      <div class="card-header d-flex align-items-center justify-content-between custom-card-header">
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
            <li><button class="dropdown-item" @click.stop="$emit('edit', project)">
              <i class="bi bi-pencil me-2"></i> Edit
            </button></li>
            <li><button class="dropdown-item text-danger" @click.stop="$emit('delete-confirm', project)">
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
  
  .project-title {
    color: #111827;
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  
  .card-text{
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  @media (max-width: 768px) {
    .project-card {
      margin-bottom: 15px;
    }
  }
  </style>