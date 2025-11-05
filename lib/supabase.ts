import { createClient } from '@supabase/supabase-js';
import CONFIGURATIONS from '../configs';

// Environment variables for Supabase configuration
const supabaseUrl = CONFIGURATIONS.API_URL;
const supabaseAnonKey = CONFIGURATIONS.ANON_KEY;
const environment = CONFIGURATIONS.APP_ENV;

// Validate URL format before using it
const validateUrl = (url: string | undefined): string => {
  if (!url) {
    throw new Error('Supabase URL is missing. Please check your NEXT_PUBLIC_SUPABASE_URL environment variable.');
  }
  
  try {
    new URL(url);
    return url;
  } catch (error) {
    throw new Error(`Invalid Supabase URL format: "${url}". Please check your NEXT_PUBLIC_SUPABASE_URL environment variable. It should be in the format: https://your-project.supabase.co`);
  }
};

// Validate configuration
const validatedUrl = validateUrl(supabaseUrl);

if (environment === 'development' && typeof window !== 'undefined') {
  console.table({
    url: validatedUrl,
    anonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Missing',
    environment: environment
  });
}

if (!validatedUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!validatedUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  throw new Error(`Supabase configuration is incomplete. Missing environment variables: ${missingVars.join(', ')}`);
}

// Create a client with session handling configuration
const supabase = createClient(validatedUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    fetch: (...args) => fetch(...args).then(res => {
      if (res.ok && environment === 'development' && typeof window !== 'undefined') {
        console.log('Request:', args[0]);
      }
      return res;
    }),
    headers: { 'x-application-name': 'whispr' }
  }
});

if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (environment === 'development') {
      console.log(`[Supabase] Auth state changed: ${event}`, {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
      });
    }
  });
  
  // Log storage keys for debugging
  if (environment === 'development') {
    console.log('[Supabase] Storage keys:', 
      Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-'))
    );
  }
}

export default supabase;
