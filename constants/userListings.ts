export type DealType = 'buy' | 'rent';

export type UserListing = {
  id: string;
  type: string;
  dealType: DealType;
  city: string;
  priceValue: number;
  price: string;
  title: string;
  address: string;
  beds: string;
  area: string;
  floor: string;
  latitude: number;
  longitude: number;
  image: number;
  description: string;
  features: string[];
};

export const USER_LISTINGS: UserListing[] = [
  {
    id: 'r1',
    type: 'Квартира',
    dealType: 'buy',
    city: 'Астана',
    priceValue: 12500000,
    price: '12 500 000 ₸',
    title: '2-комнатная квартира',
    address: 'пр. Туран 18',
    beds: '2',
    area: '65 м²',
    floor: '5 этаж',
    latitude: 51.1284,
    longitude: 71.4304,
    image: require('@/assets/images/ObjectOne.png'),
    description: 'Светлая квартира в активно развивающемся районе столицы, рядом школы и деловой центр.',
    features: ['Ремонт', 'Мебель', 'Балкон', 'Парковка'],
  },
  {
    id: 'r2',
    type: 'Квартира',
    dealType: 'buy',
    city: 'Алматы',
    priceValue: 18900000,
    price: '18 900 000 ₸',
    title: '3-комнатная квартира',
    address: 'пр. Достык 97',
    beds: '3',
    area: '95 м²',
    floor: '12 этаж',
    latitude: 43.236,
    longitude: 76.92,
    image: require('@/assets/images/ObjectTwo.png'),
    description: 'Просторная квартира с панорамными окнами и видом на горы.',
    features: ['Ремонт', 'Техника', 'Лифт', 'Консьерж'],
  },
  {
    id: 'r3',
    type: 'Новостройка',
    dealType: 'buy',
    city: 'Шымкент',
    priceValue: 9200000,
    price: '9 200 000 ₸',
    title: 'Студия в новостройке',
    address: 'пр. Кунаева 12',
    beds: '1',
    area: '38 м²',
    floor: '8 этаж',
    latitude: 42.3154,
    longitude: 69.5869,
    image: require('@/assets/images/ObjectThree.png'),
    description: 'Новая студия в современном жилом комплексе в центре Шымкента.',
    features: ['Новостройка', 'Охрана', 'Лифт', 'Двор без машин'],
  },
  {
    id: 'r4',
    type: 'Дом',
    dealType: 'buy',
    city: 'Караганда',
    priceValue: 45000000,
    price: '45 000 000 ₸',
    title: 'Коттедж с участком',
    address: 'мкр. Юго-Восток, ул. Жанибекова 45',
    beds: '5',
    area: '220 м²',
    floor: '2 этаж',
    latitude: 49.8061,
    longitude: 73.085,
    image: require('@/assets/images/ObjectFour.png'),
    description: 'Большой коттедж для семьи в спокойном районе Караганды.',
    features: ['Участок', 'Гараж', 'Терраса', 'Кладовая'],
  },
  {
    id: 'r5',
    type: 'Квартира',
    dealType: 'rent',
    city: 'Актобе',
    priceValue: 8500000,
    price: '8 500 000 ₸',
    title: '1-комнатная квартира',
    address: 'пр. Абулхаир хана 42',
    beds: '1',
    area: '42 м²',
    floor: '3 этаж',
    latitude: 50.2839,
    longitude: 57.1669,
    image: require('@/assets/images/ObjectFive.png'),
    description: 'Уютная квартира рядом с университетами и транспортной развязкой в Актобе.',
    features: ['Мебель', 'Техника', 'Интернет'],
  },
  {
    id: 'r6',
    type: 'Квартира',
    dealType: 'buy',
    city: 'Атырау',
    priceValue: 25000000,
    price: '25 000 000 ₸',
    title: '4-комнатная квартира',
    address: 'ул. Сатпаева 77',
    beds: '4',
    area: '130 м²',
    floor: '15 этаж',
    latitude: 47.0945,
    longitude: 51.9238,
    image: require('@/assets/images/ObjectSix.png'),
    description: 'Семейная квартира в престижном районе Атырау, рядом парки и школы.',
    features: ['Гардероб', 'Паркинг', 'Кухня-студия'],
  },
  {
    id: 'r7',
    type: 'Новостройка',
    dealType: 'rent',
    city: 'Актау',
    priceValue: 14200000,
    price: '14 200 000 ₸',
    title: '2-комнатная в ЖК Comfort Town',
    address: 'мкр. 17, дом 89',
    beds: '2',
    area: '68 м²',
    floor: '10 этаж',
    latitude: 43.6511,
    longitude: 51.1975,
    image: require('@/assets/images/ObjectSeven.png'),
    description: 'Современная квартира в новом ЖК рядом с набережной Актау.',
    features: ['Охрана', 'Лобби', 'Игровая площадка'],
  },
  {
    id: 'r8',
    type: 'Дом',
    dealType: 'rent',
    city: 'Усть-Каменогорск',
    priceValue: 38500000,
    price: '38 500 000 ₸',
    title: 'Таунхаус в закрытом комплексе',
    address: 'ул. Казахстан 12',
    beds: '4',
    area: '180 м²',
    floor: '2 этаж',
    latitude: 49.9483,
    longitude: 82.6289,
    image: require('@/assets/images/ObjectEight.png'),
    description: 'Таунхаус с закрытой территорией и собственной зоной отдыха в Усть-Каменогорске.',
    features: ['Закрытый двор', 'Терраса', 'Парковка'],
  },
];

export const getListingById = (id?: string) => USER_LISTINGS.find((item) => item.id === id);
