import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, View, Animated, Easing, SafeAreaView, Platform, useWindowDimensions, ScrollView } from 'react-native';
import LoginButton from '@/components/login';
import { GmailIcon, CalendarIcon, FlowArrow, ServiceBadge, PDFIcon, TextIcon } from '@/components/brand_icons';
import { useFadeSlide } from '@/hooks/use_fade_slide';

export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const titleAnim = useFadeSlide(0);
  const subtitleAnim = useFadeSlide(100);
  const flowAnim = useFadeSlide(200);
  const loginAnim = useFadeSlide(400);

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
      ]),
    ).start();
  }, []);

  const animatedStyle = { transform: [{ scale: bounceAnim }] };

  // Use a slight scale increase only for very large screens
  const iconScale = screenWidth > 1000 ? 1.1 : 1;
    // ── Animation Logic for Blobs ──
    const blobAnim1 = useRef(new Animated.Value(0)).current;
    const blobAnim2 = useRef(new Animated.Value(0)).current;

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
    <SafeAreaView style={styles.container}>
      {/* ── Background Blobs (Decoration) ── */}
          <Animated.View style={[styles.blob, styles.blob_one, blobStyle1]} />
          <Animated.View style={[styles.blob, styles.blob_two, blobStyle2]} />
          <Animated.View style={[styles.blob, styles.blob_three, blobStyle2]} />
          <Animated.View style={[styles.blob, styles.blob_four, blobStyle1]} />

      {/* ── Main Wrapper with Constraints ── */}
      <View style={styles.mainWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Animated.View style={[styles.titleBlock, titleAnim]}>
              <Text style={styles.eyebrow}>WELCOME TO</Text>
              <Text style={styles.title}>EZcalendar</Text>
            </Animated.View>
            <Animated.Text style={[styles.subtitle, subtitleAnim]}>
              Connect Gmail, parse your events with AI, and sync your life instantly.
            </Animated.Text>
          </View>

          <View style={styles.cardWrapper}>
            <Animated.View style={[styles.flowCard, flowAnim]}>
              <Animated.View style={[styles.sideColumn, animatedStyle]}>
                <ServiceBadge icon={<GmailIcon size={40 * iconScale} />} label="Gmail" size={85 * iconScale} />
                <ServiceBadge icon={<PDFIcon size={35 * iconScale} />} label="PDF" size={85 * iconScale} />
                <ServiceBadge icon={<TextIcon size={32 * iconScale} />} label="Text" size={85 * iconScale} />
              </Animated.View>

              <View style={styles.centerFlow}>
                <FlowArrow size={24 * iconScale} />
                <View style={styles.aiTag}>
                  <Text style={styles.aiText}>AI</Text>
                </View>
                <FlowArrow size={24 * iconScale} />
              </View>

              <Animated.View style={[styles.sideColumn, animatedStyle]}>
                <ServiceBadge icon={<CalendarIcon size={45 * iconScale} />} label="Calendar" size={100 * iconScale} />
              </Animated.View>
            </Animated.View>
          </View>

          <View style={styles.footerContainer}>
            <Animated.View style={[styles.loginWrap, loginAnim]}>
              <LoginButton />
              <Text style={styles.loginHint}>POWERED BY GOOGLE CLOUD SECURITY</Text>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  
  // ── Constraint Styles ──
  mainWrapper: {
      flex: 1,
      width: '100%',
      maxWidth: 600, // Limits width on desktop
      zIndex: 10,
      paddingHorizontal: 20,
  },
  scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 30,
      gap: 30,
  },
  
  headerSection: { alignItems: 'center', width: '100%' },
  titleBlock: { alignItems: 'center', marginBottom: 8 },
  eyebrow: { fontSize: 13, fontWeight: '800', color: '#7EB6FF', letterSpacing: 2 },
  title: { fontSize: 48, fontWeight: '900', color: '#1E293B', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, marginTop: 10, maxWidth: '90%' },
  
  cardWrapper: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  flowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingVertical: 30,
    paddingHorizontal: 10,
    width: '100%',
    ...Platform.select({
      ios: { shadowColor: '#7EB6FF', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20 },
      android: { elevation: 10 },
      web: { boxShadow: '0 10px 30px rgba(126, 182, 255, 0.15)' },
    }),
  },
  sideColumn: { flex: 1, alignItems: 'center', gap: 15 },
  centerFlow: { width: 60, alignItems: 'center', gap: 10 },
  aiTag: { backgroundColor: '#F0F7FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiText: { fontSize: 10, fontWeight: '900', color: '#7EB6FF' },
  
  footerContainer: { width: '100%', alignItems: 'center' },
  loginWrap: { width: '100%', maxWidth: 400, alignItems: 'center', gap: 12 },
  loginHint: { fontSize: 10, color: '#94A3B8', fontWeight: '800', letterSpacing: 1 },
  
  // ── blobs ──
  blob: { position: 'absolute', zIndex: 1 },
  blob_one: { top: -40, right: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: '#adc5f1', opacity: 0.4 },
  blob_two: { bottom: '5%', left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: '#f4bfc7', opacity: 0.4 },
  blob_three: { top: '30%', left: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: '#adc5f1', opacity: 0.3 },
  blob_four: { bottom: '15%', right: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: '#f4bfc7', opacity: 0.3 },
});
