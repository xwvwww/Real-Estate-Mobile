import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getAgencyMessageById } from '@/constants/agencyData';

export default function AgencyMessageViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const chat = getAgencyMessageById(id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Сообщения</Text>
      </View>

      {chat ? (
        <>
          <View style={styles.chatMeta}>
            <Text style={styles.chatName}>{chat.name}</Text>
            <Text style={styles.chatObject}>{chat.object}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
            {chat.messages.map((message) => (
              <View key={message.id} style={[styles.messageBubble, message.author === 'agency' ? styles.messageAgency : styles.messageClient]}>
                <Text style={[styles.messageText, message.author === 'agency' && styles.messageTextAgency]}>{message.text}</Text>
                <Text style={[styles.messageTime, message.author === 'agency' && styles.messageTimeAgency]}>{message.time}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.composer}>
            <TextInput style={styles.input} placeholder="Напишите сообщение" placeholderTextColor="#939393" />
            <Pressable style={styles.sendButton}>
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.empty}>Диалог не найден</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { height: 73, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E8E8E8', justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', left: 12, width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  chatMeta: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
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
  composer: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10, padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E8E8E8' },
  input: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#F8F8F8', paddingHorizontal: 16, fontSize: 15, color: '#3A3A3A' },
  sendButton: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { fontSize: 16, lineHeight: 24, color: '#3A3A3A' },
});
