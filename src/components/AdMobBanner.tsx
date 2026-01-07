import { useEffect } from 'react';
import { AdMobService } from '@/services/AdMobService';

const AdMobBanner = () => {
    useEffect(() => {
        AdMobService.initialize();

        // Delay showing banner slightly to ensure init
        const timer = setTimeout(() => {
            AdMobService.showBanner();
        }, 1000);

        return () => {
            clearTimeout(timer);
            AdMobService.hideBanner();
        };
    }, []);

    return null; // AdMob banner is an overlay, no DOM element needed
};

export default AdMobBanner;

