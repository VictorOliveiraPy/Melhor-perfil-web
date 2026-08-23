import React from 'react'

export function InstagramIcon(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 20, ...rest } = props
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="url(#ig)" />
      <circle cx="12" cy="12" r="3.2" fill="#fff" />
      <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
      <defs>
        <linearGradient id="ig" x1="0" x2="1">
          <stop offset="0%" stopColor="#f58529" />
          <stop offset="50%" stopColor="#dd2a7b" />
          <stop offset="100%" stopColor="#8134af" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function LinkedInIcon(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 20, ...rest } = props
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#0A66C2" />
      <path d="M8.5 10.5v6H6V9h2.5v1.5zM7.25 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zM18 16.5v-3.25c0-1.95-1.05-2.85-2.45-2.85-1.12 0-1.62.62-1.9 1.06v-0.91H11V16.5h2.35v-3.1c0-.8.15-1.6 1.16-1.6.98 0 1.02.9 1.02 1.63V16.5H18z" fill="#fff" />
    </svg>
  )
}

export default undefined
