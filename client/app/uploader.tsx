import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

// ── Define normalization function outside the component ──
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = screenWidth / 375;
const normalize = (size: number) => Math.round(size * scale);

export default function UploaderScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Layout Logic ──
  const isSmallHeight = height < 700;
  const contentMaxWidth = 550;
  const horizontalPadding = width * 0.08;

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/plain"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setPastedText(""); // Clear text if file is picked
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile && !pastedText) return;

    setIsLoading(true);

    try {
      const formData = new FormData();

      if (selectedFile) {
        // For React Native File Uploads, we need this specific object structure
        formData.append("file", {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/octet-stream",
        } as any);
      } else {
        formData.append("content", pastedText);
      }

      const response = await fetch("YOUR_BACKEND_URL/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        alert("Data uploaded successfully!");
        router.push("/selector");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Something went wrong during upload.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Animation Logic for Blobs ──
  const blobAnim1 = useRef(new Animated.Value(0)).current;
  const blobAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (anim: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(blobAnim1, 5000).start();
    createAnimation(blobAnim2, 7000).start();
  }, []);

  // Map animations to positions
  const blobStyle1 = {
    transform: [
      { translateX: blobAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
      { translateY: blobAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) },
    ],
  };
  const blobStyle2 = {
    transform: [
      { translateX: blobAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) },
      { translateY: blobAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
    ],
  };

  return (
    <View style={styles.root}>
      {/* ── Blobs Layer (Lower zIndex) ── */}
      <View style={styles.blobContainer}>
        <Animated.View style={[styles.blob, styles.blob_one, blobStyle1]} />
        <Animated.View style={[styles.blob, styles.blob_two, blobStyle2]} />
        <Animated.View style={[styles.blob, styles.blob_three, blobStyle2]} />
        <Animated.View style={[styles.blob, styles.blob_four, blobStyle1]} />
      </View>

      {/* ── Content Layer (Higher zIndex) ── */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* ── Top Bar ── */}
          <View style={StyleSheet.flatten([styles.topBar, { paddingTop: Platform.OS === 'ios' ? 50 : 20 }])}>
            <TouchableOpacity onPress={() => router.push("/selector")} hitSlop={20}>
              <Ionicons name="arrow-back" size={26} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>File Uploader</Text>
            <View style={{ width: 26 }} /> {/* Spacer for alignment */}
          </View>

          {/* ── Main Content Area - Scrollable ── */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={StyleSheet.flatten([styles.centerWrapper, { maxWidth: contentMaxWidth, paddingHorizontal: horizontalPadding }])}>
              
              <View style={styles.headerArea}>
                <Text style={styles.headerTitle}>Upload Document</Text>
                <Text style={styles.headerSubtitle}>Choose a file or provide text</Text>
              </View>

              {/* ── File Selection Area ── */}
              <TouchableOpacity
                style={StyleSheet.flatten([
                  styles.fileDropZone,
                  selectedFile && { borderColor: "#7EB6FF", borderStyle: 'solid', borderWidth: 3 },
                  isSmallHeight && { paddingVertical: 30 }
                ])}
                onPress={pickDocument}
                activeOpacity={0.7}
              >
                <View style={StyleSheet.flatten([
                  styles.iconCircle,
                  isSmallHeight && { width: 60, height: 60, marginBottom: 10 }
                ])}>
                  <Ionicons
                    name={selectedFile ? "document-text" : "cloud-upload-outline"}
                    size={isSmallHeight ? 32 : 44}
                    color={selectedFile ? "#7EB6FF" : "#94A3B8"}
                  />
                </View>
                <Text style={styles.dropZoneText} numberOfLines={1}>
                  {selectedFile ? selectedFile.name : "Tap to select PDF/TXT"}
                </Text>
                {selectedFile && (
                  <Text style={styles.fileDetails}>
                    {((selectedFile.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={styles.orText}>OR</Text>

              {/* ── Text Input Area ── */}
              <TextInput
                style={StyleSheet.flatten([
                  styles.textArea,
                  { flex: isSmallHeight ? 0.6 : 0.8 } // Shrinks input on small screens
                ])}
                multiline
                numberOfLines={6}
                placeholder="Paste your text or syllabus content here..."
                value={pastedText}
                onChangeText={(text) => {
                  setPastedText(text);
                  if (text.length > 0) setSelectedFile(null); // Clear file if text is typed
                }}
                textAlignVertical="top"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </ScrollView>

          {/* ── Footer / Action Button ── */}
          <View style={StyleSheet.flatten([
            styles.footer,
            { paddingHorizontal: horizontalPadding, maxWidth: contentMaxWidth }
          ])}>
            <TouchableOpacity
              onPress={handleUpload}
              disabled={(!selectedFile && !pastedText) || isLoading}
              style={StyleSheet.flatten([
                styles.confirmBtn,
                (!selectedFile && !pastedText || isLoading) && styles.confirmBtnDisabled,
              ])}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmBtnText}>
                  {selectedFile || pastedText ? "Upload Data →" : "Select file or paste text"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F0F4F8", // Background for the whole screen
  },
  blobContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0, // Lower zIndex
  },
  container: {
    flex: 1,
    backgroundColor: "transparent", // Content is transparent to show blobs
    zIndex: 1, // Higher zIndex
  },
  // ── Updated ScrollView Style ──
  scrollContent: {
    flexGrow: 1, // ── 1. Allow scroll to fill space ──
    justifyContent: 'center', // ── 2. Center content vertically ──
  },
  // ── Center wrapper logic ──
  centerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly', // Distributes items perfectly
    paddingBottom: 20,
  },
  // ── Top Bar Styles ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    zIndex: 10,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#334155",
    letterSpacing: -0.5
  },
  // ── Page Content Styles ──
  headerArea: { alignItems: 'center', marginBottom: 20 },
  headerTitle: {
    fontSize: normalize(26),
    fontWeight: "800",
    color: "#334155",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: "#94A3B8",
    fontWeight: "600",
    textAlign: 'center',
  },
  // ── Drop Zone Styles ──
  fileDropZone: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderStyle: 'dashed',
    paddingVertical: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  dropZoneText: {
    fontSize: normalize(16),
    fontWeight: "800",
    color: "#94A3B8",
    textAlign: 'center',
    marginTop: 10,
  },
  fileDetails: {
    fontSize: normalize(12),
    color: "#94A3B8",
    fontWeight: "600",
  },
  // ── Styles for "OR" ──
  orText: {
    fontSize: normalize(14),
    fontWeight: "900",
    color: "#CBD5E1",
    marginVertical: 15,
    textAlign: "center",
    width: "100%",
  },
  // ── Text Area Styles ──
  textArea: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: normalize(20),
    fontSize: normalize(15),
    color: "#334155",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    textAlignVertical: 'top',
  },
  // ── Footer Styles ──
  footer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    alignSelf: 'center',
    backgroundColor: "transparent",
  },
  confirmBtn: {
    backgroundColor: "#7EB6FF",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#7EB6FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  confirmBtnDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2
  },
  // ── Blobs Styles ──
  blob: {
    position: 'absolute',
  },
  blob_one: { top: -40, right: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: '#adc5f1', opacity: 0.4 },
  blob_two: { bottom: '5%', left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: '#f4bfc7', opacity: 0.4 },
  blob_three: { top: '30%', left: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: '#adc5f1', opacity: 0.3 },
  blob_four: { bottom: '15%', right: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: '#f4bfc7', opacity: 0.3 },
});
