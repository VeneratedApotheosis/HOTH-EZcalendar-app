import { Tabs, useRootNavigationState } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { AuthProvider } from '../components/context';
import { CalendarProvider } from '@/components/calendar-context';
import { useState, useEffect } from 'react';

export default function TabLayout() {
  const rootNavigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if the navigation state is actually loaded
    if (rootNavigationState?.key) {
      setIsReady(true);
    }
  }, [rootNavigationState?.key]);

  if (!isReady) {
    return null; // Or a Loading Spinner
  }

  return (
    <AuthProvider>
      <CalendarProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen name="test" options={{ title: 'test' }} />
          <Tabs.Screen name="finish" options={{ title: 'finish' }} />
          <Tabs.Screen name="uploader" options={{ title: 'uploader' }} />
          <Tabs.Screen name="selector" options={{ title: 'selector' }} />
          <Tabs.Screen
            name="gmail_picker"
            options={{
              title: 'Pick Emails',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="envelope.fill" color={color} />,
            }}
          />
        </Tabs>
      </CalendarProvider>
    </AuthProvider>
  );
}
