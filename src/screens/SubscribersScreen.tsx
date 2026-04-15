import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import tw from '../lib/tailwind';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Droplets,
  PauseCircle,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  Repeat,
} from 'lucide-react-native';

// ─── Mock Data (mirrors your Django models) ───────────────────────────────────

const monthlySubscribers = [
  {
    id: 1,
    user: { name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=47', phone: '+91 98765 43210' },
    plan_name_en: 'Fresh Daily Pack',
    desc_en: 'Premium fresh milk delivered daily',
    frequency_en: 'Daily',
    slot_en: 'Morning',
    status: 'active',
    status_en: 'Active',
    quantity_litres: 2,
    plan_price: '1200.00',
    is_paused: false,
    is_paused_days: 0,
    plan_subscribed_date: '2026-03-10',
    subscription_end_date: '2026-04-10',
    daily_delivery_status: 'delivered',
    daily_delivery_status_en: 'Delivered',
    address: { line1: 'Flat 4B, Sunrise Apts', city: 'Nashik', pincode: '422001' },
  },
  {
    id: 2,
    user: { name: 'Rahul Mehta', avatar: 'https://i.pravatar.cc/150?img=12', phone: '+91 91234 56789' },
    plan_name_en: 'Economy Milk Plan',
    desc_en: 'Affordable daily milk supply',
    frequency_en: 'Alternate Days',
    slot_en: 'Evening',
    status: 'paused',
    status_en: 'Paused',
    quantity_litres: 1,
    plan_price: '650.00',
    is_paused: true,
    is_paused_days: 3,
    plan_subscribed_date: '2026-03-15',
    subscription_end_date: '2026-04-18',
    daily_delivery_status: 'confirmed',
    daily_delivery_status_en: 'Confirmed',
    address: { line1: '12, MG Road', city: 'Nashik', pincode: '422002' },
  },
  {
    id: 3,
    user: { name: 'Ananya Patel', avatar: 'https://i.pravatar.cc/150?img=32', phone: '+91 87654 32109' },
    plan_name_en: 'Family Combo Pack',
    desc_en: 'Large family daily supply',
    frequency_en: 'Daily',
    slot_en: 'Morning',
    status: 'active',
    status_en: 'Active',
    quantity_litres: 3,
    plan_price: '1800.00',
    is_paused: false,
    is_paused_days: 0,
    plan_subscribed_date: '2026-04-01',
    subscription_end_date: '2026-05-01',
    daily_delivery_status: 'on_the_way',
    daily_delivery_status_en: 'On the Way',
    address: { line1: 'B-7, Sai Nagar', city: 'Nashik', pincode: '422003' },
  },
];

const yearlySubscribers = [
  {
    id: 1,
    user: { name: 'Karan Joshi', avatar: 'https://i.pravatar.cc/150?img=68', phone: '+91 99887 76655' },
    plan_name_en: 'Annual Premium Pack',
    desc_en: 'Year-long premium milk supply',
    frequency_en: 'Daily',
    slot_en: 'Morning',
    status: 'active',
    status_en: 'Active',
    quantity_litres: 2,
    plan_price: '13000.00',
    is_paused: false,
    is_paused_days: 0,
    plan_subscribed_date: '2026-01-01',
    subscription_end_date: '2026-12-31',
    daily_delivery_status: 'delivered',
    daily_delivery_status_en: 'Delivered',
    address: { line1: 'Plot 9, Dwarka Colony', city: 'Nashik', pincode: '422005' },
  },
  {
    id: 2,
    user: { name: 'Meera Iyer', avatar: 'https://i.pravatar.cc/150?img=25', phone: '+91 96543 21098' },
    plan_name_en: 'Yearly Saver Plan',
    desc_en: 'Budget yearly subscription',
    frequency_en: 'Daily',
    slot_en: 'Evening',
    status: 'cancelled',
    status_en: 'Cancelled',
    quantity_litres: 1,
    plan_price: '7200.00',
    is_paused: false,
    is_paused_days: 5,
    plan_subscribed_date: '2025-12-01',
    subscription_end_date: '2026-12-06',
    daily_delivery_status: 'confirmed',
    daily_delivery_status_en: 'Confirmed',
    address: { line1: '22A, Panchvati', city: 'Nashik', pincode: '422004' },
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────

const DeliveryBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string; bg: string; Icon: any; label: string }> = {
    delivered: { color: 'text-emerald-700', bg: 'bg-emerald-50', Icon: CheckCircle, label: 'Delivered' },
    on_the_way: { color: 'text-blue-700', bg: 'bg-blue-50', Icon: Truck, label: 'On the Way' },
    confirmed: { color: 'text-amber-700', bg: 'bg-amber-50', Icon: Clock, label: 'Confirmed' },
    cancelled: { color: 'text-red-700', bg: 'bg-red-50', Icon: XCircle, label: 'Cancelled' },
  };
  const c = config[status] ?? config.confirmed;
  return (
    <View style={tw`flex-row items-center gap-1 ${c.bg} px-2 py-1 rounded-lg`}>
      <c.Icon size={11} color={c.color.includes('emerald') ? '#065f46' : c.color.includes('blue') ? '#1d4ed8' : c.color.includes('amber') ? '#92400e' : '#991b1b'} />
      <Text style={tw`${c.color} text-xs font-medium`}>{c.label}</Text>
    </View>
  );
};

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    active: 'bg-emerald-400',
    paused: 'bg-amber-400',
    cancelled: 'bg-red-400',
    inactive: 'bg-slate-300',
  };
  return <View style={tw`w-2 h-2 rounded-full ${colors[status] ?? 'bg-slate-300'}`} />;
};

