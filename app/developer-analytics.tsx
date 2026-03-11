import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';

type Metric = {
  id: string;
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
};

const METRICS: Metric[] = [
  {
    id: 'views',
    value: '24 567',
    label: 'Просмотры объектов',
    icon: 'eye-outline',
    iconColor: '#70A0FF',
    iconBg: '#F0F7FF',
  },
  {
    id: 'requests',
    value: '142',
    label: 'Количество заявок',
    icon: 'mail-outline',
    iconColor: '#70A0FF',
    iconBg: '#F0F7FF',
  },
  {
    id: 'activity',
    value: '8 934',
    label: 'Активность пользователей',
    icon: 'trending-up-outline',
    iconColor: '#388E3C',
    iconBg: '#E8F5E9',
  },
];

const SALES_BARS = [58, 84, 102, 124, 116, 138];
const SALES_MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];

export default function DeveloperAnalyticsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/developer-dashboard')}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Кабинет застройщика</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.metricsWrap}>
          {METRICS.map((item) => (
            <View key={item.id} style={styles.metricCard}>
              <View>
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
              </View>
              <View style={[styles.metricIconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={28} color={item.iconColor} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Динамика продаж</Text>
            <Pressable style={styles.periodButton}>
              <Text style={styles.periodText}>6 мес</Text>
              <Ionicons name="chevron-down" size={14} color="#939393" />
            </Pressable>
          </View>

          <View style={styles.chartArea}>
            <View style={styles.barsRow}>
              {SALES_BARS.map((height, idx) => (
                <View key={`${height}-${idx}`} style={styles.barSlot}>
                  <View style={[styles.bar, { height }]} />
                </View>
              ))}
            </View>
            <View style={styles.monthsRow}>
              {SALES_MONTHS.map((month) => (
                <Text key={month} style={styles.monthText}>
                  {month}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <DeveloperBottomBar active="analytics" />
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  metricsWrap: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    minHeight: 105,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 32,
    lineHeight: 48,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  metricLabel: {
    fontSize: 14,
    lineHeight: 21,
    color: '#939393',
  },
  metricIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCard: {
    marginTop: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  periodButton: {
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3A3A',
  },
  chartArea: {
    marginTop: 16,
  },
  barsRow: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F5',
    paddingBottom: 8,
  },
  barSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#70A0FF',
  },
  monthsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthText: {
    width: 38,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    color: '#939393',
  },
});
