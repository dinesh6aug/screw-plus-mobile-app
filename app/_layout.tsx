import AuthWrapper from "@/components/AuthWrapper";
import { AuthProvider } from "@/store/useAuth";
import { FirebaseDataProvider } from "@/store/useFirebaseData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <AuthWrapper>
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false, title: "Product Details", presentation: "modal" }} />
        <Stack.Screen name="orders" options={{ headerShown: true, title: "My Orders" }} />
        <Stack.Screen name="addresses" options={{ headerShown: true, title: "Addresses" }} />
        <Stack.Screen name="payment-methods" options={{ headerShown: true, title: "Payment Methods" }} />
        <Stack.Screen name="notifications" options={{ headerShown: true, title: "Notifications" }} />
        <Stack.Screen name="wishlist" options={{ headerShown: true, title: "Wishlist" }} />
        <Stack.Screen name="settings" options={{ headerShown: true, title: "Settings" }} />
        <Stack.Screen name="admin" options={{ headerShown: true, title: "Admin Panel" }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: true, title: 'Edit Profile' }} />
        <Stack.Screen name="checkout" options={{ headerShown: false, title: "Checkout" }} />
      </Stack>
    </AuthWrapper>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FirebaseDataProvider>
          <GestureHandlerRootView>
            {/* Set status bar style */}
            <StatusBar
              barStyle="dark-content" // "dark-content" or "light-content"
              backgroundColor="#fff" // Android background color
              translucent={false}       // true makes content go under status bar
            />
            <RootLayoutNav />
          </GestureHandlerRootView>
        </FirebaseDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