const InfoRow = ({ icon: Icon, label, value, iconColor = '#3B82F6' }: any) => (
  <View style={tw`flex-row items-center gap-2 mb-1.5`}>
    <Icon size={13} color={iconColor} />
    <Text style={tw`text-slate-400 text-xs`}>{label}:</Text>
    <Text style={tw`text-slate-700 text-xs font-medium flex-1`}>{value}</Text>
  </View>
);

// ─── Subscriber Card ──────────────────────────────────────────────────────────

const SubscriberCard = ({ sub, type }: { sub: any; type: 'monthly' | 'yearly' }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={tw`bg-white rounded-2xl mb-3 shadow-sm overflow-hidden`}>
      {/* Card Header */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={tw`p-4`}
        activeOpacity={0.8}
      >
        <View style={tw`flex-row items-center justify-between`}>
          {/* User Info */}
          <View style={tw`flex-row items-center gap-3 flex-1`}>
            <View style={tw`relative`}>
              <View style={tw`w-11 h-11 rounded-full bg-blue-100 items-center justify-center`}>
                <Text style={tw`text-blue-700 font-bold text-xl`}>
                  {sub.user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={tw`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white items-center justify-center`}>
                <StatusDot status={sub.status} />
              </View>
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-slate-800 font-semibold text-sm`}>{sub.user.name}</Text>
              <Text style={tw`text-slate-400 text-xs`}>{sub.plan_name_en}</Text>
            </View>
          </View>

          {/* Right side */}
          <View style={tw`items-end gap-1`}>
            <Text style={tw`text-blue-700 font-bold text-sm`}>₹{sub.plan_price}</Text>
            <DeliveryBadge status={sub.daily_delivery_status} />
          </View>
        </View>

        {/* Quick Stats Row */}
        <View style={tw`flex-row mt-3 gap-2`}>
          <View style={tw`flex-row items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg`}>
            <Droplets size={11} color="#3B82F6" />
            <Text style={tw`text-blue-700 text-xs font-medium`}>{sub.quantity_litres}L</Text>
          </View>
          <View style={tw`flex-row items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg`}>
            <Repeat size={11} color="#64748B" />
            <Text style={tw`text-slate-600 text-xs`}>{sub.frequency_en}</Text>
          </View>
          <View style={tw`flex-row items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg`}>
            <Clock size={11} color="#64748B" />
            <Text style={tw`text-slate-600 text-xs`}>{sub.slot_en}</Text>
          </View>

          <View style={tw`ml-auto`}>
            {expanded
              ? <ChevronUp size={16} color="#94A3B8" />
              : <ChevronDown size={16} color="#94A3B8" />}
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded Details */}
      {expanded && (
        <View style={tw`px-4 pb-4 border-t border-slate-50 pt-3`}>
          <Text style={tw`text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2`}>
            Subscription Details
          </Text>
          <InfoRow icon={Calendar} label="Subscribed" value={sub.plan_subscribed_date} />
          <InfoRow icon={Calendar} label="Ends On" value={sub.subscription_end_date} />
          <InfoRow icon={Clock} label="Phone" value={sub.user.phone} iconColor="#64748B" />
          <InfoRow icon={MapPin} label="Address" value={`${sub.address.line1}, ${sub.address.city} - ${sub.address.pincode}`} iconColor="#EF4444" />
          <Text style={tw`text-slate-400 text-xs mt-1 leading-4`}>{sub.desc_en}</Text>

          {/* Status Bar */}
          <View style={tw`mt-3 flex-row items-center justify-between bg-blue-50 rounded-xl px-3 py-2`}>
            <Text style={tw`text-blue-600 text-xs font-medium`}>
              {type === 'monthly' ? 'Monthly' : 'Yearly'} · {sub.status_en}
            </Text>
            <View style={tw`flex-row items-center gap-1`}>
              <StatusDot status={sub.status} />
              <Text style={tw`text-xs text-slate-500`}>
                {sub.is_paused ? `Paused ${sub.is_paused_days} days` : 'Running'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const SubscribersScreen = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  const monthlyActive = monthlySubscribers.filter(s => s.status === 'active').length;
  const yearlyActive = yearlySubscribers.filter(s => s.status === 'active').length;
  const monthlyPaused = monthlySubscribers.filter(s => s.is_paused).length;
  const data = activeTab === 'monthly' ? monthlySubscribers : yearlySubscribers;

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      {/* Header */}
      <View style={tw`bg-blue-700 px-5 pt-12 pb-6`}>
        <Text style={tw`text-white text-2xl font-bold tracking-tight mb-1`}>Subscribers</Text>
        <Text style={tw`text-blue-200 text-sm`}>Manage monthly & yearly subscriptions</Text>
      </View>

      {/* Summary Cards */}
      <View style={tw`flex-row mx-4 -mt-5 gap-3`}>
        {[
          { label: 'Monthly Active', value: monthlyActive, color: 'bg-blue-600' },
          { label: 'Yearly Active', value: yearlyActive, color: 'bg-emerald-500' },
          { label: 'Paused', value: monthlyPaused, color: 'bg-amber-500' },
        ].map(({ label, value, color }) => (
          <View key={label} style={tw`flex-1 bg-white rounded-2xl p-3 shadow-sm`}>
            <View style={tw`${color} w-2 h-2 rounded-full mb-2`} />
            <Text style={tw`text-slate-800 text-xl font-bold`}>{value}</Text>
            <Text style={tw`text-slate-400 text-xs`}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={tw`mx-4 mt-4 bg-white rounded-2xl p-1 flex-row shadow-sm`}>
        {(['monthly', 'yearly'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={tw`flex-1 py-2.5 rounded-xl items-center ${activeTab === tab ? 'bg-blue-600' : ''
              }`}
          >
            <Text style={tw`font-semibold text-sm ${activeTab === tab ? 'text-white' : 'text-slate-400'
              }`}>
              {tab === 'monthly'
                ? `Monthly (${monthlySubscribers.length})`
                : `Yearly (${yearlySubscribers.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView
        style={tw`flex-1 mt-3`}
        contentContainerStyle={tw`px-4 pb-8`}
        showsVerticalScrollIndicator={false}
      >
        {data.map((sub) => (
          <SubscriberCard key={sub.id} sub={sub} type={activeTab} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SubscribersScreen;