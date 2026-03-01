import React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  useWindowDimensions, 
  ScrollView, 
  Platform 
} from "react-native";
import { Link } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function SelectorScreen() {
  const { width } = useWindowDimensions();

  // ── Responsive Logic ──
  const isTablet = width > 768;
  const isSmallPhone = width < 380;
  
  const horizontalPadding = (width * 0.08) || 24; 
  const cardGap = 50; 
  const columnCount = isTablet ? 3 : 2;
  
  // Calculate width for the "Tall Rectangle" look
  const cardWidth = (width - (horizontalPadding * 2) - (cardGap * (columnCount - 1))) / columnCount;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={StyleSheet.flatten([
          styles.scrollContent, 
          { paddingHorizontal: horizontalPadding }
        ])}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Section ── */}
        <View style={styles.headerArea}>
          <Text style={StyleSheet.flatten([
            styles.headerTitle, 
            { fontSize: isTablet ? 40 : 32 }
          ])}>
            Import Source
          </Text>
          <Text style={StyleSheet.flatten([
            styles.headerSubtitle, 
            { fontSize: isTablet ? 20 : 16 }
          ])}>
            Choose a method to populate your calendar
          </Text>
        </View>

        {/* ── Large Tall Grid ── */}
        <View style={StyleSheet.flatten([styles.grid, { gap: cardGap }])}>
          
          {/* Item 1: File System */}
          <Link href="/uploader" asChild>
            <TouchableOpacity 
              style={StyleSheet.flatten([styles.card, { width: cardWidth }])} 
              activeOpacity={0.7}
            >
              <View style={styles.iconBackground}>
                <Ionicons name="document-text-outline" size={isTablet ? 50 : 42} color="#7EB6FF" />
              </View>
              <Text style={styles.cardTitle}>File System</Text>
              {!isSmallPhone && <Text style={styles.cardDescription}>PDF or TXT</Text>}
            </TouchableOpacity>
          </Link>

          {/* Item 2: Gmail */}
          <Link href="/gmail_picker" asChild>
            <TouchableOpacity 
              style={StyleSheet.flatten([styles.card, { width: cardWidth }])} 
              activeOpacity={0.7}
            >
              <View style={[styles.iconBackground, { backgroundColor: '#FFEDEA' }]}>
                <MaterialCommunityIcons name="gmail" size={isTablet ? 50 : 42} color="#FF8A80" />
              </View>
              <Text style={styles.cardTitle}>Gmail</Text>
              {!isSmallPhone && <Text style={styles.cardDescription}>Inbox Sync</Text>}
            </TouchableOpacity>
          </Link>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 60, // Added more top space since the bar is gone
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 60,
  },
  headerTitle: {
    fontWeight: "900",
    color: "#334155",
    textAlign: 'center',
    letterSpacing: -1,
  },
  headerSubtitle: {
    color: "#94A3B8",
    marginTop: 12,
    textAlign: 'center',
    fontWeight: "600",
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 60, // Very tall padding
    borderRadius: 35,
    alignItems: "center",
    justifyContent: 'center',
    minHeight: 250, // Guaranteed tall rectangle
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 10 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 20 
      },
      android: { elevation: 8 },
      web: { boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }
    })
  },
  iconBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#334155",
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 10,
    textAlign: 'center',
    fontWeight: "700",
  },
});