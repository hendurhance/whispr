import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#9a6bff',
          DEFAULT: '#7A31FF',
          dark: '#6025cc',
          100: '#f0ebff',
          900: '#36217a',
        },
        secondary: {
          light: '#ff7b99',
          DEFAULT: '#ff6b8b',
          dark: '#e54e6b',
          100: '#fff0f3',
          900: '#8c2a3c',
        },
        background: {
          darkest: '#0c0c1d',
          DEFAULT: '#101027',
          lighter: '#1a1a3a',
          card: '#252547',
          highlight: '#2a2a55',
        },
        text: {
          DEFAULT: '#e0e0e6',
          muted: '#a9a9c0',
          bright: '#ffffff',
          primary: '#d2c5ff',
        },
        accent: {
          purple: '#9564ff',
          pink: '#ff6b8b',
          blue: '#56ccff',
          green: '#56ffb2',
          yellow: '#ffcb56',
          red: '#ff5656',
          teal: '#4dd0e1',
          lime: '#c4ff56',
        },
        overlay: {
          dark: 'rgba(12, 12, 29, 0.8)',
          light: 'rgba(255, 255, 255, 0.03)',
        },
        gradient: {
          start: '#7A31FF',
          mid: '#a94dff',
          end: '#ff6b8b',
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
};

export default config;
