/**
 * AdminMessagesScreen.tsx
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Reply {
  from: "admin" | "user";
  text: string;
  time: string;
}

interface Message {
  id: number;
  name: string;
  initials: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  date: string;
  unread: boolean;
  replies: Reply[];
  avatarColor: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    email: "priya.sharma@email.com",
    subject: "Order not delivered",
    preview: "My order hasn't arrived yet...",
    body: "Hi, I placed an order 5 days ago and it still hasn't arrived. My order ID is #ORD-8821. Can you please look into this?",
    time: "10:42 AM",
    date: "Today",
    unread: true,
    replies: [],
    avatarColor: "#7C3AED",
  },
  {
    id: 2,
    name: "Rahul Desai",
    initials: "RD",
    email: "rahul.d@gmail.com",
    subject: "Payment issue",
    preview: "I was charged twice for the same...",
    body: "I was charged twice for the same product. Transaction IDs: TXN-44821 and TXN-44830. Please refund the duplicate charge.",
    time: "9:15 AM",
    date: "Today",
    unread: true,
    replies: [],
    avatarColor: "#0284C7",
  },
  {
    id: 3,
    name: "Sneha Kulkarni",
    initials: "SK",
    email: "sneha.k@outlook.com",
    subject: "Wrong item received",
    preview: "I received a wrong item...",
    body: "I ordered a blue shirt size L but received a red shirt size M. I need a replacement urgently as it was a gift.",
    time: "Yesterday",
    date: "Yesterday",
    unread: false,
    replies: [
      {
        from: "admin",
        text: "Hi Sneha, we're sorry for the inconvenience. We've initiated a replacement and it will reach you in 2-3 days.",
        time: "Yesterday 3:00 PM",
      },
    ],
    avatarColor: "#059669",
  },
  {
    id: 4,
    name: "Amit Joshi",
    initials: "AJ",
    email: "amit.joshi@yahoo.com",
    subject: "Account access problem",
    preview: "Unable to log in to my account...",
    body: "I am unable to log in to my account. I have tried resetting my password twice but the reset email is not coming through.",
    time: "Apr 12",
    date: "Apr 12",
    unread: false,
    replies: [],
    avatarColor: "#D97706",
  },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  initials,
  color,
  size = 40,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        tw`items-center justify-center`,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text
        style={{ color: "#fff", fontWeight: "700", fontSize: size * 0.32 }}
      >
        {initials}
      </Text>
    </View>
  );
}

// ─── Message List Item ────────────────────────────────────────────────────────

function MessageItem({
  item,
  isSelected,
  onPress,
}: {
  item: Message;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        tw`flex-row items-start px-4 py-3 mx-2 rounded-2xl mb-1`,
        isSelected ? tw`bg-blue-50` : tw`bg-white`,
        isSelected && { borderWidth: 1, borderColor: "rgba(37,99,235,0.2)" },
        !isSelected && tw`border border-slate-50`,
      ]}
    >
      <Avatar initials={item.initials} color={item.avatarColor} size={42} />
      <View style={tw`flex-1 ml-3`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text
            numberOfLines={1}
            style={tw`text-sm font-semibold flex-1 mr-2 text-slate-900`}
          >
            {item.name}
          </Text>
          <Text style={tw`text-slate-400 text-xs`}>{item.time}</Text>
        </View>
        <Text
          numberOfLines={1}
          style={[
            tw`text-xs mt-0.5`,
            item.unread ? tw`text-slate-600 font-semibold` : tw`text-slate-400`,
          ]}
        >
          {item.subject}
        </Text>
        <Text numberOfLines={1} style={tw`text-xs text-slate-400 mt-0.5`}>
          {item.preview}
        </Text>
      </View>
      {item.unread && (
        <View style={tw`w-2 h-2 rounded-full bg-blue-600 mt-2 ml-2`} />
      )}
    </TouchableOpacity>
  );
}

// ─── Message Bottom Sheet ─────────────────────────────────────────────────────

function MessageBottomSheet({
  visible,
  message,
  onClose,
  onSend,
}: {
  visible: boolean;
  message: Message | null;
  onClose: () => void;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: BOTTOM_SHEET_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      setText("");
    }
  }, [visible]);

  const handleSend = () => {
    if (!text.trim()) return;
    setSending(true);
    setTimeout(() => {
      onSend(text.trim());
      setText("");
      setSending(false);
      setTimeout(
        () => scrollRef.current?.scrollToEnd({ animated: true }),
        150
      );
    }, 500);
  };

  if (!message && !visible) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        pointerEvents={visible ? "auto" : "none"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          opacity: backdropAnim,
          zIndex: 10,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        >
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: BOTTOM_SHEET_HEIGHT,
          zIndex: 20,
          transform: [{ translateY: slideAnim }],
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: "hidden",
          backgroundColor: "#F8FAFF",
        }}
      >
        {/* ── Handle + Header ── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#E0EAFF",
            paddingTop: 12,
            paddingBottom: 14,
            paddingHorizontal: 20,
          }}
        >
          {/* Drag handle */}
          <View style={tw`items-center mb-4`}>
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#CBD5E1",
              }}
            />
          </View>

          {/* Header row: avatar + meta + close + unread badge */}
          {message && (
            <View style={tw`flex-row items-center`}>
              <Avatar
                initials={message.initials}
                color={message.avatarColor}
                size={44}
              />
              <View style={tw`flex-1 ml-3`}>
                <View style={tw`flex-row items-center`}>
                  <Text
                    style={tw`text-slate-900 font-bold text-sm mr-2`}
                    numberOfLines={1}
                  >
                    {message.name}
                  </Text>
                  {message.unread && (
                    <View
                      style={{
                        backgroundColor: "#DBEAFE",
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: 99,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "700",
                          color: "#1D4ED8",
                        }}
                      >
                        UNREAD
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={tw`text-slate-400 text-xs mt-0.5`} numberOfLines={1}>
                  {message.subject}
                </Text>
                <Text style={tw`text-slate-300 text-[11px] mt-0.5`}>
                  {message.date} · {message.time}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  onClose();
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#F1F5F9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 14, color: "#64748B", fontWeight: "600" }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Keyboard-safe content ── */}
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          {/* ── Scrollable body + replies ── */}
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: false })
            }
          >
            {message && (
              <>
                {/* ── Original message body ── */}
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    padding: 16,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: "#E0EAFF",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#334155",
                      lineHeight: 22,
                    }}
                  >
                    {message.body}
                  </Text>
                </View>

                {/* ── Admin replies ── */}
                {message.replies.map((r, i) => (
                  <View
                    key={i}
                    style={[
                      {
                        borderRadius: 18,
                        padding: 14,
                        marginBottom: 10,
                        borderWidth: r.from === "admin" ? 0 : 1,
                        borderColor: "#E0EAFF",
                        backgroundColor:
                          r.from === "admin" ? "#1D4ED8" : "#fff",
                        // Align admin replies to the right
                        marginLeft: r.from === "admin" ? 32 : 0,
                        marginRight: r.from === "admin" ? 0 : 32,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color:
                          r.from === "admin"
                            ? "rgba(255,255,255,0.6)"
                            : "#94A3B8",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {r.from === "admin" ? "You · " : `${message.name} · `}
                      {r.time}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: r.from === "admin" ? "#fff" : "#334155",
                        lineHeight: 21,
                      }}
                    >
                      {r.text}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </ScrollView>

          {/* ── Reply input — always above keyboard ── */}
          <View
            style={{
              backgroundColor: "#fff",
              borderTopWidth: 1,
              borderTopColor: "#E0EAFF",
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 16,
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a reply…"
              placeholderTextColor="#94A3B8"
              multiline
              scrollEnabled
              style={{
                flex: 1,
                backgroundColor: "#F1F5F9",
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingTop: 11,
                paddingBottom: 11,
                fontSize: 13,
                color: "#1E293B",
                minHeight: 44,
                maxHeight: 100,
                textAlignVertical: "top",
              }}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!text.trim() || sending}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor:
                  text.trim() && !sending ? "#1D4ED8" : "#BFDBFE",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontSize: 16 }}>➤</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AdminMessagesScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [selected, setSelected] = useState<Message | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [search, setSearch] = useState("");

  const unreadCount = messages.filter((m) => m.unread).length;

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openSheet = (msg: Message) => {
    const updated = messages.map((m) =>
      m.id === msg.id ? { ...m, unread: false } : m
    );
    setMessages(updated);
    setSelected(updated.find((m) => m.id === msg.id) || msg);
    setSheetOpen(true);
  };

  const handleSend = (text: string) => {
    if (!selected) return;
    const newReply: Reply = { from: "admin", text, time: "Just now" };
    const updatedMsg = {
      ...selected,
      replies: [...selected.replies, newReply],
    };
    setSelected(updatedMsg);
    setMessages((prev) =>
      prev.map((m) => (m.id === selected.id ? updatedMsg : m))
    );
  };

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <StatusBar barStyle="light-content" />

      {/* ── Blue Header ── */}
      <View style={tw`bg-blue-700 px-5 pt-12 pb-6`}>
        <Text style={tw`text-white text-2xl font-bold tracking-tight mb-1`}>
          Support Messages
        </Text>
        <Text style={tw`text-blue-200 text-sm`}>
          Manage active customer conversations
        </Text>
      </View>

      {/* ── Floating Stats ── */}
      <View style={[tw`flex-row px-5 -mt-5`, { gap: 10 }]}>
        {[
          { label: "Total Active", value: messages.length, color: "bg-blue-600" },
          { label: "Unread", value: unreadCount, color: "bg-amber-500" },
          {
            label: "Replied",
            value: messages.filter((m) => m.replies.length > 0).length,
            color: "bg-emerald-500",
          },
        ].map((stat) => (
          <View
            key={stat.label}
            style={tw`flex-1 bg-white rounded-2xl px-4 py-3 shadow-sm border border-blue-50`}
          >
            <View style={tw`${stat.color} w-2 h-2 rounded-full mb-1`} />
            <Text style={tw`text-lg font-bold text-slate-800`}>
              {stat.value}
            </Text>
            <Text style={tw`text-slate-400 text-[10px] uppercase font-bold`}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Message List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MessageItem
            item={item}
            isSelected={selected?.id === item.id && sheetOpen}
            onPress={() => openSheet(item)}
          />
        )}
        contentContainerStyle={tw`pb-6 pt-4`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={tw`items-center mt-20`}>
            <Text style={tw`text-slate-400 text-sm`}>No messages found</Text>
          </View>
        }
      />

      {/* ── Message Bottom Sheet ── */}
      <MessageBottomSheet
        visible={sheetOpen}
        message={selected}
        onClose={() => setSheetOpen(false)}
        onSend={handleSend}
      />
    </View>
  );
}