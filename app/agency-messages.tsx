import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgencyBottomBar } from '@/components/AgencyBottomBar';
import { AGENCY_MESSAGES } from '@/constants/agencyData';

export default function AgencyMessagesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Сообщения</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {AGENCY_MESSAGES.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => router.push(`/agency-message/${item.id}` as any)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.avatarLetter}</Text>
            </View>

            <View style={styles.body}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.object}>{item.object}</Text>
              <Text style={styles.preview}>{item.preview}</Text>
            </View>

            <View style={styles.meta}>
              <Text style={styles.time}>{item.time}</Text>
              {item.unreadCount ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <AgencyBottomBar active="messages" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    height: 73,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    minHeight: 98,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    lineHeight: 23,
    color: '#3A3A3A',
    fontWeight: '600',
  },
  object: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  preview: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#3A3A3A',
  },
  meta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  time: {
    fontSize: 11,
    lineHeight: 17,
    color: '#939393',
  },
  unreadBadge: {
    marginTop: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
