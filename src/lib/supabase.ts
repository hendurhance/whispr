import { createClient } from '@supabase/supabase-js';
import CONFIGURATIONS from '../configs';

// Environment variables for Supabase configuration
const supabaseUrl = CONFIGURATIONS.API_URL;
const supabaseAnonKey = CONFIGURATIONS.ANON_KEY;
const environment = CONFIGURATIONS.APP_ENV;

// Validate URL format before using it
const validateUrl = (url: string | undefined): string => {
  if (!url) {
    throw new Error('Supabase URL is missing. Please check your VITE_SUPABASE_URL environment variable.');
  }
  
  try {
    new URL(url);
    return url;
  } catch (error) {
    throw new Error(`Invalid Supabase URL format: "${url}". Please check your VITE_SUPABASE_URL environment variable. It should be in the format: https://your-project.supabase.co`);
  }
};

// Validate configuration
const validatedUrl = validateUrl(supabaseUrl);

if (environment === 'development') {
  console.table({
    url: validatedUrl,
    anonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Missing',
    environment: environment
  });
}

if (!validatedUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!validatedUrl) missingVars.push('VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  throw new Error(`Supabase configuration is incomplete. Missing environment variables: ${missingVars.join(', ')}`);
}

// Create a client with session handling configuration
const supabase = createClient(validatedUrl, supabaseAnonKey, {
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