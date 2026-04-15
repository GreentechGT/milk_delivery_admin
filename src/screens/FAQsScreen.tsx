import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../lib/tailwind';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  X,
  MessageSquare,
  Search,
  BookOpen,
  ChevronDown,

} from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  created_at: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_FAQS: FAQ[] = [
  {
    id: 1,
    question: 'How do I pause my subscription?',
    answer:
      'You can pause your subscription anytime from the My Subscriptions section in the app. Tap on your active plan and select "Pause Delivery". Your billing cycle will be extended by the number of days paused.',
    category: 'Subscription',
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 2,
    question: 'What are the available delivery slots?',
    answer:
      'We currently offer two delivery slots — Morning (6 AM to 9 AM) and Evening (5 PM to 8 PM). You can select or change your preferred slot from the subscription settings.',
    category: 'Delivery',
    created_at: '2026-04-02T11:00:00Z',
  },
  {
    id: 3,
    question: 'How do I change my delivery address?',
    answer:
      'Go to Profile → My Addresses and add a new address or edit an existing one. Then visit your active subscription and update the delivery address from the plan settings.',
    category: 'Delivery',
    created_at: '2026-04-03T09:30:00Z',
  },
  {
    id: 4,
    question: 'Can I switch between monthly and yearly plans?',
    answer:
      'Yes! You can upgrade from a Monthly to a Yearly plan at any time. The remaining days of your current plan will be adjusted proportionally. Downgrades take effect at the next renewal.',
    category: 'Subscription',
    created_at: '2026-04-04T08:00:00Z',
  },
  {
    id: 5,
    question: 'What payment methods are accepted?',
    answer:
      'We accept UPI, Debit/Credit Cards, Net Banking, and popular wallets like Paytm and PhonePe. All payments are processed securely.',
    category: 'Payments',
    created_at: '2026-04-05T14:00:00Z',
  },
];

const CATEGORIES = ['All', 'Subscription', 'Delivery', 'Payments', 'General'];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Subscription: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Delivery: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Payments: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  General: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

const EMPTY_FAQ = { question: '', answer: '', category: 'General' };

// ─── FAQ Card ─────────────────────────────────────────────────────────────────

