<script setup>
import {ref, computed, defineEmits} from 'vue'
const name = ref('')
const description = ref('')
const level = ref(1)
const nameError = ref('')


const emit = defineEmits(['submitAdd', 'close'])


const levelInfo = computed(() => {
  if (level.value == 1) {
    return {
      text: 'Beginner',
      color: '#3b82f6', // blue
      icon: '⭐️',
    }
  } else if (level.value == 2) {
    return {
      text: 'Intermediate',
      color: '#f59e0b', // orange
      icon: '🏅',
    }
  } else if(level.value==3) {
    return {
      text: 'Expert',
      color: '#10b981', // gold
      icon: '🎯',
    }
  }else{
    return {
        text: 'Master',
        color: '#fbbf24',
        icon: '👑'
    }
  }
})
const handleSubmit = ()=>{
  if (!name.value){
    nameError.value = 'You should add the name of the skill';
  }else{
    const toAdd =  {
      name: name.value,
      description: description.value,
      level : level.value
    }
    emit('submitAdd', toAdd);
    name.value = '';
    description.value = '';
    level.value = 1;
  }
}
</script>
<template>
  <div class="blackDrop">
    <div class="form-container">
      <div>
        <label>Competence</label>
        <input type="text" placeholder="Add competence" v-model="name" @input="nameError=''">
        <p v-if="nameError" style="color: red">{{ nameError }}</p>
      </div>
      <div>
        <label>Description</label>
        <textarea placeholder="Description" v-model="description"></textarea>
      </div>
      <div class="level-section">
        <label>Level</label>
        <input type="range" min="1" max="4" step="1" v-model="level">
        <div class="level-display" :style="{ color: levelInfo.color }">
          <span class="icon">{{ levelInfo.icon }}</span>
          <span>{{ levelInfo.text }}</span>
        </div>
      </div>
      <div class="actions">
        <button class="add-btn" @click="handleSubmit">Add competence</button>
        <button class="close-btn" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blackDrop {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* soft black overlay */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  padding: 20px;
}

.form-container {
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 450px;
  animation: popUp 0.4s ease;
}

@keyframes popUp {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.form-container div {
  width: 100%;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
  font-size: 1rem;
}

input[type="text"], textarea {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input[type="text"]:focus, textarea:focus {
  border-color: #7e57c2;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.level-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="range"] {
  width: 100%;
  margin-top: 10px;
}

.level-display {
  margin-top: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 1.8rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
}

.add-btn, .close-btn {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  width: 48%;
}

.add-btn {
  background-color: #7e57c2;
  color: #fff;
  border: none;
}

.add-btn:hover {
  background-color: #673ab7;
  transform: translateY(-2px);
}

.close-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
}

.close-btn:hover {
  background-color: #ccc;
  transform: translateY(-2px);
}
</style>
