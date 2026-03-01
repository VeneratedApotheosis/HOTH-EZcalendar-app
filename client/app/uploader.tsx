import React, { useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

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
        setPastedText(""); 
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  return (
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
          <View style={{ width: 26 }} /> 
        </View>

        {/* ── Main Content Section ── */}
        <View style={StyleSheet.flatten([styles.mainContent, { paddingHorizontal: horizontalPadding }])}>
          <View style={StyleSheet.flatten([styles.centerWrapper, { maxWidth: contentMaxWidth }])}>
            
            <View style={styles.headerArea}>
              <Text style={styles.headerTitle}>Upload Document</Text>
              <Text style={styles.headerSubtitle}>Choose a file or provide text</Text>
            </View>

            {/* ── Flexible Drop Zone ── */}
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
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            {/* ── Flexible Text Input ── */}
            <TextInput
              style={StyleSheet.flatten([
                styles.textArea,
                { flex: isSmallHeight ? 0.6 : 0.8 } // Shrinks input on small screens
              ])}
              multiline
              placeholder="Paste content here..."
              value={pastedText}
              onChangeText={(text) => {
                setPastedText(text);
                if (text.length > 0) setSelectedFile(null);
              }}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={StyleSheet.flatten([
          styles.footer, 
          { paddingHorizontal: horizontalPadding, maxWidth: contentMaxWidth }
        ])}>
          <TouchableOpacity
            onPress={() => {}} // HandleUpload call
            disabled={(!selectedFile && !pastedText) || isLoading}
            style={StyleSheet.flatten([
              styles.confirmBtn,
              (!selectedFile && !pastedText || isLoading) && styles.confirmBtnDisabled,
            ])}
          >
            <Text style={styles.confirmBtnText}>Upload Data →</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
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
  },
  topBarTitle: { fontSize: 20, fontWeight: "900", color: "#334155" },
  mainContent: {
    flex: 1, // Takes up remaining space
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrapper: {
    width: '100%',
    height: '90%', // Keep content within bounds
    justifyContent: 'space-evenly', // Distributes items perfectly
  },
  headerArea: { alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#334155" },
  headerSubtitle: { color: "#94A3B8", fontWeight: "600", marginTop: 4 },
  
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
  dropZoneText: { fontSize: 16, fontWeight: "800", color: "#94A3B8", textAlign: 'center' },
  
  orText: { fontSize: 16, fontWeight: "900", color: "#CBD5E1", textAlign: 'center' },

  textArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    fontSize: 16,
    color: "#334155",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    textAlignVertical: 'top',
  },

  footer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    alignSelf: 'center',
  },
  confirmBtn: {
    backgroundColor: "#7EB6FF",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
  },
  confirmBtnDisabled: { backgroundColor: "#CBD5E1" },
  confirmBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
});