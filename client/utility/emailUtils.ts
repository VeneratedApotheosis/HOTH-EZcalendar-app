import { EmailData } from "./types";
// Decodes Gmail's base64url format
const decodeBase64Url = (str: string) => {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(escape(atob(base64)));
  } catch {
    return "";
  }
};

// Splits "John Doe <john@example.com>" into name and email
const parseSender = (fromHeader: string) => {
  const match = fromHeader.match(/(.*?)\s*<(.*)>/);
  
  if (match) {
    let senderName = match[1].trim();
    // Remove surrounding quotes if they exist
    senderName = senderName.replace(/^["']|["']$/g, ''); 
    return { 
      sender: senderName || match[2], // Fallback to email if no name
      senderEmail: match[2] 
    };
  }
  
  // Fallback if there are no angle brackets
  return { sender: fromHeader, senderEmail: fromHeader };
};

export const processEmail = (msg: any): EmailData => {
  const headers = msg.payload?.headers || [];
  const getHeader = (name: string) => 
    headers.find((h: any) => h.name.toLowerCase() === name)?.value || "";

  const fromHeader = getHeader("from");
  const { sender, senderEmail } = parseSender(fromHeader);

  // Extract body from standard payload or multipart payload
  let bodyData = msg.payload?.body?.data || "";
  if (!bodyData && msg.payload?.parts) {
    const part = msg.payload.parts.find((p: any) => p.mimeType === "text/html") 
              || msg.payload.parts.find((p: any) => p.mimeType === "text/plain");
    bodyData = part?.body?.data || "";
  }

  return {
    id: msg.id,
    sender,
    senderEmail,
    subject: getHeader("subject") || "(No Subject)",
    date: getHeader("date"), 
    snippet: msg.snippet || "",
    isRead: !(msg.labelIds || []).includes("UNREAD"),
    body: decodeBase64Url(bodyData),
  };
};

export const processEmails = (rawData: any): EmailData[] => {
  const messages = rawData.messages || [];
  return messages.map(processEmail);
};