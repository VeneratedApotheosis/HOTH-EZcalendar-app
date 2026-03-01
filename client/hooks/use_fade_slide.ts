import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useFadeSlide(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { 
        toValue: 1, duration: 600, delay, 
        easing: Easing.out(Easing.back(1.5)), 
        useNativeDriver: true 
      }),
      Animated.timing(translateY, { 
        toValue: 0, duration: 600, delay, 
        easing: Easing.out(Easing.back(1.5)), 
        useNativeDriver: true 
      }),
    ]).start();
  }, [delay]);

  return { opacity, transform: [{ translateY }] };
}