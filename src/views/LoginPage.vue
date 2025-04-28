<template>
  <div class="login-container">
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
        <h2 class="card-title text-center mb-4">Login</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-1">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
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

          <div class="mb-1">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              v-model="password"
              id="password"
              placeholder="Enter your password"
              aria-errormessage="password-error"
              @input="passwordError = ''"
            />
            <small id="password-error" class="text-danger">
              {{ passwordError || " &nbsp;" }}</small
            >
          </div>
          <p class="text-center mt-1 text-primary">
            <a class="text-primary text-center">Reset your password</a>
          </p>
          <div class="d-grid mt-3">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
        <p class="text-center mt-3 text-primary">
          Don't have an account?
          <router-link class="text-primary" :to="{ name: 'Signup' }"
            >Sign Up</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from "vue";
import { auth } from "@/firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const isLoading = ref(false);

async function handleSubmit() {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

  let correct = true;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Invalid email";
    correct = false;
  }

  if (!password.value) {
    passwordError.value = "Field can't be empty";
    correct = false;
  }

  if (correct) {
    try {
      isLoading.value = true;
      await signInWithEmailAndPassword(auth, email.value, password.value);
      router.push("/");
    } catch (error) {
      const errorCode = error.code;

      if (errorCode === "auth/invalid-credential") {
        emailError.value = "Maybe invalid email";
        passwordError.value = "Maybe invalid password";
      } else if (errorCode === "auth/user-not-found") {
        emailError.value = "This email isn't registered";
      } else if (errorCode === "auth/wrong-password") {
        passwordError.value = "Incorrect password";
      } else {
        console.log("An error happened:", errorCode);
      }
    } finally {
      isLoading.value = false;
    }
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
</style>