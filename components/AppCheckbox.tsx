import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AppCheckboxProps = {
  checked: boolean;
  onToggle?: () => void;
  style?: ViewStyle;
};

export default function AppCheckbox({ checked, onToggle, style }: AppCheckboxProps) {
  const scale = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [checked, scale]);

  const content = (
    <View
      style={[styles.box, checked && styles.boxChecked, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {checked ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
      </Animated.View>
    </View>
  );

  if (onToggle) {
    return <Pressable onPress={onToggle}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5B5B5B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: '#3D6DFF',
    backgroundColor: '#3D6DFF',
  },
});
