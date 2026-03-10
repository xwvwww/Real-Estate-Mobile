import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE_COLOR = '#70A0FF';
const INACTIVE_COLOR = '#939393';

const ROUTE_CONFIG: Record<
  string,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  index: { label: 'Главная', icon: 'home-outline' },
  projects: { label: 'Каталог', icon: 'search-outline' },
<<<<<<< HEAD
  favorites: { label: 'Избранное', icon: 'heart-outline' },
=======
  analytics: { label: 'Избранное', icon: 'heart-outline' },
>>>>>>> origin/develop
  profile: { label: 'Профиль', icon: 'person-outline' },
};

export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const visibleRoutes = state.routes.filter((route) => {
    const options = descriptors[route.key]?.options;
    return options?.href !== null && ROUTE_CONFIG[route.name];
  });

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom - 18, 0) }]}>
      <View style={styles.topBorder} />
      <View style={styles.contentRow}>
        {visibleRoutes.map((route) => {
          const config = ROUTE_CONFIG[route.name];
          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const isFocused = state.index === routeIndex;
          const tintColor = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              onLongPress={() => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              }}
              style={styles.tabItem}
              hitSlop={8}
            >
              <Ionicons name={config.icon} size={24} color={tintColor} />
              <Text style={[styles.tabLabel, { color: tintColor }]} numberOfLines={1}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  topBorder: {
    height: 1,
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
  contentRow: {
    minHeight: 62,
    paddingTop: 6,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
