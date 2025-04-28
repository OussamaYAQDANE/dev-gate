<template>
  <div class="login-container" v-if="signupSucess">
    <div class="card shadow-lg m-2">
      <div class="card-body pe-4 ps-4 pb-4 pt-3" style="min-height: 40vh">
        <div
          style="
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <loading-spinner v-if="isLoading" />
          <img
            v-else
            src="../assets/logo.png"
            style="
              width: 50px;
              height: 50px;
              overflow: hidden;
              justify-self: center;
            "
          />
        </div>
        <h2 class="card-title text-center mb-3">Last Touches</h2>
        <div style="width: 100%; display: flex; justify-content: center">
          <img
            :src="imageInputSrc ? imageInputSrc : defaultProfile"
            style="
              width: 30%;
              border-radius: 50%;
              aspect-ratio: 1;
              object-fit: cover;
              object-position: center top;
            "
          />
        </div>
        <label class="form-label mt-2">Upload Your Profile Photo</label>
        <input
          type="file"
          class="form-control"
          ref="imageInputRef"
          @change="
            displayUploadedProfile();
            fileError = '';
          "
          aria-errormessage="file-error"
        />
        <small id="file-error" class="text-danger">
          {{ fileError || " &nbsp;" }}</small
        >
        <div style="display: flex; flex-direction: column">
          <label class="form-label">Add a Bio</label>
          <textarea
            class="form-control"
            id="bigTextarea"
            rows="5"
            placeholder="Pour your bio out here..."
            v-model="bio"
          ></textarea>
        </div>

        <div class="row mt-4">
          <div class="col d-grid">
            <button
              class="btn btn-primary"
              style="background-color: gray; border: none"
              @click="router.push('/')"
            >
              Skip
            </button>
          </div>
          <div class="col-6 d-grid">
            <button class="btn btn-primary" @click="uploadProfile()">
              Save and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!---------------------------------------------------------------------------------------------------------------------->
  <div class="login-container" v-else>
    <div class="card shadow-lg m-2">
      <div class="card-body pe-4 ps-4 pb-4 pt-3">
        <div
          style="
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <loading-spinner v-if="isLoading" />
          <img
            v-else
            src="../assets/logo.png"
            style="
              width: 50px;
              height: 50px;
              overflow: hidden;
              justify-self: center;
            "
          />
        </div>

        <h2 class="card-title text-center mb-4">Sign Up</h2>
        <form @submit.prevent="handleSubmit">
          <label class="form-label">Full Name</label>
          <div class="">
            <div class="row g-3">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  placeholder="First name"
                  v-model="firstName"
                  @input="firstNameError = ''"
                />
              </div>

              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Last name"
                  v-model="lastName"
                  @input="lastNameError = ''"
                />
              </div>
            </div>

            <div class="row g-4">
              <div class="col">
                <small class="text-danger">{{
                  firstNameError || " &nbsp;"
                }}</small>
              </div>
              <div class="col">
                <small class="text-danger">{{ lastNameError }}</small>
              </div>
            </div>
          </div>
          <label class="form-label">Username</label>
          <div class="input-group">
            <span class="input-group-text">@</span>
            <input
              class="form-control"
              v-model="username"
              placeholder="Choose a unique username"
              aria-errormessage="username-error"
              @input="usernameError = ''"
            />
          </div>
          <div>
            <small id="username-error" class="text-danger">{{
              usernameError || " &nbsp;"
            }}</small>
          </div>

          <div class="">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              v-model="email"
              placeholder="Enter your email"
              aria-errormessage="email-error"
              @input="emailError = ''"
            />
            <div>
              <small id="email-error" class="text-danger">{{
                emailError || " &nbsp;"
              }}</small>
            </div>
          </div>

          <div class="">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              v-model="password"
              placeholder="Enter your password"
              aria-errormessage="password-error"
              @input="passwordError = ''"
            />
            <small id="password-error" class="text-danger">
              {{ passwordError || " &nbsp;" }}</small
            >
          </div>

          <div class="mb-1">
            <label for="password" class="form-label">Confirm Password</label>
            <input
              type="password"
              class="form-control"
              v-model="passwordConfirmation"
              id="passwordConfirmation"
              placeholder="Enter your password again"
              aria-errormessage="password-confirmation-error"
              @input="passwordConfirmationError = ''"
            />
            <small id="password-confirmation-error" class="text-danger">
              {{ passwordConfirmationError || " &nbsp;" }}</small
            >
          </div>

          <div class="d-grid mt-3">
            <button type="submit" class="btn btn-primary">Sign Up</button>
          </div>
        </form>
        <p class="text-center mt-3 text-primary">
          Already have an account?
          <router-link class="text-primary" :to="{ name: 'Login' }"
            >Login</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>
  
