export type AgencyListing = {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  image: number;
  price: string;
  location: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type AgencyRequest = {
  id: string;
  listingId: string;
  objectTitle: string;
  applicantName: string;
  summary: string;
  status: {
    label: string;
    textColor: string;
    bgColor: string;
  };
  phone: string;
  income: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type AgencyMessage = {
  id: string;
  listingId: string;
  avatarLetter: string;
  name: string;
  object: string;
  preview: string;
  time: string;
  unreadCount?: number;
  messages: {
    id: string;
    text: string;
    author: 'agency' | 'client';
    time: string;
  }[];
};

export const AGENCY_LISTINGS: AgencyListing[] = [
  {
    id: 'l1',
    title: '2-комнатная квартира в центре',
    type: 'Квартира',
    date: '15 февраля 2026',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    image: require('@/assets/images/AgencyListingOne.png'),
    price: '25 400 000 ₸',
    location: 'Алматы, Медеуский район',
    description: 'Светлая квартира с новым ремонтом, развитой инфраструктурой и удобным выездом в центр города.',
    coordinates: {
      latitude: 43.2389,
      longitude: 76.9575,
    },
  },
  {
    id: 'l2',
    title: '3-комнатная квартира с ремонтом',
    type: 'Квартира',
    date: '12 февраля 2026',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    image: require('@/assets/images/AgencyListingTwo.png'),
    price: '41 800 000 ₸',
    location: 'Астана, район Нура',
    description: 'Просторная квартира для семьи, современный дом, закрытый двор и парковка.',
    coordinates: {
      latitude: 51.1288,
      longitude: 71.4307,
    },
  },
  {
    id: 'l3',
    title: 'Студия в новостройке',
    type: 'Квартира',
    date: '10 февраля 2026',
    status: 'На модерации',
    statusColor: '#F57C00',
    statusBg: '#FFF3E0',
    image: require('@/assets/images/AgencyListingThree.png'),
    price: '16 900 000 ₸',
    location: 'Шымкент, Аль-Фарабийский район',
    description: 'Компактная студия в новом жилом комплексе рядом с транспортной развязкой.',
    coordinates: {
      latitude: 42.3182,
      longitude: 69.5901,
    },
  },
  {
    id: 'l4',
    title: 'Коттедж с участком',
    type: 'Дом',
    date: '8 февраля 2026',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    image: require('@/assets/images/AgencyListingFour.png'),
    price: '89 000 000 ₸',
    location: 'Алматы, Наурызбайский район',
    description: 'Частный дом с большим участком, террасой и гаражом.',
    coordinates: {
      latitude: 43.2015,
      longitude: 76.8274,
    },
  },
  {
    id: 'l5',
    title: 'Офисное помещение',
    type: 'Коммерческая',
    date: '5 февраля 2026',
    status: 'Неактивно',
    statusColor: '#757575',
    statusBg: '#F5F5F5',
    image: require('@/assets/images/AgencyListingFive.png'),
    price: '63 500 000 ₸',
    location: 'Караганда, центр',
    description: 'Готовый офис с отделкой, отдельный вход, удобная локация для бизнеса.',
    coordinates: {
      latitude: 49.806,
      longitude: 73.085,
    },
  },
];

export const AGENCY_REQUESTS: AgencyRequest[] = [
  {
    id: '1',
    listingId: 'l1',
    objectTitle: '2-комнатная квартира в центре',
    applicantName: 'Иван Иванов',
    summary: 'Семья из 3 человек, доход подтвержден',
    status: {
      label: 'Новая',
      textColor: '#1976D2',
      bgColor: '#E3F2FD',
    },
    phone: '+7 701 445 22 18',
    income: 'Подтвержденный доход',
    location: 'Алматы, Медеуский район',
    coordinates: {
      latitude: 43.2389,
      longitude: 76.9575,
    },
  },
  {
    id: '2',
    listingId: 'l2',
    objectTitle: '3-комнатная квартира с ремонтом',
    applicantName: 'Мария Петрова',
    summary: 'Семья из 2 человек, постоянный доход',
    status: {
      label: 'Рассматривается',
      textColor: '#F57C00',
      bgColor: '#FFF3E0',
    },
    phone: '+7 777 109 88 43',
    income: 'Постоянная работа',
    location: 'Астана, район Нура',
    coordinates: {
      latitude: 51.1288,
      longitude: 71.4307,
    },
  },
  {
    id: '3',
    listingId: 'l3',
    objectTitle: 'Студия в новостройке',
    applicantName: 'Алексей Сидоров',
    summary: 'Один человек, офисная работа',
    status: {
      label: 'Одобрена',
      textColor: '#388E3C',
      bgColor: '#E8F5E9',
    },
    phone: '+7 702 125 33 10',
    income: 'Офисная работа',
    location: 'Шымкент, Аль-Фарабийский район',
    coordinates: {
      latitude: 42.3182,
      longitude: 69.5901,
    },
  },
];

export const AGENCY_MESSAGES: AgencyMessage[] = [
  {
    id: '1',
    listingId: 'l1',
    avatarLetter: 'И',
    name: 'Иван Иванов',
    object: '2-комнатная квартира',
    preview: 'Когда можно посмотреть квартиру?',
    time: '14:32',
    unreadCount: 2,
    messages: [
      { id: 'm1', text: 'Здравствуйте, когда можно посмотреть квартиру?', author: 'client', time: '14:30' },
      { id: 'm2', text: 'Добрый день. Сегодня после 18:00 или завтра утром.', author: 'agency', time: '14:31' },
    ],
  },
  {
    id: '2',
    listingId: 'l2',
    avatarLetter: 'М',
    name: 'Мария Петрова',
    object: '3-комнатная квартира',
    preview: 'Спасибо за информацию!',
    time: '12:15',
    messages: [
      { id: 'm1', text: 'Спасибо за информацию!', author: 'client', time: '12:15' },
      { id: 'm2', text: 'Пожалуйста, если будут вопросы — пишите.', author: 'agency', time: '12:17' },
    ],
  },
];

export function getAgencyListingById(id?: string) {
  return AGENCY_LISTINGS.find((item) => item.id === id);
}

export function getAgencyRequestById(id?: string) {
  return AGENCY_REQUESTS.find((item) => item.id === id);
}

export function getAgencyMessageById(id?: string) {
  return AGENCY_MESSAGES.find((item) => item.id === id);
}
