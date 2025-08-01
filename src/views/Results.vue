<template>
  <div class="results">
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="theme">
      <div class="header">
        <h1>{{ theme.name }} - 投票结果</h1>
        <p>{{ theme.description }}</p>
        
        <div class="meta">
          <div>开始时间: {{ formatDate(theme.startTime) }}</div>
          <div>结束时间: {{ formatDate(theme.endTime) }}</div>
          <div>状态: 已结束</div>
        </div>
      </div>
      
      <div class="results-container">
        <h2>投票结果</h2>
        
        <div class="result-list">
          <div 
            v-for="candidate in sortedCandidates" 
            :key="candidate.id"
            class="result-item"
          >
            <div class="candidate-info">
              <div class="candidate-name">{{ candidate.name }}</div>
              <div class="vote-count">{{ candidate.voteCount }} 票</div>
            </div>
            <div class="vote-bar-container">
              <div 
                class="vote-bar" 
                :style="{ width: votePercentage(candidate) + '%' }"
              ></div>
            </div>
            <div class="percentage">{{ votePercentage(candidate) }}%</div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="not-found">
      <h2>投票主题不存在</h2>
      <button @click="$router.push('/')">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getThemeDetails } from '../utils/votingContract'

const route = useRoute()
const theme = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    theme.value = await getThemeDetails(route.params.id)
  } catch (error) {
    console.error('加载投票结果失败:', error)
    alert('加载投票结果失败')
  } finally {
    loading.value = false
  }
})

const sortedCandidates = computed(() => {
  if (!theme.value) return []
  return [...theme.value.candidates].sort((a, b) => b.voteCount - a.voteCount)
})

const totalVotes = computed(() => {
  return sortedCandidates.value.reduce((sum, candidate) => {
    return sum + parseInt(candidate.voteCount)
  }, 0)
})

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleString()
}

function votePercentage(candidate) {
  if (totalVotes.value === 0) return 0
  return ((candidate.voteCount / totalVotes.value) * 100).toFixed(1)
}
</script>

<style scoped>
.results {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.meta {
  margin-top: 15px;
  color: #666;
}

.meta div {
  margin-bottom: 5px;
}

.results-container {
  margin-top: 30px;
}

.result-list {
  margin-top: 20px;
}

.result-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
}

.candidate-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.candidate-name {
  font-weight: bold;
}

.vote-count {
  color: #1e88e5;
  font-weight: bold;
}

.vote-bar-container {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 5px 0;
}

.vote-bar {
  height: 100%;
  background-color: #1e88e5;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.percentage {
  text-align: right;
  font-size: 0.9em;
  color: #666;
}

.loading, .not-found {
  text-align: center;
  padding: 50px;
}
</style>