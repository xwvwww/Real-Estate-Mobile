import { Tabs } from 'expo-router';
import React from 'react';
import { AppTabBar } from '@/components/AppTabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
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
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
