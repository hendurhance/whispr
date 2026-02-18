import { createClient } from '@supabase/supabase-js';
import CONFIGURATIONS from '../configs';

const supabaseUrl = CONFIGURATIONS.API_URL;
const supabaseAnonKey = CONFIGURATIONS.ANON_KEY;

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

const validatedUrl = validateUrl(supabaseUrl);

if (!validatedUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!validatedUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  throw new Error(`Supabase configuration is incomplete. Missing environment variables: ${missingVars.join(', ')}`);
}

const supabase = createClient(validatedUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: { 'x-application-name': 'whispr' }
  }
});

export default supabase;
