<template>
  <hr class="m-1" />
  <div>
    <div
      v-if="isLoading"
      class="container m-0 text-light d-flex flex-column"
      style="
        border-radius: 10px;
        cursor: pointer;
        height: 200px;
        justify-content: center;
        align-items: center;
      "
    >
      <loading-spinner />
    </div>
    <div
      v-else
      class="container m-0 text-light d-flex flex-column pb-2"
      style="border-radius: 10px; cursor: pointer"
    >
      <div class="d-flex align-items-center mt-2">
        <div class="me-2 p-1">
          <img
            :src="profilePic ? profilePic : defaultProfile"
            style="
              width: 30px;
              height: 30px;
              aspect-ratio: 1;
              object-fit: cover;
              object-position: center;
              border-radius: 50%;
              overflow: hidden;
            "
            alt=""
          />
        </div>
        <span class="author">{{ fullName }}</span>
        <span style="color: #86a2ae" class="m-1">•</span>
        <span class="date">{{ getTimeAgo(project.createdAt) }}</span>
      </div>
      <h4 class="m-2" style="font-weight: bold">{{ project.title }}</h4>
      <p class="ms-2" style="color: #b3cad5; font-size: 0.95em">
        {{ project.description }}
      </p>
      <div class="d-flex ms-2 mb-1 mt-1" style="width: 100%">
        <div class="btn-group">
          <div
            class="overlay"
            :class="rating"
            style="
              display: flex;
              align-items: center;
              border-top-left-radius: 30px;
              border-bottom-left-radius: 30px;
            "
            @click="like"
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
            style="font-weight: bold"
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
            @click="dislike()"
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
console.log(props.project);
const likesCount = ref(
  props.project.upvoters.length - props.project.downvoters.length
);
const fullName = ref("");

async function getAuthorInfo() {
  const snapDoc = await getDoc(doc(db, "users", props.project.authorId));
  profilePic.value = snapDoc.data().profilePic;
  fullName.value = snapDoc.data().firstName + " " + snapDoc.data().lastName;

  if (
    props.project.upvoters.some((userId) => userId === auth.currentUser.uid)
  ) {
    rating.value = "liked";
  } else if (
    props.project.downvoters.some((userId) => userId === auth.currentUser.uid)
  ) {
    rating.value = "disliked";
  }

  isLoading.value = false;
}

async function dislike() {
    const docRef = doc(db, "users", props.project.authorId, "projects" ,props.project.id);
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
      rating.value = "disliked";
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
    const docRef = doc(db, "users", props.project.authorId, "projects" ,props.project.id);
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
      console.log("dislike error", error);
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
      console.log("dislike error", error);
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
      console.log("dislike error", error);
    }
  }
}

getAuthorInfo()
</script>
  
  
  <style scoped>
.overlay {
  background-color: rgba(255, 255, 255, 0.1);
}

.author {
  color: #b3cad5;
  font-weight: bold;
  font-size: 0.9em;
}

.container:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.date {
  color: #86a2ae;
  font-size: 0.8em;
}
p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0 !important;
}
i {
  font-size: 1em;
  border-radius: 50%;
  padding: 10px;
}
.upvotes {
  font-size: 0.9em;
}
#delete {
  aspect-ratio: 1;
  color: red;
  font-size: 1.5em;
  padding: 4px;
  border-radius: 100%;
  margin-right: 0.4em;
}

i:hover {
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

.comment {
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.1);
}
.comment:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.comment i:hover {
  background-color: transparent;
}
</style>