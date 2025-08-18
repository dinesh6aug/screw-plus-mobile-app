import { useStore } from "@/store/useStore";
import { Tabs } from "expo-router";
import { CirclePlay, Grid3X3, Home, Search, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const { getCartItemsCount } = useStore();
  const cartItemsCount = getCartItemsCount();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          paddingTop: 8,
          paddingBottom: 8,
          height: 90,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => <Grid3X3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <CirclePlay size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
          tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ff4757',
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}