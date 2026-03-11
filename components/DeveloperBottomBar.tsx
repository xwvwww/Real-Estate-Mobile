import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type DeveloperTabKey =
  | 'overview'
  | 'projects'
  | 'objects'
  | 'requests'
  | 'analytics'
  | 'settings';

type TabConfig = {
  key: DeveloperTabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const TABS: TabConfig[] = [
  { key: 'overview', label: 'Обзор', icon: 'home-outline', route: '/developer-dashboard' },
  { key: 'projects', label: 'Проекты', icon: 'business-outline', route: '/developer-projects' },
  { key: 'objects', label: 'Объекты', icon: 'layers-outline', route: '/developer-objects' },
  { key: 'requests', label: 'Заявки', icon: 'mail-outline', route: '/developer-requests' },
  { key: 'analytics', label: 'Аналитика', icon: 'bar-chart-outline', route: '/developer-analytics' },
  { key: 'settings', label: 'Настройки', icon: 'settings-outline', route: '/developer-settings' },
];

type Props = {
  active: DeveloperTabKey;
};

export function DeveloperBottomBar({ active }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom - 14, 2) }]}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const color = isActive ? '#70A0FF' : '#939393';

        return (
          <Pressable
            key={tab.key}
            style={styles.bottomItem}
            onPress={() => {
              if (!isActive) {
                router.replace(tab.route as never);
              }
            }}>
            <Ionicons name={tab.icon} size={20} color={color} />
            <Text style={[styles.bottomLabel, isActive && styles.bottomLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    minHeight: 62,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 7,
  },
  bottomItem: {
    minWidth: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLabel: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 15,
    color: '#939393',
    textAlign: 'center',
  },
  bottomLabelActive: {
    color: '#70A0FF',
  },
});
