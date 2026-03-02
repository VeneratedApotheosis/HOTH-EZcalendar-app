import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';

//Backend Fetching
export const fetchJwtToken = async (authCode: string, codeVerifier: string, redirectUri: string) => {
  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_LINK!}/api/google-exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: authCode,
      codeVerifier: codeVerifier,
      redirectUri: redirectUri,
    }),
  });
  return await res.json();
};

export const fetchFamilyProfiles = async (jwtToken: string) => {
  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_LINK!}/api/get-family-profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  return await res.json();
};

export const fetchFamilyAccessTokens = async (jwtToken: string) => {
  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_LINK!}/api/get-family-access-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  return await res.json();
};

// Google Api Fetching
export const fetchCalendar = async (accessToken: string) => {
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
};

//email fetching
export const fetchEmails = async (accessToken: string) => {
  // 1. Get user profile (for email address)
  const profileRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  const profile = await profileRes.json();

  // 2. Get message IDs
  const listRes = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20', // limits max num results to 20
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const list = await listRes.json();

  // 3. Get full message details for each ID
  const messages = await Promise.all(
    (list.messages || []).map(async (msg: { id: string }) => {
      const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return await detailRes.json();
    }),
  );

  return {
    emailAddress: profile.emailAddress,
    messages: messages,
  };
};

export const fetchGeminiText = async (input: string, isPdf: boolean = false) => {
  try {
    //Send Req to Backend
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_LINK}/api/extract-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: input,
        isPdf: isPdf,
      }),
    });

    //Receive requests
    const data = await response.json();
    console.log('Extracted Events:', data);
    return data;
    Alert.alert('Success', `Found ${data.length} events!`);
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to process PDF');
    return null;
  } finally {
  }
};

export const fetchGeminiPDF = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.canceled) return;

    const { uri } = result.assets[0];

    // Convert based on platform automatically
    const base64 = await getBase64FromUri(uri);

    // Now send the clean base64 string to your backend
    const events = await fetchGeminiText(base64, true);

    if (events) {
      console.log('Success! Extracted events:', events);
    }
  } catch (error) {
    console.error('PDF Error:', error);
  }
};

const getBase64FromUri = async (uri: string): Promise<string> => {
  if (Platform.OS === 'web') {
    // 1. Web Logic: Use standard fetch + FileReader
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } else {
    // 2. Native Logic: Use Expo FileSystem (Stable path)
    // This avoids the "validatePath" error by using the standard async method
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }
};
