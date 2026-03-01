import React, { useState } from 'react';
import { Button, View, Alert, ActivityIndicator, Text } from 'react-native';
import { fetchGemini } from '@/services/api';

export default function PresetButton() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const handlePress = async () => {
    const sampleText = `
      Hey team, let's have the Project Kickoff on March 15th at 10:00 AM. 
      It will be held in Conference Room B. Don't forget the slides!
    `;

    setLoading(true);
    const result = await fetchGemini(sampleText, false); // isPdf is false here
    setLoading(false);

    if (result) {
      setText(result);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Test with Sample Email" onPress={handlePress} />}
      <Text>{text}</Text>
    </View>
  );
}
