import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CalendarEvent from '@/components/calendar-event';

export default function FinishScreen() {
  const router = useRouter(); // Initialize the router
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAddToCalendar = () => {
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const handleGoHome = () => {
    // Navigate back to the index screen
    router.replace('/');
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerText}>New Events:</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.calendarEventContainer}>
          <CalendarEvent title={'Eating'} time={'2pm - 4pm'} color={'#bae1ff'} />
          <CalendarEvent title={'Meeting?'} time={'8pm - 10pm'} color={'#bae1ff'} />
          <CalendarEvent title={'A hackathon'} time={'3pm - 7pm'} color={'#bae1ff'} />
          <CalendarEvent title={'A hackathon'} time={'3pm - 7pm'} color={'#bae1ff'} />
          <CalendarEvent title={'Club Meeting'} time={'10am - 7pm'} color={'#bae1ff'} />
          <CalendarEvent title={'Scrub'} time={'7pm - 8pm'} color={'#bae1ff'} />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {status !== 'success' ? (
          // INITIAL BUTTON (Add to Calendar)
          <TouchableOpacity style={styles.button} onPress={handleAddToCalendar} disabled={status === 'loading'}>
            {status === 'loading' ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add to Google Calendar</Text>}
          </TouchableOpacity>
        ) : (
          // SUCCESS STATE BUTTON (Go Home)
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
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3c4043',
    textAlign: 'center',
  },
  calendarEventContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40, // Extra padding for modern iPhones (Safe Area)
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  buttonSuccess: {
    backgroundColor: '#1e8e3e', // Green for success
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
