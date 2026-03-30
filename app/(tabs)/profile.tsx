import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import LogoutActionCard from '@/components/LogoutActionCard';
import SettingsScreenHeader from '@/components/SettingsScreenHeader';
import { updateCurrentUserProfile } from '@/lib/api';

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

export default function ProfileScreen() {
  const router = useRouter();
  const { session, signOut, updateSessionUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+7');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    setFirstName(session.user.first_name || '');
    setLastName(session.user.last_name || '');
    setEmail(session.user.email || '');
    setPhone(session.user.phone ? formatPhoneInput(session.user.phone) : '+7');
  }, [session?.user]);

  const canSave = useMemo(() => {
    if (!session?.token) {
      return false;
    }

    if (!firstName.trim() || !lastName.trim() || !isPhoneValid(phone)) {
      return false;
    }

    const normalizedPhone = phone.replace(/\s+/g, '');
    const currentPhone = session.user.phone ? formatPhoneInput(session.user.phone).replace(/\s+/g, '') : '';

    return (
      firstName.trim() !== session.user.first_name ||
      lastName.trim() !== session.user.last_name ||
      normalizedPhone !== currentPhone
    );
  }, [firstName, lastName, phone, session]);

  const onLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const onSave = async () => {
    if (!session?.token || !canSave || saving) {
      return;
    }

    try {
      setSaving(true);
      const updatedUser = await updateCurrentUserProfile(
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.replace(/\s+/g, ''),
        },
        session.token
      );
      await updateSessionUser(updatedUser);
      Alert.alert('Профиль обновлен', 'Изменения успешно сохранены.');
    } catch (error) {
      Alert.alert(
        'Не удалось сохранить профиль',
        error instanceof Error ? error.message : 'Попробуйте еще раз.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
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
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
              placeholderTextColor="#8F8F8F"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Фамилия</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
              placeholderTextColor="#8F8F8F"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              editable={false}
              style={[styles.input, styles.inputDisabled]}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#8F8F8F"
            />
            <Text style={styles.helperText}>Email пока не редактируется через mobile API.</Text>
          </View>

          <View style={[styles.fieldWrap, styles.lastField]}>
            <Text style={styles.label}>Телефон</Text>
            <TextInput
              value={phone}
              onChangeText={(value) => setPhone(formatPhoneInput(value))}
              style={styles.input}
              keyboardType="phone-pad"
              placeholderTextColor="#8F8F8F"
            />
            {!isPhoneValid(phone) ? (
              <Text style={styles.errorText}>Введите телефон в формате +7 777 123 12 12</Text>
            ) : null}
          </View>

          <Pressable
            style={[styles.primaryButton, (!canSave || saving) && styles.primaryButtonDisabled]}
            disabled={!canSave || saving}
            onPress={onSave}>
            <Text style={styles.primaryButtonText}>
              {saving ? 'Сохраняем...' : 'Сохранить изменения'}
            </Text>
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
    paddingBottom: 12,
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
  inputDisabled: {
    color: '#8F8F8F',
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: '#8F8F8F',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: '#D14F4F',
  },
  primaryButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D5DCE8',
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
