import BannerCarousel from '@/components/BannerCarousel';
import CategoryCard from '@/components/CategoryCard';
import LocationSelector from '@/components/LocationSelector';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/store/useAuth';
import { useFirebaseData } from '@/store/useFirebaseData';
import { useStore } from '@/store/useStore';
import { router } from 'expo-router';
import { Bell, ChevronDown, MapPin, Search, ShoppingBag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { getCartItemsCount } = useStore();
  const { products, categories, banners, loading } = useFirebaseData();
  const { selectedLocation } = useAuth();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const featuredProducts = products.slice(0, 6);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestseller).slice(0, 4);
  const cartItemsCount = getCartItemsCount();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productContainer}>
      <ProductCard product={item} />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => setShowLocationSelector(true)}
        >
          <MapPin size={16} color="#3742fa" />
          <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">{selectedLocation}</Text>
          <ChevronDown size={16} color="#3742fa" />
        </TouchableOpacity>
        {/* <Text style={styles.welcomeText}>Welcome to Campus Sutra</Text> */}
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/search')}
        >
          <Search size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/notifications')}
        >
          <Bell size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.cartButton]}
          onPress={() => router.push('/cart')}
        >
          <ShoppingBag size={24} color="#333" />
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSection = (title: string, data: any[], showViewAll = false) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showViewAll && (
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={data}
        renderItem={renderProduct}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {renderHeader()}
          <ScrollView showsVerticalScrollIndicator={false}>
            {loading.banners ? (
              <View style={styles.loadingBanner}>
                <Text style={styles.loadingText}>Loading banners...</Text>
              </View>
            ) : (
              <BannerCarousel banners={banners} />
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              {loading.categories ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesContainer}
                >
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </ScrollView>
              )}
            </View>

            {loading.products ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : (
              <>
                {newArrivals.length > 0 && renderSection('New Arrivals', newArrivals, true)}
                {bestSellers.length > 0 && renderSection('Best Sellers', bestSellers, true)}
                {renderSection('Featured Products', featuredProducts, true)}
              </>
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </Animated.View>
      </View>

      <LocationSelector
        visible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    flex: 0.9,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3742fa',
    marginHorizontal: 6,
  },
  welcomeText: {
    fontSize: 12,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3742fa',
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingBanner: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});