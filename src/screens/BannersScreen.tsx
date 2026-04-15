import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
  ChevronUp,
  Package,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Search,
  Check,
  LayoutDashboard,
} from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Banner {
  id: number;
  title_en: string;
  title_hi: string;
  subtitle_en: string;
  subtitle_hi: string;
  color: string;
  image: string;
  products: Product[];
  link_url: string;
  is_active: boolean;
  order: number;
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
  { id: 7, name: 'Chana Dal', sku: 'CD-007' },
  { id: 8, name: 'Moong Dal', sku: 'MD-008' },
];

const INITIAL_BANNERS: Banner[] = [
  {
    id: 1,
    title_en: 'Summer Sale',
    title_hi: 'गर्मियों की सेल',
    subtitle_en: 'Up to 40% off on all grains',
    subtitle_hi: 'सभी अनाज पर 40% की छूट',
    color: '#3B82F6',
    image: 'https://example.com/banner1.jpg',
    products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]],
    link_url: '/sale/summer',
    is_active: true,
    order: 1,
    created_at: '2025-04-01T10:00:00Z',
  },
  {
    id: 2,
    title_en: 'Fresh Oils Collection',
    title_hi: 'ताजे तेल का संग्रह',
    subtitle_en: 'Pure & cold-pressed oils',
    subtitle_hi: 'शुद्ध और कोल्ड-प्रेस्ड तेल',
    color: '#10B981',
    image: 'https://example.com/banner2.jpg',
    products: [MOCK_PRODUCTS[2], MOCK_PRODUCTS[4]],
    link_url: '/category/oils',
    is_active: true,
    order: 2,
    created_at: '2025-04-03T12:00:00Z',
  },
  {
    id: 3,
    title_en: 'Dal & Lentils Fest',
    title_hi: 'दाल महोत्सव',
    subtitle_en: 'Protein-rich lentils at best prices',
    subtitle_hi: 'सर्वोत्तम मूल्य पर दालें',
    color: '#F59E0B',
    image: 'https://example.com/banner3.jpg',
    products: [MOCK_PRODUCTS[5], MOCK_PRODUCTS[6], MOCK_PRODUCTS[7]],
    link_url: '/category/dals',
    is_active: false,
    order: 3,
    created_at: '2025-04-05T09:00:00Z',
  },
];

const EMPTY_BANNER: Omit<Banner, 'id' | 'created_at'> = {
  title_en: '',
  title_hi: '',
  subtitle_en: '',
  subtitle_hi: '',
  color: '#3B82F6',
  image: '',
  products: [],
  link_url: '',
  is_active: true,
  order: 0,
};

// ─── Shared Sub-components ────────────────────────────────────────────────────

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={tw`flex-row justify-between mb-2`}>
    <Text style={tw`text-xs text-slate-400 w-28`}>{label}</Text>
    <Text style={tw`text-xs text-slate-700 flex-1 text-right`} numberOfLines={1}>{value}</Text>
  </View>
);

const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) => (
  <View style={tw`mb-4`}>
    <Text style={tw`text-xs text-slate-500 mb-1.5`}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      multiline={multiline}
      style={[
        tw`bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-sm text-slate-800`,
        multiline && tw`h-20`,
      ]}
    />
  </View>
);

// ─── Banner Card ──────────────────────────────────────────────────────────────

