import { createClient } from '@/utils/supabase/client'
import { VAPID_PUBLIC_KEY } from '@/configs'

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const buffer = new ArrayBuffer(raw.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i)
  return view
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export async function getPushSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg) return false
  const sub = await reg.pushManager.getSubscription()
  return Boolean(sub)
}

export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  if (!isPushSupported()) return { ok: false, error: 'Your browser doesn’t support notifications.' }
  if (!VAPID_PUBLIC_KEY) return { ok: false, error: 'Push notifications aren’t configured yet.' }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    return { ok: false, error: 'Notifications are blocked — enable them in your browser settings.' }
  }

  const reg = (await navigator.serviceWorker.getRegistration()) || (await navigator.serviceWorker.register('/sw.js'))
  await navigator.serviceWorker.ready

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  })

  const json = sub.toJSON()
  if (!json.keys?.p256dh || !json.keys?.auth) return { ok: false, error: 'Could not create a subscription.' }

  const supabase = createClient()
  const { error } = await supabase.rpc('save_push_subscription', {
    p_endpoint: sub.endpoint,
    p_p256dh: json.keys.p256dh,
    p_auth: json.keys.auth,
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg) return
  const sub = await reg.pushManager.getSubscription()
  if (!sub) return
  const supabase = createClient()
  await supabase.rpc('delete_push_subscription', { p_endpoint: sub.endpoint })
  await sub.unsubscribe()
}
