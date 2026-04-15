import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useAlert } from '../context/AlertContext';
import { useToast } from '../context/ToastContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../lib/tailwind';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  Tag,
  Search,
  Copy,
  ToggleLeft,
  ToggleRight,
  Percent,
  IndianRupee,
  Check,
} from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

type OfferType = 'Coupon' | 'Bank' | 'Exclusive';
type DiscountType = 'percentage' | 'flat';

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Offer {
  id: number;
  type: OfferType;
  code: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  expiry_text: string;
  color: string;
  category: string;
  min_order_value: string;
  discount_type: DiscountType;
  discount_value: string;
  max_discount: string;
  applicable_categories: string[];
  product: Product | null;
  image: string;
  is_active: boolean;
  created_at: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Organic Wheat Flour', sku: 'WF-001' },
  { id: 2, name: 'Brown Rice', sku: 'BR-002' },
  { id: 3, name: 'Sunflower Oil', sku: 'SO-003' },
  { id: 4, name: 'Basmati Rice', sku: 'BAS-004' },
  { id: 5, name: 'Mustard Oil', sku: 'MO-005' },
  { id: 6, name: 'Toor Dal', sku: 'TD-006' },
];

const CATEGORY_OPTIONS = ['Grains', 'Oils', 'Dals', 'Spices', 'Beverages', 'Snacks'];

const INITIAL_OFFERS: Offer[] = [
  {
    id: 1,
    type: 'Coupon',
    code: 'SAVE20',
    title_en: 'Flat 20% Off',
    title_hi: '20% की छूट',
    description_en: 'Get 20% off on orders above ₹500. Valid on all grocery items.',
    description_hi: '₹500 से अधिक के ऑर्डर पर 20% छूट।',
    expiry_text: 'Valid till 30 Apr 2025',
    color: '#3b82f6',
    category: 'Grains',
    min_order_value: '500',
    discount_type: 'percentage',
    discount_value: '20',
    max_discount: '150',
    applicable_categories: ['Grains', 'Dals'],
    product: null,
    image: '',
    is_active: true,
    created_at: '2025-04-01T10:00:00Z',
  },
  {
    id: 2,
    type: 'Bank',
    code: 'HDFC10',
    title_en: 'HDFC Bank 10% Off',
    title_hi: 'HDFC बैंक 10% छूट',
    description_en: 'Exclusive 10% cashback for HDFC credit card users.',
    description_hi: 'HDFC क्रेडिट कार्ड उपयोगकर्ताओं के लिए 10% कैशबैक।',
    expiry_text: 'Valid till 31 May 2025',
    color: '#8b5cf6',
    category: 'Oils',
    min_order_value: '300',
    discount_type: 'percentage',
    discount_value: '10',
    max_discount: '100',
    applicable_categories: ['Oils'],
    product: MOCK_PRODUCTS[2],
    image: '',
    is_active: true,
    created_at: '2025-04-03T12:00:00Z',
  },
  {
    id: 3,
    type: 'Exclusive',
    code: '',
    title_en: 'Dal Festival Offer',
    title_hi: 'दाल महोत्सव',
    description_en: 'Flat ₹50 off on all dal purchases above ₹250.',
    description_hi: '₹250 से अधिक की दाल खरीद पर ₹50 की छूट।',
    expiry_text: 'Limited time offer',
    color: '#f59e0b',
    category: 'Dals',
    min_order_value: '250',
    discount_type: 'flat',
    discount_value: '50',
    max_discount: '',
    applicable_categories: ['Dals'],
    product: MOCK_PRODUCTS[5],
    image: '',
    is_active: false,
    created_at: '2025-04-05T09:00:00Z',
  },
];

