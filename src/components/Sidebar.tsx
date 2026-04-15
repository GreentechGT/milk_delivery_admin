import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import tw from '../lib/tailwind';
import {
  Image as ImageIcon,
  Tag,
  HelpCircle,
  Users,
  Star,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react-native';

/* ─── Menu Config ───────────────────────────────────────────── */

const menuItems = [
  {
    key: 'MainTab',
    label: 'Dashboard',
    icon: LayoutDashboard,
    iconColor: '#FFFFFF',
    bgFrom: '#2563EB',
    bgTo: '#60A5FA',
    accent: '#DBEAFE',
  },
  {
    key: 'Banners',
    label: 'Banners',
    icon: ImageIcon,
    iconColor: '#7C3AED',
    bgFrom: '#EDE9FE',
    bgTo: '#EDE9FE',
    accent: '#7C3AED',
  },
  {
    key: 'Offers',
    label: 'Offers',
    icon: Tag,
    iconColor: '#059669',
    bgFrom: '#D1FAE5',
    bgTo: '#D1FAE5',
    accent: '#059669',
  },
  {
    key: 'FAQs',
    label: 'FAQs',
    icon: HelpCircle,
    iconColor: '#D97706',
    bgFrom: '#FEF3C7',
    bgTo: '#FEF3C7',
    accent: '#D97706',
  },
  {
    key: 'Subscribers',
    label: 'Subscribers',
    icon: Users,
    iconColor: '#0891B2',
    bgFrom: '#CFFAFE',
    bgTo: '#CFFAFE',
    accent: '#0891B2',
  },
  {
    key: 'Reviews',
    label: 'Reviews & Ratings',
    icon: Star,
    iconColor: '#E11D48',
    bgFrom: '#FFE4E6',
    bgTo: '#FFE4E6',
    accent: '#E11D48',
  },
];

/* ─── SidebarRow ────────────────────────────────────────────── */

interface SidebarRowProps {
  item: (typeof menuItems)[number];
  isActive?: boolean;
  onPress?: () => void;
}

const SidebarRow = ({ item, isActive, onPress }: SidebarRowProps) => {
  const IconComponent = item.icon;

  if (isActive) {
    // Dashboard — featured "hero" row
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[
          tw`flex-row items-center px-5 py-4 mb-2 rounded-3xl`,
          {
            backgroundColor: '#2563EB',
            shadowColor: '#2563EB',
            shadowOpacity: 0.45,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          },
        ]}
      >
        {/* Glowing icon */}
        <View
          style={[
            tw`w-11 h-11 rounded-2xl items-center justify-center mr-4`,
            { backgroundColor: 'rgba(255,255,255,0.2)' },
          ]}
        >
          <IconComponent size={20} color="#FFFFFF" strokeWidth={2.2} />
        </View>

        <Text style={tw`flex-1 text-base font-geistBold text-white tracking-wide`}>
          {item.label}
        </Text>

        <View
          style={[
            tw`w-7 h-7 rounded-xl items-center justify-center`,
            { backgroundColor: 'rgba(255,255,255,0.2)' },
          ]}
        >
          <ChevronRight size={14} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </TouchableOpacity>
    );
  }

  // Standard row
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        tw`flex-row items-center px-4 py-3.5 mb-2 rounded-2xl`,
        { backgroundColor: '#FFFFFF' },
      ]}
    >
      {/* Coloured icon bubble */}
      <View
        style={[
          tw`w-10 h-10 rounded-xl items-center justify-center mr-4`,
          { backgroundColor: item.bgFrom },
        ]}
      >
        <IconComponent size={18} color={item.iconColor} strokeWidth={2.2} />
      </View>

      <Text style={tw`flex-1 text-sm font-geistBold text-slate-700`}>
        {item.label}
      </Text>

      <ChevronRight size={15} color="#CBD5E1" strokeWidth={2} />
    </TouchableOpacity>
  );
};

/* ══════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════ */

const Sidebar = (props: DrawerContentComponentProps) => {
  const currentRoute = props.state ? props.state.routes[props.state.index].name : '';

  const handleNavigation = (screen: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate(screen as any);
  };

  return (
    <View style={tw`flex-1`}>
      {/* Deep blue background */}
      <View
        style={[
          tw`absolute inset-0`,
          { backgroundColor: '#EFF6FF' },
        ]}
      />



      <SafeAreaView style={tw`flex-1`} edges={['top', 'bottom', 'left']}>

        {/* ══ HEADER ══════════════════════════════════════ */}
        <View style={tw`px-6 pt-8 pb-7`}>
          {/* Avatar + name row */}
          <View style={tw`flex-row items-center`}>
            <View
              style={[
                tw`w-14 h-14 rounded-2xl items-center justify-center`,
                {
                  backgroundColor: '#2563EB',
                  shadowColor: '#2563EB',
                  shadowOpacity: 0.5,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 5 },
                  elevation: 8,
                },
              ]}
            >
              <ShieldCheck size={26} color="#FFFFFF" strokeWidth={2.5} />
            </View>

            <View style={tw`ml-4 flex-1`}>
              <Text style={tw`text-lg font-geistBold text-slate-800 leading-tight`}>
                Admin Panel
              </Text>
              <View style={tw`flex-row items-center mt-1`}>
                <View style={tw`w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5`} />
                <Text style={tw`text-xs font-interMedium text-slate-500`}>
                  System Administrator
                </Text>
              </View>
            </View>
          </View>

          {/* Role pill */}
          <View
            style={[
              tw`self-start mt-4 px-4 py-1.5 rounded-full`,
              { backgroundColor: '#DBEAFE' },
            ]}
          >
            <Text style={tw`text-[10px] font-geistBold text-blue-700 uppercase tracking-widest`}>
              Root Management
            </Text>
          </View>

          {/* Divider */}
          <View style={tw`mt-6 h-px bg-blue-100`} />
        </View>

        {/* ══ MENU ════════════════════════════════════════ */}
        <ScrollView
          style={tw`flex-1 px-5`}
          contentContainerStyle={tw`pb-12`}
          showsVerticalScrollIndicator={false}
        >
          <Text style={tw`text-[10px] font-geistBold text-slate-400 uppercase tracking-widest mb-3 px-1`}>
            Navigation
          </Text>

          {menuItems.map((item) => (
            <SidebarRow
              key={item.key}
              item={item}
              isActive={item.key === currentRoute}
              onPress={() => handleNavigation(item.key)}
            />
          ))}


        </ScrollView>

      </SafeAreaView>
    </View>
  );
};

export default Sidebar;