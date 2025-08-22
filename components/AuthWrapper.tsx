import { useAuth } from '@/store/useAuth';
import { router, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { user, isLoading, hasCompletedOnboarding, hasSkippedLogin } = useAuth();
    const segments = useSegments();

    useEffect(() => {
        if (isLoading) return;

        const inOnboarding = segments[0] === 'onboarding';
        const inAuthScreens = ['login', 'signup', 'forgot-password'].includes(segments[0] as string);

        if (!hasCompletedOnboarding && !inOnboarding && !inAuthScreens) {
            // Onboarding not complete → go to onboarding
            router.replace('/onboarding');
        }
        else if (hasCompletedOnboarding && !user && !inAuthScreens) {
            // Onboarding done but user not logged in → go to login
            router.replace('/login');
        }
        else if (hasCompletedOnboarding && user && (inOnboarding || inAuthScreens)) {
            // Onboarding done & user logged in but currently in auth screens → go to tabs
            router.replace('/(tabs)');
        }
    }, [user, isLoading, hasCompletedOnboarding, segments]);


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});