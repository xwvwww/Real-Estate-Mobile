import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateListingDraft, useListingDraft } from '@/stores/listingDraftStore';

export default function AgencyCreateListingStep3Screen() {
  const router = useRouter();
  const draft = useListingDraft();

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
          <Text style={styles.stepText}>Шаг 3 из 4</Text>

          <View style={styles.progressRow}>
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={styles.progressBar} />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Характеристики</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Количество комнат*</Text>
            <TextInput
              style={styles.input}
              value={draft.roomsCount}
              onChangeText={(value) => updateListingDraft({ roomsCount: value })}
              keyboardType="number-pad"
              placeholder="Например: 2"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Площадь (м²)*</Text>
            <TextInput
              style={styles.input}
              value={draft.area}
              onChangeText={(value) => updateListingDraft({ area: value })}
              keyboardType="number-pad"
              placeholder="Например: 65"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.rowFieldsWrap}>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Этаж*</Text>
              <TextInput
                style={styles.input}
                value={draft.floor}
                onChangeText={(value) => updateListingDraft({ floor: value })}
                keyboardType="number-pad"
                placeholder="5"
                placeholderTextColor="#939393"
              />
            </View>

            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Этажность здания*</Text>
              <TextInput
                style={styles.input}
                value={draft.totalFloors}
                onChangeText={(value) => updateListingDraft({ totalFloors: value })}
                keyboardType="number-pad"
                placeholder="9"
                placeholderTextColor="#939393"
              />
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={styles.backAction} onPress={() => router.back()}>
              <Text style={styles.backActionText}>Назад</Text>
            </Pressable>

            <Pressable style={styles.nextAction} onPress={() => router.push('/agency-create-listing-step4')}>
              <Text style={styles.nextActionText}>Далее</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
  rowFieldsWrap: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
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
  actionsRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  backAction: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backActionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  nextAction: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextActionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
