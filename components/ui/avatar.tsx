import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: number
  className?: string
}

export function Avatar({ src, alt = '', size = 64, className }: AvatarProps) {
  if (!src) {
    return <span className={cn('inline-block bg-secondary', className)} aria-hidden="true" />
  }
  return <Image src={src} alt={alt} width={size} height={size} unoptimized className={className} />
}
