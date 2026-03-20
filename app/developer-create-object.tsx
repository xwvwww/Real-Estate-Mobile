import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { createListing } from '@/lib/api';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PROPERTY_TYPES = ['Квартира', 'Студия', 'Пентхаус'] as const;

export default function DeveloperCreateObjectScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [price, setPrice] = useState('');
  const [rooms, setRooms] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [floorsTotal, setFloorsTotal] = useState('');
  const [description, setDescription] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () =>
      Boolean(
        name.trim() &&
          city.trim() &&
          propertyType.trim() &&
          price.trim() &&
          rooms.trim() &&
          area.trim() &&
          floor.trim() &&
          floorsTotal.trim() &&
          description.trim(),
      ),
    [name, propertyType, price, rooms, area, floor, floorsTotal, description],
  );

  const pickPhoto = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*'],
      multiple: false,
    });

    if (!result.canceled && result.assets?.length) {
      setPhotoName(result.assets[0].name);
    }
  };

  const submitObject = async () => {
    if (!session?.token) {
      Alert.alert('Ошибка', 'Нужно заново войти в аккаунт.');
      return;
    }

    const parsedPrice = Number(price.replace(/\s/g, ''));
    const parsedRooms = Number(rooms);
    const parsedArea = Number(area);
    const parsedFloor = Number(floor);
    const parsedFloorsTotal = Number(floorsTotal);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Ошибка', 'Укажите корректную цену.');
      return;
    }

    try {
      setSubmitting(true);

      await createListing(
        {
          title: name.trim(),
          description: description.trim(),
          property_type: propertyType.trim(),
          deal_type: 'sale',
          price: parsedPrice,
          city: city.trim(),
          address: '',
          rooms: Number.isFinite(parsedRooms) ? parsedRooms : undefined,
          area: Number.isFinite(parsedArea) ? parsedArea : undefined,
          floor: Number.isFinite(parsedFloor) ? parsedFloor : undefined,
          total_floors: Number.isFinite(parsedFloorsTotal) ? parsedFloorsTotal : undefined,
        },
        session.token
      );

      Alert.alert('Готово', 'Объект отправлен на модерацию.');
      router.replace('/developer-objects');
    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Не удалось создать объект.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3A3A3A" />
        </Pressable>
        <Text style={styles.headerTitle}>Добавить объект</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основная информация</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Название объекта*</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Например: 2-комнатная квартира, 65 м²"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Город*</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Например: Алматы"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Тип недвижимости*</Text>
            <Pressable style={styles.selectButton} onPress={() => setTypeModalOpen(true)}>
              <Text style={[styles.selectText, !propertyType && styles.placeholderText]}>
                {propertyType || 'Выберите тип'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#939393" />
            </Pressable>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Цена*</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Например: 18 500 000"
              placeholderTextColor="#939393"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Характеристики</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Количество комнат*</Text>
            <TextInput
              style={styles.input}
              value={rooms}
              onChangeText={setRooms}
              placeholder="Например: 2"
              placeholderTextColor="#939393"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Площадь (м²)*</Text>
            <TextInput
              style={styles.input}
              value={area}
              onChangeText={setArea}
              placeholder="Например: 65"
              placeholderTextColor="#939393"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldWrap, styles.half]}>
              <Text style={styles.fieldLabel}>Этаж*</Text>
              <TextInput
                style={styles.input}
                value={floor}
                onChangeText={setFloor}
                placeholder="5"
                placeholderTextColor="#939393"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.fieldWrap, styles.half]}>
              <Text style={styles.fieldLabel}>Этажность здания*</Text>
              <TextInput
                style={styles.input}
                value={floorsTotal}
                onChangeText={setFloorsTotal}
                placeholder="12"
                placeholderTextColor="#939393"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <TextInput
            style={styles.textarea}
            value={description}
            onChangeText={setDescription}
            placeholder="Опишите особенности планировки, отделки, виды из окон..."
            placeholderTextColor="#939393"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Фотографии</Text>
          <View style={styles.photoRow}>
            <Pressable style={styles.photoAdd} onPress={pickPhoto}>
              <Ionicons name="cloud-upload-outline" size={24} color="#70A0FF" />
              <Text style={styles.photoAddText}>Добавить</Text>
            </Pressable>
            {photoName ? (
              <View style={styles.photoMeta}>
                <Text numberOfLines={2} style={styles.photoName}>
                  {photoName}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.photoHint}>Добавьте фотографии квартиры, планировки, вида из окон</Text>
        </View>

        <Pressable
          style={[styles.submitButton, (!canSubmit || submitting) && styles.submitButtonDisabled]}
          onPress={submitObject}
          disabled={!canSubmit || submitting}>
          <Text style={styles.submitText}>Отправить на модерацию</Text>
        </Pressable>

        <Text style={styles.notice}>
          После отправки объект получит статус «На модерации» и появится в каталоге после подтверждения администратором
        </Text>
      </ScrollView>

      <Modal visible={typeModalOpen} transparent animationType="fade" onRequestClose={() => setTypeModalOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setTypeModalOpen(false)}>
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Тип недвижимости</Text>
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {PROPERTY_TYPES.map((item) => (
                <Pressable
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    setPropertyType(item);
                    setTypeModalOpen(false);
                  }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  scroll: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 24,
  },
  section: { gap: 16 },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  fieldWrap: { gap: 8 },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#3A3A3A',
  },
  selectButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: '#3A3A3A',
  },
  placeholderText: {
    color: '#939393',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  textarea: {
    minHeight: 168,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoAdd: {
    width: 108,
    height: 108,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoAddText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#70A0FF',
    fontWeight: '500',
  },
  photoMeta: {
    flex: 1,
    minHeight: 108,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  photoName: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3A3A',
  },
  photoHint: {
    marginTop: -4,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  submitButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  notice: {
    marginTop: -10,
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    maxHeight: 280,
  },
  modalTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 8,
  },
  modalList: {
    maxHeight: 180,
  },
  modalItem: {
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#3A3A3A',
  },
});
