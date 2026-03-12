import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgencyBottomBar } from '@/components/AgencyBottomBar';

type Employee = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
};

const EMPLOYEES: Employee[] = [
  {
    id: '1',
    initials: 'А',
    name: 'Анна Смирнова',
    email: 'anna@agency.kz',
    role: 'Менеджер',
  },
  {
    id: '2',
    initials: 'П',
    name: 'Петр Козлов',
    email: 'petr@agency.kz',
    role: 'Агент',
  },
];

export default function AgencySettingsScreen() {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState('Агентство недвижимости Гарант');
  const [email, setEmail] = useState('info@garant.kz');
  const [phone, setPhone] = useState('+7 (727) 123-45-67');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Кабинет агентства</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Настройки компании</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Название агентства</Text>
            <TextInput
              style={styles.input}
              value={agencyName}
              onChangeText={setAgencyName}
              placeholder="Название агентства"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Телефон</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Телефон"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Описание</Text>
            <TextInput
              style={styles.textArea}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              placeholder=""
              placeholderTextColor="#939393"
            />
          </View>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Сохранить изменения</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Сотрудники</Text>

          <View style={styles.employeeList}>
            {EMPLOYEES.map((employee) => (
              <View key={employee.id} style={styles.employeeCard}>
                <View style={styles.employeeTopRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{employee.initials}</Text>
                  </View>

                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{employee.name}</Text>
                    <Text style={styles.employeeEmail}>{employee.email}</Text>
                  </View>
                </View>

                <View style={styles.rolePill}>
                  <Text style={styles.roleText}>{employee.role}</Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable style={styles.logoutButton} onPress={() => router.replace('/login')}>
            <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AgencyBottomBar active="settings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    height: 73,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  fieldWrap: {
    marginTop: 16,
    gap: 4,
  },
  label: {
    fontSize: 14,
    lineHeight: 21,
    color: '#737373',
  },
  input: {
    marginTop: 4,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  textArea: {
    marginTop: 4,
    minHeight: 96,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  primaryButton: {
    marginTop: 24,
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
  employeeList: {
    marginTop: 14,
    gap: 12,
  },
  employeeCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F3F3',
    padding: 16,
  },
  employeeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 15,
    lineHeight: 23,
    color: '#3A3A3A',
    fontWeight: '600',
  },
  employeeEmail: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  rolePill: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#F0F7FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 32,
    justifyContent: 'center',
  },
  roleText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#70A0FF',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#D32F2F',
    fontWeight: '500',
  },
});
