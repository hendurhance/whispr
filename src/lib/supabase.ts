import { createClient } from '@supabase/supabase-js';
import CONFIGURATIONS from '../configs';

// Environment variables for Supabase configuration
const supabaseUrl = CONFIGURATIONS.API_URL;
const supabaseAnonKey = CONFIGURATIONS.ANON_KEY;
const environment = CONFIGURATIONS.APP_ENV;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration is incomplete. Check your environment variables.');
}

// Create a client with session handling configuration
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => fetch(...args).then(res => {
      res.ok && environment === 'development' && console.log('Request:', args[0]);
      return res;
    }),
    headers: { 'x-application-name': 'whispr' }
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  if (environment === 'development') {
    console.log(`Auth state changed: ${event}`, session ? 'User is authenticated' : 'No user');
  }
});

export default supabase;