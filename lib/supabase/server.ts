import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client for database operations only
 * Since we use Clerk for authentication, this client doesn't handle auth sessions
 */
export async function createClient() {
    // Use service key for server-side operations to avoid auth token issues
    // If service key is not available, fall back to anon key
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey,
        {
            auth: {
                // Disable all auth features since we use Clerk
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
                flowType: 'pkce',
            },
            global: {
                // Suppress auth errors
                headers: {},
            },
        }
    )
}