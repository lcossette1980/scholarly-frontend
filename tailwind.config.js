// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DraftEngine Brand Colors — Steel Blue / Green
        primary: {
          DEFAULT: '#316094',
          50: '#f0f5fa',
          100: '#dce8f3',
          200: '#b8d1e7',
          300: '#8bb4d6',
          400: '#4a7ab5',
          500: '#316094',
          600: '#2b5580',
          700: '#254a73',
          800: '#1d3b5c',
          900: '#152c45',
          950: '#0d1b2d',
        },
        // True neutral grays (Linear/Vercel style — no blue tint)
        secondary: {
          DEFAULT: '#404040',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#47763b',
          50: '#f2f7f0',
          100: '#e0eddb',
          200: '#c1dbb7',
          300: '#96c186',
          400: '#5a944c',
          500: '#47763b',
          600: '#3f6734',
          700: '#365a2d',
          800: '#2a4723',
          900: '#1f3519',
          950: '#12200f',
        },
        success: {
          DEFAULT: '#16a34a',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          DEFAULT: '#d97706',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          DEFAULT: '#dc2626',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        info: {
          DEFAULT: '#316094',
          50: '#f0f5fa',
          100: '#dce8f3',
          200: '#b8d1e7',
        },
      },
      fontFamily: {
        // Inter primary, system fallback (Linear/Vercel pattern)
        'system': ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        'mono': ['"JetBrains Mono"', '"SFMono-Regular"', 'Consolas', '"Liberation Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Tighter line-heights for modern feel
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.005em' }],
        'base': ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '-0.005em' }],
        'lg': ['1.0625rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em' }],
        'xl': ['1.1875rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.045em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        // Sharper, more deliberate radii
        DEFAULT: '0.375rem', // 6px — was 4px
        'md': '0.375rem',     // 6px
        'lg': '0.5rem',       // 8px — was 8px (kept)
        'xl': '0.75rem',      // 12px
        '2xl': '1rem',        // 16px
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'shimmer': 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        // Only the hero gets a gradient — keep it muted
        'gradient-hero': 'linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%)',
        'gradient-hero-dark': 'linear-gradient(180deg, #0a0a0a 0%, #171717 100%)',
      },
      boxShadow: {
        // Minimal, Linear-style — single-layer hairlines
        'xs': '0 1px 0 rgba(0, 0, 0, 0.04)',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'soft': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'large': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'menu': '0 8px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        // Focus ring
        'focus': '0 0 0 3px rgba(49, 96, 148, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
