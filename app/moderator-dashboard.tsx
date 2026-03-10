import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ModeratorDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard модератора</Text>
        <Text style={styles.subtitle}>Временный экран для тестовой авторизации роли.</Text>

        <Pressable style={styles.button} onPress={() => router.replace('/login')}>
          <Text style={styles.buttonText}>Выйти</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F2' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '600', color: '#2F2F2F' },
  subtitle: { marginTop: 10, fontSize: 16, lineHeight: 22, color: '#6B6B6B' },
  button: {
    marginTop: 24,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6F9BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
