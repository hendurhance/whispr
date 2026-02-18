import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';
  
  const code = searchParams.get('code');

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('token');
  redirectTo.searchParams.delete('code');
  redirectTo.searchParams.delete('type');

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          redirectTo.pathname = '/dashboard';
        } else {
          redirectTo.pathname = '/setup-profile';
        }
      }

      return NextResponse.redirect(redirectTo);
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          redirectTo.pathname = '/dashboard';
        } else {
          redirectTo.pathname = '/setup-profile';
        }
      }

      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = '/auth';
  redirectTo.searchParams.set('error', 'auth_callback_error');
  redirectTo.searchParams.set('error_description', 'Could not verify authentication token');
  return NextResponse.redirect(redirectTo);
}
