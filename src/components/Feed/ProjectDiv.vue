<template>
  <div
    class="project-card mb-3"
    @click="$router.push(project.authorId + '/projects/' + project.id)"
  >
    <div v-if="isLoading" class="loading-container">
      <loading-spinner />
    </div>
    <div v-else class="project-content">
      
      <div class="project-header">
        <div class="author-info">
          <img
            :src="profilePic ? profilePic : defaultProfile"
            class="author-avatar"
            alt="Author profile"
          />
          <div class="author-details">
            <span
              class="author-name"
              @click="
                (e) => {
                  e.stopPropagation();
                  $router.push(project.authorId);
                }
              "
              >{{ fullName }}</span
            >
            <span class="post-date">{{ getTimeAgo(project.createdAt) }}</span>
          </div>
        </div>
        <div v-if="project.icon" class="project-icon">
          <i :class="project.icon"></i>
        </div>
      </div>

    
      <h4 class="project-title">Added a new project: {{ project.title }}</h4>
      <p class="project-description">{{ project.description }}</p>

     
      <div v-if="project.stack && project.stack.length > 0" class="tech-stack">
        <span
          class="stack-item"
          v-for="(tech, index) in project.stack"
          :key="index"
        >
          {{ tech }}
        </span>
      </div>

     
      <div
        class="github-link d-flex flex-row justify-content-between align-items-center"
      >
        <button class="btn btn-sm github-link" target="_blank" >
          <i class="bi bi-github"></i> View on GitHub
        </button>
        <div class="project-actions">
          <div class="btn-group">
            <div
              class="overlay"
              :class="rating"
              style="
                display: flex;
                flex-direction: row-reverse;
                align-items: center;
                border-top-left-radius: 30px;
                border-bottom-left-radius: 30px;
              "
              @click.stop="like"
            >
              <i
                :class="{
                  'material-icons': rating == 'liked',
                  'material-icons-outlined': rating != 'liked',
                }"
                >thumb_up
              </i>
            </div>
            <span
              class="d-flex align-items-center upvotes"
              :class="rating"
              style="font-weight: bold; height: 100%"
            >
              {{ likesCount }}
            </span>
            <div
              class="overlay"
              :class="rating"
              style="
                display: flex;
                align-items: center;
                border-top-right-radius: 30px;
                border-bottom-right-radius: 30px;

              "
              @click.stop="dislike()"
            >
              <i
                :class="{
                  'material-icons': rating == 'disliked',
                  'material-icons-outlined': rating != 'disliked',
                }"
                >thumb_down</i
              >
            </div>
          </div>
        </div>
      </div>

      
    </div>
  </div>
</template>
    
  <script setup>
/* eslint-disable */
import { ref, defineProps } from "vue";
import getTimeAgo from "@/utilities/relativeTime";
import defaultProfile from "@/assets/default-profile.png";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import LoadingSpinner from "../LoadingSpinner.vue";
import { auth, db } from "@/firebase/firebase-config";

const rating = ref("neutral");
const isLoading = ref(true);
const props = defineProps({
  project: Object,
});

const profilePic = ref("");
const likesCount = ref(
  props.project.upvoters?.length - props.project.downvoters?.length || 0
);
const fullName = ref("");

