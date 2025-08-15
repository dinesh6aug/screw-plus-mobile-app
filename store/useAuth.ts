import { auth, db } from '@/config/firebase';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    user: User | null;
    userProfile: UserProfile | null;
    isLoading: boolean;
    hasCompletedOnboarding: boolean;
    selectedLocation: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Select Location');

    const loadUserProfile = useCallback(async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserProfile({
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as UserProfile);
            }
        } catch (error) {
            console.log('Error loading user profile:', error);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                await loadUserProfile(firebaseUser.uid);
            } else {
                setUserProfile(null);
            }

            setIsLoading(false);
        });

        const loadOnboardingStatus = async () => {
            try {
                const status = await AsyncStorage.getItem('hasCompletedOnboarding');
                setHasCompletedOnboarding(status === 'true');
            } catch (error) {
                console.log('Error loading onboarding status:', error);
            }
        };

        const loadSelectedLocation = async () => {
            try {
                const location = await AsyncStorage.getItem('selectedLocation');
                if (location) {
                    setSelectedLocation(location);
                }
            } catch (error) {
                console.log('Error loading selected location:', error);
            }
        };

        loadOnboardingStatus();
        loadSelectedLocation();

        return unsubscribe;
    }, [loadUserProfile]);

    const signUp = useCallback(async (email: string, password: string, displayName: string) => {
        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(userCredential.user, { displayName });

            const userProfile: UserProfile = {
                uid: userCredential.user.uid,
                email: userCredential.user.email!,
                displayName,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);

            return { success: true };
        } catch (error: any) {
            console.log('Sign up error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: any) {
            console.log('Sign in error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signInWithGoogle = useCallback(async () => {
        try {
            setIsLoading(true);

            const redirectUrl = AuthSession.makeRedirectUri();

            const request = new AuthSession.AuthRequest({
                clientId: '947363907554-your-google-client-id.apps.googleusercontent.com',
                scopes: ['openid', 'profile', 'email'],
                redirectUri: redirectUrl,
                responseType: AuthSession.ResponseType.IdToken,
                extraParams: {},
            });

            const result = await request.promptAsync({
                authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
            });

            if (result.type === 'success' && result.params.id_token) {
                const credential = GoogleAuthProvider.credential(result.params.id_token);
                const userCredential = await signInWithCredential(auth, credential);

                const existingProfile = await getDoc(doc(db, 'users', userCredential.user.uid));

                if (!existingProfile.exists()) {
                    const userProfile: UserProfile = {
                        uid: userCredential.user.uid,
                        email: userCredential.user.email!,
                        displayName: userCredential.user.displayName || 'User',
                        photoURL: userCredential.user.photoURL || undefined,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
                }

                return { success: true };
            }

            return { success: false, error: 'Google sign in cancelled' };
        } catch (error: any) {
            console.log('Google sign in error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signInWithApple = useCallback(async () => {
        try {
            setIsLoading(true);

            if (Platform.OS !== 'ios') {
                return { success: false, error: 'Apple Sign In is only available on iOS' };
            }

            await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            return { success: true };
        } catch (error: any) {
            console.log('Apple sign in error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const forgotPassword = useCallback(async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error: any) {
            console.log('Forgot password error:', error);
            return { success: false, error: error.message };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error: any) {
            console.log('Logout error:', error);
            return { success: false, error: error.message };
        }
    }, []);

    const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
        try {
            if (!user) return { success: false, error: 'No user logged in' };

            const updatedProfile = {
                ...updates,
                updatedAt: new Date(),
            };

            await updateDoc(doc(db, 'users', user.uid), updatedProfile);
            await loadUserProfile(user.uid);

            return { success: true };
        } catch (error: any) {
            console.log('Update profile error:', error);
            return { success: false, error: error.message };
        }
    }, [user, loadUserProfile]);

    const completeOnboarding = useCallback(async () => {
        try {
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            setHasCompletedOnboarding(true);
        } catch (error) {
            console.log('Error completing onboarding:', error);
        }
    }, []);

    const skipLogin = useCallback(async () => {
        try {
            await AsyncStorage.setItem('hasSkippedLogin', 'true');
            setHasCompletedOnboarding(true);
        } catch (error) {
            console.log('Error skipping login:', error);
        }
    }, []);

    const updateSelectedLocation = useCallback(async (location: string) => {
        try {
            await AsyncStorage.setItem('selectedLocation', location);
            setSelectedLocation(location);
        } catch (error) {
            console.log('Error updating selected location:', error);
        }
    }, []);

    return useMemo(() => ({
        user,
        userProfile,
        isLoading,
        hasCompletedOnboarding,
        selectedLocation,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        forgotPassword,
        logout,
        updateUserProfile,
        completeOnboarding,
        skipLogin,
        updateSelectedLocation,
    }), [
        user,
        userProfile,
        isLoading,
        hasCompletedOnboarding,
        selectedLocation,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        forgotPassword,
        logout,
        updateUserProfile,
        completeOnboarding,
        skipLogin,
        updateSelectedLocation,
    ]);
});