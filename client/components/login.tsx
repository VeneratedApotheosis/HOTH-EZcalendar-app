import { useAccessToken } from "@/hooks/useAccessToken";
import { useAuth } from "@/hooks/useAuth";
import { useProfiles } from "@/hooks/useProfile";
import { Pressable, StyleSheet, Text, View } from "react-native";
export default function LoginButton() {
  const authProps = useAuth();
  useProfiles(authProps.jwtToken?.sessionToken || null);
  useAccessToken(authProps.jwtToken?.sessionToken || null);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed, // Adds a subtle press effect
          !authProps.request && styles.buttonDisabled,
        ]}
        onPress={() => authProps.promptAsync()}
        disabled={!authProps.request}
      >
        {authProps.isLoading ? (
          <Text style={styles.buttonText}>Loading...</Text>
        ) : authProps.jwtToken ? (
          <Text style={styles.buttonText}>Logged in!</Text>
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // Removed flex: 1 and backgroundColor to allow it to be
    // placed inside another View properly
    width: '100%',
    padding: 0,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    backgroundColor: '#4285F4', // Google Blue
    borderRadius: 20,           // Fully rounded
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Android shadow
  },
  buttonPressed: {
    opacity: 0.8, // Slightly fades when pressed
    transform: [{ scale: 0.98 }], // Slightly shrinks when pressed
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
