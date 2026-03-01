import { Image } from 'expo-image';
import { Text, Platform, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import LoginButton from '@/components/login';

import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Title and Description */}
      <View style={styles.header}>
        <Text style={styles.title}>EZcalendar</Text>
        <Text style={styles.description}>Parse your emails and documents to automatically populate your calendar.</Text>

        {/* Icons Card - Now Styled with Modern Look */}
        <View style={styles.mainIconContainer}>
          {/* Stacked Icons */}
          <View style={styles.leftStack}>
            <MaterialCommunityIcons name="email-outline" size={32} color="#4285F4" style={styles.iconSpacing} />
            <FontAwesome name="file-text-o" size={30} color="#4285F4" style={styles.iconSpacing} />
            <FontAwesome name="file-pdf-o" size={30} color="#4285F4" />
          </View>
          {/* Arrow */}
          <Ionicons name="arrow-forward-outline" size={32} color="#A0A0A0" style={styles.arrow} />
          {/* Calendar Icon */}
          <View style={styles.calendar}>
            <FontAwesome name="calendar" size={64} color="#4285F4" />
          </View>
        </View>
      </View>
      {/* Login Button Area */}
      <View style={styles.loginButtonWrapper}>
        <LoginButton />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light, modern background color
    paddingHorizontal: 24,
    paddingVertical: 60,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    gap: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800', // Extra bold for visual hierarchy
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5F6368',
    lineHeight: 24, // Improves readability
    paddingHorizontal: 10,
    marginBottom: 30,
  },

  mainIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',

    // Modern Card Styles
    backgroundColor: '#FFFFFF', // Solid white card
    borderRadius: 24, // More rounded corners
    padding: 30, // Increased padding

    // Shadows for Depth (makes it look like a physical card)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, // Android shadow
  },

  leftStack: {
    flexDirection: 'column',
    marginRight: 25,
    alignItems: 'center',
  },
  iconSpacing: {
    marginBottom: 15,
  },
  arrow: {
    marginRight: 25,
  },
  calendar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});
