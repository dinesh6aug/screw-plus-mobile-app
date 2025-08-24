import { Colors } from '@/constants/Colors';
import { firebaseService } from '@/services/firebaseService';
import { useAuth } from '@/store/useAuth';
import { useStore } from '@/store/useStore';
import { Order } from '@/types/types';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Edit3,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Settings,
  Shield,
  ShoppingBag,
  User
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {


  const { user, userProfile, logout } = useAuth();
  const { favorites } = useStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userId: any = user?.uid;

  const [orders, setOrder] = useState<Order[]>([]);

  React.useEffect(() => {
    const unsubscribe = firebaseService.subscribeToOrder(userId, (data) => {
      setOrder(data);
      const values: Record<string, Animated.Value> = {};
      data.forEach(order => { values[order.orderId] = new Animated.Value(1); });
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            const result = await logout();
            setIsLoggingOut(false);
            if (result.success) {
              router.replace('/login');
            } else {
              Alert.alert('Error', result.error || 'Failed to logout');
            }
          },
        },
      ],
    );
  };

  const menuItems = [
    { icon: Shield, title: 'Admin Panel', subtitle: 'Manage app content', route: '/admin', isAdmin: true },
    { icon: ShoppingBag, title: 'My Orders', subtitle: 'Track your orders', route: '/orders' },
    { icon: Heart, title: 'Wishlist', subtitle: 'Your favorite items', route: '/wishlist' },
    { icon: MapPin, title: 'Addresses', subtitle: 'Manage delivery addresses', route: '/addresses' },
    { icon: CreditCard, title: 'Payment Methods', subtitle: 'Cards & wallets', route: '/payment-methods' },
    { icon: Bell, title: 'Notifications', subtitle: 'Alerts & updates', route: '/notifications' },
    { icon: HelpCircle, title: 'Help & Support', subtitle: 'Get assistance', route: null },
    { icon: Settings, title: 'Settings', subtitle: 'App preferences', route: '/settings' },
  ];

  const handleMenuPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
  };

  const renderMenuItem = (item: any, index: number) => {
    const IconComponent = item.icon;
    const isAdminItem = item.isAdmin;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.menuItem, isAdminItem && styles.adminMenuItem]}
        onPress={() => handleMenuPress(item.route)}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, isAdminItem && styles.adminIconContainer]}>
            <IconComponent size={20} color={isAdminItem ? "#8B5CF6" : "#666"} />
          </View>
          <View style={styles.menuItemText}>
            <Text style={[styles.menuItemTitle, isAdminItem && styles.adminMenuItemTitle]}>{item.title}</Text>
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
            {isAdminItem && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
          </View>
        </View>
        <ChevronRight size={20} color={isAdminItem ? "#8B5CF6" : "#ccc"} />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.light.homeScreenHeaderBackground.start, Colors.light.homeScreenHeaderBackground.end]}  // gradient colors
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}  // gradient start point
      end={{ x: 1, y: 0 }}    // gradient end point
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              {userProfile?.photoURL ? (
                <Image source={{ uri: userProfile.photoURL }} style={styles.avatarImage} />
              ) : (
                <User size={28} color="#666" />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {userProfile?.displayName || user?.displayName || 'Guest User'}
              </Text>
              <Text style={styles.userEmail}>
                {userProfile?.email || user?.email || 'guest@example.com'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Edit3 size={20} color="#3742fa" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹{orders.reduce((total, order) => total + order.finalTotal, 0).toLocaleString()}</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map(renderMenuItem)}
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={20} color="#ff4757" />
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Screw Plus v1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#f0f2ff',
    borderRadius: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.homeScreenHeaderForeground,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.homeScreenHeaderForeground,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 8,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 8,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  adminMenuItem: {
    backgroundColor: '#F8F7FF',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  adminIconContainer: {
    backgroundColor: '#EDE9FE',
  },
  adminMenuItemTitle: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  adminBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  adminBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});