import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { 
    AlertCircle, 
    XCircle, 
    Info, 
    AlertTriangle, 
    CheckCircle2, 
    Trash2,
    HelpCircle
} from 'lucide-react-native';
import tw from '../../lib/tailwind';

const { width } = Dimensions.get('window');

export type AlertType = 'error' | 'warning' | 'info' | 'success' | 'confirm' | 'delete';

interface ModernAlertModalProps {
    visible: boolean;
    title: string;
    message: string;
    type?: AlertType;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ModernAlertModal: React.FC<ModernAlertModalProps> = ({
    visible,
    title,
    message,
    type = 'info',
    onClose,
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Cancel',
}) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 7,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.8);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    const getIcon = () => {
        const size = 32;
        switch (type) {
            case 'error':
                return <XCircle size={size} color="#ef4444" />;
            case 'warning':
                return <AlertTriangle size={size} color="#f59e0b" />;
            case 'success':
                return <CheckCircle2 size={size} color="#10b981" />;
            case 'confirm':
                return <HelpCircle size={size} color="#3b82f6" />;
            case 'delete':
                return <Trash2 size={size} color="#ef4444" />;
            case 'info':
            default:
                return <Info size={size} color="#3b82f6" />;
        }
    };

    const getHeaderBg = () => {
        switch (type) {
            case 'error':
            case 'delete':
                return 'bg-red-50';
            case 'warning':
                return 'bg-amber-50';
            case 'success':
                return 'bg-green-50';
            case 'confirm':
            case 'info':
            default:
                return 'bg-blue-50';
        }
    };

    const isDualButton = type === 'confirm' || type === 'delete' || !!onConfirm;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {Platform.OS === 'ios' ? (
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                ) : (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
                )}
                
                <Animated.View
                    style={[
                        tw`w-[85%] bg-white rounded-[32px] overflow-hidden shadow-2xl`,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                            backgroundColor: 'white',
                        },
                    ]}
                >
                    {/* Header Icon */}
                    <View style={tw`items-center pt-8 pb-4 ${getHeaderBg()}`}>
                        <View style={tw`p-4 rounded-3xl bg-white shadow-sm`}>
                            {getIcon()}
                        </View>
                    </View>

                    {/* Content */}
                    <View style={tw`px-6 pt-6 pb-8 items-center`}>
                        <Text style={tw`font-bold text-xl text-gray-900 text-center mb-2`}>
                            {title}
                        </Text>
                        <Text style={tw`text-gray-500 text-center leading-6`}>
                            {message}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={tw`px-6 pb-8 gap-3`}>
                        {isDualButton ? (
                            <View style={tw`flex-row gap-3`}>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={tw`flex-1 py-4 rounded-2xl bg-gray-100 items-center`}
                                >
                                    <Text style={tw`font-bold text-gray-600`}>{cancelText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (onConfirm) onConfirm();
                                        onClose();
                                    }}
                                    style={tw`flex-1 py-4 rounded-2xl ${type === 'delete' ? 'bg-red-500' : 'bg-blue-600'} items-center shadow-lg`}
                                >
                                    <Text style={tw`font-bold text-white`}>{confirmText}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={onClose}
                                style={tw`w-full py-4 rounded-2xl bg-gray-900 items-center shadow-lg`}
                            >
                                <Text style={tw`font-bold text-white`}>{confirmText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});

export default ModernAlertModal;
