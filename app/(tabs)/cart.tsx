import { useStore } from '@/store/useStore';
import { CartItem } from '@/types/product';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useStore();

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(item.product.id, item.selectedSize, item.selectedColor);
    } else {
      updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, newQuantity);
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    removeFromCart(item.product.id, item.selectedSize, item.selectedColor);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.itemVariant}>
          Size: {item.selectedSize} | Color: {item.selectedColor}
        </Text>
        <Text style={styles.itemPrice}>₹{item.product.price}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item, item.quantity - 1)}
          >
            <Minus size={16} color="#666" />
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item, item.quantity + 1)}
          >
            <Plus size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item)}
      >
        <Trash2 size={20} color="#ff4757" />
      </TouchableOpacity>
    </View>
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Shopping Cart</Text>
          </View>

          <View style={styles.emptyContainer}>
            <ShoppingBag size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add some products to get started
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={(item) => `${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cartList}
        />

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>₹{getCartTotal()}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
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
  clearButton: {
    fontSize: 14,
    color: '#ff4757',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});