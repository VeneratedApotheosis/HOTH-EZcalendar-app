import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Platform,
  Animated,
  Easing
} from "react-native";
import { Link } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFadeSlide } from "@/hooks/use_fade_slide";
import { useFocusEffect } from '@react-navigation/native';

export default function SelectorScreen() {
  const { width } = useWindowDimensions();

  // ── Responsive Logic ──
  const isTablet = width > 768;
  const isSmallPhone = width < 380;
  
  const horizontalPadding = (width * 0.08) || 24;
  const cardGap = 50;
  const columnCount = isTablet ? 3 : 2;
  
  const cardWidth = (width - (horizontalPadding * 2) - (cardGap * (columnCount - 1))) / columnCount;

  // ── Animation Logic for Blobs ──
  const blobAnim1 = useRef(new Animated.Value(0)).current;
  const blobAnim2 = useRef(new Animated.Value(0)).current;

    // ── Entrance Animations ──
    const title = useRef(new Animated.Value(0)).current;
    const subtitle = useRef(new Animated.Value(0)).current;
    const card1 = useRef(new Animated.Value(0)).current;
    const card2 = useRef(new Animated.Value(0)).current;
    
    // ── Card Bounce Animation ──
    const bounceAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.02,
            duration: 2000,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const bounceStyle = {
      transform: [{ scale: bounceAnim }],
    };

  useEffect(() => {
    const createAnimation = (anim: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(blobAnim1, 5000).start();
    createAnimation(blobAnim2, 7000).start();
  }, []);
    
    const createFadeSlide = (anim: Animated.Value) => ({
      opacity: anim,
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    });
    
    useFocusEffect(
      React.useCallback(() => {
        // Reset values
        title.setValue(0);
        subtitle.setValue(0);
        card1.setValue(0);
        card2.setValue(0);

        Animated.stagger(120, [
          Animated.timing(title, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(subtitle, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(card1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(card2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, [])
    );

  // Map animations to positions
  const blobStyle1 = {
    transform: [
      { translateX: blobAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
      { translateY: blobAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) },
    ],
  };
  const blobStyle2 = {
    transform: [
      { translateX: blobAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) },
      { translateY: blobAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4F8", overflow: 'hidden' }}>
        
        {/* ── Blobs  ── */}
        <Animated.View style={[styles.blob, styles.blob_one, blobStyle1]} />
        <Animated.View style={[styles.blob, styles.blob_two, blobStyle2]} />
        <Animated.View style={[styles.blob, styles.blob_three, blobStyle2]} />
        <Animated.View style={[styles.blob, styles.blob_four, blobStyle1]} />
        
        {/* ── Main Container (Now zIndex higher) ── */}
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={StyleSheet.flatten([
              styles.scrollContent,
              { paddingHorizontal: horizontalPadding }
            ])}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section  */}
          <Animated.View style={[styles.headerArea, createFadeSlide(title)]}>
          <Animated.Text
            style={[
              styles.headerTitle,
              { fontSize: isTablet ? 40 : 32 }
            ]}
          >
            Import Source
          </Animated.Text>
          <Animated.Text
            style={[
              styles.headerSubtitle,
              { fontSize: isTablet ? 20 : 16 },
              createFadeSlide(subtitle)
            ]}
          >
            Choose a method to populate your calendar
          </Animated.Text>
            </Animated.View>

            {/* Large Tall Grid */}
            <View style={StyleSheet.flatten([styles.grid, { gap: cardGap }])}>
              
              {/* Item 1: File System */}
          <Animated.View style={[createFadeSlide(card1), bounceStyle]}>
            <Link href="/uploader" asChild>
                <TouchableOpacity
                  style={StyleSheet.flatten([styles.card, { width: cardWidth }])}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconBackground}>
                    <Ionicons name="document-text-outline" size={isTablet ? 50 : 42} color="#7EB6FF" />
                  </View>
                  <Text style={styles.cardTitle}>File System</Text>
                  {!isSmallPhone && <Text style={styles.cardDescription}>PDF or TXT</Text>}
                </TouchableOpacity>
          </Link>
        </Animated.View>

              {/* Item 2: Gmail */}
          <Animated.View style={[createFadeSlide(card2), bounceStyle]}>
            <Link href="/gmail_picker" asChild>
                <TouchableOpacity
                  style={StyleSheet.flatten([styles.card, { width: cardWidth }])}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBackground, { backgroundColor: '#FFEDEA' }]}>
                    <MaterialCommunityIcons name="gmail" size={isTablet ? 50 : 42} color="#FF8A80" />
                  </View>
                  <Text style={styles.cardTitle}>Gmail</Text>
                  {!isSmallPhone && <Text style={styles.cardDescription}>Inbox Sync</Text>}
                </TouchableOpacity>
          </Link>
        </Animated.View>
            </View>
          </ScrollView>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent", // transparent to see blobs
    zIndex: 2, // higher than blobs
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 60,
  },
  headerTitle: {
    fontWeight: "900",
    color: "#334155",
    textAlign: 'center',
    letterSpacing: -1,
  },
  headerSubtitle: {
    color: "#94A3B8",
    marginTop: 12,
    textAlign: 'center',
    fontWeight: "600",
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 60,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: 'center',
    minHeight: 250,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20
      },
      android: { elevation: 8 },
      web: { boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }
    })
  },
  iconBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#334155",
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 10,
    textAlign: 'center',
    fontWeight: "700",
  },
  // ── blobs ──
  blob: {
    position: 'absolute',
    zIndex: 1 // lower than container
  },
  blob_one: { top: -40, right: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: '#adc5f1', opacity: 0.4 },
  blob_two: { bottom: '5%', left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: '#f4bfc7', opacity: 0.4 },
  blob_three: { top: '30%', left: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: '#adc5f1', opacity: 0.3 },
  blob_four: { bottom: '15%', right: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: '#f4bfc7', opacity: 0.3 },
});
