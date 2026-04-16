import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { changeCurrentUserPassword } from '@/lib/api';

function passwordMeetsRequirements(value: string) {
  return (
    value.length >= 8 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const disabled = useMemo(() => {
    if (!session?.token || !oldPassword || !newPassword || !repeatPassword) {
      return true;
    }
    if (!passwordMeetsRequirements(newPassword)) {
      return true;
    }
    if (newPassword !== repeatPassword) {
      return true;
    }
    return false;
  }, [newPassword, oldPassword, repeatPassword, session?.token]);

  const onSubmit = async () => {
    if (!session?.token || disabled || saving) {
      return;
    }

    try {
      setSaving(true);
      await changeCurrentUserPassword(
        {
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: repeatPassword,
        },
        session.token
      );

      Alert.alert('Пароль обновлен', 'Новый пароль успешно сохранен.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        'Не удалось изменить пароль',
        error instanceof Error ? error.message : 'Попробуйте еще раз.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#3A3A3A" />
        </Pressable>
        <Text style={styles.headerTitle}>Изменить пароль</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Текущий пароль</Text>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Введите текущий пароль"
            placeholderTextColor="#939393"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Новый пароль</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Минимум 8 символов"
            placeholderTextColor="#939393"
          />
          <Text style={styles.helperText}>
            Минимум 8 символов, одна строчная, одна заглавная, цифра и спецсимвол.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Повторите пароль</Text>
          <TextInput
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Повторите новый пароль"
            placeholderTextColor="#939393"
          />
          {repeatPassword.length > 0 && repeatPassword !== newPassword ? (
            <Text style={styles.errorText}>Пароли не совпадают</Text>
          ) : null}
        </View>

        <Pressable
          style={[styles.primaryButton, (disabled || saving) && styles.primaryButtonDisabled]}
          disabled={disabled || saving}
          onPress={onSubmit}>
          <Text style={[styles.primaryButtonText, (disabled || saving) && styles.primaryButtonTextDisabled]}>
            {saving ? 'Сохраняем...' : 'Сохранить'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 63,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  content: { padding: 16, gap: 14 },
  field: { gap: 4 },
  label: { fontSize: 14, lineHeight: 21, color: '#737373', fontWeight: '500' },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#3A3A3A',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#8F8F8F',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#D14F4F',
  },
  primaryButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D5DCE8',
  },
  primaryButtonText: { fontSize: 16, lineHeight: 24, color: '#FFFFFF', fontWeight: '500' },
  primaryButtonTextDisabled: { color: '#8E97A7' },
});
