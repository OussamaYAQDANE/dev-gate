<template>
    <div class="list-group shadow-sm">
      <ProjectListItem
        v-for="project in projects"
        @click="$router.push(`${$route.fullPath}/${project.id}`)"
        :key="project.id"
        :project="project"
        :is-owner="isOwner"
        @edit="$emit('edit', project)"
        @delete-confirm="$emit('delete-confirm', project)"
      />
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import ProjectListItem from './ProjectListItem.vue';
  
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
  
  <style scoped>
  /* No specific styles needed, inherits from parent */
  </style>