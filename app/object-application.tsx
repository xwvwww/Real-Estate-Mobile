import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppDropdown from '@/components/AppDropdown';
import AppCheckbox from '@/components/AppCheckbox';
import { getListingById } from '@/constants/userListings';

const LEASE_TERMS = ['3-6 месяцев', '6-12 месяцев', '1-2 года', 'Более 2 лет'];
const GENDERS = ['М', 'Ж', 'Другое'] as const;

type Gender = (typeof GENDERS)[number];

export default function ObjectApplicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const listing = getListingById(id);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [children, setChildren] = useState(false);
  const [pets, setPets] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [stableWork, setStableWork] = useState(false);
  const [gender, setGender] = useState<Gender>('Другое');
  const [isStudent, setIsStudent] = useState(false);
  const [stableIncome, setStableIncome] = useState(false);
  const [leaseTerm, setLeaseTerm] = useState(LEASE_TERMS[0]);
  const [leaseOpen, setLeaseOpen] = useState(false);
  const [message, setMessage] = useState('');

  const isSubmitDisabled = useMemo(() => {
    return !name.trim() || !age.trim() || !phone.trim() || !email.trim() || !peopleCount.trim();
  }, [age, email, name, peopleCount, phone]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Заявка на объект</Text>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color="#737373" />
        </Pressable>
      </View>

      <View style={styles.objectBanner}>
        <Text style={styles.objectBannerLabel}>Объект недвижимости</Text>
        <Text style={styles.objectBannerTitle}>{listing?.title ?? 'Объект недвижимости'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основная информация</Text>
          <Field label="Имя *" value={name} onChangeText={setName} placeholder="Ваше имя" />
          <Field
            label="Возраст *"
            value={age}
            onChangeText={setAge}
            placeholder="Ваш возраст"
            keyboardType="number-pad"
          />
          <Field
            label="Телефон *"
            value={phone}
            onChangeText={setPhone}
            placeholder="+7 (___) ___-__-__"
            keyboardType="phone-pad"
          />
          <Field
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация о проживании</Text>
          <Field
            label="Сколько человек будет проживать? *"
            value={peopleCount}
            onChangeText={setPeopleCount}
            placeholder="Количество человек"
            keyboardType="number-pad"
          />
          <CheckRow label="Есть дети" checked={children} onToggle={() => setChildren((v) => !v)} />
          <CheckRow
            label="Есть домашние животные"
            checked={pets}
            onToggle={() => setPets((v) => !v)}
          />
          <CheckRow label="Курю" checked={smoking} onToggle={() => setSmoking((v) => !v)} />
          <CheckRow
            label="Есть постоянная работа"
            checked={stableWork}
            onToggle={() => setStableWork((v) => !v)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Дополнительная информация</Text>
          <Text style={styles.fieldLabel}>Пол</Text>
          <View style={styles.genderRow}>
            {GENDERS.map((item) => (
              <Pressable
                key={item}
                style={[styles.genderBtn, gender === item && styles.genderBtnActive]}
                onPress={() => setGender(item)}>
                <Text style={[styles.genderBtnText, gender === item && styles.genderBtnTextActive]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          <CheckRow
            label="Являюсь студентом"
            checked={isStudent}
            onToggle={() => setIsStudent((v) => !v)}
          />
          <CheckRow
            label="Есть стабильный доход"
            checked={stableIncome}
            onToggle={() => setStableIncome((v) => !v)}
          />

          <Text style={styles.fieldLabel}>На какой срок планируется аренда? *</Text>
          <AppDropdown
            value={leaseTerm}
            placeholder="Выберите срок"
            open={leaseOpen}
            options={LEASE_TERMS.map((item) => ({ label: item, value: item }))}
            onToggle={() => setLeaseOpen((v) => !v)}
            onSelect={(value) => {
              setLeaseTerm(value);
              setLeaseOpen(false);
            }}
            triggerStyle={styles.selectInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Сообщение арендодателю</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={styles.textArea}
            multiline
            textAlignVertical="top"
            placeholder="Расскажите о себе, когда планируете заезд и другую важную информацию..."
            placeholderTextColor="#939393"
          />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.submitBtn, isSubmitDisabled && styles.submitBtnDisabled]} disabled={isSubmitDisabled}>
          <Text style={[styles.submitText, isSubmitDisabled && styles.submitTextDisabled]}>Отправить заявку</Text>
        </Pressable>
        <Text style={styles.footerNote}>
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#939393"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <Pressable style={styles.checkRow} onPress={onToggle}>
      <AppCheckbox checked={checked} />
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 74,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 24, lineHeight: 30, color: '#3A3A3A', fontWeight: '600' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  objectBanner: {
    backgroundColor: '#F0F7FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0EDFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  objectBannerLabel: { fontSize: 13, lineHeight: 20, color: '#70A0FF' },
  objectBannerTitle: { marginTop: 2, fontSize: 16, lineHeight: 24, color: '#3A3A3A', fontWeight: '500' },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 116, gap: 28 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, lineHeight: 24, color: '#3A3A3A', fontWeight: '600' },
  field: { gap: 4 },
  fieldLabel: { fontSize: 14, lineHeight: 21, color: '#737373', fontWeight: '500' },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#3A3A3A',
  },
  selectInput: {
    borderWidth: 0,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkLabel: { fontSize: 15, lineHeight: 22, color: '#3A3A3A', fontWeight: '500' },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderBtnActive: { backgroundColor: '#70A0FF' },
  genderBtnText: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  genderBtnTextActive: { color: '#FFFFFF' },
  textArea: {
    height: 136,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#3A3A3A',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 8,
  },
  submitBtn: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#E0E0E0' },
  submitText: { fontSize: 16, lineHeight: 24, color: '#FFFFFF', fontWeight: '500' },
  submitTextDisabled: { color: '#939393' },
  footerNote: { fontSize: 12, lineHeight: 18, color: '#939393', textAlign: 'center' },
});
