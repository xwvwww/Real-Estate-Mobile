import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const disabled = useMemo(() => {
    if (!oldPassword || !newPassword || !repeatPassword) {
      return true;
    }
    if (newPassword.length < 6) {
      return true;
    }
    if (newPassword !== repeatPassword) {
      return true;
    }
    return false;
  }, [newPassword, oldPassword, repeatPassword]);

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
            placeholder="Минимум 6 символов"
            placeholderTextColor="#939393"
          />
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
        </View>

        <Pressable style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]} disabled={disabled}>
          <Text style={[styles.primaryButtonText, disabled && styles.primaryButtonTextDisabled]}>Сохранить</Text>
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
