<script setup>
 /* eslint-disable */
import {ref, onMounted} from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import showModalCreate from '@/components/showModalCreate.vue';
const isLoading = ref(false);
const showModalCr = ref(false);
const addComp = async ()=>{

}
</script>
<template>
    <LoadingSpinner v-if="isLoading"/>
    <div v-else>
        <div>
            <button @click="showModalCr=true">ajouter competence</button>
            <showModalCreate v-if="showModalCr"/>
        </div>
    </div>
</template>
<style>

</style>