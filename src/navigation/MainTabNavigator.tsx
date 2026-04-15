import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import VendorsScreen from '../screens/VendorsScreen';
import SupportScreen from '../screens/SupportScreen';
import { LayoutDashboard, Users, Headphones } from 'lucide-react-native';
import tw from '../lib/tailwind';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tw`bg-white border-t border-slate-100 h-20 pb-2`,
        tabBarActiveTintColor: '#2563eb', // blue-600
        tabBarInactiveTintColor: '#94a3b8', // slate-400
        tabBarLabelStyle: tw`font-interMedium text-xs`,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Vendors"
        component={VendorsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Support"
        component={SupportScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Headphones size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
