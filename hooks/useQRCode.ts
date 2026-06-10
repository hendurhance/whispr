import { useState, useEffect, useRef, useCallback } from 'react';

interface QRCodeOptions {
  padding?: number;
  backgroundColor?: string;
  drawOverlay?: (ctx: CanvasRenderingContext2D, dims: { width: number; height: number; qrSize: number }) => void;
}

export const useQRCode = (initialSize: number = 200) => {
  const [qrSize, setQrSize] = useState(initialSize);
  const qrCodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;

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

  const downloadQRCode = useCallback((filename: string, options: QRCodeOptions = {}) => {
    const { padding = 16, backgroundColor = 'white', drawOverlay } = options;

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.error('Download not available in server environment');
      return false;
    }
    
    if (!qrCodeRef.current) {
      console.error('QR code reference not found');
      return false;
    }

    try {
      const svgElement = qrCodeRef.current;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = qrSize + padding;
      canvas.height = qrSize + padding;

      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          const paddingHalf = padding / 2;
          ctx.drawImage(img, paddingHalf, paddingHalf, qrSize, qrSize);

          if (drawOverlay) drawOverlay(ctx, { width: canvas.width, height: canvas.height, qrSize });

          const dataUrl = canvas.toDataURL('image/png');

          const downloadLink = document.createElement('a');
          downloadLink.href = dataUrl;
          downloadLink.download = filename;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

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
