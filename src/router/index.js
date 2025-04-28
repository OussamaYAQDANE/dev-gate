import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/views/LoginPage.vue"
import SignupPage from '@/views/SignupPage.vue'
import MainPage from '@/views/MainPage.vue'
import DiscussionsPage from '@/views/DiscussionsPage.vue'
import SearchPage from '@/views/SearchPage.vue'
import GroupePage from '@/views/GroupePage.vue'
import ProfilePage from '@/views/ProfilePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
    children: [
      {
        path: "",
        component: DiscussionsPage
      },
      {
        path: "search",
        component: SearchPage,
      },
      {
        path: 'group/:id',
        component: GroupePage,
        name: 'groupPage'
      },
      {
        path: 'profile/:id',
        component: ProfilePage,

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


