import { Colors } from '@/constants/Colors';
import { firebaseService } from '@/services/firebaseService';
import { useStore } from '@/store/useStore';
import { router, useLocalSearchParams } from 'expo-router';
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
  Vibration,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

export default function ProductDetailScreen() {
  const { getCartItemsCount, cart } = useStore();
  const { id } = useLocalSearchParams();
  const { favorites, toggleFavorite, addToCart } = useStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const cartItemsCount = getCartItemsCount();

  // Mock multiple images for slider
  const productImages = [
    product?.image || '',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
  ];

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
    Vibration.vibrate(500);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    const existingItem = cart.find(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingItem) {
      router.push('/cart');
    } else {
      if (!selectedSize || !selectedColor) {
        alert('Please select size and color');
        return;
      }
      addToCart(product, selectedSize, selectedColor);
      router.push('/cart');
    }
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

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT * 0.3],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.container}>

        {/* Animated Header */}
        <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity, paddingTop: insets.top }]}>
          <View style={styles.headerContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <TouchableOpacity style={[styles.floatingButton, { backgroundColor: 'transparent' }]} onPress={() => router.back()}>
                <ArrowLeft size={20} color={'#000'} />
              </TouchableOpacity>
              <View style={{ width: 200 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 3 }} numberOfLines={1} ellipsizeMode='tail'>{product.title}</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: 'green' }}>₹{product.price}</Text>
              </View>
            </View>
            <View style={styles.floatingActions}>
              <TouchableOpacity style={[styles.floatingButton, { backgroundColor: 'transparent' }]} onPress={() => toggleFavorite(product.id)}>
                <Heart
                  size={20}
                  color={isFavorite ? 'red' : '#000'}
                  fill={isFavorite ? 'red' : 'none'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.floatingButton, { backgroundColor: 'transparent' }]} onPress={handleShare}>
                <Share2 size={20} color={'#000'} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Floating Header Buttons */}
        <View style={[styles.floatingHeader, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.floatingButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color={'#fff'} />
          </TouchableOpacity>
          <View style={styles.floatingActions}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => router.push('/cart')}
            >
              <ShoppingCart size={20} color={'#fff'} />
              {cartItemsCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingButton} onPress={() => toggleFavorite(product.id)}>
              <Heart
                size={20}
                color={'#fff'}
                fill={isFavorite ? '#fff' : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingButton} onPress={handleShare}>
              <Share2 size={20} color={'#fff'} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Parallax Image Slider */}
          <View style={styles.imageContainer}>
            <Animated.View
              style={[
                styles.imageSliderContainer,
                {
                  transform: [
                    { translateY: imageTranslateY },
                    { scale: imageScale },
                  ],
                },
              ]}
            >
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                  setCurrentImageIndex(index);
                }}
              >
                {productImages.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.productImage} />
                ))}
              </ScrollView>

              {/* Image Indicators */}
              <View style={styles.imageIndicators}>
                {productImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentImageIndex && styles.activeIndicator,
                    ]}
                  />
                ))}
              </View>
            </Animated.View>
          </View>

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

        </Animated.ScrollView>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  imageSliderContainer: {
    height: HEADER_HEIGHT + 100,
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT + 100,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'red',
    width: 24,
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
    paddingTop: 12,
    paddingBottom: 28,
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


  // New
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 34,
  },
  discountBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  specKey: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 16,
    color: '#94A3B8',
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 4,
  },
  deliveryInfo: {
    marginTop: 8,
  },
  deliveryText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 4,
  },
  policyText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#dedede',
  },
  quantityButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  quantity: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },


});