export interface Profile {
  id: string
  user_id: string
  username: string
  display_name: string
  avatar_url: string
  bio: string
  email_notifications: boolean
  allow_anonymous: boolean
  show_question_types: boolean
  display_social_links: boolean
  selected_theme: string
  selected_background: string
  is_indexable: boolean
  total_views: number
  total_whisprs: number
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  user_id: string
  platform: string
  url: string
  display_order: number
  created_at: string
  updated_at: string
}
