import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
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

const PERIODS = [
  { key: '3m', label: '3 мес', bars: [72, 96, 118], months: ['Янв', 'Фев', 'Мар'] },
  { key: '6m', label: '6 мес', bars: [58, 84, 102, 124, 116, 138], months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'] },
  { key: '9m', label: '9 мес', bars: [40, 58, 84, 102, 124, 116, 138, 130, 145], months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'] },
  { key: '12m', label: '12 мес', bars: [36, 48, 57, 72, 84, 102, 124, 116, 138, 130, 142, 150], months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'] },
] as const;

export default function DeveloperAnalyticsScreen() {
  const router = useRouter();
  const [periodOpen, setPeriodOpen] = useState(false);
  const [periodKey, setPeriodKey] = useState<(typeof PERIODS)[number]['key']>('6m');
  const selectedPeriod = useMemo(() => PERIODS.find((item) => item.key === periodKey) ?? PERIODS[1], [periodKey]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/developer-dashboard')}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Аналитика</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.metricsWrap}>
          {METRICS.map((item) => (
            <Pressable
              key={item.id}
              style={styles.metricCard}
              onPress={item.id === 'requests' ? () => router.replace('/developer-requests') : undefined}>
              <View>
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
              </View>
              <View style={[styles.metricIconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={28} color={item.iconColor} />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Динамика продаж</Text>
            <View style={styles.periodWrap}>
              <Pressable style={styles.periodButton} onPress={() => setPeriodOpen((prev) => !prev)}>
                <Text style={styles.periodText}>{selectedPeriod.label}</Text>
                <Ionicons name={periodOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#939393" />
              </Pressable>

              {periodOpen ? (
                <View style={styles.periodMenu}>
                  {PERIODS.map((period, index) => (
                    <Pressable
                      key={period.key}
                      style={[
                        styles.periodItem,
                        period.key === periodKey && styles.periodItemActive,
                        index === PERIODS.length - 1 && styles.periodItemLast,
                      ]}
                      onPress={() => {
                        setPeriodKey(period.key);
                        setPeriodOpen(false);
                      }}>
                      <Text style={[styles.periodItemText, period.key === periodKey && styles.periodItemTextActive]}>
                        {period.label}
                      </Text>
                      {period.key === periodKey ? <Ionicons name="checkmark" size={16} color="#70A0FF" /> : null}
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.chartArea}>
            <View style={styles.barsRow}>
              {selectedPeriod.bars.map((height, idx) => (
                <View key={`${height}-${idx}`} style={styles.barSlot}>
                  <View style={[styles.bar, { height }]} />
                </View>
              ))}
            </View>
            <View style={styles.monthsRow}>
              {selectedPeriod.months.map((month) => (
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
    zIndex: 5,
  },
  periodWrap: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  chartTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  periodButton: {
    minWidth: 82,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#3A3A3A',
  },
  periodMenu: {
    position: 'absolute',
    top: 34,
    right: 0,
    width: 92,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
    zIndex: 20,
  },
  periodItem: {
    minHeight: 36,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  periodItemLast: {
    borderBottomWidth: 0,
  },
  periodItemActive: {
    backgroundColor: '#F0F7FF',
  },
  periodItemText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3A3A',
  },
  periodItemTextActive: {
    color: '#70A0FF',
    fontWeight: '600',
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
    gap: 6,
  },
  monthText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    color: '#939393',
  },
});
