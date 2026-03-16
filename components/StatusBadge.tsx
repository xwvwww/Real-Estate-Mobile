import { StyleSheet, Text, View } from 'react-native';

type StatusBadgeProps = {
  label: string;
  backgroundColor: string;
  textColor: string;
  size?: 'sm' | 'md';
};

export function StatusBadge({
  label,
  backgroundColor,
  textColor,
  size = 'sm',
}: StatusBadgeProps) {
  return (
    <View style={[styles.base, size === 'md' ? styles.medium : styles.small, { backgroundColor }]}>
      <Text style={[styles.text, size === 'md' ? styles.textMedium : styles.textSmall, { color: textColor }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  small: {
    minHeight: 26,
  },
  medium: {
    minHeight: 30,
    paddingHorizontal: 14,
  },
  text: {
    fontWeight: '500',
  },
  textSmall: {
    fontSize: 12,
    lineHeight: 18,
  },
  textMedium: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
});
