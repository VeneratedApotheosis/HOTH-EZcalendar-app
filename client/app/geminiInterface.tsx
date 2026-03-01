import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_LINK;

export default function App() {
  const [loading, setLoading] = useState(false);

  const pickAndProcessPdf = async () => {
    try {
      // 1. Pick the document
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setLoading(true);
      const { uri } = result.assets[0];

      // ... inside your pickAndProcessPdf function
      const file = new File(uri);
      const base64Data = await file.base64();

      // 3. Send to your Node.js backend
      const response = await fetch(`${BACKEND_URL}/api/extract-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: base64Data,
          isPdf: true,
        }),
      });

      const data = await response.json();
      console.log('Extracted Events:', data);
      Alert.alert('Success', `Found ${data.length} events!`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to process PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gemini Calendar Parser</Text>

      <TouchableOpacity style={styles.button} onPress={pickAndProcessPdf} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Select PDF & Extract</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#6200ee', padding: 15, borderRadius: 8, width: 250, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
