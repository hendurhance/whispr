import type { Metadata } from 'next';
import PublicProfilePage from '@/components/pages/PublicProfilePage';
import { createClient } from '@/utils/supabase/server';
import { FUNCTIONS } from '@/configs';

type Props = {
  params: Promise<{ username: string }>;
};

async function fetchProfileData(username: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        username,
        display_name,
        avatar_url,
        bio,
        user_id,
        total_whisprs,
        display_social_links,
        allow_anonymous,
        show_question_types,
        selected_theme,
        selected_background
      `)
      .eq('username', username)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    let socialLinks = [];
    if (data.display_social_links) {
      const { data: links, error: linksError } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', data.user_id)
        .order('display_order', { ascending: true });
      
      if (!linksError && links) {
        socialLinks = links;
      }
    }
    
    return {
      username: data.username,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      totalWhisprs: data.total_whisprs || 0,
      displaySocialLinks: data.display_social_links,
      socialLinks,
      allowAnonymous: data.allow_anonymous,
      showQuestionTypes: data.show_question_types,
      selectedTheme: data.selected_theme,
      selectedBackground: data.selected_background,
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
}

async function updateProfileViews(username: string) {
  try {
    await fetch(FUNCTIONS.UPDATE_PROFILE_VIEWS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
  } catch (error) {
    // Silent fail - views are non-critical
    console.error('Error updating profile views:', error);
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchProfileData(username);

  if (!profile) {
    return {
      title: 'Profile Not Found',
      description: 'The requested profile does not exist on Whispr',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const displayName = profile.displayName || username;
  const description = profile.bio 
    ? `${profile.bio} | Send ${displayName} anonymous messages, questions, and honest feedback on Whispr.`
    : `Send ${displayName} anonymous messages and honest feedback. Ask questions, share confessions, and get real with ${displayName} on Whispr.`;
  
  const title = `${displayName} (@${username}) - Send Anonymous Messages | Whispr`;

  return {
    title,
    description,
    keywords: [
      `${username}`,
      `${displayName}`,
      'anonymous messages',
      'send message',
      'anonymous feedback',
      'ask me anything',
      'confessions',
      'honest feedback',
    ],
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `/${username}`,
      images: profile.avatarUrl ? [
        {
          url: profile.avatarUrl,
          width: 400,
          height: 400,
          alt: `${displayName}'s profile picture`,
          type: 'image/jpeg',
        }
      ] : [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `Send ${displayName} anonymous messages on Whispr`,
        }
      ],
      siteName: 'Whispr',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : ['/og-image.png'],
    },
    alternates: {
      canonical: `/${username}`,
    },
    other: {
      'profile:username': username,
      'profile:first_name': displayName,
    },
  };
}

export default async function PublicProfile({ params }: Props) {
  const { username } = await params;

  const profile = await fetchProfileData(username);

  if (profile) {
    updateProfileViews(username).catch(console.error);
  }
  
  return <PublicProfilePage initialProfile={profile} username={username} />;
}
