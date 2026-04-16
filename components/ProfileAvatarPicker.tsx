import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

type ProfileAvatarPickerProps = {
  storageKey: string;
  fallbackLabel: string;
};

async function readStoredAvatar(key: string) {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

async function writeStoredAvatar(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return;
    }

    if (value === null) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, value);
    return;
  }

  if (value === null) {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

export default function ProfileAvatarPicker({
  storageKey,
  fallbackLabel,
}: ProfileAvatarPickerProps) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    readStoredAvatar(storageKey)
      .then((value) => {
        if (!cancelled) {
          setAvatarUri(value);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled) {
      return;
    }

    const nextUri = result.assets?.[0]?.uri;

    if (!nextUri) {
      return;
    }

    setAvatarUri(nextUri);
    await writeStoredAvatar(storageKey, nextUri);
  };

  const removeAvatar = async () => {
    setAvatarUri(null);
    await writeStoredAvatar(storageKey, null);
  };

  return (
    <View style={styles.wrap}>
      {avatarUri ? (
        <>
          <Pressable style={styles.avatarShell} onPress={pickAvatar}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
          </Pressable>

          <View style={styles.actionRow}>
            <Pressable style={styles.primaryPill} onPress={pickAvatar}>
              <Ionicons name={loading ? 'hourglass-outline' : 'camera-outline'} size={16} color="#70A0FF" />
              <Text style={styles.primaryPillText}>Изменить фото</Text>
            </Pressable>

            <Pressable style={styles.secondaryPill} onPress={removeAvatar}>
              <Ionicons name="close" size={16} color="#737373" />
              <Text style={styles.secondaryPillText}>Удалить</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Pressable style={styles.emptyAvatarShell} onPress={pickAvatar}>
            <View style={styles.emptyAvatarInner}>
              <Ionicons name={loading ? 'hourglass-outline' : 'image-outline'} size={30} color="#70A0FF" />
            </View>
          </Pressable>
          <View style={styles.emptyCaption}>
            <Text style={styles.emptyPickerTitle}>Выбрать фото</Text>
            <Text style={styles.emptyPickerHint}>Откроется галерея</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    alignItems: 'center',
    gap: 12,
  },
  emptyAvatarShell: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#F7FAFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D9E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#70A0FF',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  emptyAvatarInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E9F1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCaption: {
    alignItems: 'center',
    gap: 2,
  },
  emptyPickerTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  emptyPickerHint: {
    fontSize: 13,
    lineHeight: 20,
    color: '#8B96A8',
  },
  avatarShell: {
    width: 124,
    height: 124,
    borderRadius: 62,
    overflow: 'hidden',
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#DCE8FF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#70A0FF',
  },
  avatarFallbackText: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryPill: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPillText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#70A0FF',
    fontWeight: '600',
  },
  secondaryPill: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryPillText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#737373',
    fontWeight: '500',
  },
});