const EMPTY_OFFER: Omit<Offer, 'id' | 'created_at'> = {
  type: 'Coupon',
  code: '',
  title_en: '',
  title_hi: '',
  description_en: '',
  description_hi: '',
  expiry_text: '',
  color: '#3b82f6',
  category: '',
  min_order_value: '',
  discount_type: 'percentage',
  discount_value: '',
  max_discount: '',
  applicable_categories: [],
  product: null,
  image: '',
  is_active: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<OfferType, { bg: string; text: string; border: string }> = {
  Coupon: { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
  Bank: { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' },
  Exclusive: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
};

// ─── Shared Sub-components ────────────────────────────────────────────────────

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={tw`flex-row justify-between mb-2`}>
    <Text style={tw`text-xs text-slate-400 w-32`}>{label}</Text>
    <Text style={tw`text-xs text-slate-700 flex-1 text-right`} numberOfLines={1}>{value}</Text>
  </View>
);

const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}) => (
  <View style={tw`mb-4`}>
    <Text style={tw`text-xs text-slate-500 mb-1.5`}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      multiline={multiline}
      keyboardType={keyboardType}
      style={[
        tw`bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-sm text-slate-800`,
        multiline && tw`h-20`,
      ]}
    />
  </View>
);

// ─── Product Picker ───────────────────────────────────────────────────────────

