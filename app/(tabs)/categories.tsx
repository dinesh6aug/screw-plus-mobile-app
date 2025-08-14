import ProductCard from '@/components/ProductCard';
import { categories, products } from '@/constants/products';
import { useStore } from '@/store/useStore';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoriesScreen() {
  const { selectedCategory, setSelectedCategory } = useStore();
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  const categoryOptions = ['All', ...categories.map(cat => cat.name)];

  const filteredProducts = activeCategory === 'All'
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
      <Text style={[
        styles.categoryFilterText,
        activeCategory === item && styles.categoryFilterTextActive
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
      />
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
});