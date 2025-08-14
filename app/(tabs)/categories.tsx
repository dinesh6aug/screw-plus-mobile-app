import ProductCard from '@/components/ProductCard';
import { firebaseService } from '@/services/firebaseService';
import { useStore } from '@/store/useStore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoriesScreen() {
  const { selectedCategory, setSelectedCategory } = useStore();
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories & products from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [categoryData, productData] = await Promise.all([
          firebaseService.getCategories(),
          firebaseService.getProducts()
        ]);

        setCategories(categoryData.map(cat => cat.name));
        setProducts(productData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryOptions = ['All', ...categories];

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter(product => product.category === activeCategory);

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    setSelectedCategory(category);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productContainer}>
      <ProductCard product={item} />
    </View>
  );

  const renderCategoryFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        activeCategory === item && styles.categoryFilterActive
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text
        style={[
          styles.categoryFilterText,
          activeCategory === item && styles.categoryFilterTextActive
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>{filteredProducts.length} products found</Text>
        </View>

        <FlatList
          data={categoryOptions}
          renderItem={renderCategoryFilter}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilters}
          contentContainerStyle={styles.categoryFiltersContent}
        />

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryFilters: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    minHeight: 52,
    maxHeight: 52,
  },
  categoryFiltersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryFilterActive: {
    backgroundColor: '#333',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: '#fff',
  },
  productsContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