async function getAuthorInfo() {
  try {
    const snapDoc = await getDoc(doc(db, "users", props.project.authorId));
    const userData = snapDoc.data();
    profilePic.value = userData?.profilePic || "";
    fullName.value =
      `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
      "Unknown User";

    if (auth.currentUser) {
      if (
        props.project.upvoters?.some(
          (userId) => userId === auth.currentUser.uid
        )
      ) {
        rating.value = "liked";
      } else if (
        props.project.downvoters?.some(
          (userId) => userId === auth.currentUser.uid
        )
      ) {
        rating.value = "disliked";
      }
    }
  } catch (error) {
    console.error("Error fetching author info:", error);
  } finally {
    isLoading.value = false;
  }
}

async function dislike() {
  if (!auth.currentUser) return;

  const docRef = doc(
    db,
    "users",
    props.project.authorId,
    "projects",
    props.project.id
  );

  if (rating.value === "disliked") {
    rating.value = "neutral";
    likesCount.value++;
    try {
      await updateDoc(docRef, {
        downvoters: arrayRemove(auth.currentUser.uid),
      });
    } catch (error) {
      likesCount.value--;
      rating.value = "disliked";
      console.log("dislike error", error);
    }
  } else if (rating.value === "neutral") {
    rating.value = "disliked";
    likesCount.value--;
    try {
      await updateDoc(docRef, {
        upvoters: arrayRemove(auth.currentUser.uid),
        downvoters: arrayUnion(auth.currentUser.uid),
      });
    } catch (error) {
      likesCount.value++;
      rating.value = "neutral";
      console.log("dislike error", error);
    }
  } else {
    rating.value = "disliked";
    likesCount.value -= 2;
    try {
      await updateDoc(docRef, {
        upvoters: arrayRemove(auth.currentUser.uid),
        downvoters: arrayUnion(auth.currentUser.uid),
      });
    } catch (error) {
      likesCount.value += 2;
      rating.value = "liked";
      console.log("dislike error", error);
    }
  }
}

async function like() {
  if (!auth.currentUser) return;

  const docRef = doc(
    db,
    "users",
    props.project.authorId,
    "projects",
    props.project.id
  );

  if (rating.value === "liked") {
    rating.value = "neutral";
    likesCount.value--;
    try {
      await updateDoc(docRef, {
        upvoters: arrayRemove(auth.currentUser.uid),
      });
    } catch (error) {
      likesCount.value++;
      rating.value = "liked";
      console.log("like error", error);
    }
  } else if (rating.value === "neutral") {
    rating.value = "liked";
    likesCount.value++;
    try {
      await updateDoc(docRef, {
        upvoters: arrayUnion(auth.currentUser.uid),
        downvoters: arrayRemove(auth.currentUser.uid),
      });
    } catch (error) {
      likesCount.value--;
      rating.value = "neutral";
      console.log("like error", error);
    }
  } else {
    rating.value = "liked";
    likesCount.value += 2;
    try {
      await updateDoc(docRef, {
        upvoters: arrayUnion(auth.currentUser.uid),
        downvoters: arrayRemove(auth.currentUser.uid),
      });
    } catch (error) {
      likesCount.value -= 2;
      rating.value = "disliked";
      console.log("like error", error);
    }
  }
}

getAuthorInfo();
</script>
    
  <style scoped>
.project-card {
  background-color: rgba(30, 35, 40, 0.6);
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.project-card:hover {
  background-color: rgba(40, 45, 55, 0.8);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 36px;
  height: 36px;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  color: #b3cad5;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
}

.author-name:hover {
  text-decoration: underline;
}

.post-date {
  color: #86a2ae;
  font-size: 0.8rem;
}
.upvotes {
  font-size: 0.9em;
}
.project-icon {
  color: #86a2ae;
  font-size: 1.5rem;
}

.project-title {
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
  font-size: 1.25rem;
}

.project-description {
  color: #b3cad5;
  font-size: 0.95rem;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.stack-item {
  background: linear-gradient(145deg, #4dabf7, #4dabf7);
  color: white;
  border-radius: 6px;
  padding: 5px 10px;
  font-weight: 500;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}



.github-link  button{
    background: linear-gradient(145deg, #333, #222);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    padding: 6px 14px;
    transition: all 0.3s ease;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    text-decoration: none;
}

.github-link button:hover {
    background: linear-gradient(145deg, #434343, #303030);
}



.project-actions {
  display: flex;
  margin-top: 8px;
}







i {
  font-size: 1em;
  border-radius: 50%;
  padding: 10px;
}


.overlay i:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.liked i:hover,
.disliked i:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.liked {
  background-color: green;
}

.disliked {
  background-color: red;
}
.neutral {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>