import { Image } from "expo-image";
import { Platform, StyleSheet, View } from "react-native";

export default function FinishScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 15 }}>
      Finihs
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
