import React, { useEffect } from 'react';

interface AdSenseProps {
  className?: string;
  style?: React.CSSProperties;
  adSlot: string;
  adFormat?: 'auto' | 'fluid';
  fullWidthResponsive?: boolean;
}

const AdSense: React.FC<AdSenseProps> = ({
  className,
  style,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`animate-fade-in ${className || ''}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...style
        }}
        data-ad-client="YOUR_AD_CLIENT_ID" // Replace with your AdSense client ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default AdSense;