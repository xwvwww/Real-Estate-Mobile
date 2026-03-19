import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import LogoutActionCard from '@/components/LogoutActionCard';
import SettingsScreenHeader from '@/components/SettingsScreenHeader';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const onLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <SettingsScreenHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Личные данные</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Имя</Text>
            <TextInput
              defaultValue="Иван"
              style={styles.input}
              placeholderTextColor="#8F8F8F"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Фамилия</Text>
            <TextInput
              defaultValue="Иванов"
              style={styles.input}
              placeholderTextColor="#8F8F8F"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              defaultValue="ivan@example.com"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#8F8F8F"
            />
          </View>

          <View style={[styles.fieldWrap, styles.lastField]}>
            <Text style={styles.label}>Телефон</Text>
            <TextInput
              defaultValue="+7 (777) 123-45-67"
              style={styles.input}
              keyboardType="phone-pad"
              placeholderTextColor="#8F8F8F"
            />
          </View>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Сохранить изменения</Text>
          </Pressable>
        </View>

        <View style={[styles.card, styles.securityCard]}>
          <Text style={styles.cardTitle}>Безопасность</Text>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/change-password')}>
            <Text style={styles.secondaryButtonText}>Изменить пароль</Text>
          </Pressable>
        </View>

        <LogoutActionCard onPress={onLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scroll: {
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  fieldWrap: {
    marginTop: 16,
  },
  lastField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    lineHeight: 21,
    color: '#737373',
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  primaryButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  securityCard: {
    marginTop: 16,
    paddingBottom: 16,
  },
  secondaryButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#70A0FF',
    fontWeight: '500',
  },
});
