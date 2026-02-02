'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#252547',
          color: '#e0e0e6',
          border: '1px solid #7A31FF',
        },
        success: {
          iconTheme: {
            primary: '#56ffb2',
            secondary: '#252547',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff5656',
            secondary: '#252547',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
