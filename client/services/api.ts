//Backend Fetching
export const fetchJwtToken = async (authCode : string, codeVerifier : string, redirectUri : string) => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_LINK!}/api/google-exchange`, {
        method : 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            code: authCode,
            codeVerifier: codeVerifier,
            redirectUri: redirectUri,
        }),
    });
    return await res.json();
}

export const fetchFamilyProfiles = async (jwtToken : string) => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_LINK!}/api/get-family-profiles`, {
        method : 'POST',
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${jwtToken}`
        },
    });
    return await res.json();
}

export const fetchFamilyAccessTokens = async (jwtToken : string) => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_LINK!}/api/get-family-access-tokens`, {
        method : 'POST',
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
        },
    });
    return await res.json();
}

// Google Api Fetching
export const fetchCalendar = async (accessToken: string) => {
    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return await res.json();
}

//email fetching
export const fetchEmails = async (accessToken: string) => {
  // 1. Get user profile (for email address)
  const profileRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/profile",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const profile = await profileRes.json();

  // 2. Get message IDs
  const listRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20", // limits max num results to 20
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const list = await listRes.json();

  // 3. Get full message details for each ID
  const messages = await Promise.all(
    (list.messages || []).map(async (msg: { id: string }) => {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return await detailRes.json();
    })
  );

  return {
    emailAddress: profile.emailAddress,
    messages: messages,
  };
};