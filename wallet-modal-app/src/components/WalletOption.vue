<template>
  <button 
    @click="selectWallet"
    class="w-full flex items-center gap-4 p-5 rounded-2xl hover:bg-[#1a3c2e] 
           transition-all border border-transparent hover:border-emerald-500/30 group">
    
    <div class="w-11 h-11 flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
      {{ wallet.icon }}
    </div>
    
    <span class="text-lg font-medium text-white">{{ wallet.name }}</span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  wallet: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const selectWallet = () => {
  emit('select', props.wallet.name)
}
</script>