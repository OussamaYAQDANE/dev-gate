<template>
    <div class="spinner"></div>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #4f46e5; /* Indigo 600 */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: auto; /* Center it if needed */
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  