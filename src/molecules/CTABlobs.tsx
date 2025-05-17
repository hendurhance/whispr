import React from 'react';
import Blob from '../atoms/Blob';

interface CTABlobsProps {
  className?: string;
}

/**
 * Reusable blob decoration component for CTA sections
 */
const CTABlobs: React.FC<CTABlobsProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Top left shape */}
      <Blob
        position="-top-10 -left-10"
        size="w-28 h-28"
        color="bg-gradient-primary"
        opacity={0.9}
        rotate={12}
        className="rounded-xl"
        animation="float 13s ease-in-out infinite"
      />

      {/* Top right shape */}
      <Blob
        position="-top-6 right-[15%]"
        size="w-16 h-16"
        color="bg-accent-green"
        opacity={0.8}
        className="rounded-full"
        animation="float 17s ease-in-out infinite alternate"
        animationDelay="1s"
      />

      {/* Bottom left shape - triangle */}
      <Blob
        position="-bottom-8 left-[20%]"
        size="w-24 h-24"
        color="bg-accent-yellow"
        opacity={0.8}
        customPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        animation="float 15s ease-in-out infinite"
        animationDelay="2s"
      />

      {/* Bottom right shape - blob */}
      <Blob
        position="-bottom-12 -right-8"
        size="w-32 h-32"
        color="linear-gradient(135deg, #ff6b8b 0%, #7A31FF 100%)"
        opacity={0.9}
        customPath="30% 70% 70% 30% / 30% 30% 70% 70%"
        animation="float 20s ease-in-out infinite alternate"
        animationDelay="3s"
      />

      {/* Extra floating elements for more depth */}
      <Blob
        position="top-[40%] left-[10%]"
        size="w-8 h-8"
        color="bg-primary-light"
        opacity={0.3}
        className="rounded-full"
        animation="float 25s ease-in-out infinite alternate"
        zIndex={0}
      />

      <Blob
        position="top-[60%] right-[25%]"
        size="w-12 h-12"
        color="bg-secondary-light"
        opacity={0.4}
        className="rounded-md"
        rotate={45}
        animation="float 22s ease-in-out infinite"
        animationDelay="4s"
        zIndex={0}
      />
    </div>
  );
};

export default CTABlobs;