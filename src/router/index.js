import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/views/LoginPage.vue"
import SignupPage from '@/views/SignupPage.vue'
import MainPage from '@/views/MainPage.vue'



const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
    
  },
  {
    path: '/login',
    name: "Login",
    component: LoginPage,
  },
  {
    path: '/signup',
    name: "Signup",
    component: SignupPage,
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



export default router


