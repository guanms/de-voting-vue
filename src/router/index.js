import { createRouter, createWebHistory } from 'vue-router'
import WalletConnect from '../components/WalletConnect.vue'
import VotingList from '../views/VotingList.vue'
import VotingDetail from '../views/VotingDetail.vue'
import CreateVoting from '../views/CreateVoting.vue'
import Results from '../views/Results.vue'

const routes = [
  {path: '/', name: 'WalletConnect', component: WalletConnect},
  {path: '/votingList', component: VotingList },
  { path: '/voting/:id', component: VotingDetail, props: true },
  { path: '/create', component: CreateVoting },
  { path: '/results/:id', component: Results, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
