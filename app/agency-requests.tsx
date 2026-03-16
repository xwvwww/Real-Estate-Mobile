import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgencyBottomBar } from '@/components/AgencyBottomBar';
import { StatusBadge } from '@/components/StatusBadge';
import { AGENCY_REQUESTS } from '@/constants/agencyData';
import { CARD_RADIUS, LIGHT_CARD_SHADOW } from '@/constants/ui';

export default function AgencyRequestsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Заявки</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {AGENCY_REQUESTS.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => router.push(`/agency-request-view/${item.id}` as any)}>
            <Text style={styles.objectTitle}>{item.objectTitle}</Text>
            <Text style={styles.applicantName}>{item.applicantName}</Text>
            <Text style={styles.summary}>{item.summary}</Text>

            <View style={styles.bottomRow}>
              <StatusBadge label={item.status.label} backgroundColor={item.status.bgColor} textColor={item.status.textColor} />
              <Ionicons name="chevron-forward" size={18} color="#B6B6B6" />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <AgencyBottomBar active="requests" />
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
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    ...LIGHT_CARD_SHADOW,
  },
  objectTitle: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  applicantName: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
  },
  summary: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  bottomRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
