<template>
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isOpen" class="modal-overlay" @click.self="close">
          <div class="modal-content">
            <button class="modal-close" @click="close" style="color:white">&times;</button>
            <slot></slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
  });
  
  const emit = defineEmits(['update:modelValue']);
  const isOpen = ref(props.modelValue);
  
  watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal;
  });
  
  const close = () => {
    emit('update:modelValue', false);
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: rgb(45, 45, 45);
    padding: 20px;
    border-radius: 8px;
    position: relative;
    width: 500px;
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s;
  }

  .modal-fade-enter,
  .modal-fade-leave-to {
    opacity: 0;
  }
</style>
  