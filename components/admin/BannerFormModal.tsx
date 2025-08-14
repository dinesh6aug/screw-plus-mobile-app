import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { X, Save } from 'lucide-react-native';
import { useFirebaseData } from '@/store/useFirebaseData';
import { Banner } from '@/types/product';

interface BannerFormModalProps {
  visible: boolean;
  banner: Banner | null;
  onClose: () => void;
}

export default function BannerFormModal({ visible, banner, onClose }: BannerFormModalProps) {
  const { addBanner, updateBanner } = useFirebaseData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    cta: 'Shop Now'
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        cta: banner.cta
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        cta: 'Shop Now'
      });
    }
  }, [banner]);

  const handleSave = async () => {
    if (!formData.title || !formData.subtitle || !formData.image || !formData.cta) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const bannerData: Omit<Banner, 'id'> = {
        title: formData.title,
        subtitle: formData.subtitle,
        image: formData.image,
        cta: formData.cta
      };

      if (banner) {
        await updateBanner(banner.id, bannerData);
        Alert.alert('Success', 'Banner updated successfully');
      } else {
        await addBanner(bannerData);
        Alert.alert('Success', 'Banner added successfully');
      }
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {banner ? 'Edit Banner' : 'Add Banner'}
          </Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Save size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
          <View style={styles.field}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="e.g. New Collection, Summer Sale"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Subtitle *</Text>
            <TextInput
              style={styles.input}
              value={formData.subtitle}
              onChangeText={(text) => setFormData({ ...formData, subtitle: text })}
              placeholder="e.g. Up to 50% Off, Fresh Styles"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Image URL *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
              placeholder="https://example.com/banner-image.jpg"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Call to Action *</Text>
            <TextInput
              style={styles.input}
              value={formData.cta}
              onChangeText={(text) => setFormData({ ...formData, cta: text })}
              placeholder="e.g. Shop Now, Explore, Discover"
            />
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewMainTitle}>{formData.title || 'Banner Title'}</Text>
              <Text style={styles.previewSubtitle}>{formData.subtitle || 'Banner Subtitle'}</Text>
              <View style={styles.previewButton}>
                <Text style={styles.previewButtonText}>{formData.cta || 'Shop Now'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937'
  },
  saveButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center'
  },
  form: {
    flex: 1
  },
  formContent: {
    padding: 20
  },
  field: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  previewSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12
  },
  previewCard: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center'
  },
  previewMainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8
  },
  previewSubtitle: {
    fontSize: 16,
    color: '#FEF3C7',
    textAlign: 'center',
    marginBottom: 16
  },
  previewButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B'
  }
});