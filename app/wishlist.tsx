import ProductCard from '@/components/ProductCard';
import { products } from '@/constants/products';
import { useStore } from '@/store/useStore';
import { Heart, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WishlistScreen() {
    const { favorites, addToCart } = useStore();

    const wishlistProducts = products.filter(product => favorites.includes(product.id));

    const handleAddAllToCart = () => {
        wishlistProducts.forEach(product => {
            if (product.sizes.length > 0 && product.colors.length > 0) {
                addToCart(product, product.sizes[0], product.colors[0]);
            }
        });
    };

    const renderProduct = ({ item }: { item: any }) => (
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
            <TouchableOpacity style={styles.shopNowButton}>
                <Text style={styles.shopNowText}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Wishlist</Text>
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
                    />
                </>
            )}
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