<script setup>
/* eslint-disable */
import { auth, db } from "@/firebase/firebase-config";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  setDoc,
  doc,
  serverTimestamp,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { storage } from "@/firebase/firebase-config";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { ref } from "vue";
import router from "@/router";
import defaultProfile from "../assets/default-profile.png";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
const imageInputRef = ref(null);
const imageInputSrc = ref("");

const fileError = ref("");

const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const firstNameError = ref("");
const firstName = ref("");
const lastName = ref("");

const lastNameError = ref("");

const emailError = ref("");
const passwordError = ref("");
const passwordConfirmationError = ref("");

const signupSucess = ref(false);

const isLoading = ref(false);

const bio = ref("");

const username = ref("");
const usernameError = ref("");

async function handleSubmit() {
  const emailRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

  let correct = true;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Invalid email";
    correct = false;
    console.log(email.value);
  }

  if (!firstName.value) {
    firstNameError.value = "Field can't be empty";
    correct = false;
  }

  if (!lastName.value) {
    lastNameError.value = "Field can't be empty";
    correct = false;
  }

  if (!password.value) {
    passwordError.value = "Field can't be empty";
    correct = false;
  }

  if (!passwordConfirmation.value) {
    passwordConfirmationError.value = "Field can't be empty";
    correct = false;
  }

  if (password.value != passwordConfirmation.value) {
    passwordConfirmationError.value = "Passwords don't match";
    correct = false;
  }
  const username_regex = /^[a-zA-Z0-9_]+$/;

  if (!username.value || !username_regex.test(username.value)) {
    usernameError.value = "Please choose a valid username";
    correct = false;
  }

  if (correct) {
    isLoading.value = true;
    const q = query(
      collection(db, "users"),
      where("username", "==", username.value)
    );
    const usernames = await getDocs(q);
    console.log(usernames);
    if (!usernames.empty) {
      usernameError.value = "Username already taken";
      isLoading.value = false;

      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      const user = userCredentials.user;

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        firstName: firstName.value,
        lastName: lastName.value,
        createdAt: serverTimestamp(),
        username: username.value,
      });
      signupSucess.value = true;
    } catch (error) {
      const errorCode = error.code;

      if (errorCode === "auth/email-already-in-use") {
        emailError.value = "That email is already used bro, pick another.";
      } else if (errorCode === "auth/invalid-email") {
        emailError.value = "That ain't a valid email, what is this, Ohio?";
      } else if (errorCode === "auth/weak-password") {
        passwordError.value = "🍼 That password is weak af, beef it up.";
      } else {
        console.log("💀 Unknown signup error:", errorCode);
      }
    } finally {
      isLoading.value = false;
    }
  }
}

function displayUploadedProfile() {
  const file = imageInputRef.value.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      imageInputSrc.value = e.target.result;
    };

    reader.readAsDataURL(file);
  }
}

async function uploadProfile() {
  try {
    isLoading.value = true;
    const file = imageInputRef.value.files[0];

    if (!file) {
      fileError.value = "No file selected";
      return;
    }

    const imageRef = storageRef(
      storage,
      `${auth.currentUser.uid}/images/${new Date().toISOString() + file.name}`
    );

    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on(
      "state_changed",
      () => {},
      () => {
        fileError.value = "An error occured, try again";
        isLoading.value = false;
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await setDoc(
            doc(db, "users", auth.currentUser.uid),
            { profilePic: downloadURL, bio: bio.value },
            { merge: true }
          );
          router.replace("/");
        } catch (error) {
          console.log(error);
          fileError.value = "An error occured, try again";
        } finally {
          isLoading.value = false;
        }
      }
    );
  } catch (error) {
    console.log(error);
    isLoading.value = false;
  }
}
</script>
  
















































<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #242424;
  align-items: center;
  justify-content: center;
  display: flex;
}

.card {
  background-color: #343a40; /* Dark card background */
  border: none;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  justify-self: center;
  align-self: center;
}

.card-title {
  color: #ffffff; /* White title text */
}

.form-label {
  color: #adb5bd; /* Light gray labels */
}

.form-control {
  background-color: #495057; /* Dark input background */
  border: 1px solid #6c757d; /* Slightly lighter border */
  color: #ffffff; /* White text in inputs */
  position: relative;
}
p.text-primary {
  color: #adb5bd !important;
}

.form-control::placeholder {
  color: #adb5bd; /* Light gray placeholder */
}

.form-control:focus {
  background-color: #495057;
  color: #ffffff;
}
.bio::placeholder {
  position: absolute;
  top: 10px;
}
</style>