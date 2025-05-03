<template>
  <div id="page" class="text-light">
    <div class="d-flex main-page justify-content-center">
      <div
        class="d-flex flex-column discussions"
        style="max-width: 800px; width: 100%"
      >
        <div class="d-flex text-light mt-2 ms-2">
          <div class="form-select text-light">
            <button
              class="btn dropdown-toggle text-light"
              id="sort"
              data-bs-toggle="dropdown"
              type="button"
            >
              {{ 'sort' }} &nbsp;
            </button>
            <ul class="dropdown-menu" aria-labelledby="sort">
              <li class="dropdown-item" @click="sort = 'Recent'">Projects</li>
              <li class="dropdown-item" @click="sort = 'Top'">Competences</li>
            </ul>
          </div>
        </div>
        <project-div
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </div>
</template>
    
    
    <script setup>
import {  db } from "@/firebase/firebase-config";
import { ref } from "vue";
import {
  collectionGroup,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import ProjectDiv from "@/components/Feed/ProjectDiv.vue";

let lastDoc = null;

const projects = ref([]);

async function start() {
  getProjects();
}

async function getProjects() {
  const q = lastDoc
    ? query(
        collectionGroup(db, "projects"),
        orderBy("createdAt", "desc"),
        limit(10),
        startAfter(lastDoc)
      )
    : query(
        collectionGroup(db, "projects"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
  const snapshot = await getDocs(q);
   snapshot.docs.forEach((doc) => {
    projects.value.push({ id: doc.id, ...doc.data() });
    lastDoc = doc;
    console.log(doc.data());
  });
}

start();
</script>
    
    
    <style scoped>
#page {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  margin: 0;
}

.form-select {
  outline: none;
  border: none;
  box-shadow: none;
}
.form-select:focus {
  border: none;
  box-shadow: none;
}

li {
  color: white;
}
li:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
.dropdown-toggle {
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
}
.dropdown-toggle:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>