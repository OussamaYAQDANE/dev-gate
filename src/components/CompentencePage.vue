<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">User Competences</h1>
      
      <div v-if="loading" class="flex justify-center items-center h-64">
        <LoadingSpinner/>
      </div>
      
      <p v-else-if="competences.length === 0" class="text-gray-500">
        No competences found for this user.
      </p>
      
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li v-for="competence in competences" :key="competence.id" class="p-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <!-- Edit Mode -->
              <div v-if="editingId === competence.id" class="flex items-center flex-1 mr-4">
                <input
                  v-model="editValue"
                  type="text"
                  class="flex-1 p-2 border rounded-md"
                />
                <div class="flex ml-2">
                  <button 
                    @click="handleSave"
                    class="p-1 text-green-600 hover:text-green-800 mr-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button 
                    @click="handleCancel"
                    class="p-1 text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                  </button>
                </div>
              </div>
              
              <!-- View Mode -->
              <template v-else>
                <span class="flex-1 text-gray-800">{{ competence.name }}</span>
                <div class="flex ml-4">
                  <button
                    @click="handleEdit(competence)"
                    class="p-2 text-blue-600 hover:text-blue-800 mr-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                  <button
                    @click="handleDelete(competence.id)"
                    class="p-2 text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </template>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable */
  import { ref, onMounted } from 'vue';
  import { collection, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
  import { db } from '@/firebase/firebase-config'; // Update this path to your Firebase config
  import LoadingSpinner from './LoadingSpinner.vue';
  import { auth } from '@/firebase/firebase-config';
  // Props
  const props = defineProps({
    userId: {
      type: String,
      required: true
    }
  });
  
  // Reactive state
  const competences = ref([]);
  const loading = ref(true);
  const editingId = ref(null);
  const editValue = ref('');
  
  // Fetch user competences
  const fetchCompetences = async () => {
    try {
      const competencesRef = collection(db, 'competences', auth.currentUser.uid);
      const competencesSnapshot = await getDocs(competencesRef);
      
      const competencesList = competencesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      competences.value = competencesList;
      loading.value = false;
    } catch (error) {
      console.error("Error fetching competences:", error);
      loading.value = false;
    }
  };
  
  // Delete competence
  const handleDelete = async (competenceId) => {
    try {
      await deleteDoc(doc(db, `users/${props.userId}/competences/${competenceId}`));
      // Update state to remove the deleted competence
      competences.value = competences.value.filter(comp => comp.id !== competenceId);
    } catch (error) {
      console.error("Error deleting competence:", error);
    }
  };
  
  // Start editing
  const handleEdit = (competence) => {
    editingId.value = competence.id;
    editValue.value = competence.name || '';
  };
  
  // Save edited competence
  const handleSave = async () => {
    try {
      const competenceRef = doc(db, `users/${props.userId}/competences/${editingId.value}`);
      await updateDoc(competenceRef, { name: editValue.value });
      
      // Update state with the edited competence
      competences.value = competences.value.map(comp => 
        comp.id === editingId.value ? { ...comp, name: editValue.value } : comp
      );
      
      // Reset editing state
      editingId.value = null;
      editValue.value = '';
    } catch (error) {
      console.error("Error updating competence:", error);
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    editingId.value = null;
    editValue.value = '';
  };
  
  // Lifecycle hooks
  onMounted(() => {
      fetchCompetences();
  });
  </script>
<style scoped>
body{
  color: white;
  background-color: white;
}

</style>