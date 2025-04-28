<template>
  <loading-screen v-if="isLoading" />
  <div v-else class="d-flex flex-column" style="width: 100%; height: 100%; overflow: hidden;">
    <nav-bar :profilePic="profilePic"  />
    <div style="height: 100%; overflow: auto;">
        <router-view />
    </div>
    
  </div>
</template>

<script setup>
/* eslint-disable */

import { auth, db } from "@/firebase/firebase-config";
import router from "@/router";
import { onAuthStateChanged } from "firebase/auth";
import NavBar from "@/components/NavBar.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import { ref } from "vue";
import { doc, getDoc } from "firebase/firestore";

const isLoading = ref(true);
const profilePic = ref('');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    router.push("/login");
    return;
  }
  const snapshot = await getDoc(doc(db,"users", user.uid));
  profilePic.value = snapshot.data().profilePic;
  isLoading.value = false;
});
</script>

<style>
</style>