import { AdMob, BannerAdSize, BannerAdPosition, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Real AdMob ID for Indus Appstore Release
const ADMOB_BANNER_ID = 'ca-app-pub-9616663341680102/8753249026';
const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-9616663341680102/6382160578';

let lastAdShowTime = 0;
const AD_COOLDOWN_MS = 2 * 60 * 1000; // 2 Minutes Cooldown between ads (Safe for Account)

export const AdMobService = {
    initialize: async () => {
        if (!Capacitor.isNativePlatform()) return;

        try {
            await AdMob.initialize({
                // Production Init (No Test Devices)
            });
            console.log('AdMob Initialized');

            // Preload the first interstitial
            AdMobService.prepareInterstitial();

        } catch (e) {
            console.error('AdMob Initialization Failed', e);
        }
    },

    // --- BANNER ADS ---
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
    },

    // --- INTERSTITIAL ADS ---
    prepareInterstitial: async () => {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await AdMob.prepareInterstitial({
                adId: ADMOB_INTERSTITIAL_ID,
                isTesting: false
            });
            console.log('Interstitial Prepared');
        } catch (e) {
            console.error('Failed to prepare interstitial', e);
        }
    },

    showInterstitial: async () => {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await AdMob.showInterstitial();
            // Prepare the next one automatically
            setTimeout(() => AdMobService.prepareInterstitial(), 5000);
        } catch (e) {
            console.error('Failed to show interstitial', e);
        }
    },

    // Smart Trigger: Checks cooldown before showing
    checkAndShowAd: async () => {
        const now = Date.now();
        if (now - lastAdShowTime > AD_COOLDOWN_MS) {
            console.log('Ad Cooldown Over. Showing Interstitial...');
            await AdMobService.showInterstitial();
            lastAdShowTime = now;
            return true; // Ad shown
        } else {
            console.log('Ad Cooldown Active. Skipping...');
            return false; // Ad skipped
        }
    }
};
