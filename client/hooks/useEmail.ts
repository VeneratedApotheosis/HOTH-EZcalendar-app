import { processEmails } from "@/utility/emailUtils"; // Placeholder
import { EmailObj } from "@/utility/types"; // Placeholder
import { useCallback, useEffect, useState } from "react";
import { fetchEmails } from "../services/api"; // Placeholder
import { storage } from "../services/storage";
import { useAccessToken } from "./useAccessToken";

export function useEmail(jwtToken: string | null) {
  const { getValidAccessToken } = useAccessToken(jwtToken);
  const [emails, setEmails] = useState<EmailObj | null>(() => {
    return storage.get("emails") || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserEmails = useCallback(async () => {
    if (!jwtToken) return;
    console.log(jwtToken)

    setIsLoading(true);
    setError(null);

    try {
      console.log("pre")
      const accessToken = await getValidAccessToken();
      console.log(accessToken)
      
      const accessTokenString = accessToken.parent.accessToken;

      const rawData = await fetchEmails(accessTokenString);
      const processedData = processEmails(rawData);

      const formattedEmails: EmailObj = {
        owner: rawData.emailAddress, // Placeholder property
        name: "Inbox", 
        messages: processedData
      };

      
      setEmails(formattedEmails);
      storage.save("emails", formattedEmails);
      
    } catch (err: any) {
      console.error("Gmail Fetch Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [jwtToken, getValidAccessToken]);

  useEffect(() => {
    fetchUserEmails();
  }, [fetchUserEmails]);

  return { emails, isLoading, error, refetch: fetchUserEmails };
}