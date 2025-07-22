<template>
  <div>
    <button @click="connectWallet">连接钱包</button>
    <div v-if="walletAddress">当前钱包地址：{{ walletAddress }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { connectWallet } from "../utils/eth";

const walletAddress = ref("");

const connectWalletHandler = async() => {
  try{
    walletAddress.value = await connectWallet();
  }catch (e) {
    alert(e.message);
  }
}

const connectWallet_handler = () => {
  connectWalletHandler();
};

</script>