import ProductCard from '@/components/ProductCard';
import { Colors } from '@/constants/Colors';
import { firebaseService } from '@/services/firebaseService'; // adjust path if needed
import { useStore } from '@/store/useStore';
import { Product } from '@/types/product';
import { router } from 'expo-router';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WishlistScreen() {
    const { favorites, clearWishlist, addToCart } = useStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to real-time products
        const unsubscribe = firebaseService.subscribeToProducts((fetchedProducts) => {
            setProducts(fetchedProducts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const wishlistProducts = products.filter(product => favorites.includes(product.id));

    const handleAddAllToCart = () => {
        wishlistProducts.forEach(product => {
            const size = product.sizes?.[0] || "Default Size";
            const color = product.colors?.[0] || "Default Color";
            addToCart(product, size, color);
        });

        Alert.alert(
            "Success",
            "All items have been added to your cart.",
            [{ text: "OK" }]
        );

        clearWishlist(); // clear wishlist after success
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.productContainer}>
            <ProductCard product={item} />
        </View>
    );

    const renderEmptyWishlist = () => (
        <View style={styles.emptyState}>
            <Heart size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
                Add items you love to your wishlist and shop them later
            </Text>
            <TouchableOpacity style={styles.shopNowButton} onPress={() => router.replace('/(tabs)')}>
                <Text style={styles.shopNowText}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#333" style={{ flex: 1 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>My Wishlist</Text>
                    </View>
                    {wishlistProducts.length > 0 && (
                        <Text style={styles.itemCount}>{wishlistProducts.length} items</Text>
                    )}
                </View>

                {wishlistProducts.length === 0 ? (
                    renderEmptyWishlist()
                ) : (
                    <>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={styles.addAllButton}
                                onPress={handleAddAllToCart}
                            >
                                <ShoppingCart size={20} color="#fff" />
                                <Text style={styles.addAllText}>Add All to Cart</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={wishlistProducts}
                            renderItem={renderProduct}
                            numColumns={2}
                            columnWrapperStyle={styles.row}
                            contentContainerStyle={styles.productsContainer}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                        />
                    </>
                )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    itemCount: {
        fontSize: 14,
        color: '#666',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    actionsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    addAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        paddingVertical: 12,
        borderRadius: 8,
    },
    addAllText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
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
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    shopNowButton: {
        backgroundColor: '#333',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    },
    shopNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
