import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'CS2024001',
    date: '2024-01-15',
    status: 'delivered',
    total: 2499,
    items: [
      {
        id: '1',
        name: 'Classic White T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        price: 1299,
        quantity: 1,
        size: 'M',
        color: 'White'
      },
      {
        id: '2',
        name: 'Denim Jacket',
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
        price: 1200,
        quantity: 1,
        size: 'L',
        color: 'Blue'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'CS2024002',
    date: '2024-01-20',
    status: 'shipped',
    total: 1899,
    items: [
      {
        id: '3',
        name: 'Casual Hoodie',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
        price: 1899,
        quantity: 1,
        size: 'XL',
        color: 'Gray'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'CS2024003',
    date: '2024-01-22',
    status: 'processing',
    total: 3299,
    items: [
      {
        id: '4',
        name: 'Premium Polo Shirt',
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        price: 1649,
        quantity: 2,
        size: 'M',
        color: 'Navy'
      }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock size={16} color="#ffa502" />;
    case 'processing':
      return <Package size={16} color="#3742fa" />;
    case 'shipped':
      return <Truck size={16} color="#2f3542" />;
    case 'delivered':
      return <CheckCircle size={16} color="#2ed573" />;
    case 'cancelled':
      return <XCircle size={16} color="#ff4757" />;
    default:
      return <Clock size={16} color="#ffa502" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#ffa502';
    case 'processing':
      return '#3742fa';
    case 'shipped':
      return '#2f3542';
    case 'delivered':
      return '#2ed573';
    case 'cancelled':
      return '#ff4757';
    default:
      return '#ffa502';
  }
};

export default function OrdersScreen() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [animatedValues] = useState(() => 
    mockOrders.reduce((acc, order) => {
      acc[order.id] = new Animated.Value(0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const toggleOrderExpansion = (orderId: string) => {
    const isExpanded = expandedOrder === orderId;
    
    if (isExpanded) {
      Animated.timing(animatedValues[orderId], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedOrder(null));
    } else {
      setExpandedOrder(orderId);
      Animated.timing(animatedValues[orderId], {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderOrderItem = (order: Order) => {
    const isExpanded = expandedOrder === order.id;
    const animatedHeight = animatedValues[order.id].interpolate({
      inputRange: [0, 1],
      outputRange: [0, order.items.length * 80 + 20],
    });

    return (
      <View key={order.id} style={styles.orderCard}>
        <TouchableOpacity 
          style={styles.orderHeader}
          onPress={() => toggleOrderExpansion(order.id)}
        >
          <View style={styles.orderHeaderLeft}>
            <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
            <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.orderHeaderRight}>
            <View style={styles.statusContainer}>
              {getStatusIcon(order.status)}
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
            <Text style={styles.orderTotal}>₹{order.total}</Text>
          </View>
        </TouchableOpacity>

        <Animated.View style={[styles.orderItems, { height: animatedHeight }]}>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemVariant}>{item.size} • {item.color}</Text>
                <Text style={styles.itemPrice}>₹{item.price} × {item.quantity}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        <View style={styles.orderActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Track Order</Text>
          </TouchableOpacity>
          
          {order.status === 'delivered' && (
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>Track and manage your orders</Text>
        </View>

        <View style={styles.ordersContainer}>
          {mockOrders.map(renderOrderItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  ordersContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  orderHeaderRight: {
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderItems: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  itemVariant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f8f9fa',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButtonText: {
    color: '#333',
  },
});