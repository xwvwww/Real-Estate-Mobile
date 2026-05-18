import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgencyBottomBar } from '@/components/AgencyBottomBar';
import ProfileAvatarPicker from '@/components/ProfileAvatarPicker';
import { useAuth } from '@/contexts/AuthContext';
import LogoutActionCard from '@/components/LogoutActionCard';
import SettingsScreenHeader from '@/components/SettingsScreenHeader';

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, '');
  const normalized = digits.startsWith('7')
    ? digits.slice(0, 11)
    : digits.startsWith('8')
      ? `7${digits.slice(1, 11)}`
      : `7${digits}`.slice(0, 11);

  const country = normalized.slice(0, 1);
  const part1 = normalized.slice(1, 4);
  const part2 = normalized.slice(4, 7);
  const part3 = normalized.slice(7, 9);
  const part4 = normalized.slice(9, 11);

  let result = country ? `+${country}` : '+7';
  if (part1) result += ` ${part1}`;
  if (part2) result += ` ${part2}`;
  if (part3) result += ` ${part3}`;
  if (part4) result += ` ${part4}`;

  return result.trim();
}

function isPhoneValid(value: string) {
  return value.replace(/\D/g, '').length === 11;
}

export default function AgencySettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [agencyName, setAgencyName] = useState('Агентство недвижимости Гарант');
  const [email] = useState('info@garant.kz');
  const [phone, setPhone] = useState(formatPhoneInput('+7 (727) 123-45-67'));
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SettingsScreenHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Настройки компании</Text>
          <ProfileAvatarPicker
            storageKey="profile-avatar-agency"
            fallbackLabel={agencyName.trim().charAt(0).toUpperCase() || 'A'}
          />

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
              style={[styles.input, styles.readOnlyInput]}
              value={email}
              editable={false}
              selectTextOnFocus={false}
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
              onChangeText={(value) => setPhone(formatPhoneInput(value))}
              keyboardType="phone-pad"
              placeholder="Телефон"
              placeholderTextColor="#939393"
            />
            {!isPhoneValid(phone) ? (
              <Text style={styles.errorText}>Введите телефон в формате +7 777 123 12 12</Text>
            ) : null}
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

        <View style={[styles.card, styles.securityCard]}>
          <Text style={styles.cardTitle}>Безопасность</Text>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/change-password')}>
            <Text style={styles.secondaryButtonText}>Изменить пароль</Text>
          </Pressable>
        </View>

        <LogoutActionCard
          onPress={async () => {
            await signOut();
            router.replace('/login');
          }}
        />
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
    paddingVertical: 0,
    fontSize: 16,
    color: '#3A3A3A',
    textAlignVertical: 'center',
  },
  readOnlyInput: {
    color: '#777777',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: '#D14F4F',
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
  securityCard: {
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
