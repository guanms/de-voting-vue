import { createRouter, createWebHistory } from 'vue-router'
import WalletConnect from '../components/WalletConnect.vue'

const routes = [
  {
    path: '/',
    name: 'WalletConnect',
    component: WalletConnect
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
