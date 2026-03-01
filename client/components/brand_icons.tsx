import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons, FontAwesome6, Feather, Ionicons } from '@expo/vector-icons';

// Define the shape of the props to stop the "size" error
interface BadgeProps {
  icon: React.ReactNode;
  label: string;
  size?: number;
}

export function GmailIcon({ size = 80 }) {
  return <MaterialCommunityIcons name="gmail" size={size} color="#EA4335" />;
}

export function CalendarIcon({ size = 75 }) {
  return <FontAwesome6 name="calendar-days" size={size} color="#1A73E8" />;
}

export function PDFIcon({ size = 32 }) {
  return <MaterialCommunityIcons name="file-pdf-box" size={size} color="#F44336" />;
}

export function TextIcon({ size = 28 }) {
  return <Ionicons name="document-text-outline" size={size} color="#7EB6FF" />;
}

interface IconProps {
  size?: number;
  color?: string;
}

export const FlowArrow = ({ size = 24 }: IconProps) => {
  return (
    // Make sure 'size' is actually used in your SVG or Image styles
    <View style={{ width: size, height: size }}>
       {/* Your arrow SVG code here */}
    </View>
  );
};

export function ServiceBadge({ icon, label, size = 100 }: BadgeProps) {
  return (
    <View style={iconStyles.badge}>
      <View style={[iconStyles.iconWrap, { width: size, height: size }]}>
        {icon}
      </View>
      <Text style={iconStyles.label}>{label}</Text>
    </View>
  );
}

const iconStyles = StyleSheet.create({
  badge: { alignItems: 'center', gap: 10 },
  iconWrap: { 
    borderRadius: 30, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: "#7EB6FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  label: { fontSize: 14, fontWeight: '800', color: '#64748B', marginTop: 4 },
});