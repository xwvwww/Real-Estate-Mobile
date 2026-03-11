import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Настройки</Text>
      </View>

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
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Изменить пароль</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutText}>Выйти из аккаунта</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    height: 63,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#3A3A3A',
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
  logoutButton: {
    marginTop: 16,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#D32F2F',
    fontWeight: '500',
  },
});
