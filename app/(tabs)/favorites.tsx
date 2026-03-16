import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { USER_LISTINGS } from '@/constants/userListings';
import { useFavoriteIds } from '@/stores/favoritesStore';

export default function FavoritesScreen() {
  const router = useRouter();
  const favoriteIds = useFavoriteIds();
  const favoriteItems = USER_LISTINGS.filter((item) => favoriteIds.includes(item.id));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Избранное</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never">
        {favoriteItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Пока нет избранных объектов</Text>
            <Text style={styles.emptyText}>Добавьте объекты в избранное из каталога или карточки объекта</Text>
          </View>
        ) : null}

        {favoriteItems.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/object/[id]', params: { id: item.id } })}>
            <Image source={item.image} style={styles.image} contentFit="cover" />
            <View style={styles.cardBody}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.city}>{item.city}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    height: 63,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  scroll: {
    backgroundColor: '#F8F8F8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  emptyBox: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  card: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  city: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: '#939393',
  },
  price: {
    marginTop: 6,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#70A0FF',
  },
});
