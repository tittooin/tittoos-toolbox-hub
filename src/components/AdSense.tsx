import React, { useEffect } from 'react';

type AdType = 'display' | 'in_article' | 'in_feed' | 'multiplex';

interface AdSenseProps {
  className?: string;
  style?: React.CSSProperties;
  adSlot: string;
  // For display ads, this controls auto vs fluid; ignored for specific types
  adFormat?: 'auto' | 'fluid';
  fullWidthResponsive?: boolean;
  // Specific unit type support
  adType?: AdType;
  // In-feed units require a layout key provided by AdSense
  layoutKey?: string;
}

const AdSense: React.FC<AdSenseProps> = ({
  className,
  style,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  adType = 'display',
  layoutKey,
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Compute ad attributes based on type
  const getAttributes = () => {
    switch (adType) {
      case 'in_article':
        return {
          'data-ad-format': 'fluid',
          'data-ad-layout': 'in-article',
        } as Record<string, string | boolean>;
      case 'in_feed':
        // In-feed requires a layout key. Fallback to display if missing to avoid invalid config.
        if (!layoutKey) {
          return {
            'data-ad-format': adFormat,
            'data-full-width-responsive': fullWidthResponsive,
          } as Record<string, string | boolean>;
        }
        return {
          'data-ad-format': 'fluid',
          'data-ad-layout': 'in-feed',
          'data-ad-layout-key': layoutKey,
        } as Record<string, string | boolean>;
      case 'multiplex':
        return {
          'data-ad-format': 'autorelaxed',
        } as Record<string, string | boolean>;
      case 'display':
      default:
        return {
          'data-ad-format': adFormat,
          'data-full-width-responsive': fullWidthResponsive,
        } as Record<string, string | boolean>;
    }
  };

  const attributes = getAttributes();

  return (
    <div className={`animate-fade-in ${className || ''}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'center',
          ...style,
        }}
        data-ad-client="ca-pub-7510164795562884"
        data-ad-slot={adSlot}
        {...attributes}
      />
    </div>
  );
};

export default AdSense;