<template>
  <div
    class="competence-card mb-3"
  >
    <div v-if="isLoading" class="loading-container">
      <loading-spinner />
    </div>
    <div v-else class="competence-content">
      <!-- Header with author info -->
      <div class="competence-header">
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
                  $router.push(competence.authorId);
                }
              "
              >{{ fullName }}</span
            >
            <span class="post-date">{{ getTimeAgo(competence.createdAt) }}</span>
          </div>
        </div>
        <div class="competence-level">
          <span :class="'level-badge ' + competence.level.toLowerCase()">
            {{ competence.level.substring(0,1).toUpperCase() + competence.level.substring(1) }}
          </span>
        </div>
      </div>

      <!-- Competence title -->
      <h4 class="competence-title">Has acquired a new competence: {{ competence.title }}</h4>
      <p class="project-description">{{ competence.description }}</p>

      <!-- Interaction controls -->
      <div class="github-link d-flex flex-row justify-content-end align-items-center mt-3">
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
  competence: Object,
});

const profilePic = ref("");
const likesCount = ref(
  props.competence.upvoters?.length - props.competence.downvoters?.length || 0
);
const fullName = ref("");

async function getAuthorInfo() {
  try {
    const snapDoc = await getDoc(doc(db, "users", props.competence.authorId));
    const userData = snapDoc.data();
    profilePic.value = userData?.profilePic || "";
    fullName.value =
      `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
      "Unknown User";

    if (auth.currentUser) {
      if (
        props.competence.upvoters?.some(
          (userId) => userId === auth.currentUser.uid
        )
      ) {
        rating.value = "liked";
      } else if (
        props.competence.downvoters?.some(
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
    props.competence.authorId,
    "competences",
    props.competence.id
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
    props.competence.authorId,
    "competences",
    props.competence.id
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
.competence-card {
  background-color: rgba(30, 35, 40, 0.6);
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.competence-card:hover {
  background-color: rgba(40, 45, 55, 0.8);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
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


.competence-header {
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

.competence-level {
  display: flex;
  align-items: center;
}

.level-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.level-badge.beginner {
  background-color: #4dabf7;
}

.level-badge.intermediate {
  background-color: #38d9a9;
}

.level-badge.advanced {
  background-color: #fcc419;
}

.level-badge.expert {
  background-color: #ff6b6b;
}

.competence-title {
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
  font-size: 1.25rem;
}

.upvotes {
  font-size: 0.9em;
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