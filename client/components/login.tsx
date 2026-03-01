import { useEffect } from "react"; //
import { useRouter } from "expo-router"; //
import { useAccessToken } from "@/hooks/useAccessToken";
import { useAuth } from "@/hooks/useAuth";
import { useCalendar } from "@/hooks/useCalendar";
import { useProfiles } from "@/hooks/useProfile";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function LoginButton() {
  const authProps = useAuth();
  const router = useRouter(); // Initialize the router

  useProfiles(authProps.jwtToken?.sessionToken || null);
  useAccessToken(authProps.jwtToken?.sessionToken || null);
  useCalendar(authProps.jwtToken?.sessionToken || null);

  // Watch for successful login and redirect
  useEffect(() => {
    if (authProps.jwtToken) {
      router.replace("/selector"); //
    }
  }, [authProps.jwtToken]); // Runs every time jwtToken changes

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          !authProps.request && styles.buttonDisabled,
        ]}
        onPress={() => authProps.promptAsync()}
        disabled={!authProps.request}
      >
        {authProps.isLoading ? (
          <Text style={styles.buttonText}>Loading...</Text>
        ) : authProps.jwtToken ? (
          <Text style={styles.buttonText}>Redirecting...</Text> // Updated feedback
        ) : (
          <Text style={styles.buttonText}>Login with Google</Text>
        )}
      </Pressable>
    </View>
  );
}

// ... styles remain the same
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
