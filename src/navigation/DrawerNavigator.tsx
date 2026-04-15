import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabNavigator from './MainTabNavigator';
import { Menu } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import Sidebar from '../components/Sidebar';

// Screen Imports
import BannersScreen from '../screens/BannersScreen';
import OffersScreen from '../screens/OffersScreen';
import FAQsScreen from '../screens/FAQsScreen';
import SubscribersScreen from '../screens/SubscribersScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: tw`bg-white border-b border-slate-50 shadow-none`,
        headerTitleStyle: tw`font-geistBold text-slate-800`,
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.toggleDrawer()}
            style={tw`ml-4 p-2`}
          >
            <Menu size={22} color="#1d4ed8" />
          </TouchableOpacity>
        ),
        drawerStyle: tw`w-72`,
      })}
    >
      <Drawer.Screen 
        name="MainTab" 
        component={MainTabNavigator} 
        options={{ 
          title: 'Admin Dashboard',
        }}
      />
      
      <Drawer.Screen 
        name="Banners" 
        component={BannersScreen} 
        options={{ title: 'Banners Management' }}
      />
      
      <Drawer.Screen 
        name="Offers" 
        component={OffersScreen} 
        options={{ title: 'Offers & Coupons' }}
      />
      
      <Drawer.Screen 
        name="FAQs" 
        component={FAQsScreen} 
        options={{ title: 'FAQs Management' }}
      />
      
      <Drawer.Screen 
        name="Subscribers" 
        component={SubscribersScreen} 
        options={{ title: 'Subscribers Feed' }}
      />
      
      <Drawer.Screen 
        name="Reviews" 
        component={ReviewsScreen} 
        options={{ title: 'Reviews & Ratings' }}
      />
      
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'System Settings' }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
