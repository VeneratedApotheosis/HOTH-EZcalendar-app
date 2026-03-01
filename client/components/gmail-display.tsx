import { useAccessToken } from "@/hooks/useAccessToken";
import { useAuth } from "@/hooks/useAuth";
import { useCalendar } from "@/hooks/useCalendar";
import { useProfiles } from "@/hooks/useProfile";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function GmailDisplay() {
  const authProps = useAuth();
  useProfiles(authProps.jwtToken?.sessionToken || null);
  useAccessToken(authProps.jwtToken?.sessionToken || null);
  useCalendar(authProps.jwtToken?.sessionToken || null);
  //gmailProps = useGmail(authProps.jwtToken?.sessionToken || null);

  return <View style={{ flex: 1 }}>bruh</View>;
}
