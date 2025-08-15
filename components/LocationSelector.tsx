import { useAuth } from '@/store/useAuth';
import { MapPin, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LocationSelectorProps {
    visible: boolean;
    onClose: () => void;
}

const locations = [
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Surat, Gujarat',
    'Lucknow, Uttar Pradesh',
    'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh',
    'Thane, Maharashtra',
    'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Pimpri-Chinchwad, Maharashtra',
    'Patna, Bihar',
    'Vadodara, Gujarat',
];

export default function LocationSelector({ visible, onClose }: LocationSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { updateSelectedLocation } = useAuth();

    const filteredLocations = locations.filter(location =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectLocation = async (location: string) => {
        await updateSelectedLocation(location);
        onClose();
    };

    const renderLocationItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={styles.locationItem}
            onPress={() => handleSelectLocation(item)}
        >
            <MapPin size={20} color="#666" />
            <Text style={styles.locationText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Select Location</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Search size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for your city"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="words"
                    />
                </View>

                <FlatList
                    data={filteredLocations}
                    renderItem={renderLocationItem}
                    keyExtractor={(item) => item}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    list: {
        flex: 1,
        paddingHorizontal: 24,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    locationText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
});