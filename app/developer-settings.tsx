import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';
import LogoutActionCard from '@/components/LogoutActionCard';
import ProfileAvatarPicker from '@/components/ProfileAvatarPicker';
import SettingsScreenHeader from '@/components/SettingsScreenHeader';

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'Сергей Иванов',
    email: 'sergey@developer.kz',
    role: 'Менеджер проектов',
  },
  {
    id: 'e2',
    name: 'Елена Смирнова',
    email: 'elena@developer.kz',
    role: 'Менеджер по продажам',
  },
];

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

export default function DeveloperSettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const [companyName, setCompanyName] = useState('ЖК Comfort Town');
  const [bin, setBin] = useState('123456789012');
  const [email, setEmail] = useState('info@comforttown.kz');
  const [phone, setPhone] = useState('+7 (727) 987-65-43');

  const onLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SettingsScreenHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.companyCard}>
          <Text style={styles.sectionHeading}>Настройки компании</Text>
          <ProfileAvatarPicker
            storageKey="profile-avatar-developer"
            fallbackLabel={companyName.trim().charAt(0).toUpperCase() || 'D'}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Название компании</Text>
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              style={styles.input}
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>БИН</Text>
            <TextInput
              value={bin}
              onChangeText={setBin}
              style={styles.input}
              keyboardType="number-pad"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Телефон</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
              placeholderTextColor="#939393"
            />
          </View>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Сохранить изменения</Text>
          </Pressable>
        </View>

        <View style={styles.teamSection}>
          <Text style={styles.sectionHeading}>Сотрудники</Text>

          {EMPLOYEES.map((employee) => (
            <View key={employee.id} style={styles.employeeCard}>
              <View style={styles.employeeTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitial(employee.name)}</Text>
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

        <LogoutActionCard onPress={onLogout} />
      </ScrollView>

      <DeveloperBottomBar active="settings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  companyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  teamSection: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  fieldGroup: {
    marginTop: 12,
    gap: 4,
  },
  label: {
    fontSize: 14,
    lineHeight: 21,
    color: '#737373',
  },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 0,
    fontSize: 16,
    color: '#3A3A3A',
    textAlignVertical: 'center',
  },
  primaryButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  employeeTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  employeeInfo: {
    marginLeft: 12,
    flex: 1,
    gap: 1,
  },
  employeeName: {
    fontSize: 15,
    lineHeight: 23,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  employeeEmail: {
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  rolePill: {
    marginTop: 12,
    alignSelf: 'flex-start',
    minHeight: 31,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  roleText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#70A0FF',
  },
});
