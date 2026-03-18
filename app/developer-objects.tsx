import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { DEVELOPER_OBJECTS } from '@/constants/developerData';
import { CARD_RADIUS, ELEVATED_CARD_SHADOW } from '@/constants/ui';

export default function DeveloperObjectsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/developer-dashboard')}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Объекты</Text>
      </View>

      <View style={styles.main}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never">
          {DEVELOPER_OBJECTS.length === 0 ? (
            <EmptyState icon="home-outline" title="Пока нет объектов" description="Добавленные объекты будут отображаться в этом разделе" />
          ) : null}

          {DEVELOPER_OBJECTS.map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/developer-object-view/[id]', params: { id: item.id } })}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.project}>{item.project}</Text>

              <View style={styles.metaRow}>
                <StatusBadge label={item.status.label} backgroundColor={item.status.bg} textColor={item.status.color} />

                <View style={styles.viewsWrap}>
                  <Ionicons name="eye-outline" size={14} color="#939393" />
                  <Text style={styles.viewsText}>{item.views}</Text>
                </View>
              </View>

              <Text style={styles.date}>{item.date}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable style={styles.addButton} onPress={() => router.push('/developer-create-object')}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <DeveloperBottomBar active="objects" />
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
  backButton: {
    position: 'absolute',
    left: 12,
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  main: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    ...ELEVATED_CARD_SHADOW,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  project: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 34,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#70A0FF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
