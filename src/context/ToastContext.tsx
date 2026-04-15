import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import { Audio } from 'expo-av';
import tw from '../lib/tailwind';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
    showToast: (title: string, message?: string, type?: ToastType) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('success');
    const [isVisible, setIsVisible] = useState(false);
    
    const soundRef = useRef<Audio.Sound | null>(null);
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let isMounted = true;
        async function loadSound() {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    playThroughEarpieceAndroid: false,
                });

                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/notification.m4a'),
                    { shouldPlay: false, volume: 1.0 }
                );
                
                if (isMounted) {
                    soundRef.current = sound;
                } else {
                    await sound.unloadAsync();
                }
            } catch (error) {
                console.log('Error loading toast sound:', error);
            }
        }
        loadSound();
        return () => {
            isMounted = false;
            if (soundRef.current) {
                soundRef.current.unloadAsync();
                soundRef.current = null;
            }
        };
    }, []);

    const playSound = async () => {
        if (soundRef.current) {
            try {
                const status = await soundRef.current.getStatusAsync();
                if (status.isLoaded) {
                    await soundRef.current.stopAsync();
                    await soundRef.current.playAsync();
                }
            } catch (error) {
                console.log('Error playing sound:', error);
            }
        }
    };

    const hideToast = useCallback(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setIsVisible(false);
        });
    }, [translateY, opacity]);

    const showToast = useCallback((t: string, m: string = '', typeVal: ToastType = 'success') => {
        setTitle(t);
        setMessage(m);
        setType(typeVal);
        setIsVisible(true);
        playSound();

        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 20,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();

        setTimeout(hideToast, 4000);
    }, [hideToast, translateY, opacity]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={24} color="#10b981" fill="#ecfdf5" />;
            case 'error': return <XCircle size={24} color="#ef4444" fill="#fef2f2" />;
            case 'info': return <Info size={24} color="#3b82f6" fill="#eff6ff" />;
            default: return <CheckCircle size={24} color="#10b981" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-green-100';
            case 'error': return 'border-red-100';
            case 'info': return 'border-blue-100';
            default: return 'border-gray-100';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <View style={[tw`absolute top-0 left-0 right-0 z-50 items-center`, { pointerEvents: 'none' }]}>
                <SafeAreaView style={tw`w-full items-center`}>
                    <Animated.View
                        style={[
                            tw`flex-row bg-white p-4 rounded-2xl shadow-xl border mx-5 w-[90%]`,
                            tw`${getBorderColor()}`,
                            {
                                transform: [{ translateY }],
                                opacity,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 12,
                                elevation: 8,
                            }
                        ]}
                    >
                        <View style={tw`mr-3 pt-0.5`}>
                            {getIcon()}
                        </View>
                        <View style={tw`flex-1 pr-2`}>
                            <Text style={tw`font-bold text-gray-900 text-sm mb-1`}>{title}</Text>
                            {message ? (
                                <Text style={tw`text-gray-500 text-xs leading-4`}>{message}</Text>
                            ) : null}
                        </View>
                    </Animated.View>
                </SafeAreaView>
            </View>
        </ToastContext.Provider>
    );
};
