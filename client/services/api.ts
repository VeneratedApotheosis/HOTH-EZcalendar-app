import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

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

//calendar writing
export const addEventToGoogleCalendar = async ( accessToken : string, eventDetails : any) => {
  const { title, description, location, startDate, endDate} = eventDetails;

  const event = {
    summary: title,
    location: location,
    description: description,
    start: {
      dateTime: startDate, // Must be ISO string: 2023-10-25T10:00:00Z
      timeZone: 'UTC',     // just do
    },
    end: {
      dateTime: endDate,
      timeZone: 'UTC',
    },
  };

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('Event created successfully:', data.htmlLink);
      return data;
    } else {
      console.error('Error creating event:', data);
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error('Network or API Error:', error);
  }

}

export const fetchGemini = async (input: string, isPdf: boolean = false) => {
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

