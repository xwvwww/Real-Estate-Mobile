import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgencyBottomBar } from '@/components/AgencyBottomBar';

type RequestStatus = {
  label: string;
  textColor: string;
  bgColor: string;
};

type AgencyRequest = {
  id: string;
  objectTitle: string;
  applicantName: string;
  summary: string;
  status: RequestStatus;
  actions?: boolean;
};

const REQUESTS: AgencyRequest[] = [
  {
    id: '1',
    objectTitle: '2-комнатная квартира в центре',
    applicantName: 'Иван Иванов',
    summary: 'Семья из 3 человек, доход подтвержден',
    status: {
      label: 'Новая',
      textColor: '#1976D2',
      bgColor: '#E3F2FD',
    },
    actions: true,
  },
  {
    id: '2',
    objectTitle: '3-комнатная квартира с ремонтом',
    applicantName: 'Мария Петрова',
    summary: 'Семья из 2 человек, постоянный доход',
    status: {
      label: 'Рассматривается',
      textColor: '#F57C00',
      bgColor: '#FFF3E0',
    },
  },
  {
    id: '3',
    objectTitle: 'Студия в новостройке',
    applicantName: 'Алексей Сидоров',
    summary: 'Один человек, офисная работа',
    status: {
      label: 'Одобрена',
      textColor: '#388E3C',
      bgColor: '#E8F5E9',
    },
  },
];

export default function AgencyRequestsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Кабинет агентства</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {REQUESTS.map((item) => (
          <View key={item.id} style={[styles.card, item.actions ? styles.cardLarge : styles.cardCompact]}>
            <Text style={styles.objectTitle}>{item.objectTitle}</Text>
            <Text style={styles.applicantName}>{item.applicantName}</Text>
            <Text style={styles.summary}>{item.summary}</Text>

            <View style={styles.bottomRow}>
              <View style={[styles.statusPill, { backgroundColor: item.status.bgColor }]}> 
                <Text style={[styles.statusText, { color: item.status.textColor }]}>{item.status.label}</Text>
              </View>
            </View>

            {item.actions ? (
              <View style={styles.actionsRow}>
                <Pressable style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Принять</Text>
                </Pressable>

                <Pressable style={styles.rejectButton}>
                  <Text style={styles.rejectButtonText}>Отклонить</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
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
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  cardLarge: {
    minHeight: 194,
  },
  cardCompact: {
    minHeight: 155,
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
    justifyContent: 'flex-start',
  },
  statusPill: {
    height: 26,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  rejectButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#D32F2F',
    fontWeight: '500',
  },
});
