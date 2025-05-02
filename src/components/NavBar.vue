<template>
  <nav class="navbar navbar-dark bg-dark shadow-sm sticky-top border-bottom border-secondary">
    <div class="container-fluid">
      <!-- Brand -->
      <div class="navbar-brand d-flex align-items-center">
        <img src="../assets/logo.png" class="me-2" width="30" height="30" alt="Logo">
        <span class="fw-bold">Dev Gate</span>
      </div>

<ul class="navbar-nav d-flex flex-row me-3">
          <li class="nav-item me-3">
            <router-link to="/" exact-active-class="active" class="nav-link">Messaging</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/search" exact-active-class="active" class="nav-link">Search</router-link>
          </li>
        </ul>
      <!-- Navigation content - always visible -->
      <div class="d-flex">
        <!-- Nav links (commented out in original, kept for reference) -->

        

        <!-- User actions -->
        <div class="d-flex align-items-center">
          <!-- Logout button -->
          <button
            class="btn btn-outline-danger d-flex align-items-center me-3"
            @click="signOut(auth)"
          >
            <i class="material-icons me-1" style="font-size: 18px">logout</i>
            <span>Logout</span>
          </button>

          <!-- Profile image -->
          <router-link
            :to="{name: 'ProfilePage', params: {uid: auth.currentUser.uid}}"
            class="profile-link"
          >
            <img
              :src="props.profilePic ? profilePic : DefaultProfile"
              class="profile-image rounded-circle border border-light"
              alt="Profile"
            />
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { defineProps } from "vue";
import DefaultProfile from "@/assets/default-profile.png";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase-config";

const props = defineProps({
  profilePic: String,
});
</script>

<style scoped>
.navbar {
  height: 60px;
}

.profile-link {
  transition: transform 0.2s;
}

.profile-link:hover {
  transform: scale(1.05);
}

.profile-image {
  height: 40px;
  width: 40px;
  object-fit: cover;
  object-position: top center;
}

/* Custom styling for active nav links and hover effect */
.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #8a2be2; /* Purple color matching your original */
  border-radius: 1px;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.active::after {
  width: 100%;
  background-color: #8a2be2;
}
</style>