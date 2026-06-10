import { Bricolage_Grotesque, Hanken_Grotesk, Spline_Sans_Mono, Fraunces } from 'next/font/google'

export const fontDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

export const fontBody = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})

export const fontVoice = Spline_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-spline',
  display: 'swap',
})

export const fontSerif = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})
