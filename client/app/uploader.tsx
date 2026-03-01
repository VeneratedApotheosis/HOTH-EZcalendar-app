import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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
      router.back();
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

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#334155" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>File Uploader</Text>
        </View>
      </View>

      {/* ── Main Content Area - Scrollable ── */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Upload Document</Text>
        <Text style={styles.headerSubtitle}>Select a file or paste text below</Text>

        {/* ── File Selection Area ── */}
        <TouchableOpacity style={styles.fileDropZone} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={normalize(40)} color={selectedFile ? "#7EB6FF" : "#94A3B8"} />
          <Text style={[styles.dropZoneText, selectedFile && {color: "#7EB6FF"}]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8", // Pastel Blue background
  },
  scrollContent: {
      padding: normalize(20),
      alignItems: 'center',
      paddingBottom: 40,
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
    fontWeight: "bold",
    color: "#334155",
    marginBottom: normalize(8),
    marginTop: 20,
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
  
  // ── Text Area Styles ──
  orText: {
      fontSize: normalize(14),
      fontWeight: "700",
      color: "#94A3B8",
      marginVertical: 10,
  },
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
  
  // ── Footer Styles (Matches GmailPicker) ──
  footer: {
    padding: 20,
    backgroundColor: "transparent"
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
});
