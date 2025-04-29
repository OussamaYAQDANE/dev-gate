import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/views/LoginPage.vue"
import SignupPage from '@/views/SignupPage.vue'
import MainPage from '@/views/MainPage.vue'

import ObjectivesPage from '@/views/ObjectivesPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import ProjectsPage from '@/views/ProjectsPage.vue'



const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
    children:[
      { name: "ProfilePage",
        path: ":uid", 
        component: ProfilePage
      },
      {
        path: "objectives",
        component: ObjectivesPage
      },
      {
        path: ":uid/projects",
        component: ProjectsPage
      }
    ]
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


