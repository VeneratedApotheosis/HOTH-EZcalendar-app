import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import Parser from '@/components/Parser';
import GmailDisplay from '@/components/gmail-display';
import LoginButton from '@/components/login';

import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Title and Description */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Name
        </ThemedText>
        <ThemedText style={styles.description}>This is the app description that sits below the title.</ThemedText>

        {/* Icons */}
        <View style={styles.mainIconContainer}>
          {/* Stacked Icons */}
          <View style={styles.leftStack}>
            <MaterialCommunityIcons name="email-outline" size={32} color="#4285F4" style={styles.iconSpacing} />
            <FontAwesome name="file-text-o" size={30} color="#4285F4" style={styles.iconSpacing} />
            <FontAwesome name="file-pdf-o" size={30} color="#4285F4" />
          </View>

          {/* Arrow */}
          <Ionicons name="arrow-forward-outline" size={32} color="#000" style={styles.arrow} />

          {/* Calendar Icon */}
          <View style={styles.calendar}>
            <FontAwesome name="calendar" size={64} color="#4285F4" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 80,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  description: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },

  mainIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',

    // card styles, can remove if it looks bad
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  leftStack: {
    flexDirection: 'column',
    marginRight: 20,
    alignItems: 'center',
  },
  iconSpacing: {
    marginBottom: 10,
  },
  arrow: {
    marginRight: 20,
  },
  calendar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
  },
});
