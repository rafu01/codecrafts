import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../components/HomePage'
import EditorLayout from "@/components/EditorLayout.vue";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/project',
    name: 'layout',
    component: EditorLayout
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router