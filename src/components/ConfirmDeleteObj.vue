<script setup>
    import { defineEmits } from 'vue'
    const emit = defineEmits(['confirmDelete', 'cancel'])

    const handleDelete = () => {
    emit('confirmDelete')
    }

    const handleCancel = () => {
    emit('cancel')
    }
</script>

<template>
  <div>
    <div class="modal-overlay" @click.self="handleCancel">
      <div class="modal-content">
        <div class="modal-header">
          <h1><i class="bi bi-exclamation-triangle me-2"></i>Delete Objective</h1>
          <button class="close-btn" @click="handleCancel">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-content">
            <i class="bi bi-exclamation-octagon-fill warning-icon"></i>
            <h2>Are you sure you want to delete this objective?</h2>
            <p>This action cannot be undone. All data associated with this objective will be permanently removed.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="handleCancel">Cancel</button>
          <button class="delete-btn" @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: #1e1e1e;
  width: 500px;
  max-width: 90%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 25px rgba(255, 87, 87, 0.6);
  color: #e0e0e0;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background-color: #d32f2f;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h1 {
  color: white;
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 20px;
  text-align: center;
}

.delete-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.warning-icon {
  font-size: 3rem;
  color: #d32f2f;
}

.modal-body h2 {
  font-size: 1.3rem;
  margin: 0;
  color: #f0f0f0;
}

.modal-body p {
  color: #aaa;
  margin: 0;
  line-height: 1.5;
}

.modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #333;
}

button {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid #666;
  color: #e0e0e0;
}

.delete-btn {
  background-color: #d32f2f;
  border: none;
  color: white;
}

.cancel-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.delete-btn:hover {
  background-color: #f44336;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 87, 87, 0.3);
}

/* Add Bootstrap Icons if not already imported */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");
</style>