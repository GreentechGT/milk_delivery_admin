import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import tw from '../lib/tailwind';
import {
  Search, Filter, MapPin, Phone, Mail,
  CheckCircle, Clock, XCircle, ChevronRight,
  Share2, Star, Building2, Landmark, User,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ─────────────────────────────────────────────────────────────────────

type VendorStatus = 'Approved' | 'Pending' | 'Rejected';

interface Vendor {
  id: string;
  vendor_id: string;

  // Personal Info
  name: string;
  phone: string;
  email: string;
  personal_id_proof: string | null;   // e.g. filename or uri

  // Shop Info
  shop_name: string;
  shop_address: string;
  shop_location: string;
  shop_id_proof: string | null;
  tagline: string | null;
  description: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  banner_image: string | null;
  logo_image: string | null;
  avatar: string;                     // emoji fallback when no logo

  // Business Info
  business_name: string | null;
  gst_number: string | null;
  pan_number: string | null;
  fssai_license: string | null;

  // Bank Info
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  account_type: string | null;
  bank_branch: string | null;

  // Status & Meta
  status: VendorStatus;
  verified: boolean;
  is_active: boolean;
  score: number;
  orders: number;
  joined: string;

  // Performance stats (derived / from backend)
  stats: { label: string; value: string }[];
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const VENDORS: Vendor[] = [
  {
    id: '1',
    vendor_id: 'VEN-2024-4821',
    name: 'Ravi Sharma',
    phone: '+91 98765 43210',
    email: 'freshmart@dairy.in',
    personal_id_proof: 'aadhaar_ravi.jpg',
    shop_name: 'FreshMart Dairy',
    shop_address: '12, Milk Colony Road, Nashik, Maharashtra 422001',
    shop_location: 'Nashik, Maharashtra',
    shop_id_proof: 'shop_reg_freshmart.pdf',
    tagline: 'Fresh dairy, every day',
    description: 'Premium dairy products sourced directly from local farms.',
    website: 'https://freshmartdairy.in',
    instagram: '@freshmartdairy',
    facebook: 'freshmartdairy',
    banner_image: null,
    logo_image: null,
    avatar: '🏪',
    business_name: 'FreshMart Dairy Pvt Ltd',
    gst_number: '27AABCU9603R1ZX',
    pan_number: 'AABCU9603R',
    fssai_license: '10019999000124',
    bank_name: 'State Bank of India',
    account_holder_name: 'Ravi Sharma',
    account_number: '31298765432',
    ifsc_code: 'SBIN0001234',
    account_type: 'Current',
    bank_branch: 'Nashik Main Branch',
    status: 'Approved',
    verified: true,
    is_active: true,
    score: 94,
    orders: 580,
    joined: 'Jan 2024',
    stats: [
      { label: 'Orders', value: '562' },
      { label: 'Rating', value: '4.8 ★' },
      { label: 'Avg Payout', value: '₹4.2k' },
      { label: 'Success', value: '98%' },
    ],
  },
  {
    id: '2',
    vendor_id: 'VEN-2024-3312',
    name: 'Priya Desai',
    phone: '+91 91234 56789',
    email: 'quickbite@farms.in',
    personal_id_proof: 'pan_priya.jpg',
    shop_name: 'QuickBite Farms',
    shop_address: '7, Agro Park, Hadapsar, Pune 411028',
    shop_location: 'Pune, Maharashtra',
    shop_id_proof: 'shop_cert_quickbite.pdf',
    tagline: 'Farm to table, fast',
    description: 'Fresh vegetables and fruits directly from our farm network.',
    website: null,
    instagram: '@quickbitefarms',
    facebook: null,
    banner_image: null,
    logo_image: null,
    avatar: '🐄',
    business_name: 'QuickBite Agri LLP',
    gst_number: '27BBBCQ8812R1ZY',
    pan_number: 'BBBCQ8812R',
    fssai_license: '10019888000231',
    bank_name: 'HDFC Bank',
    account_holder_name: 'Priya Desai',
    account_number: '50100234567890',
    ifsc_code: 'HDFC0001567',
    account_type: 'Current',
    bank_branch: 'Hadapsar Branch',
    status: 'Approved',
    verified: true,
    is_active: true,
    score: 87,
    orders: 440,
    joined: 'Mar 2024',
    stats: [
      { label: 'Orders', value: '418' },
      { label: 'Rating', value: '4.5 ★' },
      { label: 'Avg Payout', value: '₹3.8k' },
      { label: 'Success', value: '96%' },
    ],
  },
  {
    id: '3',
    vendor_id: 'VEN-2024-7791',
    name: 'Arjun Mehta',
    phone: '+91 99887 76655',
    email: 'spicehub@co.in',
    personal_id_proof: null,
    shop_name: 'SpiceHub Co.',
    shop_address: '3, Spice Market Lane, Dadar, Mumbai 400014',
    shop_location: 'Mumbai, Maharashtra',
    shop_id_proof: null,
    tagline: null,
    description: 'Premium whole and ground spices for retailers and restaurants.',
    website: null,
    instagram: null,
    facebook: null,
    banner_image: null,
    logo_image: null,
    avatar: '🌿',
    business_name: null,
    gst_number: null,
    pan_number: 'CCCAM1234X',
    fssai_license: '10019777000312',
    bank_name: 'Axis Bank',
    account_holder_name: 'Arjun Mehta',
    account_number: '91902345671',
    ifsc_code: 'UTIB0003456',
    account_type: 'Savings',
    bank_branch: 'Dadar West',
    status: 'Pending',
    verified: false,
    is_active: true,
    score: 72,
    orders: 360,
    joined: 'Jun 2024',
    stats: [
      { label: 'Orders', value: '340' },
      { label: 'Rating', value: '4.2 ★' },
      { label: 'Avg Payout', value: '₹2.1k' },
      { label: 'Success', value: '92%' },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<VendorStatus, { bg: string; text: string; label: string; icon: any }> = {
  Approved: { bg: '#DCFCE7', text: '#15803D', label: 'Approved', icon: CheckCircle },
  Pending: { bg: '#FEF9C3', text: '#A16207', label: 'Pending Review', icon: Clock },
  Rejected: { bg: '#FEE2E2', text: '#B91C1C', label: 'Rejected', icon: XCircle },
};

const FILTERS: (VendorStatus | 'All')[] = ['All', 'Approved', 'Pending', 'Rejected'];

// Mask sensitive numbers: show last 4 chars only
const mask = (val: string | null, show = 4) =>
  val ? `${'•'.repeat(Math.max(0, val.length - show))}${val.slice(-show)}` : '—';

// ─── Section Header ────────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={tw`text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3 mt-2`}>
    {title}
  </Text>
);

// ─── Info Row ──────────────────────────────────────────────────────────────────

const InfoRow = ({ label, value }: { label: string; value: string | null }) => (
  <View style={tw`flex-row justify-between items-center py-2 border-b border-blue-50`}>
    <Text style={tw`text-xs text-slate-400 flex-1`}>{label}</Text>
    <Text style={tw`text-xs font-semibold text-slate-700 flex-1 text-right`} numberOfLines={1}>
      {value ?? '—'}
    </Text>
  </View>
);

// ─── Badge Row ─────────────────────────────────────────────────────────────────

const BadgeRow = ({ label, uploaded }: { label: string; uploaded: boolean }) => (
  <View style={tw`flex-row justify-between items-center py-2 border-b border-blue-50`}>
    <Text style={tw`text-xs text-slate-400`}>{label}</Text>
    <View style={[tw`px-2 py-0.5 rounded-full`, { backgroundColor: uploaded ? '#DCFCE7' : '#FEF9C3' }]}>
      <Text style={[tw`text-[10px] font-bold`, { color: uploaded ? '#15803D' : '#A16207' }]}>
        {uploaded ? 'UPLOADED' : 'MISSING'}
      </Text>
    </View>
  </View>
);

// ─── Vendor Detail Modal ───────────────────────────────────────────────────────

const VendorDetailModal = ({
  vendor,
  onClose,
}: {
  vendor: Vendor | null;
  onClose: () => void;
}) => {
  if (!vendor) return null;
  const st = STATUS_CONFIG[vendor.status];
  const StatusIcon = st.icon;

  return (
    <Modal transparent visible animationType="slide" onRequestClose={onClose}>
      <View style={tw`flex-1 bg-black/60 justify-end`}>
        <TouchableOpacity style={tw`flex-1`} activeOpacity={1} onPress={onClose} />

        <View style={tw`bg-white rounded-t-[32px] shadow-2xl`} >
          {/* Drag pill */}
          <View style={tw`w-10 h-1.5 bg-slate-200 rounded-full self-center mt-3 mb-1`} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`px-6 pt-4 pb-10`}
            style={{ maxHeight: SCREEN_WIDTH * 1.6 }}
          >
            {/* ── Top Header ── */}
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center mr-3 border border-blue-100`}>
                  <Text style={tw`text-3xl`}>{vendor.avatar}</Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-bold text-slate-900`} numberOfLines={1}>
                    {vendor.shop_name}
                  </Text>
                  <Text style={tw`text-xs text-slate-400`}>{vendor.vendor_id} · Joined {vendor.joined}</Text>
                  <View style={[tw`mt-1 self-start px-2 py-0.5 rounded-full flex-row items-center`, { backgroundColor: st.bg }]}>
                    <StatusIcon size={9} color={st.text} style={tw`mr-1`} />
                    <Text style={[tw`text-[9px] font-bold`, { color: st.text }]}>{st.label.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={tw`p-2 bg-blue-50 rounded-xl border border-blue-100 ml-2`}>
                <Share2 size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            {/* ── Quick Actions ── */}
            <View style={tw`flex-row gap-3 mb-6`}>
              <TouchableOpacity style={tw`flex-1 flex-row items-center justify-center bg-blue-700 py-3.5 rounded-2xl`}>
                <Phone size={16} color="#fff" />
                <Text style={tw`text-sm font-bold text-white ml-2`}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`flex-1 flex-row items-center justify-center bg-blue-50 py-3.5 rounded-2xl border border-blue-100`}>
                <Mail size={16} color="#3B82F6" />
                <Text style={tw`text-sm font-bold text-blue-700 ml-2`}>Email</Text>
              </TouchableOpacity>
            </View>

            {/* ── Personal Info ── */}
            <SectionHeader title="Personal info" />
            <View style={tw`bg-slate-50 rounded-2xl px-4 mb-5`}>
              <InfoRow label="Full name" value={vendor.name} />
              <InfoRow label="Phone" value={vendor.phone} />
              <InfoRow label="Email" value={vendor.email} />
              <BadgeRow label="ID proof" uploaded={!!vendor.personal_id_proof} />
            </View>

            {/* ── Shop Info ── */}
            <SectionHeader title="Shop info" />
            <View style={tw`bg-slate-50 rounded-2xl px-4 mb-5`}>
              <InfoRow label="Shop name" value={vendor.shop_name} />
              <InfoRow label="Address" value={vendor.shop_address} />
              <InfoRow label="Location" value={vendor.shop_location} />
              <InfoRow label="Tagline" value={vendor.tagline} />
              <InfoRow label="Description" value={vendor.description} />
              <InfoRow label="Website" value={vendor.website} />
              <InfoRow label="Instagram" value={vendor.instagram} />
              <InfoRow label="Facebook" value={vendor.facebook} />
              <BadgeRow label="Shop ID proof" uploaded={!!vendor.shop_id_proof} />
              <BadgeRow label="Banner image" uploaded={!!vendor.banner_image} />
              <BadgeRow label="Logo image" uploaded={!!vendor.logo_image} />
            </View>

            {/* ── Business Info ── */}
            <SectionHeader title="Business info" />
            <View style={tw`bg-slate-50 rounded-2xl px-4 mb-5`}>
              <InfoRow label="Business name" value={vendor.business_name} />
              <InfoRow label="GST number" value={vendor.gst_number} />
              <InfoRow label="PAN number" value={vendor.pan_number} />
              <InfoRow label="FSSAI license" value={vendor.fssai_license} />
            </View>

            {/* ── Bank Info ── */}
            <SectionHeader title="Bank info" />
            <View style={tw`bg-slate-50 rounded-2xl px-4 mb-5`}>
              <InfoRow label="Bank name" value={vendor.bank_name} />
              <InfoRow label="Account holder" value={vendor.account_holder_name} />
              <InfoRow label="Account no." value={mask(vendor.account_number)} />
              <InfoRow label="IFSC code" value={vendor.ifsc_code} />
              <InfoRow label="Account type" value={vendor.account_type} />
              <InfoRow label="Branch" value={vendor.bank_branch} />
            </View>

            {/* ── Performance Metrics ── */}
            <SectionHeader title="Performance metrics" />
            <View style={tw`flex-row flex-wrap -mx-1.5 mb-6`}>
              {vendor.stats.map((s, i) => (
                <View key={i} style={tw`w-1/2 p-1.5`}>
                  <View style={tw`bg-slate-50 rounded-2xl p-4 border border-blue-50`}>
                    <Text style={tw`text-[10px] font-bold text-slate-300 uppercase`}>{s.label}</Text>
                    <Text style={tw`text-lg font-bold text-blue-800 mt-1`}>{s.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ── Status Actions ── */}
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity style={tw`flex-1 py-4 rounded-2xl bg-emerald-600 items-center`}>
                <Text style={tw`text-sm font-bold text-white`}>Approve listing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`flex-1 py-4 rounded-2xl bg-red-50 border border-red-100 items-center`}>
                <Text style={tw`text-sm font-bold text-red-600`}>Decline</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ─── Vendor Row ────────────────────────────────────────────────────────────────

const VendorRow = ({ vendor, onView }: { vendor: Vendor; onView: (v: Vendor) => void }) => {
  const st = STATUS_CONFIG[vendor.status];
  const StatusIcon = st.icon;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onView(vendor)}
      style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-blue-50`}
    >
      <View style={tw`flex-row items-center mb-4`}>
        <View style={tw`w-12 h-12 rounded-xl bg-blue-50 items-center justify-center mr-4 border border-blue-100`}>
          <Text style={tw`text-2xl`}>{vendor.avatar}</Text>
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-bold text-slate-900`}>{vendor.shop_name}</Text>
          <View style={tw`flex-row items-center mt-0.5`}>
            <MapPin size={11} color="#60A5FA" />
            <Text style={tw`text-xs text-slate-400 ml-1`}>{vendor.shop_location}</Text>
          </View>
        </View>
        <View style={[tw`px-2.5 py-1 rounded-full flex-row items-center`, { backgroundColor: st.bg }]}>
          <StatusIcon size={10} color={st.text} style={tw`mr-1`} />
          <Text style={[tw`text-[10px] font-bold`, { color: st.text }]}>{st.label.toUpperCase()}</Text>
        </View>
      </View>

      <View style={tw`flex-row items-center justify-between border-t border-blue-50 pt-4`}>
        <View>
          <Text style={tw`text-[10px] font-bold text-slate-300 uppercase`}>Total Orders</Text>
          <Text style={tw`text-sm font-bold text-slate-700 mt-0.5`}>{vendor.orders} batches</Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`text-[10px] font-bold text-slate-300 uppercase`}>Score</Text>
          <View style={tw`flex-row items-center mt-0.5`}>
            <Star size={11} color="#EAB308" fill="#EAB308" />
            <Text style={tw`text-sm font-bold text-slate-700 ml-1`}>{vendor.score}%</Text>
          </View>
        </View>
        <View style={tw`items-end`}>
          <View style={tw`w-8 h-8 rounded-full bg-blue-50 items-center justify-center`}>
            <ChevronRight size={16} color="#3B82F6" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

const VendorsScreen = () => {
  const [vendors] = useState<Vendor[]>(VENDORS);
  const [activeFilter, setActiveFilter] = useState<VendorStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const filtered = vendors.filter(v => {
    const matchFilter = activeFilter === 'All' || v.status === activeFilter;
    const searchLower = search?.toLowerCase() || '';
    const matchSearch =
      (v.shop_name || '').toLowerCase().includes(searchLower) ||
      (v.name || '').toLowerCase().includes(searchLower) ||
      (v.shop_location || '').toLowerCase().includes(searchLower);
    return matchFilter && matchSearch;
  });

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`bg-blue-700 px-6 pt-12 pb-6`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={tw`text-white text-2xl font-bold tracking-tight mb-1`}>Vendors</Text>
              <Text style={tw`text-blue-200 text-sm`}>Manage delivery partner network</Text>
            </View>
            <TouchableOpacity style={tw`w-10 h-10 rounded-xl bg-blue-600 items-center justify-center`}>
              <Filter size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={tw`flex-row mx-6 -mt-5 gap-3`}>
          {[
            { label: 'Total', value: vendors.length, color: 'bg-blue-600' },
            { label: 'Live', value: vendors.filter(v => v.status === 'Approved').length, color: 'bg-emerald-500' },
            { label: 'Wait', value: vendors.filter(v => v.status === 'Pending').length, color: 'bg-amber-500' },
            { label: 'Off', value: vendors.filter(v => v.status === 'Rejected').length, color: 'bg-red-400' },
          ].map(({ label, value, color }) => (
            <View key={label} style={tw`flex-1 bg-white rounded-2xl p-3 shadow-sm`}>
              <View style={tw`${color} w-2 h-2 rounded-full mb-1.5`} />
              <Text style={tw`text-slate-800 text-lg font-bold`}>{value}</Text>
              <Text style={tw`text-slate-400 text-[10px] uppercase font-bold`}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Filter Tabs */}
        <View style={tw`px-6 mt-4`}>
          <View style={tw`bg-white rounded-2xl p-1.5 flex-row shadow-sm`}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={tw`flex-1 py-2.5 rounded-xl items-center ${activeFilter === f ? 'bg-blue-600' : ''}`}
              >
                <Text style={tw`font-bold text-xs uppercase ${activeFilter === f ? 'text-white' : 'text-slate-400'}`}>
                  {f === 'All' ? `All (${vendors.length})` : f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* List */}
        <View style={tw`px-6 pt-4 pb-10`}>
          {filtered.length === 0 ? (
            <View style={tw`items-center justify-center py-16`}>
              <View style={tw`w-16 h-16 rounded-2xl bg-blue-100 items-center justify-center mb-4`}>
                <Clock size={28} color="#2563EB" />
              </View>
              <Text style={tw`text-base font-bold text-slate-700 mb-1`}>No vendors found</Text>
              <Text style={tw`text-sm text-slate-400 text-center`}>Try a different search or filter.</Text>
            </View>
          ) : (
            filtered.map(vendor => (
              <VendorRow key={vendor.id} vendor={vendor} onView={setSelectedVendor} />
            ))
          )}
        </View>
      </ScrollView>

      <VendorDetailModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
    </View>
  );
};

export default VendorsScreen;