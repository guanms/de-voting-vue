<template>
  <div class="create-voting">
    <h1>创建新投票</h1>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>投票主题</label>
        <input v-model="form.name" required>
      </div>
      
      <div class="form-group">
        <label>主题描述</label>
        <textarea v-model="form.description" required></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>开始时间</label>
          <input type="datetime-local" v-model="form.startTime" required>
        </div>
        
        <div class="form-group">
          <label>结束时间</label>
          <input type="datetime-local" v-model="form.endTime" required>
        </div>
      </div>
      
      <div class="candidates">
        <h3>候选人</h3>
        <div v-for="(candidate, index) in form.candidates" :key="index" class="candidate-item">
          <input v-model="candidate.name" placeholder="候选人名称" required>
          <button type="button" @click="removeCandidate(index)" class="remove-btn">删除</button>
        </div>
        <button type="button" @click="addCandidate" class="add-btn">添加候选人</button>
      </div>
      
      <button type="submit" :disabled="submitting" class="submit-btn">
        {{ submitting ? '创建中...' : '创建投票' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createVoting } from '../utils/votingContract'

const router = useRouter()
const form = ref({
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  candidates: [{ name: '' }]
})
const submitting = ref(false)

function addCandidate() {
  form.value.candidates.push({ name: '' })
}

function removeCandidate(index) {
  if (form.value.candidates.length > 1) {
    form.value.candidates.splice(index, 1)
  }
}

async function submitForm() {
  submitting.value = true
  
  try {
    const candidateNames = form.value.candidates.map(c => c.name)
    await createVoting({
      name: form.value.name,
      description: form.value.description,
      startTime: new Date(form.value.startTime).getTime(),
      endTime: new Date(form.value.endTime).getTime(),
      candidates: candidateNames
    })
    
    alert('投票创建成功！')
    router.push('/')
  } catch (error) {
    console.error('创建投票失败:', error)
    alert(`创建失败: ${error.message || '未知错误'}`)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.create-voting {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

textarea {
  min-height: 100px;
}

.candidates {
  margin: 30px 0;
}

.candidate-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.candidate-item input {
  flex: 1;
}

.remove-btn {
  background-color: #f44336;
}

.add-btn {
  background-color: #4CAF50;
}

.submit-btn {
  padding: 12px 24px;
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}
</style>