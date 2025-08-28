import { getStatusColor, paymentMethods } from "@/services/utilityService";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle, Clock, Download, Headphones, Package, Truck, XCircle } from 'lucide-react-native';
import React from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OrderItem = {
    id: string;
    productId: string;
    name: string;
    size: string;
    color: string;
    image: string;
    price: number;
    quantity: number;
};

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

const OrderDetailScreen: React.FC = () => {

    const invoiceUri = 'https://www.wmaccess.com/downloads/sample-invoice.pdf';

    const scrollY = React.useRef(new Animated.Value(0)).current;

    const params = useLocalSearchParams<{
        orderId?: string;
        placedOn?: string;
        items?: string; // comes as string
        total?: string;
        status: string;
        estimatedDelivery?: string;
        deliveryAddress?: string;
        billingAddress?: string;
        paymentMethod?: string;
        subTotal?: string;
        deliveryFee?: string;
        discount?: string;
        taxPercentage?: string;
        taxAmount?: string;
        platformFee?: string;
    }>();

    // Parse items safely
    const items: OrderItem[] = params.items ? JSON.parse(params.items as string) : [];

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <View style={styles.container}>
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                    style={{ padding: 20 }}
                >
                    {/* <TouchableOpacity style={styles.cartButton}>
                <Text style={styles.cartButtonText}>🛒 Move all items to cart</Text>
            </TouchableOpacity>
            <Text style={styles.subText}>Move items to cart to complete order checkout</Text> */}

                    {/* Status */}
                    <View style={styles.statusBox}>
                        {/* <Text style={styles.statusText}>
                    {params.status === "not_processed" ? "❌ Order Not Processed" : "✅ Order Processed"}
                </Text> */}

                        <View style={styles.statusContainer}>
                            {getStatusIcon(params.status)}
                            <Text style={[styles.statusText, { color: getStatusColor(params.status), marginBottom: 0 }]}>
                                {params.status.charAt(0).toUpperCase() + params.status.slice(1)}
                            </Text>
                        </View>
                        <Text style={styles.deliveryText}>Estimated Delivery by {params.estimatedDelivery}</Text>
                    </View>

                    {/* Order Info */}
                    <View style={styles.orderInfo}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Order #ID</Text>
                            <Text style={styles.value}>{params.orderId}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Placed on</Text>
                            <Text style={styles.value}>{params.placedOn}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Payment Method</Text>
                            <Text style={styles.value}>{paymentMethods.find(mode => mode.id === params.paymentMethod)?.name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Total</Text>
                            <Text style={styles.value}>₹{Number(params.total)?.toLocaleString()}</Text>
                        </View>
                    </View>

                    {/* Items */}
                    {items.map((item, index) => (
                        <View key={item.productId + '-' + index} style={styles.itemCard}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <View style={{ flex: 1, marginRight: 20 }}>
                                <TouchableOpacity onPress={() => router.push(`/product/${item.productId}` as any)}><Text style={styles.itemName} numberOfLines={2} ellipsizeMode='tail'>{item.name}</Text></TouchableOpacity>
                                <Text style={styles.itemVariant}>{item.size} • {item.color}</Text>
                                <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
                            </View>
                            <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                        </View>
                    ))}

                    {/* Delivery */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SHIPPING ADDRESS</Text>
                        <Text style={styles.sectionText}>{params.deliveryAddress}</Text>
                    </View>

                    {/* Billing */}
                    {/* <View style={styles.section}>
                        <Text style={styles.sectionTitle}>BILLING ADDRESS</Text>
                        <Text style={styles.sectionText}>{params.billingAddress}</Text>
                    </View> */}

                    {/* Order Summery */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
                        <View style={[styles.orderInfo, { padding: 0, backgroundColor: 'transparent', marginTop: 5 }]}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Item(s) Subtotal:</Text>
                                <Text style={styles.value}>₹{Number(params.subTotal || 0)?.toLocaleString()}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Tax ({params.taxPercentage || 0}%):</Text>
                                <Text style={styles.value}>₹{Number(params.taxAmount || 0)?.toLocaleString()}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Shipping:</Text>
                                <Text style={styles.value}>₹{Number(params.deliveryFee || 0)?.toLocaleString()}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Platform Fee:</Text>
                                <Text style={styles.value}>₹{Number(params.platformFee || 0)?.toLocaleString()}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Discount:</Text>
                                <Text style={styles.value}>₹{Number(params.discount || 0)?.toLocaleString()}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { fontWeight: '600', color: '#000' }]}>Grand Total:</Text>
                                <Text style={styles.value}>₹{Number(params.total || 0)?.toLocaleString()}</Text>
                            </View>
                        </View>

                    </View>
                </Animated.ScrollView>
                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.addToCartButton}>
                        <Headphones size={20} color="#333" />
                        <Text style={styles.addToCartText}>Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buyNowButton} onPress={() => {
                         router.push({
                              pathname: "/order/invoice",
                              params:{
                                ...params,
                                invoiceNo: 'WMACCESS',
                                invoiceUri
                              },
                            });
                    }}>
                        <Download size={20} color="#fff" />
                        <Text style={styles.buyNowText}>Invoice</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    cartButton: {
        backgroundColor: "#ffe6e6",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        marginBottom: 4,
    },
    cartButtonText: { color: "red", fontWeight: "600" },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 5
    },
    subText: { textAlign: "center", color: "#666", marginBottom: 16 },
    orderInfo: {
        backgroundColor: "#F2F2F2",
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    label: { fontSize: 14, color: "#555" },
    value: { fontSize: 14, fontWeight: "600", color: "#0f1111" },
    statusBox: {
        backgroundColor: "#F2F2F2",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    statusText: { color: "red", fontWeight: "700", marginBottom: 4 },
    deliveryText: { color: "#555" },
    itemCard: {
        flexDirection: "row",
        justifyContent: 'space-between',
        gap: 10,
        backgroundColor: "#fefefe",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },
    itemImage: { width: 60, height: 60, borderRadius: 6, backgroundColor: '#fff' },
    itemName: { fontWeight: "600", fontSize: 14, color: '#2162a1' },
    itemPrice: { color: "#333", fontSize: 13, fontWeight: '600' },
    itemVariant: {
        fontSize: 12,
        color: '#575959',
        marginVertical: 5
    },
    itemQty: { fontWeight: "600", color: "#0f1111" },
    section: { marginBottom: 28, paddingHorizontal: 10 },
    sectionTitle: { fontWeight: "700", fontSize: 14, marginBottom: 6, color: "#444" },
    sectionText: { fontSize: 13, color: "#555" },

    footer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 28,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        gap: 10
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
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#333',
        gap: 8
    },
    buyNowText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default OrderDetailScreen;
