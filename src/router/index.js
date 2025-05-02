import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/views/LoginPage.vue"
import SignupPage from '@/views/SignupPage.vue'
import MainPage from '@/views/MainPage.vue'
import DashBoard from '@/views/DashBoard.vue'
import SearchPage from '../components/SearchPage.vue'



const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
    children:[
      {
        path: "", 
        component: DashBoard
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
  },
  {
    path:'/SearchPage',
    name:"SearchPage",
    component:SearchPage
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



export default router