const ProductPickerModal = ({
  visible,
  selected,
  onClose,
  onSave,
}: {
  visible: boolean;
  selected: Product | null;
  onClose: () => void;
  onSave: (p: Product | null) => void;
}) => {
  const [search, setSearch] = useState('');
  const [pick, setPick] = useState<Product | null>(selected);

  const filtered = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={tw`flex-1 bg-white`}>
        {/* Modal header — blue strip */}
        <View style={tw`bg-blue-700 px-4 pt-4 pb-4`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-base font-bold text-white`}>Select Product</Text>
            <View style={tw`flex-row items-center gap-3`}>
              <TouchableOpacity
                onPress={() => { onSave(pick); onClose(); }}
                style={tw`bg-white px-4 py-1.5 rounded-full`}
              >
                <Text style={tw`text-xs font-semibold text-blue-700`}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar inside header */}
          <View style={tw`flex-row items-center bg-blue-600 rounded-xl px-3 py-2 gap-2 mt-3`}>
            <Search size={14} color="#93C5FD" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search products..."
              placeholderTextColor="#93C5FD"
              style={tw`flex-1 text-sm text-white`}
            />
          </View>
        </View>
        {/* None option */}
        <TouchableOpacity
          onPress={() => setPick(null)}
          style={tw`flex-row items-center justify-between px-4 py-3 border-b border-slate-50`}
        >
          <Text style={tw`text-sm font-inter text-slate-500 italic`}>None</Text>
          {pick === null && <Check size={14} color="#2563EB" />}
        </TouchableOpacity>
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={tw`px-4 pb-6`}
          renderItem={({ item }) => {
            const isSel = pick?.id === item.id;
            return (
              <TouchableOpacity
                onPress={() => setPick(item)}
                style={tw`flex-row items-center justify-between py-3 border-b border-slate-50`}
              >
                <View>
                  <Text style={tw`text-sm font-inter text-slate-800`}>{item.name}</Text>
                  <Text style={tw`text-xs font-inter text-slate-400`}>{item.sku}</Text>
                </View>
                <View style={[tw`w-6 h-6 rounded-full border items-center justify-center`, isSel ? tw`bg-blue-600 border-blue-600` : tw`border-slate-300`]}>
                  {isSel && <Check size={12} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

// ─── Offer Form Modal ─────────────────────────────────────────────────────────

const OfferFormModal = ({
  visible,
  offer,
  onClose,
  onSave,
}: {
  visible: boolean;
  offer: Offer | null;
  onClose: () => void;
  onSave: (data: Partial<Offer>) => void;
}) => {
  const { showAlert } = useAlert();
  const isEdit = !!offer?.id;
  const [form, setForm] = useState<Partial<Offer>>(offer || EMPTY_OFFER);
  const [showProductPicker, setShowProductPicker] = useState(false);

  React.useEffect(() => { setForm(offer || EMPTY_OFFER); }, [offer]);

  const set = (field: keyof Offer, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleCategory = (cat: string) => {
    const cats = form.applicable_categories || [];
    set('applicable_categories', cats.includes(cat) ? cats.filter((c) => c !== cat) : [...cats, cat]);
  };

  const handleSave = () => {
    if (!form.title_en?.trim()) {
      showAlert({
        title: 'Validation',
        message: 'Title (English) is required.',
        type: 'warning'
      });
      return;
    }
    if (!form.discount_value?.toString().trim()) {
      showAlert({
        title: 'Validation',
        message: 'Discount value is required.',
        type: 'warning'
      });
      return;
    }
    if (!form.expiry_text?.trim()) {
      showAlert({
        title: 'Validation',
        message: 'Expiry text is required.',
        type: 'warning'
      });
      return;
    }
    onSave(form);
    onClose();
  };

  const OFFER_TYPES: OfferType[] = ['Coupon', 'Bank', 'Exclusive'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={tw`flex-1 bg-blue-50`} edges={['top']}>
        {/* Modal header — blue strip */}
        <View style={tw`bg-blue-700 px-5 pt-4 pb-5`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={tw`text-white text-lg font-bold`}>
                {isEdit ? 'Edit Offer' : 'New Offer'}
              </Text>
              <Text style={tw`text-blue-200 text-xs mt-0.5`}>
                {isEdit ? 'Update offer details' : 'Fill in the details below'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={tw`w-8 h-8 rounded-full bg-blue-600 items-center justify-center`}
            >
              <X size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`flex-1`}
          keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : 0}
        >
          <ScrollView contentContainerStyle={tw`px-4 py-5 pb-10`} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Same content as before... */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                🎁 Offer Type
              </Text>
              <View style={tw`flex-row gap-2 mb-4`}>
                {OFFER_TYPES.map((t) => {
                  const meta = TYPE_META[t];
                  const active = form.type === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => set('type', t)}
                      style={[
                        tw`flex-1 py-1.5 rounded-xl border items-center`,
                        { backgroundColor: active ? meta.bg : '#F8FAFC', borderColor: active ? meta.border : '#E2E8F0' },
                      ]}
                    >
                      <Text style={[tw`text-[10px] font-bold uppercase`, { color: active ? meta.text : '#94A3B8' }]}>{t}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {(form.type === 'Coupon' || form.type === 'Bank') && (
                <FormField label="Coupon Code" value={form.code || ''} onChangeText={(v) => set('code', v.toUpperCase())} placeholder="e.g. SAVE20" />
              )}
            </View>

            {/* English Section */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                🇬🇧 English Content
              </Text>
              <FormField label="Title (English) *" value={form.title_en || ''} onChangeText={(v) => set('title_en', v)} placeholder="e.g. Flat 20% Off" />
              <FormField label="Description (English) *" value={form.description_en || ''} onChangeText={(v) => set('description_en', v)} placeholder="Describe the offer..." multiline />
            </View>

            {/* Hindi Section */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                🇮🇳 Hindi Content
              </Text>
              <FormField label="Title (Hindi)" value={form.title_hi || ''} onChangeText={(v) => set('title_hi', v)} placeholder="e.g. 20% की छूट" />
              <FormField label="Description (Hindi)" value={form.description_hi || ''} onChangeText={(v) => set('description_hi', v)} placeholder="विवरण..." multiline />
            </View>

            {/* Discount Section */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                💰 Discount Details
              </Text>
              <View style={tw`flex-row gap-2 mb-4`}>
                {(['percentage', 'flat'] as DiscountType[]).map((dt) => (
                  <TouchableOpacity
                    key={dt}
                    onPress={() => set('discount_type', dt)}
                    style={[
                      tw`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl border`,
                      form.discount_type === dt ? tw`bg-blue-600 border-blue-600` : tw`bg-blue-50 border-blue-100`,
                    ]}
                  >
                    {dt === 'percentage'
                      ? <Percent size={13} color={form.discount_type === dt ? '#fff' : '#3B82F6'} />
                      : <IndianRupee size={13} color={form.discount_type === dt ? '#fff' : '#3B82F6'} />}
                    <Text style={[tw`text-xs font-bold capitalize`, form.discount_type === dt ? tw`text-white` : tw`text-blue-600`]}>
                      {dt === 'percentage' ? 'Percent' : 'Flat'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={tw`flex-row gap-3`}>
                <View style={tw`flex-1`}>
                  <FormField label={`Value ${form.discount_type === 'percentage' ? '(%)' : '(₹)'} *`} value={form.discount_value || ''} onChangeText={(v) => set('discount_value', v)} placeholder="20" keyboardType="numeric" />
                </View>
                <View style={tw`flex-1`}>
                  <FormField label="Max Disc (₹)" value={form.max_discount || ''} onChangeText={(v) => set('max_discount', v)} placeholder="150" keyboardType="numeric" />
                </View>
              </View>

              <FormField label="Min Order Value (₹)" value={form.min_order_value || ''} onChangeText={(v) => set('min_order_value', v)} placeholder="e.g. 500" keyboardType="numeric" />
            </View>

            {/* Other Details Section */}
            <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                ℹ️ Other Details
              </Text>
              <View style={tw`flex-row gap-3`}>
                <View style={tw`flex-1`}>
                  <FormField label="Expiry Text *" value={form.expiry_text || ''} onChangeText={(v) => set('expiry_text', v)} placeholder="e.g. 30 Apr" />
                </View>
                <View style={tw`flex-1`}>
                  <FormField label="Hex Color" value={form.color || ''} onChangeText={(v) => set('color', v)} placeholder="#3B82F6" />
                </View>
              </View>
              <FormField label="Image URL" value={form.image || ''} onChangeText={(v) => set('image', v)} placeholder="https://..." />

              <Text style={tw`text-xs text-slate-500 mb-2 mt-1`}>Linked Product</Text>
              <TouchableOpacity
                onPress={() => setShowProductPicker(true)}
                style={tw`flex-row items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4`}
              >
                <Text style={tw`text-sm text-blue-700 font-medium`}>
                  {form.product ? form.product.name : 'Select product (optional)'}
                </Text>
                <ChevronDown size={16} color="#2563EB" />
              </TouchableOpacity>

              <View style={tw`flex-row items-center justify-between bg-blue-50 rounded-xl px-4 py-3`}>
                <Text style={tw`text-sm text-slate-700 font-medium`}>Offer Active</Text>
                <Switch
                  value={form.is_active ?? true}
                  onValueChange={(v) => set('is_active', v)}
                  trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                  thumbColor={form.is_active ? '#2563EB' : '#94A3B8'}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              style={tw`bg-blue-700 rounded-2xl py-4 items-center shadow-sm`}
            >
              <Text style={tw`text-base font-bold text-white`}>
                {isEdit ? 'Save Changes' : 'Create Offer'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        <ProductPickerModal
          visible={showProductPicker}
          selected={form.product || null}
          onClose={() => setShowProductPicker(false)}
          onSave={(p) => set('product', p)}
        />
      </SafeAreaView>
    </Modal>
  );
};

// ─── Offer Card ───────────────────────────────────────────────────────────────

const OfferCard = ({
  offer,
  onEdit,
  onDelete,
  onToggle,
}: {
  offer: Offer;
  onEdit: (o: Offer) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) => {
  const { showToast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const meta = TYPE_META[offer.type];

  const discountLabel =
    offer.discount_type === 'percentage'
      ? `${offer.discount_value}% off`
      : `₹${offer.discount_value} off`;

  const handleCopy = () => {
    showToast('Copied', `Code "${offer.code}" copied to clipboard.`, 'info');
  };

  return (
    <View style={tw`bg-white rounded-2xl mb-3 shadow-sm overflow-hidden`}>
      {/* Color bar */}
      <View style={[tw`h-1 w-full`, { backgroundColor: offer.color || '#3b82f6' }]} />

      <View style={tw`p-4`}>
        {/* Top row */}
        <View style={tw`flex-row items-start justify-between mb-3`}>
          <View style={tw`flex-1 mr-3`}>
            <View style={tw`flex-row items-center gap-2 flex-wrap mb-1.5`}>
              {/* Type badge */}
              <View style={[tw`px-2 py-0.5 rounded-full border`, { backgroundColor: meta.bg, borderColor: meta.border }]}>
                <Text style={[tw`text-[10px] font-bold uppercase`, { color: meta.text }]}>{offer.type}</Text>
              </View>
              {/* Active badge */}
              <View style={[tw`px-2 py-0.5 rounded-full`, { backgroundColor: offer.is_active ? '#DBEAFE' : '#F1F5F9' }]}>
                <Text style={[tw`text-[10px] font-bold uppercase`, { color: offer.is_active ? '#1D4ED8' : '#64748B' }]}>
                  {offer.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
              {/* Discount badge */}
              <View style={tw`bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full`}>
                <Text style={tw`text-[10px] font-bold uppercase text-emerald-700`}>{discountLabel}</Text>
              </View>
            </View>
            <Text style={tw`text-base font-semibold text-slate-900`}>{offer.title_en}</Text>
            <Text style={tw`text-xs text-slate-400 mt-0.5`}>{offer.expiry_text}</Text>
          </View>

          {/* Actions */}
          <View style={tw`flex-row items-center gap-2`}>
            <TouchableOpacity onPress={() => onToggle(offer.id)} style={tw`w-8 h-8 rounded-full items-center justify-center bg-blue-50`}>
              {offer.is_active ? <ToggleRight size={16} color="#2563EB" /> : <ToggleLeft size={16} color="#94A3B8" />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEdit(offer)} style={tw`w-8 h-8 rounded-full items-center justify-center bg-blue-50`}>
              <Edit2 size={16} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(offer.id)} style={tw`w-8 h-8 rounded-full items-center justify-center bg-red-50`}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Coupon code row */}
        {offer.code ? (
          <TouchableOpacity
            onPress={handleCopy}
            style={tw`flex-row items-center gap-2 self-start bg-blue-50 border border-dashed border-blue-300 rounded-lg px-3 py-1.5 mb-3`}
          >
            <Tag size={12} color="#2563EB" />
            <Text style={tw`text-sm font-bold text-blue-700 tracking-widest uppercase`}>{offer.code}</Text>
            <Copy size={11} color="#3B82F6" />
          </TouchableOpacity>
        ) : null}

        {/* Description */}
        <Text style={tw`text-xs text-slate-500 mb-3`} numberOfLines={2}>
          {offer.description_en}
        </Text>

        {/* Min order & max discount chips */}
        <View style={tw`flex-row gap-2 flex-wrap`}>
          {offer.min_order_value ? (
            <View style={tw`bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1`}>
              <Text style={tw`text-[10px] font-bold text-slate-500`}>MIN ₹{offer.min_order_value}</Text>
            </View>
          ) : null}
          {offer.max_discount ? (
            <View style={tw`bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1`}>
              <Text style={tw`text-[10px] font-bold text-slate-500`}>UPTO ₹{offer.max_discount}</Text>
            </View>
          ) : null}
          {offer.product ? (
            <View style={tw`bg-blue-600 rounded-full px-2.5 py-1 flex-row items-center gap-1`}>
              <Check size={10} color="#fff" />
              <Text style={tw`text-[10px] font-bold text-white uppercase`}>{offer.product.name}</Text>
            </View>
          ) : null}
        </View>

        {/* Expand */}
        <TouchableOpacity
          onPress={() => setExpanded((v) => !v)}
          style={tw`flex-row items-center gap-1 mt-3.5 self-start`}
        >
          <Text style={tw`text-xs text-blue-400 font-medium`}>
            {expanded ? 'Hide details' : 'Show Hindi & category'}
          </Text>
          <ChevronDown size={12} color="#60A5FA" style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }} />
        </TouchableOpacity>

        {expanded && (
          <View style={tw`mt-3.5 pt-3.5 border-t border-blue-50`}>
            <Row label="Title (HI)" value={offer.title_hi || '—'} />
            <Row label="Desc (HI)" value={offer.description_hi || '—'} />
            <Row label="Category" value={offer.category || '—'} />
            <Row label="Applicable" value={offer.applicable_categories.join(', ') || '—'} />
            <Row label="Created" value={new Date(offer.created_at).toLocaleDateString('en-IN')} />
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'Coupon' | 'Bank' | 'Exclusive';

const OffersScreen = () => {
  const { showAlert } = useAlert();
  const { showToast } = useToast();
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const nextId = Math.max(0, ...offers.map((o) => o.id)) + 1;

  const filtered = offers.filter((o) => {
    const matchSearch =
      o.title_en.toLowerCase().includes(search.toLowerCase()) ||
      o.code?.toLowerCase().includes(search.toLowerCase()) ||
      o.category?.toLowerCase().includes(search.toLowerCase());
    const matchTab = filterTab === 'all' || o.type === filterTab;
    return matchSearch && matchTab;
  });

  const handleSave = (data: Partial<Offer>) => {
    if (data.id) {
      setOffers((prev) => prev.map((o) => (o.id === data.id ? { ...o, ...data } : o)));
    } else {
      setOffers((prev) => [...prev, { ...(data as any), id: nextId, created_at: new Date().toISOString() }]);
    }
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: 'Delete Offer',
      message: 'Are you sure you want to delete this offer?',
      type: 'delete',
      onConfirm: () => {
        setOffers((prev) => prev.filter((o) => o.id !== id));
        showToast('Deleted', 'Offer removed successfully.', 'info');
      }
    });
  };

  const handleToggle = (id: number) =>
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, is_active: !o.is_active } : o)));

  const activeCount = offers.filter((o) => o.is_active).length;
  const couponCount = offers.filter((o) => o.type === 'Coupon').length;
  const bankCount = offers.filter((o) => o.type === 'Bank').length;

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'Coupon', label: 'Coupon' },
    { key: 'Bank', label: 'Bank' },
    { key: 'Exclusive', label: 'Exclusive' },
  ];

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Blue Header (consistent) ── */}
        <View style={tw`bg-blue-700 px-5 pt-12 pb-6`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={tw`text-white text-2xl font-bold tracking-tight mb-1`}>Offers & Coupons</Text>
              <Text style={tw`text-blue-200 text-sm`}>Manage store discounts & vouchers</Text>
            </View>
            <TouchableOpacity
              onPress={() => { setEditingOffer(null); setModalVisible(true); }}
              style={tw`flex-row items-center gap-2 bg-white px-4 py-2 rounded-xl`}
            >
              <Plus size={16} color="#1D4ED8" />
              <Text style={tw`text-sm font-bold text-blue-700`}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Floating Stat Cards ── */}
        <View style={tw`flex-row mx-4 -mt-5 gap-3`}>
          {[
            { label: 'Total', value: offers.length, color: 'bg-blue-600' },
            { label: 'Active', value: activeCount, color: 'bg-emerald-500' },
            { label: 'Coupon', value: couponCount, color: 'bg-amber-500' },
            { label: 'Bank', value: bankCount, color: 'bg-indigo-500' },
          ].map(({ label, value, color }) => (
            <View key={label} style={tw`flex-1 bg-white rounded-2xl p-3 shadow-sm`}>
              <View style={tw`${color} w-2 h-2 rounded-full mb-2`} />
              <Text style={tw`text-slate-800 text-lg font-bold`}>{value}</Text>
              <Text style={tw`text-slate-400 text-xs`}>{label}</Text>
            </View>
          ))}
        </View>

        {/* ── Search & Filters ── */}
        <View style={tw`px-4 mt-4`}>
          {/* Search bar */}
          <View style={tw`flex-row items-center bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-blue-50 mb-3`}>
            <Search size={14} color="#94A3B8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search code or title..."
              placeholderTextColor="#94A3B8"
              style={tw`flex-1 text-sm text-slate-800 ml-2`}
            />
          </View>

          {/* Filter tabs */}
          <View style={tw`bg-white rounded-2xl p-1 flex-row shadow-sm`}>
            {FILTER_TABS.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setFilterTab(key)}
                style={tw`flex-1 py-2 rounded-xl items-center ${filterTab === key ? 'bg-blue-600' : ''}`}
              >
                <Text style={tw`font-bold text-[10px] uppercase ${filterTab === key ? 'text-white' : 'text-slate-400'}`}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Offer List ── */}
        <View style={tw`px-4 mt-4 pb-10`}>
          {filtered.length === 0 ? (
            <View style={tw`items-center justify-center py-16`}>
              <View style={tw`w-16 h-16 rounded-2xl bg-blue-100 items-center justify-center mb-4`}>
                <Tag size={28} color="#2563EB" />
              </View>
              <Text style={tw`text-base font-bold text-slate-700 mb-1`}>No offers found</Text>
              <Text style={tw`text-sm text-slate-400 text-center`}>Try adjusting your filter.</Text>
            </View>
          ) : (
            filtered.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onEdit={(o) => { setEditingOffer(o); setModalVisible(true); }}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))
          )}
        </View>
      </ScrollView>

      <OfferFormModal
        visible={modalVisible}
        offer={editingOffer}
        onClose={() => { setModalVisible(false); setEditingOffer(null); }}
        onSave={handleSave}
      />
    </View>
  );
};

export default OffersScreen;