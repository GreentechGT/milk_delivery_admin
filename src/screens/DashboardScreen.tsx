import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import tw from '../lib/tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polyline, Line, Text as SvgText, Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { Bell, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;

// ─── Data ────────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: 'Total Vendors',
    value: '1,284',
    sub: '+12 this week',
    trend: 'up',
    icon: '🏪',
    accent: '#1D4ED8',
    bg: '#EFF6FF',
  },
  {
    label: 'Active Vendors',
    value: '948',
    sub: '73.8% active',
    trend: 'up',
    icon: '✅',
    accent: '#0EA5E9',
    bg: '#F0F9FF',
  },
  {
    label: 'Daily Orders',
    value: '3,401',
    sub: '↑ 2,890 · ↓ 511',
    trend: 'up',
    icon: '📦',
    accent: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    label: 'Subscribers',
    value: '5,210',
    sub: '4,100 mo · 1,110 yr',
    trend: 'up',
    icon: '👥',
    accent: '#2563EB',
    bg: '#EFF6FF',
  },
];

const ORDER_TREND = [120, 180, 140, 220, 190, 260, 310, 280, 340, 390, 360, 420];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const VENDOR_RANKING = [
  { name: 'FreshMart', orders: 580, color: '#1D4ED8' },
  { name: 'QuickBite', orders: 440, color: '#3B82F6' },
  { name: 'SpiceHub', orders: 360, color: '#60A5FA' },
  { name: 'GreenLeaf', orders: 280, color: '#93C5FD' },
  { name: 'UrbanEats', orders: 200, color: '#BFDBFE' },
];

