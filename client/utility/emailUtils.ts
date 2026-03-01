import { EmailMessage } from "./types";

// Decodes Gmail's base64url format
const decodeBase64Url = (str: string) => {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(escape(atob(base64)));
  } catch {
    return "";
  }
};

export const processEmail = (msg: any): EmailMessage => {
  const headers = msg.payload?.headers || [];
  const getHeader = (name: string) => 
    headers.find((h: any) => h.name.toLowerCase() === name)?.value || "";
  
  let bodyData = msg.payload?.body?.data || "";
  if (!bodyData && msg.payload?.parts) {
    const part = msg.payload.parts.find((p: any) => p.mimeType === "text/html") 
              || msg.payload.parts.find((p: any) => p.mimeType === "text/plain");
    bodyData = part?.body?.data || "";
  }

  return {
    id: msg.id,
    threadId: msg.threadId,
    from: getHeader("from"),
    to: getHeader("to"),
    subject: getHeader("subject"),
    date: getHeader("date"),
    snippet: msg.snippet || "",
    body: decodeBase64Url(bodyData),
    isRead: !(msg.labelIds || []).includes("UNREAD"),
  };
};

export const processEmails = (rawData: any): EmailMessage[] => {
  const messages = rawData.messages || [];
  return messages.map(processEmail);
};