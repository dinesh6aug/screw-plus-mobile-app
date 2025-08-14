import { Building, Edit3, Home, MapPin, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'John Doe',
    address: '123 Main Street, Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 9876543210',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    name: 'John Doe',
    address: '456 Business Park, Floor 5',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400070',
    phone: '+91 9876543210',
    isDefault: false,
  },
  {
    id: '3',
    type: 'other',
    name: 'Jane Doe',
    address: '789 College Road, Near Metro Station',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    phone: '+91 9876543211',
    isDefault: false,
  },
];

const getAddressIcon = (type: string) => {
  switch (type) {
    case 'home':
      return <Home size={20} color="#333" />;
    case 'work':
      return <Building size={20} color="#333" />;
    default:
      return <MapPin size={20} color="#333" />;
  }
};

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [animatedValues] = useState(() => 
    mockAddresses.reduce((acc, address) => {
      acc[address.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Animated.timing(animatedValues[addressId], {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start(() => {
              setAddresses(prev => prev.filter(addr => addr.id !== addressId));
            });
          },
        },
      ]
    );
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const renderAddressCard = (address: Address) => {
    const scaleValue = animatedValues[address.id];

    return (
      <Animated.View
        key={address.id}
        style={[
          styles.addressCard,
          {
            transform: [{ scale: scaleValue }],
            opacity: scaleValue,
          },
        ]}
      >
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            {getAddressIcon(address.type)}
            <Text style={styles.addressType}>
              {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
            </Text>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          
          <View style={styles.addressActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Edit3 size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteAddress(address.id)}
            >
              <Trash2 size={16} color="#ff4757" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addressContent}>
          <Text style={styles.addressName}>{address.name}</Text>
          <Text style={styles.addressText}>{address.address}</Text>
          <Text style={styles.addressText}>
            {address.city}, {address.state} - {address.pincode}
          </Text>
          <Text style={styles.addressPhone}>Phone: {address.phone}</Text>
        </View>

        {!address.isDefault && (
          <TouchableOpacity 
            style={styles.setDefaultButton}
            onPress={() => handleSetDefault(address.id)}
          >
            <Text style={styles.setDefaultText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Delivery Addresses</Text>
          <Text style={styles.headerSubtitle}>Manage your delivery locations</Text>
        </View>

        <TouchableOpacity style={styles.addAddressButton}>
          <Plus size={20} color="#333" />
          <Text style={styles.addAddressText}>Add New Address</Text>
        </TouchableOpacity>

        <View style={styles.addressesContainer}>
          {addresses.map(renderAddressCard)}
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
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  addressesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: '#2ed573',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  addressContent: {
    padding: 16,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  addressPhone: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 4,
  },
  setDefaultButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  setDefaultText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});