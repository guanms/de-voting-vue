<template>
  <div class="voting-list">
    <div class="header">
      <h1>投票主题列表</h1>
      <button @click="goToCreate">创建新投票</button>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else>
      <div v-for="theme in themes" :key="theme.id" class="theme-card">
        <h2>{{ theme.name }}</h2>
        <p>{{ theme.description }}</p>
        <div class="meta">
          <span>开始: {{ formatDate(theme.startTime) }}</span>
          <span>结束: {{ formatDate(theme.endTime) }}</span>
          <span :class="themeStatus(theme)">{{ statusText(theme) }}</span>
        </div>
        <div class="actions">
          <button @click="viewDetails(theme.id)">查看详情</button>
          <button @click="viewResults(theme.id)">查看结果</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllThemes } from '../utils/votingContract'

const router = useRouter()
const themes = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    themes.value = await getAllThemes()
  } catch (error) {
    console.error('加载投票主题失败:', error)
    alert('加载投票主题失败，请检查网络连接')
  } finally {
    loading.value = false
  }
})

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleString()
}

function themeStatus(theme) {
  const now = Date.now() / 1000
  if (now < theme.startTime) return 'upcoming'
  if (now > theme.endTime) return 'ended'
  return 'active'
}

function statusText(theme) {
  const status = themeStatus(theme)
  return {
    upcoming: '未开始',
    active: '进行中',
    ended: '已结束'
  }[status]
}

function viewDetails(id) {
  router.push(`/voting/${id}`)
}

function viewResults(id) {
  router.push(`/results/${id}`)
}

function goToCreate() {
  router.push('/create')
}
</script>

<style scoped>
.voting-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.theme-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.meta {
  display: flex;
  gap: 15px;
  margin: 10px 0;
  font-size: 0.9em;
  color: #666;
}

.meta span.active {
  color: green;
  font-weight: bold;
}

.meta span.ended {
  color: #999;
}

.meta span.upcoming {
  color: orange;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 8px 16px;
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1565c0;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}
</style>