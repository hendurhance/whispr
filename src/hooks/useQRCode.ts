import { useState, useEffect, useRef, useCallback } from 'react';

interface QRCodeOptions {
  padding?: number;
  backgroundColor?: string;
}

export const useQRCode = (initialSize: number = 200) => {
  const [qrSize, setQrSize] = useState(initialSize);
  const qrCodeRef = useRef<SVGSVGElement>(null);

  // Adjust QR code size for smaller screens
  useEffect(() => {
    const handleResize = () => {
      // Set QR code size based on screen width
      if (window.innerWidth < 375) {
        setQrSize(150);
      } else if (window.innerWidth < 640) {
        setQrSize(180);
      } else {
        setQrSize(initialSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialSize]);

  // Function to download QR code as PNG
  const downloadQRCode = useCallback((filename: string, options: QRCodeOptions = {}) => {
    const { padding = 16, backgroundColor = 'white' } = options;
    
    if (!qrCodeRef.current) {
      console.error('QR code reference not found');
      return false;
    }

    try {
      // Get the SVG element
      const svgElement = qrCodeRef.current;

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions with padding
      canvas.width = qrSize + padding;
      canvas.height = qrSize + padding;

      if (ctx) {
        // Fill with background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Convert SVG to a data URL
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Create an image from the SVG
        const img = new Image();
        img.onload = () => {
          // Draw the image onto the canvas (with padding/2 on each side)
          const paddingHalf = padding / 2;
          ctx.drawImage(img, paddingHalf, paddingHalf, qrSize, qrSize);

          // Convert canvas to a data URL
          const dataUrl = canvas.toDataURL('image/png');

          // Create a download link
          const downloadLink = document.createElement('a');
          downloadLink.href = dataUrl;
          downloadLink.download = filename;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Clean up
          URL.revokeObjectURL(svgUrl);
        };
        img.src = svgUrl;
      }
      return true;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      return false;
    }
  }, [qrSize]);

  return {
    qrSize,
    qrCodeRef,
    downloadQRCode
  };
};