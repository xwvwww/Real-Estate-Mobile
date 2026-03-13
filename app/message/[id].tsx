import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getListingById } from '@/constants/userListings';
import { getUserChatById } from '@/constants/userMessages';

export default function MessageDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const chat = getUserChatById(id);
  const listing = getListingById(chat?.listingId);
  const [draft, setDraft] = useState('');

  const conversation = useMemo(() => chat?.messages ?? [], [chat?.messages]);

  if (!chat) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#3A3A3A" />
          </Pressable>
          <Text style={styles.headerTitle}>Сообщения</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Диалог не найден</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#3A3A3A" />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{chat.name}</Text>
            <Text style={styles.headerSubtitle}>{chat.object}</Text>
          </View>

          <Pressable
            style={styles.headerBtn}
            onPress={() => {
              if (listing) {
                router.push({ pathname: '/object/[id]', params: { id: listing.id } });
              }
            }}>
            <Ionicons name="home-outline" size={18} color="#3A3A3A" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {listing ? (
            <Pressable
              style={styles.objectBanner}
              onPress={() => router.push({ pathname: '/object/[id]', params: { id: listing.id } })}>
              <View style={styles.objectBannerTextWrap}>
                <Text style={styles.objectBannerLabel}>По объекту</Text>
                <Text style={styles.objectBannerTitle}>{listing.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
            </Pressable>
          ) : null}

          {conversation.map((message) => {
            const isMine = message.from === 'me';
            return (
              <View key={message.id} style={[styles.messageRow, isMine && styles.messageRowMine]}>
                <View style={[styles.messageBubble, isMine ? styles.mineBubble : styles.companyBubble]}>
                  <Text style={[styles.messageText, isMine && styles.mineMessageText]}>{message.text}</Text>
                  <Text style={[styles.messageTime, isMine && styles.mineMessageTime]}>{message.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.inputWrap}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              style={styles.input}
              placeholder="Напишите сообщение..."
              placeholderTextColor="#939393"
            />
            <Pressable style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]} disabled={!draft.trim()}>
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 63,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, lineHeight: 24, color: '#3A3A3A', fontWeight: '600' },
  headerSubtitle: { fontSize: 12, lineHeight: 18, color: '#939393' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  objectBanner: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  objectBannerTextWrap: { flex: 1, gap: 2 },
  objectBannerLabel: { fontSize: 12, lineHeight: 18, color: '#70A0FF' },
  objectBannerTitle: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '600' },
  messageRow: { alignItems: 'flex-start' },
  messageRowMine: { alignItems: 'flex-end' },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  companyBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  mineBubble: {
    backgroundColor: '#70A0FF',
    borderTopRightRadius: 4,
  },
  messageText: { fontSize: 14, lineHeight: 21, color: '#3A3A3A' },
  mineMessageText: { color: '#FFFFFF' },
  messageTime: { fontSize: 11, lineHeight: 16, color: '#939393', alignSelf: 'flex-end' },
  mineMessageTime: { color: 'rgba(255,255,255,0.8)' },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#F8F8F8',
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: { flex: 1, fontSize: 14, lineHeight: 21, color: '#3A3A3A', paddingVertical: 12 },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, lineHeight: 27, color: '#3A3A3A', fontWeight: '600' },
});
