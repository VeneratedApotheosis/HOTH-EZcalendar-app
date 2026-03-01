import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Get screen dimensions for responsiveness
const { width, height } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size: number) => Math.round(size * scale);

// Calculate button width proportionally
const PADDING_HORIZONTAL = normalize(20);
const BUTTON_GAP = normalize(12);
const MAX_BUTTON_WIDTH = 300;
const calculatedWidth = (width - (PADDING_HORIZONTAL * 2) - BUTTON_GAP) / 2;
const BUTTON_WIDTH = Math.min(calculatedWidth, MAX_BUTTON_WIDTH);

export default function SelectorScreen() {
  return (
    <View style={styles.container}>
      {/* ── Top Bar - Reduced Padding ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.gmailDot} />
          <Text style={styles.topBarTitle}>Upload Source</Text>
        </View>
      </View>

      {/* ── Main Content Area ── */}
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Select Import Type</Text>
        <Text style={styles.headerSubtitle}>Choose how to populate your calendar</Text>

        {/* ── Action Buttons ── */}
        <View style={styles.buttonContainer}>
          
          {/* Button 1: File Uploader */}
          <Link href="/uploader" asChild>
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
              <View style={styles.iconBackground}>
                <Ionicons name="document-text-outline" size={normalize(32)} color="#7EB6FF" />
              </View>
              <Text style={styles.cardTitle}>File System</Text>
              <Text style={styles.cardDescription}>TXT / PDF documents</Text>
            </TouchableOpacity>
          </Link>

          {/* Button 2: Gmail Picker */}
          <Link href="/gmail_picker" asChild>
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
              <View style={[styles.iconBackground, { backgroundColor: '#FFEDEA' }]}>
                <MaterialCommunityIcons name="gmail" size={normalize(32)} color="#FF8A80" />
              </View>
              <Text style={styles.cardTitle}>Gmail</Text>
              <Text style={styles.cardDescription}>Select from inbox</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8", // Pastel Blue background
  },
  
  // ── Top Bar Styles - FIXED PADDING ──
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
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  gmailDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF8A80", // Pastel Coral
    borderWidth: 2,
    borderColor: "#fff"
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#334155",
    letterSpacing: -0.5
  },
  
  // ── Page Content Styles ──
  content: {
    flex: 1,
    padding: PADDING_HORIZONTAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: normalize(26),
    fontWeight: "bold",
    color: "#334155",
    marginBottom: normalize(8),
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: "#94A3B8",
    marginBottom: height * 0.05,
    textAlign: 'center',
  },
  
  // ── Button Card Styles ──
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: BUTTON_GAP,
    width: "100%",
  },
  card: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: BUTTON_WIDTH,
    
    // Rounded and Shadowed
    padding: normalize(25),
    borderRadius: 28,
    
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBackground: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  cardTitle: {
    fontSize: normalize(17),
    fontWeight: "700",
    color: "#334155",
    marginBottom: normalize(6),
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: normalize(13),
    color: "#94A3B8",
    textAlign: 'center',
    fontWeight: "600",
  },
});
