<template>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="project in projects" :key="project.id" class="col">
        <ProjectCard 
          @click="$router.push(`${$route.fullPath}/${project.id}`)"
          :project="project" 
          :is-owner="isOwner"
          @edit="$emit('edit', project)"
          @delete-confirm="$emit('delete-confirm', project)"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import ProjectCard from './ProjectCard.vue';
  
  defineProps({
    projects: {
      type: Array,
      required: true
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['edit', 'delete-confirm']);
  </script>
  
 