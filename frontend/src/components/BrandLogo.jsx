function BrandLogo({ className = 'brand-logo' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="AuthVault logo">
      <defs>
        <linearGradient id="authvault-fill" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent-main)" />
          <stop offset="1" stopColor="var(--sage-main)" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#authvault-fill)" opacity="0.18" />
      <path
        d="M32 14L18 20V32C18 41.5 24 50 32 53C40 50 46 41.5 46 32V20L32 14Z"
        fill="none"
        stroke="var(--ink-main)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="30" r="4.5" fill="var(--accent-main)" />
      <path
        d="M25 41C25 37.5 28 35.5 32 35.5C36 35.5 39 37.5 39 41"
        stroke="var(--accent-main)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default BrandLogo