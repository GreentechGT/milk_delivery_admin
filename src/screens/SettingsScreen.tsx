import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import tw from '../lib/tailwind';
import { Settings } from 'lucide-react-native';

const SettingsScreen = () => {
  return (
    <View style={tw`flex-1 bg-blue-50`}>
      {/* ── Blue Header ── */}
      <View style={tw`bg-blue-700 px-6 pt-12 pb-6`}>
        <View>
          <Text style={tw`text-white text-2xl font-bold tracking-tight mb-1`}>Settings</Text>
          <Text style={tw`text-blue-200 text-sm`}>Configure your administrative preferences</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={tw`flex-grow items-center justify-center p-6 -mt-10`}>
        <View style={tw`bg-white rounded-[40px] p-8 items-center shadow-lg border border-blue-50`}>
          <View style={tw`w-24 h-24 rounded-full bg-blue-50 items-center justify-center mb-6`}>
            <Settings size={48} color="#3B82F6" />
          </View>
          <Text style={tw`text-xl font-bold text-slate-900 mb-2`}>Coming Soon</Text>
          <Text style={tw`text-sm text-slate-500 text-center px-4`}>
            System configuration and advanced administrative controls are currently under development.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
