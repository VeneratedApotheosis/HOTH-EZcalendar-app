import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { AuthProvider } from './context';

export default function TabLayout() {
  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
        <Tabs.Screen name="login" options={{ title: 'login' }} />
        <Tabs.Screen
          name="gmail-picker"
          options={{
            title: 'Pick Emails',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="envelope.fill" color={color} />,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
