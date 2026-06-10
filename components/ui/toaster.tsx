'use client'

import { Toaster } from 'react-hot-toast'

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fbf7ee',
          color: '#1c1812',
          border: '2px solid #1c1812',
          borderRadius: '4px',
          boxShadow: '4px 4px 0 0 #1c1812',
          fontFamily: 'var(--font-hanken), system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          maxWidth: '90vw',
        },
        success: { iconTheme: { primary: '#1FB58F', secondary: '#fbf7ee' } },
        error: { iconTheme: { primary: '#FF4D2E', secondary: '#fbf7ee' } },
      }}
    />
  )
}