const RECENT_ACTIVITY = [
  { type: 'order', title: 'New order placed', sub: 'FreshMart — ₹1,240', time: '2m ago', dot: '#1D4ED8' },
  { type: 'vendor', title: 'Vendor approved', sub: 'SpiceHub joined the platform', time: '18m ago', dot: '#0EA5E9' },
  { type: 'cancel', title: 'Order cancelled', sub: 'QuickBite — ₹380', time: '45m ago', dot: '#EF4444' },
  { type: 'sub', title: 'New subscriber', sub: 'Yearly plan — Rahul M.', time: '1h ago', dot: '#6366F1' },
  { type: 'order', title: 'Order delivered', sub: 'GreenLeaf — ₹670', time: '2h ago', dot: '#10B981' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const maxOrders = Math.max(...ORDER_TREND);
const chartH = 120;
const pointX = (i: number) => (i / (ORDER_TREND.length - 1)) * CHART_WIDTH;
const pointY = (v: number) => chartH - (v / maxOrders) * chartH;
const polyPoints = ORDER_TREND.map((v, i) => `${pointX(i)},${pointY(v)}`).join(' ');
const areaPath =
  `M${pointX(0)},${chartH} ` +
  ORDER_TREND.map((v, i) => `L${pointX(i)},${pointY(v)}`).join(' ') +
  ` L${pointX(ORDER_TREND.length - 1)},${chartH} Z`;

const maxBar = Math.max(...VENDOR_RANKING.map(v => v.orders));

// ─── Sub-components ──────────────────────────────────────────────────────────

const KpiCard = ({ card, index }: { card: typeof KPI_CARDS[0]; index: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        tw`w-1/2 p-2`,
        { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
      ]}
    >
      <View
        style={[
          tw`rounded-3xl p-5 bg-white border border-slate-100 shadow-sm`,
        ]}
      >
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View style={[tw`w-10 h-10 rounded-2xl items-center justify-center`, { backgroundColor: card.bg }]}>
            <Text style={{ fontSize: 20 }}>{card.icon}</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            {card.trend === 'up' ? <TrendingUp size={14} color="#10B981" /> : <TrendingDown size={14} color="#EF4444" />}
          </View>
        </View>
        <Text style={tw`text-xs font-interMedium text-slate-500 uppercase tracking-wider mb-1`}>
          {card.label}
        </Text>
        <Text style={tw`text-2xl font-geistBold text-slate-900`}>
          {card.value}
        </Text>
        <Text style={tw`text-[10px] font-inter text-slate-400 mt-1`}>{card.sub}</Text>
      </View>
    </Animated.View>
  );
};

const SectionTitle = ({ title, showAll = false }: { title: string; showAll?: boolean }) => (
  <View style={tw`flex-row items-center justify-between mb-4 mt-2 px-2`}>
    <Text style={tw`text-lg font-geistBold text-slate-900 tracking-tight`}>{title}</Text>
    {showAll && (
      <TouchableOpacity style={tw`flex-row items-center`}>
        <Text style={tw`text-xs font-geistBold text-blue-600 mr-1`}>View All</Text>
        <ChevronRight size={14} color="#2563EB" />
      </TouchableOpacity>
    )}
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

const DashboardScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      {/* ── Blue Header ── */}
      <View style={tw`bg-blue-700 px-6 pt-12 pb-6`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View>
            <Text style={tw`text-blue-200 text-xs font-bold uppercase tracking-widest`}>
              Global Overview
            </Text>
            <Text style={tw`text-2xl font-bold text-white mt-1`}>
              Dashboard
            </Text>
            <Text style={tw`text-xs text-blue-200/60 mt-0.5`}>
              Updated: 8 Apr 2026, 11:30 PM
            </Text>
          </View>
          <TouchableOpacity style={tw`w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center`}>
            <Bell size={22} color="#FFF" />
            <View style={tw`absolute top-3 right-3 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-blue-600`} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={tw`pb-12`}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      >
        <View style={tw`px-4 pt-6`}>

          {/* ── KPI Cards ── */}
          <View style={tw`flex-row flex-wrap -mx-2`}>
            {KPI_CARDS.map((card, i) => (
              <KpiCard key={i} card={card} index={i} />
            ))}
          </View>

          {/* ── Orders Trend Chart ── */}
          <View style={tw`mt-6`}>
            <SectionTitle title="Order Analytics" />
            <View style={tw`rounded-3xl p-6 bg-white border border-slate-100 shadow-sm`}>
              <View style={tw`flex-row justify-between mb-6`}>
                <View>
                  <Text style={tw`text-3xl font-geistBold text-slate-900`}>3,401</Text>
                  <View style={tw`flex-row items-center mt-1`}>
                    <TrendingUp size={12} color="#10B981" />
                    <Text style={tw`text-xs font-interMedium text-emerald-500 ml-1`}>+18.4% vs last mo</Text>
                  </View>
                </View>
                <View style={tw`bg-blue-50 px-3 py-1.5 rounded-xl self-start`}>
                  <Text style={tw`text-[10px] font-geistBold text-blue-600`}>MONTHLY VIEW</Text>
                </View>
              </View>

              <Svg width={CHART_WIDTH} height={chartH + 30} style={tw`-mx-0`}>
                <Defs>
                  <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#1D4ED8" stopOpacity="0.15" />
                    <Stop offset="1" stopColor="#1D4ED8" stopOpacity="0" />
                  </LinearGradient>
                </Defs>
                {/* Horizontal Grid lines */}
                {[0, 0.5, 1].map((p, i) => (
                  <Line
                    key={i}
                    x1={0} y1={chartH * p}
                    x2={CHART_WIDTH} y2={chartH * p}
                    stroke="#F1F5F9" strokeWidth={1}
                  />
                ))}
                {/* Area fill */}
                <Path d={areaPath} fill="url(#areaGrad)" />
                {/* Main Line */}
                <Polyline
                  points={polyPoints}
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* Latest Point Circle */}
                <Circle
                  cx={pointX(ORDER_TREND.length - 1)} cy={pointY(ORDER_TREND[ORDER_TREND.length - 1])}
                  r={5}
                  fill="#1D4ED8"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
                {/* Month labels */}
                {MONTHS.filter((_, i) => i % 2 === 0).map((m, idx) => (
                  <SvgText
                    key={m}
                    x={pointX(idx * 2)}
                    y={chartH + 24}
                    fontSize={10}
                    fontFamily="Inter-Medium"
                    fill="#94A3B8"
                    textAnchor="middle"
                  >
                    {m}
                  </SvgText>
                ))}
              </Svg>
            </View>
          </View>

          {/* ── Vendor Ranking ── */}
          <View style={tw`mt-8`}>
            <SectionTitle title="Top Performing Vendors" showAll />
            <View style={tw`rounded-3xl p-6 bg-white border border-slate-100 shadow-sm`}>
              {VENDOR_RANKING.map((v, i) => {
                const barW = (v.orders / maxBar) * (CHART_WIDTH - 120);
                return (
                  <View key={i} style={tw`mb-5`}>
                    <View style={tw`flex-row items-center justify-between mb-2`}>
                      <View style={tw`flex-row items-center`}>
                        <View style={tw`w-6 h-6 rounded-lg bg-slate-50 items-center justify-center mr-2 border border-slate-100`}>
                          <Text style={tw`text-[10px] font-geistBold text-slate-400`}>{i + 1}</Text>
                        </View>
                        <Text style={tw`text-sm font-interSemiBold text-slate-700`}>{v.name}</Text>
                      </View>
                      <Text style={tw`text-xs font-geistBold text-slate-900`}>{v.orders} pkts</Text>
                    </View>
                    <View style={tw`h-2 bg-slate-50 rounded-full overflow-hidden`}>
                      <View
                        style={[tw`h-2 rounded-full`, {
                          width: barW,
                          backgroundColor: v.color,
                        }]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ── Recent Activity ── */}
          <View style={tw`mt-8`}>
            <SectionTitle title="System Feed" showAll />
            <View style={tw`rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden`}>
              {RECENT_ACTIVITY.map((item, i) => (
                <View
                  key={i}
                  style={[
                    tw`flex-row items-center px-5 py-4`,
                    i < RECENT_ACTIVITY.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
                  ]}
                >
                  {/* Indicator */}
                  <View style={[tw`w-1.5 h-1.5 rounded-full mr-4`, { backgroundColor: item.dot }]} />
                  {/* Text */}
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-sm font-interSemiBold text-slate-800`}>
                      {item.title}
                    </Text>
                    <Text style={tw`text-xs font-inter text-slate-400 mt-0.5`}>
                      {item.sub}
                    </Text>
                  </View>
                  {/* Time */}
                  <Text style={tw`text-[10px] font-interMedium text-slate-300`}>{item.time}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;