import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Early exit with a more useful default for development
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration is incomplete. Check your environment variables.');
}

// Create a client with session handling configuration
console.log('Creating Supabase client with URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => fetch(...args).then(res => {
      res.ok && console.log(`Supabase fetch: ${args[0] as string}`);
      return res;
    }),
    headers: { 'x-application-name': 'whispr' }
  }
});

// Print initial authentication state (for debugging)
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Auth state changed: ${event}`, session ? 'User is authenticated' : 'No user');
});

export default supabase;