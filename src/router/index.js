import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/views/LoginPage.vue"
import SignupPage from '@/views/SignupPage.vue'
import MainPage from '@/views/MainPage.vue'
import SearchPage from '../components/SearchPage.vue'
import ObjectivesPage from '@/views/ObjectivesPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import ProjectsPage from '@/views/ProjectsPage.vue'
import ProjectDetailPage from '@/views/ProjectDetailPage.vue'
import ConpetensePage from '@/views/ConpetensePage.vue'
import TimelinePage from '@/views/TimelinePage.vue'
import FeedPage from '@/views/FeedPage.vue'



const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
    children:[
      {
        path:'/search',
        name:"SearchPage",
        component:SearchPage
      },
      { name: "ProfilePage",
        path: ":uid", 
        component: ProfilePage
      },
      {
        path: ":uid/skills",
        component: ConpetensePage
      },
      {
        path: ":uid/objectives",
        component: ObjectivesPage
      },
      {
        path: ":uid/projects",
        component: ProjectsPage
      },
      {
        path: ":uid/timeline",
        component: TimelinePage
      },
      {
        path: ":uid/projects/:pid",
        component:ProjectDetailPage,
      },
      {
        path:'',
        component: FeedPage
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
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



export default router


