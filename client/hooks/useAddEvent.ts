import { useContext, useState } from "react";
import { AuthContext } from "@/components/context";
import { useAccessToken } from "./useAccessToken";
import { addEventToGoogleCalendar } from "../services/api"; // Adjust path

export function useAddEvent() {
  // 1. get jwt from global context
  const { jwtToken } = useContext(AuthContext);
  const sessionToken = jwtToken?.sessionToken || null;

  // 2. Pass it to your token manager
  const { getValidAccessToken } = useAccessToken(sessionToken);
  
  // 3. Optional: track loading/error state specifically for calendar writing
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 4. Create the wrapper function
  const createEvent = async (eventDetails: any) => {
    isLoading(true);
    setError(null);

    try {
      //get a valid token obj
      const tokenObj = await getValidAccessToken();
      
      //get access token
      const googleToken = tokenObj?.parent?.accessToken;

      //call api to make event
      const result = await addEventToGoogleCalendar(googleToken, eventDetails);
      
      return result; // Returns the data (like htmlLink) so the UI can use it
      
    } catch (err: any) {
      console.error("Failed to create event:", err);
      setError(err.message || "Unknown error occurred");
      throw err; // Re-throw if you want the component to catch it too
    } finally {
      isLoading(false);
    }
  };

  return { createEvent, loading, error };
}