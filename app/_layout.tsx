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
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false, title: "Product Details" }} />
      <Stack.Screen name="orders" options={{ headerShown: true, title: "My Orders" }} />
      <Stack.Screen name="addresses" options={{ headerShown: true, title: "Addresses" }} />
      <Stack.Screen name="payment-methods" options={{ headerShown: true, title: "Payment Methods" }} />
      <Stack.Screen name="notifications" options={{ headerShown: true, title: "Notifications" }} />
      <Stack.Screen name="wishlist" options={{ headerShown: true, title: "Wishlist" }} />
      <Stack.Screen name="settings" options={{ headerShown: true, title: "Settings" }} />
      <Stack.Screen name="admin" options={{ headerShown: true, title: "Admin Panel" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseDataProvider>
        <GestureHandlerRootView>
          <StatusBar barStyle={'default'} />
          <RootLayoutNav />
        </GestureHandlerRootView>
      </FirebaseDataProvider>
    </QueryClientProvider>
  );
}
