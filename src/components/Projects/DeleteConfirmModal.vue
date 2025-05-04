<template>
    <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Project</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ project?.title }}</strong>?</p>
            <p class="text-danger mb-0"><small>This action cannot be undone.</small></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
            <button type="button" class="btn btn-danger" @click="$emit('confirm')" :disabled="deleting">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ deleting ? 'Deleting...' : 'Delete Project' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  defineProps({
    project: {
      type: Object,
      default: null
    },
    deleting: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['confirm', 'close']);
  </script>
  
