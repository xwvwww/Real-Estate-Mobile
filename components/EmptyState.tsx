import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CARD_RADIUS, ELEVATED_CARD_SHADOW } from '@/constants/ui';

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
};

export function EmptyState({
  title,
  description,
  icon = 'documents-outline',
  actionLabel,
  onAction,
  style,
  elevated = true,
}: EmptyStateProps) {
  return (
    <View style={[styles.box, !elevated && styles.boxFlat, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={24} color="#70A0FF" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
    ...ELEVATED_CARD_SHADOW,
  },
  boxFlat: {
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 4,
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    alignSelf: 'stretch',
  },
  actionText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
