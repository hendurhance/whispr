/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#9a6bff', // Slightly lighter purple
          DEFAULT: '#7A31FF', // Directly from your logo's W - more vibrant
          dark: '#6025cc', // Darker shade for hover states
          100: '#f0ebff', // Very light purple for subtle backgrounds
          900: '#36217a', // Very dark purple for contrast elements
        },
        secondary: {
          light: '#ff7b99', // Slightly lighter pink
          DEFAULT: '#ff6b8b', // Your original pink
          dark: '#e54e6b', // Slightly more saturated dark pink
          100: '#fff0f3', // Very light pink for subtle backgrounds
          900: '#8c2a3c', // Very dark pink for contrast elements
        },
        background: {
          darkest: '#0c0c1d', // Even darker than your current background
          DEFAULT: '#101027', // Your current dark background
          lighter: '#1a1a3a', // Your current lighter background
          card: '#252547', // Slightly lighter for cards and elements
          highlight: '#2a2a55', // For highlighted elements
        },
        text: {
          DEFAULT: '#e0e0e6', // Your current text color
          muted: '#a9a9c0', // Your current muted text
          bright: '#ffffff', // Pure white for emphasis
          primary: '#d2c5ff', // Purple-tinted text
        },
        accent: {
          purple: '#9564ff', // Accent color for highlights
          pink: '#ff6b8b', // Your pink can be used as accent too
          blue: '#56ccff', // Adding a blue accent for variety
          green: '#56ffb2', // Success color
          yellow: '#ffcb56', // Warning color
        },
        overlay: {
          dark: 'rgba(12, 12, 29, 0.8)', // For modal backgrounds
          light: 'rgba(255, 255, 255, 0.03)', // For card highlights
        },
        gradient: {
          start: '#7A31FF', // Start with your logo purple
          mid: '#a94dff', // Middle transition color
          end: '#ff6b8b', // End with your pink
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(122, 49, 255, 0.3)',
        'glow': '0 0 20px rgba(122, 49, 255, 0.4)',
        'glow-lg': '0 0 30px rgba(122, 49, 255, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 107, 139, 0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7A31FF 0%, #ff6b8b 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #6025cc 0%, #e54e6b 100%)',
        'gradient-dark': 'linear-gradient(135deg, #101027 0%, #1a1a3a 100%)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'messageFloat': 'messageFloat 15s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -15px) rotate(5deg)' },
          '50%': { transform: 'translate(-5px, 10px) rotate(-5deg)' },
          '75%': { transform: 'translate(-15px, -10px) rotate(3deg)' }
        },
        messageFloat: {
          '0%': { transform: 'translate(0, 0)', opacity: '0' },
          '5%': { transform: 'translate(0, -10px)', opacity: '1' },
          '45%': { transform: 'translate(0, -10px)', opacity: '1' },
          '50%': { transform: 'translate(10px, -10px)', opacity: '0.8' },
          '90%': { transform: 'translate(10px, -10px)', opacity: '0.8' },
          '100%': { transform: 'translate(0, 0)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}