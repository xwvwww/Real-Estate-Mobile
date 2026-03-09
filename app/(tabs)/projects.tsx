import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProjectsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Проекты</Text>
        <Text style={styles.subtitle}>Следующий экран по дизайну доделаем следующим шагом.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '600', color: '#2F2F2F' },
  subtitle: { marginTop: 10, fontSize: 15, lineHeight: 22, color: '#737373' },
});
