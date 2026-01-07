import { AdMob, BannerAdSize, BannerAdPosition, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Real AdMob ID for Indus Appstore Release
const ADMOB_BANNER_ID = 'ca-app-pub-9616663341680102/8753249026';

export const AdMobService = {
    initialize: async () => {
        if (!Capacitor.isNativePlatform()) return;

        try {
            await AdMob.initialize({
                // Production Init (No Test Devices)
            });
            console.log('AdMob Initialized');
        } catch (e) {
            console.error('AdMob Initialization Failed', e);
        }
    },

    showBanner: async () => {
        if (!Capacitor.isNativePlatform()) return;

        try {
            const options = {
                adId: ADMOB_BANNER_ID,
                adSize: BannerAdSize.BANNER,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
                isTesting: false, // PRODUCTION MODE
            };

            await AdMob.showBanner(options);
        } catch (e) {
            console.error('Failed to show banner', e);
        }
    },

    hideBanner: async () => {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await AdMob.hideBanner();
        } catch (e) {
            console.error('Failed to hide banner', e);
        }
    },

    resumeBanner: async () => {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await AdMob.resumeBanner();
        } catch (e) {
            console.error('Failed to resume banner', e);
        }
    }
};
