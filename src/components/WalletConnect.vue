<template>
  <div class="wallet-connector">
    <div v-if="address">
      <span class="wallet-address">{{ formatAddress(address) }}</span>
      <button @click="disconnect">断开</button>
    </div>
    <div v-else>
      <button @click="() => handleConnectWallet('metamask')" :disabled="loading">
        {{ loading ? '连接中...' : '连接 MetaMask' }}
      </button>
      <button @click="() => handleConnectWallet('walletconnect')" :disabled="loading">
        {{ loading ? '连接中...' : 'WalletConnect' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { connectWallet, disconnectWallet, getCurrentAddress } from '../utils/eth'

const address = ref(null)
const loading = ref(false)

async function handleConnectWallet(type) {
  if (loading.value) return
  loading.value = true
  try {
    address.value = await connectWallet(type);
  } catch (err) {
    if (err.error.code === -32002) {
      alert('请先处理弹出的钱包连接请求（MetaMask 登录或授权）')
    } else {
      alert(err.message || '连接钱包失败')
    }
  } finally {
    loading.value = false
  }
}

function formatAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}
async function disconnect() {
  await disconnectWallet()
  address.value = null
}
// 初次加载时检查是否已连接
onMounted(async () => {
  const storedAddress = localStorage.getItem('wallet_address')
  if (storedAddress) {
    address.value = storedAddress
  }

  // 监听账户变更
  window.ethereum?.on('accountsChanged', (accounts) => {
    address.value = accounts.length ? accounts[0] : null
    localStorage.setItem('currentAddress', address.value);
  })

  // 监听网络变更（可选）
  window.ethereum?.on('chainChanged', () => {
    window.location.reload() // 强制刷新页面以防状态不同步
  })
})

// 清理监听器（可选）
onBeforeUnmount(() => {
  window.ethereum?.removeAllListeners('accountsChanged')
  window.ethereum?.removeAllListeners('chainChanged')
})
</script>

<style scoped>
.wallet-connector {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.wallet-address {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}
button {
  padding: 8px 12px;
  border: none;
  background-color: #1e88e5;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
button:hover {
  background-color: #1565c0;
}
button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}
</style>
