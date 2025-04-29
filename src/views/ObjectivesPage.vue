<script setup>
    /*  eslint-disable */
    import { auth, db } from '@/firebase/firebase-config';
    import { onAuthStateChanged } from 'firebase/auth';
    import { ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { onSnapshot,doc,collection, addDoc } from 'firebase/firestore';
    import ObjectiveCard from '@/components/ObjectiveCard.vue';
    import AddObjective from '@/components/AddObjective.vue';
    
    const route = useRoute()
    const router = useRouter()
    const UserId = ref('')
    const User = ref({})
    const objectives = ref([])
    const showModelAdd = ref(false);

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
                objectives.value = SnapShot.docs.map((doc)=>({id: doc.uid, ...doc.data()}))
            }
        }) 
    }
    getObjectives()

    const hideAddPost = ()=>{ showModelAdd.value = false}
    const showAddPost = ()=>{ showModelAdd.value = true}
    const handleAdd = async (newObj)=>{
        const docRef = collection(db,"users",UserId.value, "objectives")
        await addDoc(docRef, newObj)
        showModelAdd.value = false
    }

</script>


<template>
    <div class="objectives-page">
        <h1 class="page-title">OBJECTIVES</h1>
        <div class="search-filter">
            <button @click="showAddPost">Add Task</button>
            <input type="text" placeholder="Search...">
            <select>
                <option value="Done">Done</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
            </select>
        </div>


        <AddObjective v-if="showModelAdd" @cancel="hideAddPost" @addPost="handleAdd"/>
        <div class="objectives-grid">
            <ObjectiveCard v-for="x in objectives" :key="x.id" :objective="x"/>
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