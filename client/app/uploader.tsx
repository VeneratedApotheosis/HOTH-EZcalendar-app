import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

// Get screen dimensions for responsiveness
const { width, height } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size: number) => Math.round(size * scale);

export default function UploaderScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <TouchableOpacity onPress={() => router.push("/selector")}>
              <Ionicons name="arrow-back" size={24} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>File Uploader</Text>
          </View>
        </View>

        {/* ── Main Content Area - Scrollable ── */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* ── Centering Container ── */}
          <View style={styles.centerContainer}>
            <Text style={styles.headerTitle}>Upload Document</Text>
            <Text style={styles.headerSubtitle}>Select a file or paste text below</Text>

            {/* ── File Selection Area ── */}
            <TouchableOpacity style={styles.fileDropZone} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={normalize(40)} color={selectedFile ? "#7EB6FF" : "#94A3B8"} />
              <Text style={[styles.dropZoneText, selectedFile && { color: "#7EB6FF" }]}>
                {selectedFile ? selectedFile.name : "Tap to select PDF or TXT"}
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
              style={styles.textArea}
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
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleUpload}
            disabled={(!selectedFile && !pastedText) || isLoading}
            style={[
              styles.confirmBtn,
              (!selectedFile && !pastedText || isLoading) && styles.confirmBtnDisabled,
            ]}
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
    padding: normalize(20),
  },
  // ── New Container for centering contents ──
  centerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  // ── Top Bar Styles ──
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
  topBarTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#334155",
    letterSpacing: -0.5
  },
  // ── Page Content Styles ──
  headerTitle: {
    fontSize: normalize(26),
    fontWeight: "800",
    color: "#334155",
    marginBottom: normalize(8),
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: "#94A3B8",
    marginBottom: 30,
    textAlign: 'center',
  },
  // ── Drop Zone Styles ──
  fileDropZone: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(25),
    gap: normalize(10),
    marginBottom: 15,
  },
  dropZoneText: {
    fontSize: normalize(16),
    fontWeight: "700",
    color: "#334155",
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
    fontWeight: "700",
    color: "#94A3B8",
    marginVertical: 15,
    textAlign: "center",
    width: "100%",
  },
  // ── Text Area Styles ──
  textArea: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: normalize(20),
    fontSize: normalize(15),
    color: "#334155",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 150,
    textAlignVertical: 'top',
  },
  // ── Footer Styles ──
  footer: {
    padding: 20,
    backgroundColor: "transparent",
  },
  confirmBtn: {
    backgroundColor: "#7EB6FF",
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#7EB6FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  confirmBtnDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
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
