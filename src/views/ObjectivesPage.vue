<script setup>
/*  eslint-disable */
import { auth, db } from '@/firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { onSnapshot, doc, collection, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import ObjectiveCard from '@/components/ObjectiveCard.vue';
import AddObjective from '@/components/AddObjective.vue';
import EditObjective from '@/components/EditObjective.vue';
import ConfirmDeleteObj from '@/components/ConfirmDeleteObj.vue';

const name_to_search = ref('')
const type_to_search = ref('')
const route = useRoute()
const router = useRouter()
const UserId = ref('')
const User = ref({})
const objectives = ref([])
const showModelAdd = ref(false)
const showModelEdit = ref(false)
const showConfirm = ref(false)
const ObjectiveToEditId = ref('')
const ObjectiveToDelete = ref('')

UserId.value = route.params.uid;

const getUser = ()=>{
    const docRef = doc(db, "users", UserId.value)
    onSnapshot(docRef, (Snapshot)=>{
        if (Snapshot.data()){
            User.value = Snapshot.data()
        }
    })
}
getUser()

const getObjectives = ()=>{
    const docRef = collection(db,"users",UserId.value, "objectives")
    onSnapshot(docRef, (SnapShot)=>{
        if (SnapShot && SnapShot.docs){
            objectives.value = SnapShot.docs.map((doc)=>({id: doc.id, ...doc.data()}))
        }
    }) 
}
getObjectives()

const filteredObjectives = computed(() => {
    return objectives.value.filter(obj => {
        // Filter by name (case insensitive)
        const nameMatch = obj.name.toLowerCase().includes(name_to_search.value.toLowerCase())
        
        // Filter by type (if type_to_search has a value)
        const typeMatch = type_to_search.value === '' || 
                          obj.status.toLowerCase() === type_to_search.value.toLowerCase()
        
        return nameMatch && typeMatch
    })
})

const hideAddPost = ()=>{ showModelAdd.value = false}
const showAddPost = ()=>{ showModelAdd.value = true}
const hideEditPost = ()=>{showModelEdit.value = false}
const hideConfirm = ()=>{ showConfirm.value = false}

const handleAdd = async (newObj)=>{
    const docRef = collection(db,"users",UserId.value, "objectives")
    await addDoc(docRef, newObj)
    showModelAdd.value = false
}

const showEditPost = (id)=>{
    ObjectiveToEditId.value=id;
    showModelEdit.value = true;
}

const showConfirmModel = (id)=>{
    ObjectiveToDelete.value = id;
    showConfirm.value = true;
}

const handleDelete = async ()=>{
    showConfirm.value = false;
    await deleteDoc(doc(db, "users", UserId.value, "objectives", ObjectiveToDelete.value))
}

const handleEdit = async (newObj)=>{
    showModelEdit.value = false;
    await setDoc(doc(db, "users", UserId.value, "objectives", ObjectiveToEditId.value),newObj)
}
</script>

<template>
    <div class="objectives-page">
        <h1 class="page-title">OBJECTIVES</h1>
        <div class="search-filter">
            <button @click="showAddPost">Add Task</button>
            <input v-model="name_to_search" type="text" placeholder="Search...">
            <select v-model="type_to_search">
                <option value="">All Statuses</option>
                <option value="complete">Done</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
            </select>
        </div>

        <AddObjective v-if="showModelAdd" @cancel="hideAddPost" @addPost="handleAdd"/>
        <EditObjective v-if="showModelEdit" @cancel="hideEditPost" @editPost="handleEdit" :objectiveId="ObjectiveToEditId"/>
        <ConfirmDeleteObj v-if="showConfirm" @cancel="hideConfirm" @confirmDelete="handleDelete"/>

        <div class="objectives-grid">
            <ObjectiveCard 
                v-for="x in filteredObjectives" 
                :key="x.id" 
                :objective="x" 
                @showConfirm="showConfirmModel(x.id)"  
                @showEdit="showEditPost(x.id)"
            />
        </div>
    </div>
</template>



<style scoped>
.objectives-page {
    padding: 20px;
}

.page-title {
    color: #d275ff;
    text-shadow: 0 0 10px rgba(210, 117, 255, 0.5);
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
}

.objectives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

@media (max-width: 768px) {
    .objectives-grid {
        grid-template-columns: 1fr;
    }
}

.search-filter {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
    align-items: center;
    flex-wrap: wrap;
}

.search-filter button {
    background-color: #d275ff;
    color: #1e1e1e;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(210, 117, 255, 0.3);
}

.search-filter button:hover {
    background-color: #e19fff;
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(210, 117, 255, 0.5);
}

.search-filter input[type="text"] {
    background-color: #2a2a2a;
    color: #e0e0e0;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 8px 15px;
    flex-grow: 1;
    transition: all 0.3s ease;
}

.search-filter input[type="text"]:focus {
    outline: none;
    border-color: #d275ff;
    box-shadow: 0 0 10px rgba(210, 117, 255, 0.3);
}

.search-filter input[type="text"]::placeholder {
    color: #888;
}

.search-filter select {
    background-color: #2a2a2a;
    color: #e0e0e0;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 8px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-filter select:focus {
    outline: none;
    border-color: #d275ff;
    box-shadow: 0 0 10px rgba(210, 117, 255, 0.3);
}

/* For mobile devices */
@media (max-width: 768px) {
    .search-filter {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>