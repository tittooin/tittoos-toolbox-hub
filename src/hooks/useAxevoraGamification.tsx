
import { useState, useEffect, useRef } from 'react';
import { db, auth } from "@/lib/firebase";
import {
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
    increment,
    getDoc,
    arrayUnion,
    serverTimestamp
} from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

export interface UserProfile {
    uid: string;
    xp: number;
    level: number;
    badges: string[];
    scratchCards: ScratchCard[];
}

export interface ScratchCard {
    id: string;
    isClaimed: boolean;
    rewardType: 'xp' | 'theme' | 'coupon' | 'badge';
    rewardValue: string; // The code usually
    rewardLabel: string;
    discount?: string; // e.g. "30% OFF"
    affiliateLink?: string; // e.g. "https://amazon.to/..."
}

export const useAxevoraGamification = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newReward, setNewReward] = useState<ScratchCard | null>(null);

    // Ref to track previous profile state to avoid stale closures
    const userProfileRef = useRef<UserProfile | null>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, 'user_profiles', user.uid);

                // Initialize profile if not exists
                const snap = await getDoc(docRef);
                if (!snap.exists()) {
                    await setDoc(docRef, {
                        uid: user.uid,
                        xp: 0,
                        level: 1,
                        badges: ['Rookie'],
                        scratchCards: []
                    });
                }

                // Realtime Listener
                const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserProfile;
                        const prevProfile = userProfileRef.current;

                        console.log("🔥 AxevoraGamification Hook Update:", data);

                        // Check for Level Up (Compare against REF to avoid stale closure)
                        if (prevProfile && data.level > prevProfile.level) {
                            console.log("🎉 LEVEL UP DETECTED! Showing Modal.");
                            setShowLevelUp(true);
                        }

                        // Check for new available scratch cards
                        const unclaimed = (data.scratchCards || []).find(c => !c.isClaimed);
                        if (unclaimed) {
                            console.log("🎁 Unclaimed Reward Found:", unclaimed);
                            setNewReward(unclaimed);
                        }

                        setUserProfile(data);
                        userProfileRef.current = data;
                    }
                    setLoading(false);
                });

                return () => unsubscribeSnapshot();
            } else {
                setUserProfile(null);
                userProfileRef.current = null;
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const awardXP = async (amount: number, reason: string) => {
        if (!auth.currentUser || !userProfile) return;

        const userRef = doc(db, 'user_profiles', auth.currentUser.uid);
        const newXP = userProfile.xp + amount;

        // Calculate Level: Level = floor(sqrt(XP / 50)) + 1
        const newLevel = Math.floor(Math.sqrt(newXP / 50)) + 1;
        const levelUp = newLevel > userProfile.level;

        const updates: any = {
            xp: increment(amount)
        };

        if (levelUp) {
            updates.level = newLevel;
            // Generate Reward
            const reward = generateReward(newLevel);
            updates.scratchCards = arrayUnion(reward);
        }

        try {
            await updateDoc(userRef, updates);
        } catch (error) {
            console.error("Error awarding XP:", error);
        }
    };

    const generateReward = (level: number): ScratchCard => {
        const id = Math.random().toString(36).substring(7);
        const rand = Math.random();

        // 1. Beginner Levels (1-2): Mostly XP or Themes
        if (level < 3) {
            if (rand > 0.4) return {
                id, isClaimed: false, rewardType: 'xp',
                rewardValue: '50', rewardLabel: '50 XP Boost', discount: 'LEVEL UP FAST'
            };
            return {
                id, isClaimed: false, rewardType: 'theme',
                rewardValue: 'cyberpunk', rewardLabel: 'Theme: Cyberpunk', discount: 'UNLOCK'
            };
        }

        // 2. Affiliate Levels (3+): Real Shopping Deals
        // Simplified Affiliate Logic for Demo
        const deals = [
            {
                label: 'Amazon Gadgets',
                val: 'AMZ-TITTOO-20',
                disc: '20% OFF',
                link: 'https://www.amazon.in/b?node=1389401031&tag=tittoos-21'
            },
            {
                label: 'Hostinger Hosting',
                val: 'HOST-WEB-70',
                disc: '70% OFF',
                link: 'https://www.hostinger.in/tittoo'
            },
            {
                label: 'Boat Headphones',
                val: 'BOAT-HEAD-30',
                disc: '30% OFF',
                link: 'https://www.boat-lifestyle.com'
            },
            {
                label: 'MamaEarth Care',
                val: 'MAMA-EARTH-25',
                disc: '25% OFF',
                link: 'https://mamaearth.in'
            }
        ];

        const deal = deals[Math.floor(Math.random() * deals.length)];

        return {
            id,
            isClaimed: false,
            rewardType: 'coupon',
            rewardValue: deal.val,
            rewardLabel: deal.label,
            discount: deal.disc,
            affiliateLink: deal.link
        };
    };

    const claimReward = async (cardId: string) => {
        if (!auth.currentUser || !userProfile) return;

        // Mark card as claimed in DB (This requires mapping logic, for simplicity we just update the specific card in array - simplified implies fetch-modify-save or separate collection. 
        // For keeping it single doc, we will replace the array. In prod, better to use subcollection)

        const updatedCards = userProfile.scratchCards.map(c =>
            c.id === cardId ? { ...c, isClaimed: true } : c
        );

        const card = userProfile.scratchCards.find(c => c.id === cardId);
        if (card && card.rewardType === 'xp') {
            await updateDoc(doc(db, 'user_profiles', auth.currentUser.uid), {
                scratchCards: updatedCards,
                xp: increment(parseInt(card.rewardValue))
            });
        } else {
            await updateDoc(doc(db, 'user_profiles', auth.currentUser.uid), {
                scratchCards: updatedCards
            });
        }
    };

    // --- Secure Nickname Logic ---

    // Check if nickname exists and return registered status
    const checkNickname = async (nickname: string) => {
        const id = nickname.toLowerCase().trim();
        const docRef = doc(db, 'nicknames', id);
        const snap = await getDoc(docRef);
        return { exists: snap.exists(), isOwner: snap.exists() && snap.data()?.ownerUid === auth.currentUser?.uid };
    };

    // Register a new nickname securely
    const registerNickname = async (nickname: string, pin: string) => {
        if (!auth.currentUser) throw new Error("Not authenticated");
        const id = nickname.toLowerCase().trim();
        const pinDoc = {
            pin: pin, // In production, hash this!
            ownerUid: auth.currentUser.uid,
            createdAt: serverTimestamp()
        };
        await setDoc(doc(db, 'nicknames', id), pinDoc);
    };

    // Recover account using PIN
    const recoverAccount = async (nickname: string, pin: string) => {
        if (!auth.currentUser) throw new Error("Not authenticated");
        const id = nickname.toLowerCase().trim();
        const docRef = doc(db, 'nicknames', id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) throw new Error("Nickname not found");
        const data = snap.data();

        if (data!.pin !== pin) throw new Error("Incorrect PIN");

        // Migration Logic: Move old profile to new UID if different
        const oldUid = data!.ownerUid;
        const newUid = auth.currentUser.uid;

        if (oldUid !== newUid) {
            const oldProfileRef = doc(db, 'user_profiles', oldUid);
            const newProfileRef = doc(db, 'user_profiles', newUid);

            const oldProfileSnap = await getDoc(oldProfileRef);
            if (oldProfileSnap.exists()) {
                await setDoc(newProfileRef, { ...oldProfileSnap.data(), uid: newUid });
                // Update nickname owner
                await updateDoc(docRef, { ownerUid: newUid });
            }
        }
    };

    return {
        userProfile,
        loading,
        showLevelUp,
        setShowLevelUp,
        newReward,
        awardXP,
        claimReward,
        checkNickname,
        registerNickname,
        recoverAccount,
        setNewReward
    };
};
