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
    path: '/project/:id',
    name: 'layout',
    component: EditorLayout,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router