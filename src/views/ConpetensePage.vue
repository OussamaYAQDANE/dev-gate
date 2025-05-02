<script setup>
 /* eslint-disable */
import {ref, onMounted} from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import showModalCreate from '@/components/showModalCreate.vue';
import auth from '@/firebase/firebase-config'
import { db } from '@/firebase/firebase-config';
import { collection } from 'firebase/firestore';
const isLoading = ref(false);
const showModalCr = ref(false);
const addSkill = async (toAdd)=>{
    const user_ref = collection
    await addDoc(db, 'users', auth.currentUser.uid, 'competences');
}
</script>
<template>
    <LoadingSpinner v-if="isLoading"/>
    <div v-else>
        <div>
            <p>SKILLS </p>
            <button @click="showModalCr=true">ajouter competence</button>
            <showModalCreate v-if="showModalCr" @submit="addSkill"/>
        </div>
    </div>
</template>
<style>

</style>