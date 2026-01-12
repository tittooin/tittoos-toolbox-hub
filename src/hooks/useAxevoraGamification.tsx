
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
    serverTimestamp,
    getDocs,
    collection,
    query,
    orderBy,
    limit
} from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

export interface UserProfile {
    uid: string;
    xp: number;
    coins: number;
    level: number;
    displayName?: string; // Cache nickname for Leaderboard
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
                        coins: 50, // Start with 50 coins
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

    const updateCoins = async (amount: number) => {
        if (!auth.currentUser) return;
        const userRef = doc(db, 'user_profiles', auth.currentUser.uid);
        try {
            await updateDoc(userRef, {
                coins: increment(amount)
            });
        } catch (error) {
            console.error("Error updating coins:", error);
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

        // 2. Affiliate Levels (3+): Real Amazon Shopping Deals (User Requested: Amazon Only)
        // Using "tittoos-21" tag for all links temporarily
        const deals = [
            {
                label: 'Amazon: Tech Deals',
                val: 'AMZ-TECH-50',
                disc: 'UP TO 50% OFF',
                link: 'https://www.amazon.in/b?node=1389401031&tag=tittoos-21' // Gadgets
            },
            {
                label: 'Amazon: Fashion',
                val: 'AMZ-STYLE-70',
                disc: 'UP TO 70% OFF',
                link: 'https://www.amazon.in/b?node=1571271031&tag=tittoos-21' // Fashion
            },
            {
                label: 'Amazon: Home & Kitchen',
                val: 'AMZ-HOME-30',
                disc: 'STARTING ₹99',
                link: 'https://www.amazon.in/b?node=1380365031&tag=tittoos-21' // Home
            },
            {
                label: 'Amazon: Books',
                val: 'AMZ-READ-20',
                disc: 'BESTSELLERS',
                link: 'https://www.amazon.in/b?node=976389031&tag=tittoos-21' // Books
            },
            {
                label: 'Amazon: Today\'s Deals',
                val: 'AMZ-DAILY-LUCKY',
                disc: 'LIGHTNING DEALS',
                link: 'https://www.amazon.in/gp/goldbox?tag=tittoos-21' // Goldbox
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

        // 1. Save Secure PIN
        const pinDoc = {
            pin: pin, // In production, hash this!
            ownerUid: auth.currentUser.uid,
            createdAt: serverTimestamp()
        };
        await setDoc(doc(db, 'nicknames', id), pinDoc);

        // 2. Sync Display Name to Profile (For Leaderboard)
        await updateDoc(doc(db, 'user_profiles', auth.currentUser.uid), {
            displayName: nickname
        });
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

        // Ensure current profile has the name (Migration/Recovery)
        await updateDoc(doc(db, 'user_profiles', newUid), {
            displayName: nickname
        });
    };

    // --- Leaderboard Logic ---
    const getLeaderboard = async () => {
        const q = query(
            collection(db, 'user_profiles'),
            orderBy('xp', 'desc'),
            limit(20)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as UserProfile);
    };

    return {
        userProfile,
        updateCoins,
        loading,
        showLevelUp,
        setShowLevelUp,
        newReward,
        awardXP,
        claimReward,
        checkNickname,
        registerNickname,
        recoverAccount,
        getLeaderboard,
        setNewReward
    };
};
