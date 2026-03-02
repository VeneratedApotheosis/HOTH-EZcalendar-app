import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CalendarEvent from '@/components/calendar-event';
import { useCalendarLocal } from '../components/calendar-context'; // Adjust path
import { EventDetails } from '@/utility/types';
import { useAddEvent } from '@/hooks/useAddEvent';

export default function FinishScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { events: allEvents } = useCalendarLocal();
  const colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];
  const { createEvent } = useAddEvent()
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (allEvents && allEvents.length > 0) {
      setSelectedIndices(new Set(allEvents.map((_, i) => i)));
    }
  }, [allEvents]);

  // 3. Toggle selection on press
  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const handleAddToCalendar = async () => {
    const eventsToAdd = allEvents.filter((_, index) => selectedIndices.has(index));

    if (eventsToAdd.length === 0) {
      return;
    }

    setStatus('loading');
    
    try {
      await Promise.all(
        eventsToAdd.map(async (localEvent) => {
          const eventPayload = {
            title: localEvent.title || 'Untitled Event',
            description: localEvent.description || '',
            location: localEvent.location || '',
            startTime: new Date(localEvent.startTime).toISOString(),
            endTime: new Date(localEvent.endTime).toISOString(),
          };

          return createEvent(eventPayload);
        })
      );

      setStatus('success');
    } catch (error) {
      console.error("Calendar Sync Error:", error);
      setStatus('idle'); 
    } finally {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStatus('idle'); 
    }
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
        
        {/* Added a counter to the top bar so users know how many are selected */}
        <View style={styles.topBarCountContainer}>
          <Text style={styles.topBarCount}>
            {selectedIndices.size} / {allEvents?.length || 0}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.calendarEventContainer}>
          {!allEvents || allEvents.length === 0 ? (
            <Text style={styles.emptyText}>No events extracted yet.</Text>
          ) : (
            allEvents.map((event: EventDetails, index: number) => {
              const isSelected = selectedIndices.has(index);

              return (
                // 5. Wrap the event card in a TouchableOpacity for selection
                <TouchableOpacity
                  key={`${event.title}-${index}`}
                  activeOpacity={0.8}
                  onPress={() => toggleSelection(index)}
                  style={[
                    styles.selectableCard,
                    isSelected ? styles.cardSelected : styles.cardUnselected
                  ]}
                >
                  <CalendarEvent
                    title={event.title}
                    time={`${new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(event.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                    color={colors[index % colors.length]}
                  />
                  
                  {/* Optional: A simple visual indicator (checkbox circle) */}
                  <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Persistent Bottom Button */}
      <View style={styles.buttonContainer}>
        {status !== 'success' ? (
          <TouchableOpacity 
            style={[styles.button, selectedIndices.size === 0 && styles.buttonDisabled]} 
            onPress={handleAddToCalendar} 
            disabled={status === 'loading' || selectedIndices.size === 0}
          >
            {status === 'loading' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {selectedIndices.size === 0 
                  ? "Select events to add" 
                  : `Add ${selectedIndices.size} to Calendar`}
              </Text>
            )}
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
  },selectableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingRight: 12,
  },
  cardSelected: {
    borderColor: '#1a73e8', // Blue border when selected
    backgroundColor: '#ffffff',
    opacity: 1,
  },
  cardUnselected: {
    borderColor: 'transparent',
    backgroundColor: '#ffffff',
    opacity: 0.5, // Dimmed when not selected
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto', // Pushes it to the right
  },
  checkboxActive: {
    backgroundColor: '#1a73e8',
    borderColor: '#ffffff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#A0C3FF', // Lighter blue when disabled
    shadowOpacity: 0,
  }
});
