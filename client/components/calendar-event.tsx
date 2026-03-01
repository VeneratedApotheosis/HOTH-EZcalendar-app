import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CalendarEventProps {
  title: string;
  time: string;
  color: string;
}

const darkenColor = (hex: string, amount: number = 0.6): string => {
  // Remove the # if it exists
  const cleanHex = hex.replace("#", "");

  // Convert hex to RGB
  let r = parseInt(cleanHex.substring(0, 2), 16);
  let g = parseInt(cleanHex.substring(2, 4), 16);
  let b = parseInt(cleanHex.substring(4, 6), 16);

  // Darken each channel
  r = Math.floor(r * amount);
  g = Math.floor(g * amount);
  b = Math.floor(b * amount);

  // Convert back to hex and pad with zeros if needed
  const toHex = (c: number) => c.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default function CalendarEvent({
  title,
  time,
  color,
}: CalendarEventProps) {
  const darkTextColor = darkenColor(color, 0.5);

  return (
    <View style={styles.cardContainer}>
      {/* The Accent Bar: This gives it the "Gmail" calendar look */}
      <View style={[styles.accentBar, { backgroundColor: color }]} />

      <View style={styles.content}>
        <Text
          style={[styles.title, { color: darkTextColor }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 8,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
    overflow: "hidden", // Ensures the accent bar follows the border radius
  },
  accentBar: {
    width: 6,
    height: "100%",
  },
  content: {
    padding: 12,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  timeText: {
    fontSize: 13,
    color: "#70757a",
  },
});
