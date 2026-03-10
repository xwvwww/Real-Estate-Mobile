import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type FavoriteItem = {
  id: string;
  title: string;
  city: string;
  price: string;
  image: any;
};

const FAVORITE_ITEMS: FavoriteItem[] = [
  {
    id: 'r1',
    title: '2-комнатная квартира',
    city: 'Алматы',
    price: '12 500 000 ₸',
    image: require('@/assets/images/ObjectOne.png'),
  },
  {
    id: 'r2',
    title: '3-комнатная квартира',
    city: 'Алматы',
    price: '18 900 000 ₸',
    image: require('@/assets/images/ObjectTwo.png'),
  },
  {
    id: 'r3',
    title: 'Студия в новостройке',
    city: 'Алматы',
    price: '9 200 000 ₸',
    image: require('@/assets/images/ObjectThree.png'),
  },
];

export default function FavoritesScreen() {
  const router = useRouter();

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
        overScrollMode="never"
      >
        {FAVORITE_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/object/[id]', params: { id: item.id } })}
          >
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
