import { createApp } from 'vue'
import WalletModal from './WalletModal.vue'

export function createWalletModal(selector) {
    const app = createApp(WalletModal)
    app.mount(selector)
    return app
}

// Auto-mount if in dev mode
if (import.meta.env.DEV) {
    createWalletModal('#app')
}