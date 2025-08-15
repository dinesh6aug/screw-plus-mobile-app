import { Colors } from '@/constants/Colors';
import { firebaseService } from '@/services/firebaseService';
import { useStore } from '@/store/useStore';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { favorites, toggleFavorite, addToCart } = useStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const data = await firebaseService.getProductById(id as string);
      if (!data) {
        setError("Product not found");
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const isFavorite = product && favorites.includes(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    router.push('/cart');
  };

  const handleShare = async () => {
    try {
      console.log('Sharing product:', product);
      await Share.share({
        message: `Check out this amazing product: ${product.title} - ₹${product.price}`,
        url: product.image,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{error || 'Product not found'}</Text>
      </SafeAreaView>
    );
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>

      <Stack.Screen options={{ headerShown: false }} />

      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={() => toggleFavorite(product.id)}>
              <Heart
                size={24}
                color={isFavorite ? 'red' : Colors.light.text}
                fill={isFavorite ? 'red' : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Share2 size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Floating Header Buttons */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.floatingButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={'#fff'} />
        </TouchableOpacity>
        <View style={styles.floatingActions}>
          <TouchableOpacity style={styles.floatingButton} onPress={() => toggleFavorite(product.id)}>
            <Heart
              size={24}
              color={isFavorite ? 'red' : '#fff'}
              fill={isFavorite ? 'red' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingButton} onPress={handleShare}>
            <Share2 size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>


      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.productImage} />

        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingContainer}>
            <Star size={16} color="#ffa502" fill="#ffa502" />
            <Text style={styles.rating}>
              {product.rating}
            </Text>

            <Text style={styles.reviews}>
              ({String(product.reviews)} reviews)
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
            {product.discount && (
              <Text style={styles.discount}>{product.discount}% OFF</Text>
            )}
          </View>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.optionsContainer}>
                {product.sizes.map((size: any) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionButton,
                      selectedSize === size && styles.optionButtonSelected
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedSize === size && styles.optionTextSelected
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.optionsContainer}>
                {product.colors.map((color: any) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.optionButton,
                      selectedColor === color && styles.optionButtonSelected
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedColor === color && styles.optionTextSelected
                    ]}>
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <ShoppingCart size={20} color="#333" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  productImage: {
    width,
    height: width,
  },
  content: {
    padding: 16,
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 26,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  discount: {
    fontSize: 14,
    color: '#2ed573',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextSelected: {
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  addToCartText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 8,
  },
  buyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#333',
    marginLeft: 8,
  },
  buyNowText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fafafa',
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    zIndex: 999,
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  floatingActions: {
    flexDirection: 'row',
    gap: 12,
  },
});