<script setup>
    /*  eslint-disable */
    import { auth, db } from '@/firebase/firebase-config';
    import { onAuthStateChanged } from 'firebase/auth';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { onSnapshot,doc,collection } from 'firebase/firestore';
    import ObjectiveCard from '@/components/ObjectiveCard.vue';
    
    

    const router = useRouter()
    const currentUserId = ref('')
    const currentUser = ref({})
    const objectives = ref([])


    onAuthStateChanged(auth, (user)=>{
        if (user){
            currentUserId.value = user.uid;
            getUser()
            getObjectives()
        }else{
            router.push('/login')
        }
    })

    const getUser = ()=>{
        const docRef = doc(db, "users", currentUserId.value)
        onSnapshot(docRef, (Snapshot)=>{
            if (Snapshot.data()){
                currentUser.value = Snapshot.data()
            }
        })
    }

    const getObjectives = ()=>{
        const docRef = collection(db,"users",currentUserId.value, "objectives")
        onSnapshot(docRef, (SnapShot)=>{
            if (SnapShot && SnapShot.docs){
                objectives.value = SnapShot.docs.map((doc)=>({id: doc.uid, ...doc.data()}))
            }
        }) 
    }

</script>


<template>
    <div class="objectives-page">
        <h1 class="page-title">OBJECTIVES</h1>
        <div class="search-filter">
            
        </div>
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
</style>