<template>
  <div class="voting-detail">
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="theme">
      <div class="header">
        <h1>{{ theme.name }}</h1>
        <p>{{ theme.description }}</p>
        
        <div class="meta">
          <div>开始时间: {{ formatDate(theme.startTime) }}</div>
          <div>结束时间: {{ formatDate(theme.endTime) }}</div>
          <div :class="statusClass">状态: {{ statusText }}</div>
        </div>
      </div>
      
      <div class="candidates">
        <h2>候选人</h2>
        
        <div v-if="canVote" class="vote-instruction">
          请选择一位候选人投票（每人只能投一次）
        </div>
        
        <div class="candidate-list">
          <div 
            v-for="candidate in theme.candidates" 
            :key="candidate.id"
            class="candidate-item"
            :class="{ selected: selectedCandidate === candidate.id }"
            @click="selectCandidate(candidate.id)"
          >
            <div class="candidate-name">{{ candidate.name }}</div>
            <div v-if="hasVoted" class="vote-count">票数: {{ candidate.voteCount }}</div>
          </div>
        </div>
        
        <div v-if="canVote" class="actions">
          <button 
            @click="submitVote" 
            :disabled="!selectedCandidate || voting"
            class="vote-btn"
          >
            {{ voting ? '投票中...' : '确认投票' }}
          </button>
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
import { getThemeDetails, vote } from '../utils/votingContract'

const route = useRoute()
const theme = ref(null)
const loading = ref(true)
const selectedCandidate = ref(null)
const voting = ref(false)
const hasVoted = ref(false)

onMounted(async () => {
  try {
    theme.value = await getThemeDetails(route.params.id)
    
    // 检查是否已投票（实际实现需要检查合约状态）
    // 这里简化处理，实际应从合约中获取hasVoted状态
    const votedThemes = JSON.parse(localStorage.getItem('votedThemes') || '{}')
    hasVoted.value = votedThemes[route.params.id] || false
  } catch (error) {
    console.error('加载投票详情失败:', error)
    alert('加载投票详情失败')
  } finally {
    loading.value = false
  }
})

const currentTime = computed(() => Math.floor(Date.now() / 1000))
const isActive = computed(() => {
  return theme.value && 
    currentTime.value >= theme.value.startTime && 
    currentTime.value <= theme.value.endTime
})

const canVote = computed(() => {
  return isActive.value && !hasVoted.value
})

const statusText = computed(() => {
  if (!theme.value) return ''
  
  if (currentTime.value < theme.value.startTime) return '未开始'
  if (currentTime.value > theme.value.endTime) return '已结束'
  return '进行中'
})

const statusClass = computed(() => {
  if (!theme.value) return ''
  
  if (currentTime.value < theme.value.startTime) return 'upcoming'
  if (currentTime.value > theme.value.endTime) return 'ended'
  return 'active'
})

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleString()
}

function selectCandidate(id) {
  if (canVote.value) {
    selectedCandidate.value = id
  }
}

async function submitVote() {
  if (!selectedCandidate.value || voting.value) return
  
  voting.value = true
  try {
    await vote(route.params.id, selectedCandidate.value)
    
    // 记录已投票
    const votedThemes = JSON.parse(localStorage.getItem('votedThemes') || {})
    votedThemes[route.params.id] = true
    localStorage.setItem('votedThemes', JSON.stringify(votedThemes))
    
    hasVoted.value = true
    alert('投票成功！')
    
    // 刷新候选人票数
    theme.value = await getThemeDetails(route.params.id)
  } catch (error) {
    console.error('投票失败:', error)
    alert(`投票失败: ${error.message || '未知错误'}`)
  } finally {
    voting.value = false
  }
}
</script>

<style scoped>
.voting-detail {
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

.meta .active {
  color: green;
  font-weight: bold;
}

.meta .ended {
  color: #999;
}

.meta .upcoming {
  color: orange;
}

.candidates {
  margin-top: 30px;
}

.vote-instruction {
  margin: 10px 0 20px;
  padding: 10px;
  background-color: #e3f2fd;
  border-radius: 4px;
}

.candidate-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.candidate-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.candidate-item:hover {
  border-color: #1e88e5;
  background-color: #f5f9ff;
}

.candidate-item.selected {
  border-color: #1e88e5;
  background-color: #e3f2fd;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.3);
}

.candidate-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.vote-count {
  color: #666;
  font-size: 0.9em;
}

.actions {
  margin-top: 30px;
  text-align: center;
}

.vote-btn {
  padding: 12px 30px;
  font-size: 1.1em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.vote-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.loading, .not-found {
  text-align: center;
  padding: 50px;
}
</style>