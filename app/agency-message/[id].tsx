import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import {
  createApplicationMessage,
  fetchApplicationMessages,
  fetchApplications,
  fetchListingById,
} from '@/lib/api';
import { mapApiMessageToChatMessage } from '@/lib/messages';

export default function AgencyMessageViewScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [draft, setDraft] = useState('');
  const [chatName, setChatName] = useState<string | null>(null);
  const [chatObject, setChatObject] = useState<string | null>(null);
  const [messages, setMessages] = useState<ReturnType<typeof mapApiMessageToChatMessage>[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!id || !session?.token) {
      setChatName(null);
      setChatObject(null);
      setMessages([]);
      setLoading(false);
      setLoadError('Войдите в аккаунт агентства и выберите диалог');
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setLoadError(null);

    const loadChat = async () => {
      const [applications, applicationMessages] = await Promise.all([
        fetchApplications(session.token),
        fetchApplicationMessages(id, session.token),
      ]);

      const application = applications.find((item) => String(item.id) === id);
      if (!application) {
        throw new Error('Вернитесь к сообщениям и откройте существующий диалог');
      }

      const listing = await fetchListingById(application.listing_id, session.token).catch(() => null);

      if (cancelled) {
        return;
      }

      setChatName(application.full_name);
      setChatObject(listing?.title || `Объект #${application.listing_id}`);
      setMessages(applicationMessages.map((item) => mapApiMessageToChatMessage(item, session)));
    };

    loadChat()
      .catch((error: unknown) => {
        if (!cancelled) {
          setChatName(null);
          setChatObject(null);
          setMessages([]);
          setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить диалог');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, session]);

  const conversation = useMemo(() => messages, [messages]);

  const sendMessage = async () => {
    if (!id || !session?.token || !draft.trim() || sending) {
      return;
    }

    try {
      setSending(true);
      const createdMessage = await createApplicationMessage(id, draft.trim(), session.token);
      setMessages((current) => [...current, mapApiMessageToChatMessage(createdMessage, session)]);
      setDraft('');
    } catch (error) {
      Alert.alert(
        'Не удалось отправить сообщение',
        error instanceof Error ? error.message : 'Попробуйте еще раз.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#70A0FF" />
          </Pressable>
          <Text style={styles.headerTitle}>Сообщения</Text>
        </View>

        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator color="#70A0FF" />
            <Text style={styles.loadingText}>Загружаем диалог...</Text>
          </View>
        ) : null}

        {!loading && chatName && chatObject ? (
          <>
            <View style={styles.chatMeta}>
              <Text style={styles.chatName}>{chatName}</Text>
              <Text style={styles.chatObject}>{chatObject}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
              {conversation.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.from === 'me' ? styles.messageAgency : styles.messageClient,
                  ]}>
                  <Text
                    style={[
                      styles.messageText,
                      message.from === 'me' && styles.messageTextAgency,
                    ]}>
                    {message.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      message.from === 'me' && styles.messageTimeAgency,
                    ]}>
                    {message.time}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.composer}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                style={styles.input}
                placeholder="Напишите сообщение"
                placeholderTextColor="#939393"
              />
              <Pressable
                style={[styles.sendButton, (!draft.trim() || sending) && styles.sendButtonDisabled]}
                disabled={!draft.trim() || sending}
                onPress={sendMessage}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </>
        ) : null}

        {!loading && (!chatName || !chatObject) ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="chatbubbles-outline"
              title="Диалог не найден"
              description={loadError || 'Вернитесь к сообщениям агентства и выберите активный чат'}
              actionLabel="К сообщениям"
              onAction={() => router.replace('/agency-messages')}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 73,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 12,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 16 },
  loadingText: { fontSize: 13, lineHeight: 20, color: '#737373' },
  chatMeta: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  chatName: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  chatObject: { fontSize: 13, lineHeight: 20, color: '#939393' },
  messages: { padding: 16, gap: 10, paddingBottom: 100 },
  messageBubble: { maxWidth: '82%', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  messageClient: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF' },
  messageAgency: { alignSelf: 'flex-end', backgroundColor: '#70A0FF' },
  messageText: { fontSize: 14, lineHeight: 21, color: '#3A3A3A' },
  messageTextAgency: { color: '#FFFFFF' },
  messageTime: { marginTop: 4, fontSize: 11, lineHeight: 16, color: '#939393' },
  messageTimeAgency: { color: 'rgba(255,255,255,0.8)' },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#3A3A3A',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.6 },
  emptyWrap: { flex: 1, justifyContent: 'center', padding: 16 },
});
