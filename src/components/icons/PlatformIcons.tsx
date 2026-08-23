import React from 'react'

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <defs />
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeOpacity="0.16" fill="none" />
      <path d="M12 7.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeOpacity="0.16" fill="none" />
      <path d="M7.5 10.5v6m0-6V8.5A1.5 1.5 0 019 7h0a1.5 1.5 0 011.5 1.5V16.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="13.5" y="10.5" width="2" height="6" rx="0.3" fill="currentColor" />
    </svg>
  )
}

export default null
