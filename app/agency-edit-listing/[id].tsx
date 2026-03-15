import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getAgencyListingById } from '@/constants/agencyData';

export default function AgencyEditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const listing = getAgencyListingById(id);

  const [title, setTitle] = useState(listing?.title ?? '');
  const [price, setPrice] = useState(listing?.price ?? '');
  const [location, setLocation] = useState(listing?.location ?? '');
  const [description, setDescription] = useState(listing?.description ?? '');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Редактирование</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Field label="Название" value={title} onChangeText={setTitle} />
          <Field label="Цена" value={price} onChangeText={setPrice} />
          <Field label="Локация" value={location} onChangeText={setLocation} />
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Описание</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={styles.area}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#939393"
            />
          </View>
        </View>

        <Pressable style={styles.saveButton} onPress={() => router.back()}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.input} placeholderTextColor="#939393" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 73,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 12,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16 },
  fieldWrap: { marginTop: 14 },
  label: { fontSize: 14, lineHeight: 21, color: '#737373', marginBottom: 4 },
  input: { height: 48, borderRadius: 10, backgroundColor: '#F8F8F8', paddingHorizontal: 16, fontSize: 16, color: '#3A3A3A' },
  area: { minHeight: 120, borderRadius: 10, backgroundColor: '#F8F8F8', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#3A3A3A' },
  saveButton: { height: 48, borderRadius: 12, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
});
