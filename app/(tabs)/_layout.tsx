import { Tabs } from 'expo-router';
import React from 'react';
<<<<<<< HEAD
import { AppTabBar } from '@/components/AppTabBar';
=======

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
>>>>>>> a6cf9b0a1952f5ef070b197f1a41b9f238c917b2

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
<<<<<<< HEAD
        headerShown: false,
      }}
      tabBar={(props) => <AppTabBar {...props} />}
=======
        tabBarActiveTintColor: '#70A0FF',
        tabBarInactiveTintColor: '#9B9B9B',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopColor: '#E8E8E8',
          backgroundColor: '#FFFFFF',
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
>>>>>>> a6cf9b0a1952f5ef070b197f1a41b9f238c917b2
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
<<<<<<< HEAD
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Каталог',
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Избранное',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
=======
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
>>>>>>> a6cf9b0a1952f5ef070b197f1a41b9f238c917b2
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
<<<<<<< HEAD
          href: null,
=======
          title: 'Проекты',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="building.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Аналитика',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
>>>>>>> a6cf9b0a1952f5ef070b197f1a41b9f238c917b2
        }}
      />
    </Tabs>
  );
}
