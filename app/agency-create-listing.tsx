import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateListingDraft, useListingDraft } from '@/stores/listingDraftStore';
import { formatPriceInput } from '@/lib/price';

const PROPERTY_TYPES = ['Квартира', 'Дом', 'Коммерческая', 'Студия'] as const;
const DEAL_TYPES = ['Продажа', 'Аренда'] as const;

export default function AgencyCreateListingScreen() {
  const router = useRouter();
  const draft = useListingDraft();

  const [propertyTypeModalOpen, setPropertyTypeModalOpen] = useState(false);
  const [dealTypeModalOpen, setDealTypeModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topHeader}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#3A3A3A" />
        </Pressable>

        <Text style={styles.topHeaderTitle}>Создание объявления</Text>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.stepSection}>
          <Text style={styles.stepText}>Шаг 1 из 4</Text>

          <View style={styles.progressRow}>
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Основная информация</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Название объекта*</Text>
            <TextInput
              style={styles.input}
              value={draft.title}
              onChangeText={(value) => updateListingDraft({ title: value })}
              placeholder="Например: 2-комнатная квартира в центре"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Тип недвижимости*</Text>
            <Pressable style={styles.select} onPress={() => setPropertyTypeModalOpen(true)}>
              <Text style={[styles.selectText, !draft.propertyType && styles.selectPlaceholder]}>
                {draft.propertyType || 'Выберите тип недвижимости'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#939393" />
            </Pressable>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Тип сделки*</Text>
            <Pressable style={styles.select} onPress={() => setDealTypeModalOpen(true)}>
              <Text style={[styles.selectText, !draft.dealType && styles.selectPlaceholder]}>
                {draft.dealType || 'Выберите тип сделки'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#939393" />
            </Pressable>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Цена*</Text>
            <View style={styles.priceInputWrap}>
              <TextInput
                style={[styles.input, styles.priceInput]}
                value={draft.price}
                onChangeText={(value) => updateListingDraft({ price: formatPriceInput(value) })}
                keyboardType="number-pad"
                placeholder="Например: 12 500 000"
                placeholderTextColor="#939393"
              />
              <Text style={styles.priceCurrency}>₸</Text>
            </View>
          </View>

          <Pressable style={styles.nextButton} onPress={() => router.push('/agency-create-listing-step2')}>
            <Text style={styles.nextButtonText}>Далее</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={propertyTypeModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPropertyTypeModalOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPropertyTypeModalOpen(false)}>
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Тип недвижимости</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PROPERTY_TYPES.map((item) => (
                <Pressable
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    setPropertyTypeModalOpen(false);
                    updateListingDraft({ propertyType: item });
                  }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={dealTypeModalOpen} transparent animationType="fade" onRequestClose={() => setDealTypeModalOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setDealTypeModalOpen(false)}>
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Тип сделки</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {DEAL_TYPES.map((item) => (
                <Pressable
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    setDealTypeModalOpen(false);
                    updateListingDraft({ dealType: item });
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
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  saveButton: {
    minWidth: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#70A0FF',
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 24,
  },
  stepSection: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#939393',
    textAlign: 'center',
  },
  progressRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E8E8E8',
  },
  progressBarActive: {
    backgroundColor: '#70A0FF',
  },
  formSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  fieldWrap: {
    marginTop: 16,
    gap: 8,
  },
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
    lineHeight: 24,
    color: '#3A3A3A',
  },
  priceInputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  priceInput: {
    paddingRight: 44,
  },
  priceCurrency: {
    position: 'absolute',
    right: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#737373',
    fontWeight: '500',
  },
  select: {
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
    lineHeight: 24,
    color: '#3A3A3A',
  },
  selectPlaceholder: {
    color: '#939393',
  },
  nextButton: {
    marginTop: 26,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 8,
  },
  modalItem: {
    height: 44,
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
