import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CalendarEvent from '@/components/calendar-event';
import { useCalendarLocal } from '../components/calendar-context'; // Adjust path
import { EventDetails } from '@/utility/types';

export default function FinishScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { events } = useCalendarLocal();
  const colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];

  const handleAddToCalendar = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header "Blob" Container */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.gmailDot} />
          <Text style={styles.topBarTitle}>New Events:</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.calendarEventContainer}>
          {events.length === 0 ? (
            <Text style={styles.emptyText}>No events extracted yet. Try scanning a PDF!</Text>
          ) : (
            events.map((event: EventDetails, index: number) => (
              <CalendarEvent
                key={`${event.title}-${index}`} // Unique key for React
                title={event.title}
                // Combining Date and Time for the display if needed
                time={`${event.startTime} - ${event.endTime}`}
                color={colors[index % colors.length]}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Persistent Bottom Button */}
      <View style={styles.buttonContainer}>
        {status !== 'success' ? (
          <TouchableOpacity style={styles.button} onPress={handleAddToCalendar} disabled={status === 'loading'}>
            {status === 'loading' ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add to Google Calendar</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.buttonSuccess]} onPress={handleGoHome}>
            <Text style={styles.buttonText}>✓ Success! Return Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8', // Light grey background for the "main" area
  },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  headerBlob: {
    backgroundColor: 'white',
    paddingTop: 60, // Adjust based on status bar height
    paddingBottom: 20,
    borderBottomLeftRadius: 30, // The rounded corners at the bottom
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // Adding a subtle shadow to make the "blob" look elevated
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1, // Ensures it stays on top of the scroll content
  },
  headerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30, // Space between the blob and the first card
  },
  calendarEventContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'transparent', // Keep it clean on the grey background
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonSuccess: {
    backgroundColor: '#1e8e3e',
    shadowColor: '#1e8e3e',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,

    height: 76,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gmailDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF8A80', // Pastel Coral
    borderWidth: 2,
    borderColor: '#fff',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#334155',
    letterSpacing: -0.5,
  },
  topBarCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7EB6FF',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topBarCountContainer: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
