import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { store } from './src/store/store';
import { queryClient } from './src/api/queryClient';
import RootNavigator from './src/navigation/RootNavigator';
import tw from './src/lib/tailwind';
import { AlertProvider } from './src/context/AlertContext';
import { ToastProvider } from './src/context/ToastContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    "Geist-Regular": require("./src/assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("./src/assets/fonts/Geist-Medium.ttf"),
    "Geist-Bold": require("./src/assets/fonts/Geist-Bold.ttf"),
    "Inter-Regular": require("./src/assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./src/assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("./src/assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("./src/assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Light": require("./src/assets/fonts/Inter-Light.ttf")
  });

  if (!fontsLoaded) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          <ToastProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </AlertProvider>
      </QueryClientProvider>
    </Provider>
  );
}