const BannerCard = ({
  banner,
  onEdit,
  onDelete,
  onToggle,
}: {
  banner: Banner;
  onEdit: (b: Banner) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={tw`bg-white rounded-2xl mb-3 shadow-sm overflow-hidden`}>
      {/* Accent bar using the banner's own color */}
      <View style={[tw`h-1 w-full`, { backgroundColor: banner.color || '#3B82F6' }]} />

      <View style={tw`p-4`}>
        {/* Header row */}
        <View style={tw`flex-row items-start justify-between mb-3`}>
          <View style={tw`flex-1 mr-3`}>
            {/* Status + Order badges */}
            <View style={tw`flex-row items-center gap-2 mb-1.5`}>
              <View style={[
                tw`px-2 py-0.5 rounded-full`,
                { backgroundColor: banner.is_active ? '#DBEAFE' : '#F1F5F9' },
              ]}>
                <Text style={[
                  tw`text-xs font-medium`,
                  { color: banner.is_active ? '#1D4ED8' : '#64748B' },
                ]}>
                  {banner.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
              <View style={tw`bg-slate-100 px-2 py-0.5 rounded-full`}>
                <Text style={tw`text-xs text-slate-500`}>Order #{banner.order}</Text>
              </View>
            </View>

            <Text style={tw`text-base font-semibold text-slate-900`}>{banner.title_en}</Text>
            {banner.subtitle_en ? (
              <Text style={tw`text-sm text-slate-500 mt-0.5`}>{banner.subtitle_en}</Text>
            ) : null}
          </View>

          {/* Action buttons */}
          <View style={tw`flex-row items-center gap-2`}>
            <TouchableOpacity
              onPress={() => onToggle(banner.id)}
              style={tw`w-8 h-8 rounded-full items-center justify-center bg-blue-50`}
            >
              {banner.is_active
                ? <ToggleRight size={16} color="#2563EB" />
                : <ToggleLeft size={16} color="#94A3B8" />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onEdit(banner)}
              style={tw`w-8 h-8 rounded-full items-center justify-center bg-blue-50`}
            >
              <Edit2 size={16} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(banner.id)}
              style={tw`w-8 h-8 rounded-full items-center justify-center bg-red-50`}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Image URL row */}
        {banner.image ? (
          <View style={tw`flex-row items-center gap-1.5 mb-2.5 bg-blue-50 rounded-lg px-2.5 py-1.5`}>
            <ImageIcon size={11} color="#3B82F6" />
            <Text style={tw`text-xs text-blue-600 flex-1`} numberOfLines={1}>{banner.image}</Text>
          </View>
        ) : null}

        {/* Products pill row */}
        <View style={tw`flex-row items-center gap-2 flex-wrap`}>
          <View style={tw`flex-row items-center gap-1 bg-blue-600 px-2.5 py-1 rounded-full`}>
            <Package size={11} color="#fff" />
            <Text style={tw`text-xs text-white font-medium`}>
              {banner.products.length} product{banner.products.length !== 1 ? 's' : ''}
            </Text>
          </View>
          {banner.products.slice(0, 2).map((p) => (
            <View key={p.id} style={tw`bg-blue-50 rounded-full px-2.5 py-1`}>
              <Text style={tw`text-xs text-blue-700`}>{p.name}</Text>
            </View>
          ))}
          {banner.products.length > 2 && (
            <View style={tw`bg-blue-50 rounded-full px-2.5 py-1`}>
              <Text style={tw`text-xs text-blue-700`}>+{banner.products.length - 2} more</Text>
            </View>
          )}
        </View>

        {/* Expand toggle */}
        <TouchableOpacity
          onPress={() => setExpanded((v) => !v)}
          style={tw`flex-row items-center gap-1 mt-3 self-start`}
        >
          <Text style={tw`text-xs text-blue-400`}>
            {expanded ? 'Hide details' : 'Show Hindi & link'}
          </Text>
          {expanded
            ? <ChevronUp size={12} color="#60A5FA" />
            : <ChevronDown size={12} color="#60A5FA" />}
        </TouchableOpacity>

        {/* Expanded details */}
        {expanded && (
          <View style={tw`mt-3 pt-3 border-t border-blue-50`}>
            <Row label="Title (HI)" value={banner.title_hi || '—'} />
            <Row label="Subtitle (HI)" value={banner.subtitle_hi || '—'} />
            <Row label="Link URL" value={banner.link_url || '—'} />
            <Row label="Color" value={banner.color || '—'} />
            <Row label="Created" value={new Date(banner.created_at).toLocaleDateString('en-IN')} />
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Product Picker Modal ─────────────────────────────────────────────────────

const ProductPickerModal = ({
  visible,
  selectedProducts,
  onClose,
  onSave,
}: {
  visible: boolean;
  selectedProducts: Product[];
  onClose: () => void;
  onSave: (products: Product[]) => void;
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product[]>(selectedProducts);

  const filtered = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (product: Product) =>
    setSelected((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product],
    );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={tw`flex-1 bg-white`}>
        {/* Modal header — blue strip */}
        <View style={tw`bg-blue-700 px-4 pt-4 pb-4`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-base font-bold text-white`}>Select Products</Text>
            <View style={tw`flex-row items-center gap-3`}>
              <TouchableOpacity
                onPress={() => { onSave(selected); onClose(); }}
                style={tw`bg-white px-4 py-1.5 rounded-full`}
              >
                <Text style={tw`text-xs font-semibold text-blue-700`}>Done ({selected.length})</Text>
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

        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={tw`px-4 pb-8 pt-2`}
          renderItem={({ item }) => {
            const isSelected = !!selected.find((p) => p.id === item.id);
            return (
              <TouchableOpacity
                onPress={() => toggle(item)}
                style={tw`flex-row items-center justify-between py-3 border-b border-blue-50`}
              >
                <View>
                  <Text style={tw`text-sm text-slate-800 font-medium`}>{item.name}</Text>
                  <Text style={tw`text-xs text-slate-400`}>{item.sku}</Text>
                </View>
                <View style={[
                  tw`w-6 h-6 rounded-full border-2 items-center justify-center`,
                  isSelected ? tw`bg-blue-600 border-blue-600` : tw`border-slate-200`,
                ]}>
                  {isSelected && <Check size={12} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

// ─── Banner Form Modal ────────────────────────────────────────────────────────

const BannerFormModal = ({
  visible,
  banner,
  onClose,
  onSave,
}: {
  visible: boolean;
  banner: Banner | null;
  onClose: () => void;
  onSave: (data: Partial<Banner>) => void;
}) => {
  const { showAlert } = useAlert();
  const isEdit = !!banner?.id;
  const [form, setForm] = useState<Partial<Banner>>(banner || EMPTY_BANNER);
  const [showProductPicker, setShowProductPicker] = useState(false);

  React.useEffect(() => { setForm(banner || EMPTY_BANNER); }, [banner]);

  const set = (field: keyof Banner, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={tw`flex-1 bg-blue-50`} edges={['top']}>
        {/* Modal header — same blue-700 strip */}
        <View style={tw`bg-blue-700 px-5 pt-4 pb-5`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={tw`text-white text-lg font-bold`}>
                {isEdit ? 'Edit Banner' : 'New Banner'}
              </Text>
              <Text style={tw`text-blue-200 text-xs mt-0.5`}>
                {isEdit ? 'Update banner details' : 'Fill in the details below'}
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
          <ScrollView contentContainerStyle={tw`px-4 py-5 pb-12`} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* English Section */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                🇬🇧 English Content
              </Text>
              <FormField label="Title (English) *" value={form.title_en || ''} onChangeText={(v) => set('title_en', v)} placeholder="e.g. Summer Sale" />
              <FormField label="Subtitle (English)" value={form.subtitle_en || ''} onChangeText={(v) => set('subtitle_en', v)} placeholder="e.g. Up to 40% off" />
            </View>

            {/* Hindi Section */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                🇮🇳 Hindi Content
              </Text>
              <FormField label="Title (Hindi)" value={form.title_hi || ''} onChangeText={(v) => set('title_hi', v)} placeholder="e.g. गर्मियों की सेल" />
              <FormField label="Subtitle (Hindi)" value={form.subtitle_hi || ''} onChangeText={(v) => set('subtitle_hi', v)} placeholder="e.g. 40% की छूट" />
            </View>

            {/* Media & Style Section */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                🖼 Media & Style
              </Text>
              <FormField label="Image URL *" value={form.image || ''} onChangeText={(v) => set('image', v)} placeholder="https://example.com/banner.jpg" />
              <FormField label="Background Color" value={form.color || ''} onChangeText={(v) => set('color', v)} placeholder="#3B82F6" />
              <FormField label="Display Order" value={String(form.order ?? 0)} onChangeText={(v) => set('order', parseInt(v) || 0)} placeholder="1" />
              <FormField label="Link URL" value={form.link_url || ''} onChangeText={(v) => set('link_url', v)} placeholder="/category/sale" />
            </View>

            {/* Products Section */}
            <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                📦 Linked Products
              </Text>
              <TouchableOpacity
                onPress={() => setShowProductPicker(true)}
                style={tw`flex-row items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-3`}
              >
                <View style={tw`flex-row items-center gap-2`}>
                  <Package size={16} color="#2563EB" />
                  <Text style={tw`text-sm text-blue-700 font-medium`}>
                    {(form.products || []).length > 0
                      ? `${(form.products || []).length} product(s) selected`
                      : 'Tap to add products'}
                  </Text>
                </View>
                <ChevronDown size={16} color="#2563EB" />
              </TouchableOpacity>

              {(form.products || []).length > 0 && (
                <View style={tw`flex-row flex-wrap gap-2`}>
                  {(form.products || []).map((p) => (
                    <View key={p.id} style={tw`bg-blue-100 rounded-full px-3 py-1 flex-row items-center gap-1.5`}>
                      <Text style={tw`text-xs text-blue-800 font-medium`}>{p.name}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          set('products', (form.products || []).filter((x) => x.id !== p.id))
                        }
                      >
                        <X size={10} color="#1D4ED8" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={() => {
                if (!form.title_en?.trim()) {
                  showAlert({
                    title: 'Validation',
                    message: 'Title (English) is required.',
                    type: 'warning'
                  });
                  return;
                }
                if (!form.image?.trim()) {
                  showAlert({
                    title: 'Validation',
                    message: 'Image URL is required.',
                    type: 'warning'
                  });
                  return;
                }
                onSave(form);
                onClose();
              }}
              style={tw`bg-blue-700 rounded-2xl py-4 items-center shadow-sm`}
            >
              <Text style={tw`text-base font-bold text-white`}>
                {isEdit ? 'Save Changes' : 'Create Banner'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        <ProductPickerModal
          visible={showProductPicker}
          selectedProducts={form.products || []}
          onClose={() => setShowProductPicker(false)}
          onSave={(products) => set('products', products)}
        />
      </SafeAreaView>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const BannersScreen = () => {
  const { showAlert } = useAlert();
  const { showToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const nextId = Math.max(0, ...banners.map((b) => b.id)) + 1;

  const filtered = banners.filter((b) => {
    if (filterActive === 'active') return b.is_active;
    if (filterActive === 'inactive') return !b.is_active;
    return true;
  });

  const handleSave = (data: Partial<Banner>) => {
    if (data.id) {
      setBanners((prev) => prev.map((b) => (b.id === data.id ? { ...b, ...data } : b)));
    } else {
      setBanners((prev) => [...prev, { ...(data as any), id: nextId, created_at: new Date().toISOString() }]);
    }
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: 'Delete Banner',
      message: 'Are you sure you want to delete this banner?',
      type: 'delete',
      onConfirm: () => {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        showToast('Deleted', 'Banner removed successfully.', 'info');
      }
    });
  };

  const handleToggle = (id: number) =>
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b)));

  const activeCount = banners.filter((b) => b.is_active).length;
  const inactiveCount = banners.filter((b) => !b.is_active).length;
  const totalProducts = banners.reduce((sum, b) => sum + b.products.length, 0);

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Blue Header (matches Reviews & Subscribers) ── */}
        <View style={tw`bg-blue-700 px-5 pt-12 pb-6`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={tw`text-white text-2xl font-bold tracking-tight mb-1`}>Banners</Text>
              <Text style={tw`text-blue-200 text-sm`}>Manage app banners & promotions</Text>
            </View>
            <TouchableOpacity
              onPress={() => { setEditingBanner(null); setModalVisible(true); }}
              style={tw`flex-row items-center gap-2 bg-white px-4 py-2 rounded-xl`}
            >
              <Plus size={16} color="#1D4ED8" />
              <Text style={tw`text-sm font-bold text-blue-700`}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Floating Stat Cards (matches other screens) ── */}
        <View style={tw`flex-row mx-4 -mt-5 gap-3`}>
          {[
            { label: 'Total Banners', value: banners.length, color: 'bg-blue-600' },
            { label: 'Active', value: activeCount, color: 'bg-emerald-500' },
            { label: 'Inactive', value: inactiveCount, color: 'bg-slate-400' },
            { label: 'Products', value: totalProducts, color: 'bg-amber-500' },
          ].map(({ label, value, color }) => (
            <View key={label} style={tw`flex-1 bg-white rounded-2xl p-3 shadow-sm`}>
              <View style={tw`${color} w-2 h-2 rounded-full mb-2`} />
              <Text style={tw`text-slate-800 text-lg font-bold`}>{value}</Text>
              <Text style={tw`text-slate-400 text-xs`}>{label}</Text>
            </View>
          ))}
        </View>

        {/* ── Filter Chips ── */}
        <View style={tw`mx-4 mt-4 bg-white rounded-2xl p-1 flex-row shadow-sm`}>
          {(['all', 'active', 'inactive'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilterActive(tab)}
              style={tw`flex-1 py-2.5 rounded-xl items-center ${filterActive === tab ? 'bg-blue-600' : ''
                }`}
            >
              <Text style={tw`font-semibold text-sm capitalize ${filterActive === tab ? 'text-white' : 'text-slate-400'
                }`}>
                {tab === 'all' ? `All (${banners.length})` : tab === 'active' ? `Active (${activeCount})` : `Inactive (${inactiveCount})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Banner List ── */}
        <View style={tw`px-4 mt-4 pb-10`}>
          {filtered.length === 0 ? (
            <View style={tw`items-center justify-center py-16`}>
              <View style={tw`w-16 h-16 rounded-2xl bg-blue-100 items-center justify-center mb-4`}>
                <LayoutDashboard size={28} color="#2563EB" />
              </View>
              <Text style={tw`text-base font-bold text-slate-700 mb-1`}>No banners found</Text>
              <Text style={tw`text-sm text-slate-400 text-center`}>Try adjusting your filter.</Text>
            </View>
          ) : (
            filtered.map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                onEdit={(b) => { setEditingBanner(b); setModalVisible(true); }}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))
          )}
        </View>
      </ScrollView>

      <BannerFormModal
        visible={modalVisible}
        banner={editingBanner}
        onClose={() => { setModalVisible(false); setEditingBanner(null); }}
        onSave={handleSave}
      />
    </View>
  );
};

export default BannersScreen;