import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { USER_CHATS } from '@/constants/userMessages';

export default function UserMessagesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Сообщения</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {USER_CHATS.map((chat) => (
          <Pressable
            key={chat.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/message/[id]', params: { id: chat.id } })}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{chat.avatarLetter}</Text></View>
            <View style={styles.body}>
              <Text style={styles.name}>{chat.name}</Text>
              <Text style={styles.object}>{chat.object}</Text>
              <Text style={styles.text}>{chat.preview}</Text>
            </View>
            <View style={styles.meta}>
              <Text style={styles.time}>{chat.time}</Text>
              {chat.unread > 0 ? (
                <View style={styles.badge}><Text style={styles.badgeText}>{chat.unread}</Text></View>
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 63,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: '#3A3A3A' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  card: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, lineHeight: 24 },
  body: { flex: 1 },
  name: { fontSize: 15, lineHeight: 23, color: '#3A3A3A', fontWeight: '600' },
  object: { fontSize: 12, lineHeight: 18, color: '#939393' },
  text: { marginTop: 4, fontSize: 13, lineHeight: 20, color: '#3A3A3A' },
  meta: { alignItems: 'flex-end', minHeight: 48, justifyContent: 'space-between' },
  time: { fontSize: 11, lineHeight: 17, color: '#939393' },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { fontSize: 10, lineHeight: 15, color: '#FFFFFF', fontWeight: '600' },
});
