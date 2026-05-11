<template>
  <div class="min-h-screen bg-[#0a0f1c]">
    <div class="container mx-auto py-12">
      <h1 class="text-4xl font-bold text-white text-center mb-8">
        Web3 Wallet Connect Demo
      </h1>
      
      <div class="flex justify-center">
        <button 
          @click="openModal"
          class="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl text-lg transition">
          Connect Wallet
        </button>
      </div>
    </div>

    <!-- Wallet Modal -->
    <WalletModal ref="walletModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WalletModal from './components/WalletModal.vue'

const walletModal = ref(null)

const openModal = () => {
  walletModal.value?.openModal()
}
</script>