import { Colors } from '@/constants/Colors';
import { useAuth } from '@/store/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { forgotPassword } = useAuth();

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        const result = await forgotPassword(email.trim());
        setIsLoading(false);

        if (result.success) {
            Alert.alert(
                'Reset Email Sent',
                'Please check your email for password reset instructions.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } else {
            Alert.alert('Error', result.error || 'An error occurred');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Enter your email address and we will send you a link to reset your password.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Mail size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                testID="email-input"
                                placeholderTextColor={Colors.light.placeholderTextColor}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleResetPassword}
                            disabled={isLoading}
                            style={styles.resetButton}
                            testID="reset-button"
                        >
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.resetButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.resetButtonText}>
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </Text>
                                <ArrowRight size={20} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Remember your password? </Text>
                    <TouchableOpacity onPress={handleBack}>
                        <Text style={styles.backToLoginText}>Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#f9f9f9',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: '#333',
    },
    resetButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    resetButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginRight: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    footerText: {
        fontSize: 16,
        color: '#666',
    },
    backToLoginText: {
        fontSize: 16,
        color: '#667eea',
        fontWeight: '600',
    },
});