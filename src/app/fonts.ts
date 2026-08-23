import { Gabarito, IBM_Plex_Mono, Schibsted_Grotesk } from 'next/font/google'

export const fontDisplay = Gabarito({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-display',
  display: 'swap',
})

export const fontSans = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-sans',
  display: 'swap',
})

export const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})
