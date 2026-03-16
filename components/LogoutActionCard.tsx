import { Pressable, StyleSheet, Text } from 'react-native';

type LogoutActionCardProps = {
  onPress: () => void;
};

export default function LogoutActionCard({ onPress }: LogoutActionCardProps) {
  return (
    <Pressable style={styles.logoutButton} onPress={onPress}>
      <Text style={styles.logoutText}>Выйти из аккаунта</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 16,
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2D8D8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#D32F2F',
    fontWeight: '500',
  },
});