const FAQCard = ({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FAQ;
  onEdit: (f: FAQ) => void;
  onDelete: (id: number) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORY_COLORS[faq.category] ?? CATEGORY_COLORS.General;

  return (
    <View style={tw`bg-white rounded-2xl mb-3 shadow-sm overflow-hidden`}>
      {/* Left accent bar */}
      <View style={tw`flex-row`}>
        <View style={tw`w-1 ${cat.dot.replace('bg-', 'bg-')}`}
        // inline style for the accent bar color
        />
        <View style={tw`flex-1 p-4`}>
          {/* Header */}
          <View style={tw`flex-row items-start justify-between`}>
            <View style={tw`flex-1 mr-3`}>
              {/* Category badge */}
              <View style={tw`flex-row items-center gap-1.5 mb-2`}>
                <View style={tw`${cat.bg} px-2.5 py-0.5 rounded-full flex-row items-center gap-1`}>
                  <View style={tw`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                  <Text style={tw`${cat.text} text-xs font-medium`}>{faq.category}</Text>
                </View>
                <Text style={tw`text-slate-300 text-xs`}>
                  {new Date(faq.created_at).toLocaleDateString('en-IN')}
                </Text>
              </View>

              {/* Question */}
              <TouchableOpacity onPress={() => setExpanded((v) => !v)} activeOpacity={0.7}>
                <Text style={tw`text-slate-800 font-semibold text-sm leading-5`}>
                  {faq.question}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={tw`flex-row items-center gap-2`}>
              <TouchableOpacity
                onPress={() => onEdit(faq)}
                style={tw`w-8 h-8 rounded-full items-center justify-center bg-blue-50`}
              >
                <Edit2 size={14} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete(faq.id)}
                style={tw`w-8 h-8 rounded-full items-center justify-center bg-red-50`}
              >
                <Trash2 size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Expand toggle */}
          <TouchableOpacity
            onPress={() => setExpanded((v) => !v)}
            style={tw`flex-row items-center gap-1 mt-2 self-start`}
            activeOpacity={0.7}
          >
            <Text style={tw`text-xs text-blue-400`}>
              {expanded ? 'Hide answer' : 'View answer'}
            </Text>
            {expanded
              ? <ChevronUp size={12} color="#60A5FA" />
              : <ChevronDown size={12} color="#60A5FA" />}
          </TouchableOpacity>

          {/* Answer */}
          {expanded && (
            <View style={tw`mt-3 pt-3 border-t border-blue-50`}>
              <View style={tw`flex-row gap-2`}>
                <MessageSquare size={14} color="#93C5FD" style={tw`mt-0.5`} />
                <Text style={tw`text-slate-600 text-sm leading-5 flex-1`}>{faq.answer}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// ─── FAQ Form Modal ───────────────────────────────────────────────────────────

const FAQFormModal = ({
  visible,
  faq,
  onClose,
  onSave,
}: {
  visible: boolean;
  faq: Partial<FAQ> | null;
  onClose: () => void;
  onSave: (data: Partial<FAQ>) => void;
}) => {
  const isEdit = !!faq?.id;
  const [form, setForm] = useState<Partial<FAQ>>(faq || EMPTY_FAQ);
  const [selectedCategory, setSelectedCategory] = useState(faq?.category || 'General');

  React.useEffect(() => {
    setForm(faq || EMPTY_FAQ);
    setSelectedCategory(faq?.category || 'General');
  }, [faq]);

  const set = (field: keyof FAQ, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.question?.trim()) {
      Alert.alert('Validation', 'Question is required.');
      return;
    }
    if (!form.answer?.trim()) {
      Alert.alert('Validation', 'Answer is required.');
      return;
    }
    onSave({ ...form, category: selectedCategory });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={tw`flex-1 bg-blue-50`} edges={['top']}>
        {/* Modal Header */}
        <View style={tw`bg-blue-700 px-5 pt-4 pb-5`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={tw`text-white text-lg font-bold`}>
                {isEdit ? 'Edit FAQ' : 'New FAQ'}
              </Text>
              <Text style={tw`text-blue-200 text-xs mt-0.5`}>
                {isEdit ? 'Update question & answer' : 'Add a new frequently asked question'}
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
          <ScrollView
            contentContainerStyle={tw`px-4 py-5 pb-12`}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {/* Category picker */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                Category
              </Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
                  const c = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.General;
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={tw`px-3 py-1.5 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-blue-100'
                        }`}
                    >
                      <Text style={tw`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Question field */}
            <View style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                ❓ Question
              </Text>
              <TextInput
                value={form.question || ''}
                onChangeText={(v) => set('question', v)}
                placeholder="e.g. How do I pause my subscription?"
                placeholderTextColor="#94A3B8"
                multiline
                style={tw`bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 min-h-16`}
              />
            </View>

            {/* Answer field */}
            <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm`}>
              <Text style={tw`text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3`}>
                💬 Answer
              </Text>
              <TextInput
                value={form.answer || ''}
                onChangeText={(v) => set('answer', v)}
                placeholder="Write a clear, helpful answer for customers..."
                placeholderTextColor="#94A3B8"
                multiline
                style={tw`bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 min-h-32`}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={tw`bg-blue-700 rounded-2xl py-4 items-center shadow-sm`}
            >
              <Text style={tw`text-base font-bold text-white`}>
                {isEdit ? 'Save Changes' : 'Add FAQ'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const FAQsScreen = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(INITIAL_FAQS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const nextId = Math.max(0, ...faqs.map((f) => f.id)) + 1;

  const filtered = faqs.filter((f) => {
    const matchSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleSave = (data: Partial<FAQ>) => {
    if (data.id) {
      setFaqs((prev) => prev.map((f) => (f.id === data.id ? { ...f, ...data } : f)));
    } else {
      setFaqs((prev) => [
        ...prev,
        { ...(data as any), id: nextId, created_at: new Date().toISOString() },
      ]);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete FAQ', 'Remove this FAQ for customers?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setFaqs((prev) => prev.filter((f) => f.id !== id)),
      },
    ]);
  };

  // Category counts
  const catCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === 'All' ? faqs.length : faqs.filter((f) => f.category === cat).length;
    return acc;
  }, {});

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Blue Header ── */}
        <View style={tw`bg-blue-700 px-5 pt-12 pb-6`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <View>
              <Text style={tw`text-white text-2xl font-bold tracking-tight mb-1`}>FAQs</Text>
              <Text style={tw`text-blue-200 text-sm`}>Manage customer help content</Text>
            </View>
            <TouchableOpacity
              onPress={() => { setEditingFaq(null); setModalVisible(true); }}
              style={tw`flex-row items-center gap-2 bg-white px-4 py-2 rounded-xl`}
            >
              <Plus size={16} color="#1D4ED8" />
              <Text style={tw`text-sm font-bold text-blue-700`}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Search bar inside header */}
          <View style={tw`flex-row items-center bg-blue-600 rounded-xl px-3 py-2.5 gap-2`}>
            <Search size={15} color="#93C5FD" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search questions or answers..."
              placeholderTextColor="#93C5FD"
              style={tw`flex-1 text-sm text-white`}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={14} color="#93C5FD" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Floating Stat Cards ── */}
        <View style={tw`flex-row mx-4 -mt-5 gap-3`}>
          {[
            { label: 'Total FAQs', value: faqs.length, color: 'bg-blue-600' },
            { label: 'Subscription', value: faqs.filter((f) => f.category === 'Subscription').length, color: 'bg-emerald-500' },
            { label: 'Delivery', value: faqs.filter((f) => f.category === 'Delivery').length, color: 'bg-amber-500' },
            { label: 'Payments', value: faqs.filter((f) => f.category === 'Payments').length, color: 'bg-slate-400' },
          ].map(({ label, value, color }) => (
            <View key={label} style={tw`flex-1 bg-white rounded-2xl p-3 shadow-sm`}>
              <View style={tw`${color} w-2 h-2 rounded-full mb-2`} />
              <Text style={tw`text-slate-800 text-lg font-bold`}>{value}</Text>
              <Text style={tw`text-slate-400 text-xs`}>{label}</Text>
            </View>
          ))}
        </View>

        {/* ── Category Filter Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4 py-3 gap-2`}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={tw`px-3 py-1.5 rounded-full border ${activeCategory === cat ? 'bg-blue-600 border-blue-600' : 'bg-white border-blue-100'
                }`}
            >
              <Text style={tw`text-xs font-medium ${activeCategory === cat ? 'text-white' : 'text-slate-500'
                }`}>
                {cat} {catCounts[cat] > 0 ? `(${catCounts[cat]})` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── FAQ List ── */}
        <View style={tw`px-4 pb-10`}>
          {filtered.length === 0 ? (
            <View style={tw`items-center justify-center py-16`}>
              <View style={tw`w-16 h-16 rounded-2xl bg-blue-100 items-center justify-center mb-4`}>
                <BookOpen size={28} color="#2563EB" />
              </View>
              <Text style={tw`text-base font-bold text-slate-700 mb-1`}>No FAQs found</Text>
              <Text style={tw`text-sm text-slate-400 text-center`}>
                {searchQuery ? 'Try a different search term.' : 'Tap "Add" to create your first FAQ.'}
              </Text>
            </View>
          ) : (
            filtered.map((faq) => (
              <FAQCard
                key={faq.id}
                faq={faq}
                onEdit={(f) => { setEditingFaq(f); setModalVisible(true); }}
                onDelete={handleDelete}
              />
            ))
          )}
        </View>
      </ScrollView>

      <FAQFormModal
        visible={modalVisible}
        faq={editingFaq}
        onClose={() => { setModalVisible(false); setEditingFaq(null); }}
        onSave={handleSave}
      />
    </View>
  );
};

export default FAQsScreen;