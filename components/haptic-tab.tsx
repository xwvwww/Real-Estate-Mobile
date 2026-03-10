import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        Animated.spring(scale, {
          toValue: 0.92,
          speed: 28,
          bounciness: 4,
          useNativeDriver: true,
        }).start();
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        Animated.spring(scale, {
          toValue: 1,
          speed: 20,
          bounciness: 6,
          useNativeDriver: true,
        }).start();
        props.onPressOut?.(ev);
      }}>
      <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
        {props.children}
      </Animated.View>
    </PlatformPressable>
  );
}
