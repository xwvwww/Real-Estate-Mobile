import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import AppCheckbox from '@/components/AppCheckbox';
import { registerCompany, registerUser } from '@/lib/api';

import RegisterPageIconFirst from '@/assets/images/RegisterPageIconFirst.svg';
import RegisterPageIconSecond from '@/assets/images/RegisterPageIconSecond.svg';
import RegisterPageIconThird from '@/assets/images/RegisterPageIconThird.svg';

type Role = 'user' | 'agency' | 'developer';

type UserForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
};

type CompanyForm = {
  companyName: string;
  registrationNumber: string;
  city: string;
  companyEmail: string;
  companyPhone: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  password: string;
  passwordConfirmation: string;
};

type RoleItemProps = {
  title: string;
  description: string;
  active: boolean;
  onPress: () => void;
  icon: ReactNode;
  compact?: boolean;
};

function RoleItem({ title, description, active, onPress, icon, compact }: RoleItemProps) {
  return (
    <Pressable style={[styles.roleCard, active && styles.roleCardActive]} onPress={onPress}>
      <View style={styles.roleIconWrap}>{icon}</View>
      <View style={styles.roleTextWrap}>
        <Text style={[styles.roleTitle, compact && styles.roleTitleCompact]}>{title}</Text>
        <Text style={[styles.roleDescription, compact && styles.roleDescriptionCompact]}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('user');
  const [step, setStep] = useState<1 | 2>(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [agencyPasswordVisible, setAgencyPasswordVisible] = useState(false);
  const [agencyRepeatPasswordVisible, setAgencyRepeatPasswordVisible] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [agencyDocName, setAgencyDocName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userForm, setUserForm] = useState<UserForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
  });
  const [companyForm, setCompanyForm] = useState<CompanyForm>({
    companyName: '',
    registrationNumber: '',
    city: '',
    companyEmail: '',
    companyPhone: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    password: '',
    passwordConfirmation: '',
  });
  const transition = useRef(new Animated.Value(1)).current;
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateUserForm = <K extends keyof UserForm>(field: K, value: UserForm[K]) => {
    setUserForm((current) => ({ ...current, [field]: value }));
  };

  const updateCompanyForm = <K extends keyof CompanyForm>(field: K, value: CompanyForm[K]) => {
    setCompanyForm((current) => ({ ...current, [field]: value }));
  };

  const onSelectRole = (nextRole: Role) => {
    setRole(nextRole);
    if (nextRole === 'user' || nextRole === 'agency' || nextRole === 'developer') {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = setTimeout(() => setStep(2), 90);
    }
  };

  const isUserStepTwo = step === 2 && role === 'user';
  const isCompanyStepTwo = step === 2 && (role === 'agency' || role === 'developer');

  const pickAgencyDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    setAgencyDocName(result.assets?.[0]?.name ?? null);
  };

  const submitUserRegistration = async () => {
    if (!acceptTerms) {
      Alert.alert('Требуется согласие', 'Подтвердите согласие с условиями сервиса.');
      return;
    }

    if (userForm.password !== userForm.passwordConfirmation) {
      Alert.alert('Пароли не совпадают', 'Проверьте пароль и повторите ввод.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await registerUser({
        first_name: userForm.firstName.trim(),
        last_name: userForm.lastName.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim(),
        password: userForm.password,
        password_confirmation: userForm.passwordConfirmation,
      });

      router.replace({
        pathname: '/confirm/[token]',
        params: { token: response.token },
      });
    } catch (error) {
      Alert.alert(
        'Не удалось зарегистрироваться',
        error instanceof Error ? error.message : 'Попробуйте ещё раз.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCompanyRegistration = async () => {
    if (!acceptTerms) {
      Alert.alert('Требуется согласие', 'Подтвердите согласие с условиями сервиса.');
      return;
    }

    if (companyForm.password !== companyForm.passwordConfirmation) {
      Alert.alert('Пароли не совпадают', 'Проверьте пароль и повторите ввод.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await registerCompany({
        company_name: companyForm.companyName.trim(),
        registration_number: companyForm.registrationNumber.trim(),
        city: companyForm.city.trim(),
        company_email: companyForm.companyEmail.trim(),
        company_phone: companyForm.companyPhone.trim(),
        company_type: role === 'agency' ? 'agency' : 'developer',
        first_name: companyForm.firstName.trim(),
        last_name: companyForm.lastName.trim(),
        job_title: companyForm.jobTitle.trim(),
        password: companyForm.password,
        password_confirmation: companyForm.passwordConfirmation,
      });

      router.replace({
        pathname: '/confirm/[token]',
        params: { token: response.token },
      });
    } catch (error) {
      Alert.alert(
        'Не удалось зарегистрировать компанию',
        error instanceof Error ? error.message : 'Попробуйте ещё раз.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmitUser =
    acceptTerms &&
    !isSubmitting &&
    userForm.firstName.trim().length > 0 &&
    userForm.lastName.trim().length > 0 &&
    userForm.email.trim().length > 0 &&
    userForm.phone.trim().length > 0 &&
    userForm.password.trim().length > 0 &&
    userForm.passwordConfirmation.trim().length > 0;

  const canSubmitCompany =
    acceptTerms &&
    !isSubmitting &&
    companyForm.companyName.trim().length > 0 &&
    companyForm.registrationNumber.trim().length > 0 &&
    companyForm.city.trim().length > 0 &&
    companyForm.companyEmail.trim().length > 0 &&
    companyForm.companyPhone.trim().length > 0 &&
    companyForm.firstName.trim().length > 0 &&
    companyForm.lastName.trim().length > 0 &&
    companyForm.jobTitle.trim().length > 0 &&
    companyForm.password.trim().length > 0 &&
    companyForm.passwordConfirmation.trim().length > 0;

  useEffect(() => {
    transition.setValue(0);
    Animated.timing(transition, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [step, transition]);

  useEffect(() => {
    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Регистрация</Text>
        <Pressable hitSlop={8} onPress={() => router.replace('/login')}>
          <Ionicons name="close" size={24} color="#7F7F7F" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.View
          style={{
            opacity: transition,
            transform: [
              {
                translateY: transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                }),
              },
            ],
          }}
        >
          {isUserStepTwo ? (
          <>
            <Text style={styles.stepText}>Шаг 2 из 2</Text>

            <View style={styles.twoCols}>
              <View style={styles.col}>
                <Text style={styles.label}>Имя*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Иван"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  value={userForm.firstName}
                  onChangeText={(value) => updateUserForm('firstName', value)}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Фамилия*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Иванов"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  value={userForm.lastName}
                  onChangeText={(value) => updateUserForm('lastName', value)}
                />
              </View>
            </View>

            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={styles.input}
              placeholder="seller@example.kz"
              placeholderTextColor={PLACEHOLDER_COLOR}
              keyboardType="email-address"
              autoCapitalize="none"
              value={userForm.email}
              onChangeText={(value) => updateUserForm('email', value)}
            />

            <Text style={styles.label}>Телефон*</Text>
            <TextInput
              style={styles.input}
              placeholder="+7 700 000 00 00"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={userForm.phone}
              onChangeText={(value) => updateUserForm('phone', value)}
            />

            <Text style={styles.label}>Пароль*</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry={!passwordVisible}
                value={userForm.password}
                onChangeText={(value) => updateUserForm('password', value)}
              />
              <Pressable onPress={() => setPasswordVisible((v) => !v)} style={styles.eyeButton}>
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8D8D8D"
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Повторите пароль*</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry={!repeatPasswordVisible}
                value={userForm.passwordConfirmation}
                onChangeText={(value) => updateUserForm('passwordConfirmation', value)}
              />
              <Pressable
                onPress={() => setRepeatPasswordVisible((v) => !v)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={repeatPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8D8D8D"
                />
              </Pressable>
            </View>

            <Pressable style={styles.termsRow} onPress={() => setAcceptTerms((v) => !v)}>
              <AppCheckbox checked={acceptTerms} />
              <Text style={styles.agreeText}>
                Я принимаю условия сервиса и соглашаюсь на обработку персональных данных.
              </Text>
            </Pressable>

            <View style={styles.actionsRow}>
              <Pressable style={styles.secondaryButton} onPress={() => setStep(1)}>
                <Text style={styles.secondaryButtonText}>Назад</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.primaryButton,
                  !canSubmitUser && styles.primaryButtonDisabled,
                ]}
                disabled={!canSubmitUser}
                onPress={submitUserRegistration}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Отправляем...' : 'Зарегистрироваться'}
                </Text>
              </Pressable>
            </View>
          </>
          ) : isCompanyStepTwo ? (
          <>
            <Text style={styles.stepText}>Шаг 2 из 2</Text>

            <Text style={styles.sectionTitle}>Информация о компании</Text>

            <Text style={styles.label}>Название компании*</Text>
            <TextInput
              style={styles.input}
              placeholder={
                role === 'developer' ? 'ТОО Застройщик' : 'ТОО Агентство недвижимости'
              }
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={companyForm.companyName}
              onChangeText={(value) => updateCompanyForm('companyName', value)}
            />

            <View style={styles.twoCols}>
              <View style={styles.col}>
                <View style={styles.rowLabelWrap}>
                  <Text style={[styles.label, styles.rowLabelText, styles.regNumberLabelTop]}>
                    Регистрационный номер*
                  </Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="БИН/ИИН"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  value={companyForm.registrationNumber}
                  onChangeText={(value) => updateCompanyForm('registrationNumber', value)}
                />
              </View>
              <View style={styles.col}>
                <View style={styles.rowLabelWrap}>
                  <Text style={[styles.label, styles.rowLabelText]}>Город*</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Алматы"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  value={companyForm.city}
                  onChangeText={(value) => updateCompanyForm('city', value)}
                />
              </View>
            </View>

            <Text style={styles.label}>Email компании*</Text>
            <TextInput
              style={styles.input}
              placeholder="info@company.kz"
              placeholderTextColor={PLACEHOLDER_COLOR}
              keyboardType="email-address"
              autoCapitalize="none"
              value={companyForm.companyEmail}
              onChangeText={(value) => updateCompanyForm('companyEmail', value)}
            />

            <Text style={styles.label}>Телефон компании*</Text>
            <TextInput
              style={styles.input}
              placeholder="+7 700 000 00 00"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={companyForm.companyPhone}
              onChangeText={(value) => updateCompanyForm('companyPhone', value)}
            />

            <Text style={styles.sectionTitle}>Контактное лицо</Text>

            <View style={styles.twoCols}>
              <View style={styles.col}>
                <Text style={styles.label}>Имя*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Алексей"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  value={companyForm.firstName}
                  onChangeText={(value) => updateCompanyForm('firstName', value)}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Фамилия*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Иванов"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  value={companyForm.lastName}
                  onChangeText={(value) => updateCompanyForm('lastName', value)}
                />
              </View>
            </View>

            <Text style={styles.label}>Должность*</Text>
            <TextInput
              style={styles.input}
              placeholder="Директор"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={companyForm.jobTitle}
              onChangeText={(value) => updateCompanyForm('jobTitle', value)}
            />

            <Text style={styles.label}>Пароль*</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry={!agencyPasswordVisible}
                value={companyForm.password}
                onChangeText={(value) => updateCompanyForm('password', value)}
              />
              <Pressable
                onPress={() => setAgencyPasswordVisible((v) => !v)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={agencyPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8D8D8D"
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Повторите пароль*</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry={!agencyRepeatPasswordVisible}
                value={companyForm.passwordConfirmation}
                onChangeText={(value) => updateCompanyForm('passwordConfirmation', value)}
              />
              <Pressable
                onPress={() => setAgencyRepeatPasswordVisible((v) => !v)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={agencyRepeatPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8D8D8D"
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Документы</Text>
            <Pressable style={styles.uploadButton} onPress={pickAgencyDocument}>
              <View style={styles.uploadContent}>
                <Ionicons name="cloud-upload-outline" size={20} color="#8D8D8D" />
                <Text style={styles.uploadButtonText}>
                  {agencyDocName ? agencyDocName : 'Загрузить документы'}
                </Text>
              </View>
              {agencyDocName ? (
                <Pressable
                  style={styles.clearFileButton}
                  onPress={(event) => {
                    event.stopPropagation();
                    setAgencyDocName(null);
                  }}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                </Pressable>
              ) : null}
            </Pressable>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Профиль компании будет проверен администратором. Публикация объявлений будет
                доступна после подтверждения.
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.secondaryButton} onPress={() => setStep(1)}>
                <Text style={styles.secondaryButtonText}>Назад</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.primaryButton,
                  !canSubmitCompany && styles.primaryButtonDisabled,
                ]}
                disabled={!canSubmitCompany}
                onPress={submitCompanyRegistration}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Отправляем...' : 'Зарегистрироваться'}
                </Text>
              </Pressable>
            </View>
          </>
          ) : (
          <>
            <Text style={styles.stepText}>Шаг 1 из 2</Text>
            <Text style={[styles.screenTitle, styles.screenTitleCompact]}>Выберите тип аккаунта</Text>

            <View style={styles.roleList}>
              <RoleItem
                title="Пользователь"
                description="Просмотр объектов и отправка заявок"
                active={role === 'user'}
                onPress={() => onSelectRole('user')}
                icon={<RegisterPageIconFirst width={24} height={24} />}
                compact
              />

              <RoleItem
                title="Агентство недвижимости"
                description="Публикация объявлений и работа с клиентами"
                active={role === 'agency'}
                onPress={() => onSelectRole('agency')}
                icon={<RegisterPageIconSecond width={24} height={24} />}
                compact
              />

              <RoleItem
                title="Застройщик"
                description="Размещение проектов и управление объектами"
                active={role === 'developer'}
                onPress={() => onSelectRole('developer')}
                icon={<RegisterPageIconThird width={24} height={24} />}
                compact
              />
            </View>
          </>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  header: {
    height: 74,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
    backgroundColor: '#F3F3F3',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#353535',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 34,
    paddingBottom: 24,
  },
  stepText: {
    textAlign: 'center',
    color: '#9A9A9A',
    fontSize: 14,
    marginBottom: 10,
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#353535',
    marginBottom: 20,
  },
  screenTitleCompact: {
    fontSize: 20,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 34 / 1.7,
    fontWeight: '600',
    color: '#353535',
    marginTop: 14,
    marginBottom: 6,
  },
  roleList: {
    gap: 16,
  },
  roleCard: {
    minHeight: 102,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    backgroundColor: '#F3F3F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  roleCardActive: {
    borderColor: '#98B8FF',
    backgroundColor: '#F7FAFF',
  },
  roleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E6EAF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  roleTextWrap: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 4,
  },
  roleTitleCompact: {
    fontSize: 18,
    fontWeight: '500',
  },
  roleDescription: {
    fontSize: 17,
    lineHeight: 22,
    color: '#8F8F8F',
    fontWeight: '400',
  },
  roleDescriptionCompact: {
    fontSize: 15,
    lineHeight: 20,
  },
  twoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: '#3A3A3A',
    marginBottom: 8,
    marginTop: 14,
  },
  rowLabelWrap: {
    minHeight: 46,
    justifyContent: 'flex-end',
  },
  rowLabelText: {
    marginTop: 0,
  },
  regNumberLabelTop: {
    marginTop: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#2A2A2A',
  },
  passwordWrap: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 12,
  },
  uploadButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  uploadButtonText: {
    color: '#8D8D8D',
    fontSize: 17,
    flexShrink: 1,
  },
  clearFileButton: {
    marginLeft: 10,
  },
  infoBox: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#EAF0F8',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoText: {
    color: '#4E4E4E',
    fontSize: 15,
    lineHeight: 22,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#2A2A2A',
  },
  eyeButton: {
    padding: 4,
  },
  termsRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  agreeText: {
    marginLeft: 10,
    flex: 1,
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#2F2F2F',
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6F9BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

const PLACEHOLDER_COLOR = '#9B9B9B';
