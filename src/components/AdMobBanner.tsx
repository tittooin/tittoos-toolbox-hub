import { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const AdMobBanner = () => {
    const [isNative] = useState(Capacitor.isNativePlatform());
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (!isNative) return;

        const initializeAdMob = async () => {
            try {
                await AdMob.initialize({
                    requestTrackingAuthorization: true,
                    testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'], // Optional: Add test devices if needed
                    initializeForTesting: false,
                });

                // Current Real Ad Unit ID from user
                const adId = 'ca-app-pub-9616663341680102/8753249026';

                await AdMob.showBanner({
                    adId: adId,
                    adSize: BannerAdSize.ADAPTIVE_BANNER,
                    position: BannerAdPosition.BOTTOM_CENTER,
                    margin: 0,
                    isTesting: false // Set to true if you want to see test ads during dev
                });

                setAdLoaded(true);
            } catch (error) {
                console.error('AdMob Initialization Error:', error);
            }
        };

        initializeAdMob();

        // Cleanup on unmount
        return () => {
            if (isNative) {
                AdMob.removeBanner().catch(err => console.error('Failed to remove banner', err));
            }
        };
    }, [isNative]);

    if (!isNative) return null; // Don't verify/render anything on web

    // We don't render a DOM element for the ad itself as AdMob overlays it natively.
    // But we can add a spacer if needed, though usually ADAPTIVE_BANNER handles overlay.
    return (
        <div
            className="admob-spacer"
            style={{
                height: adLoaded ? '60px' : '0px',
                width: '100%',
                transition: 'height 0.3s'
            }}
        />
    );
};

export default AdMobBanner;
