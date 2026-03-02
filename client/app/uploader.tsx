import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  useWindowDimensions,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

export default function UploaderScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  // ── Logic for scaling and layout ──
  const isLargeScreen = width > 850;
  const scale = width > 1200 ? 1.0 : width / 375;
  const normalize = (size: number) => Math.round(Platform.OS === 'web' ? Math.min(size * scale, size * 1.1) : size * scale);

  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Blobs Animation ──
  const blobAnim1 = useRef(new Animated.Value(0)).current;
  const blobAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnim = (anim: Animated.Value, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(anim, { toValue: 0, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
        ])
      ).start();
    };
    startAnim(blobAnim1, 6000);
    startAnim(blobAnim2, 8000);
  }, []);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "text/plain"] });
    if (!result.canceled && result.assets) {
      setSelectedFile(result.assets[0]);
      setPastedText("");
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Background Blobs ── */}
      <View style={styles.blobContainer}>
        <Animated.View style={[styles.blob, styles.blob_one, { transform: [{ translateY: blobAnim1.interpolate({inputRange:[0,1], outputRange:[0, 30]}) }] }]} />
        <Animated.View style={[styles.blob, styles.blob_two, { transform: [{ translateX: blobAnim2.interpolate({inputRange:[0,1], outputRange:[0, -20]}) }] }]} />
        <Animated.View style={[styles.blob, styles.blob_three, { transform: [{ translateY: blobAnim2.interpolate({inputRange:[0,1], outputRange:[0, -30]}) }] }]} />
        <Animated.View style={[styles.blob, styles.blob_four, { transform: [{ translateX: blobAnim1.interpolate({inputRange:[0,1], outputRange:[0, 20]}) }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={20}>
              <Ionicons name="arrow-back" size={26} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>File Uploader</Text>
            <View style={{ width: 26 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ── FIX: Added parent container to center content ── */}
            <View style={styles.outerContainer}>
                <View style={styles.centerContainer}>
                  
                    <View style={styles.headerArea}>
                        <Text style={[styles.headerTitle, { fontSize: normalize(26) }]}>Upload Document</Text>
                        <Text style={styles.headerSubtitle}>Choose a file or provide text to get started</Text>
                    </View>

                    <View style={[styles.mainLayout, isLargeScreen && styles.rowLayout]}>
                        
                        {/* Left: File Zone */}
                        <View style={styles.column}>
                        <TouchableOpacity
                            style={[styles.fileDropZone, selectedFile && styles.fileSelectedBorder]}
                            onPress={pickDocument}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconCircle}>
                            <Ionicons
                                name={selectedFile ? "document-text" : "cloud-upload-outline"}
                                size={normalize(32)}
                                color={selectedFile ? "#7EB6FF" : "#94A3B8"}
                            />
                            </View>
                            <Text style={styles.dropZoneText} numberOfLines={1}>
                            {selectedFile ? selectedFile.name : "Tap to select PDF/TXT"}
                            </Text>
                            {selectedFile && <Text style={styles.fileDetails}>Ready</Text>}
                        </TouchableOpacity>
                        </View>

                        {/* The Divider */}
                        <View style={isLargeScreen ? styles.orColumn : styles.orRow}>
                        <View style={isLargeScreen ? styles.vLine : styles.hLine} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={isLargeScreen ? styles.vLine : styles.hLine} />
                        </View>

                        {/* Right: Text Input */}
                        <View style={styles.column}>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            placeholder="Paste text here..."
                            value={pastedText}
                            onChangeText={(text) => {
                            setPastedText(text);
                            if (text.length > 0) setSelectedFile(null);
                            }}
                            textAlignVertical="top"
                            placeholderTextColor="#94A3B8"
                        />
                        </View>

                    </View>

                    <TouchableOpacity
                        onPress={() => setIsLoading(true)}
                        disabled={(!selectedFile && !pastedText) || isLoading}
                        style={[styles.confirmBtn, (!selectedFile && !pastedText || isLoading) && styles.confirmBtnDisabled]}
                    >
                        {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.confirmBtnText}>Upload Data →</Text>}
                    </TouchableOpacity>

                </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F4F8" },
  blobContainer: { ...StyleSheet.absoluteFillObject, zIndex: 0, overflow: 'hidden' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  topBarTitle: { fontSize: 20, fontWeight: "900", color: "#334155", letterSpacing: -0.5 },
  
  scrollContent: { flexGrow: 1 },
  // ── FIX: Ensures content is centered horizontally ──
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  centerContainer: {
    width: '90%',
    maxWidth: 1000,
    paddingTop: 20,
  },
  
  headerArea: { alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontWeight: "800", color: "#334155" },
  headerSubtitle: { color: "#94A3B8", fontWeight: "600", marginTop: 5, textAlign: 'center', fontSize: 14 },

  mainLayout: { width: '100%' },
  rowLayout: { flexDirection: 'row', alignItems: 'stretch' },
  column: { flex: 1 },

  fileDropZone: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderStyle: 'dashed',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: 180,
  },
  fileSelectedBorder: { borderColor: "#7EB6FF", borderStyle: 'solid', borderWidth: 3 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  dropZoneText: { fontSize: 14, fontWeight: "800", color: "#94A3B8" },
  fileDetails: { fontSize: 12, color: "#7EB6FF", fontWeight: "700", marginTop: 2 },

  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  orColumn: { width: 60, alignItems: 'center', justifyContent: 'center' },
  hLine: { flex: 1, height: 1, backgroundColor: '#CBD5E1', opacity: 0.5 },
  vLine: { width: 1, height: '30%', backgroundColor: '#CBD5E1', opacity: 0.5 },
  orText: { marginHorizontal: 10, marginVertical: 8, fontWeight: "900", color: "#CBD5E1", fontSize: 12 },

  textArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 15,
    fontSize: 14,
    color: "#334155",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 180,
  },

  confirmBtn: {
    backgroundColor: "#7EB6FF",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
    width: Platform.OS === 'web' ? 300 : '100%',
    alignSelf: 'center',
    elevation: 8,
    shadowColor: "#7EB6FF",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  confirmBtnDisabled: { backgroundColor: "#CBD5E1", shadowOpacity: 0 },
  confirmBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },

  blob: { position: 'absolute', zIndex: 0 },
  // ── FIX: Matching sizes from selector.tsx exactly ──
  blob_one: { top: -40, right: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: '#adc5f1', opacity: 0.4 },
  blob_two: { bottom: '5%', left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: '#f4bfc7', opacity: 0.4 },
  blob_three: { top: '30%', left: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: '#adc5f1', opacity: 0.3 },
  blob_four: { bottom: '15%', right: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: '#f4bfc7', opacity: 0.3 },
});
