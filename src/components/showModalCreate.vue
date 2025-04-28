<script setup>
import {ref, computed} from 'vue'
const name = ref('')
const description = ref('')
const level = ref(1)

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
</script>
<template>
    <div class="blackDrop">
        <div class="form-container">
            <p>
                <label>Competence</label>
                <input type="text" placeholder="Add competence" v-model= "name">
            </p>
            <p>
                <label>Description</label>
                <textarea placeholder="Description" v-model="description"></textarea>
            </p>
            <div class="level-section">
                <label>Level</label>
                <input type="range" min="1" max="4" step = "1" v-model="level">
                <div class="level-display" :style="{ color: levelInfo.color }">
                    <span class="icon">{{ levelInfo.icon }}</span>
                    <span>{{ levelInfo.text }}</span>
                </div>
                <div>
                    <p>Current Level: {{ level }}</p>
                </div>
            </div>
            <div class="actions">
                <button>Add competence</button>
                <button>Close</button>
            </div>
        </div>
    </div>
</template>
<style>
.blackDrop{
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}
.form-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    z-index: 1000000;
}
.level-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-display {
  margin-top: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 1.5rem;
}
</style>