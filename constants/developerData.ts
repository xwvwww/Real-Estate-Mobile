export type DeveloperProject = {
  id: string;
  title: string;
  status: string;
  statusColor: string;
  statusBg: string;
  units: string;
  views: string;
  createdAt?: string;
  location: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type DeveloperObject = {
  id: string;
  title: string;
  project: string;
  status: {
    label: string;
    color: string;
    bg: string;
  };
  views: string;
  date: string;
  price: string;
  rooms: string;
  area: string;
  floor: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type DeveloperRequest = {
  id: string;
  title: string;
  applicant: string;
  note: string;
  status: string;
  statusColor: string;
  statusBg: string;
  phone: string;
  income: string;
  project: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export const DEVELOPER_PROJECTS: DeveloperProject[] = [
  {
    id: 'comfort-town',
    title: 'ЖК "Comfort Town"',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    units: '35',
    views: '8 453',
    location: 'Астана, район Нура',
    description: 'Современный жилой комплекс с квартирами комфорт-класса и развитой инфраструктурой.',
    coordinates: {
      latitude: 51.1288,
      longitude: 71.4307,
    },
  },
  {
    id: 'green-valley',
    title: 'ЖК "Green Valley"',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    units: '28',
    views: '6 234',
    location: 'Алматы, Бостандыкский район',
    description: 'Проект с акцентом на зеленую территорию, семейные планировки и закрытый двор.',
    coordinates: {
      latitude: 43.222,
      longitude: 76.9136,
    },
  },
  {
    id: 'smart-city',
    title: 'ЖК "Smart City"',
    status: 'На модерации',
    statusColor: '#F57C00',
    statusBg: '#FFF3E0',
    units: '15',
    views: '3 890',
    location: 'Шымкент, Аль-Фарабийский район',
    description: 'Новый квартал с цифровыми сервисами, подземным паркингом и коммерческими помещениями.',
    coordinates: {
      latitude: 42.3182,
      longitude: 69.5901,
    },
  },
  {
    id: 'premium-plaza',
    title: 'ЖК "Premium Plaza"',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    units: '42',
    views: '9 876',
    createdAt: 'Создан: 1 января 2026',
    location: 'Алматы, Медеуский район',
    description: 'Премиальный проект с панорамными окнами и видовыми квартирами.',
    coordinates: {
      latitude: 43.2389,
      longitude: 76.9575,
    },
  },
  {
    id: 'city-park',
    title: 'ЖК "City Park"',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    units: '22',
    views: '4 532',
    createdAt: 'Создан: 15 декабря 2025',
    location: 'Караганда, Юго-Восток',
    description: 'Комплекс рядом с парковой зоной, ориентированный на молодых специалистов и семьи.',
    coordinates: {
      latitude: 49.7873,
      longitude: 73.1431,
    },
  },
];

export const DEVELOPER_OBJECTS: DeveloperObject[] = [
  {
    id: 'o1',
    title: '2-комнатная квартира 65 м²',
    project: 'ЖК "Comfort Town"',
    status: { label: 'Активно', color: '#388E3C', bg: '#E8F5E9' },
    views: '245',
    date: '15 февраля 2026',
    price: '25 400 000 ₸',
    rooms: '2 комнаты',
    area: '65 м²',
    floor: '7/12 этаж',
    location: 'Астана, район Нура',
    coordinates: {
      latitude: 51.1288,
      longitude: 71.4307,
    },
  },
  {
    id: 'o2',
    title: '3-комнатная квартира 95 м²',
    project: 'ЖК "Green Valley"',
    status: { label: 'Активно', color: '#388E3C', bg: '#E8F5E9' },
    views: '189',
    date: '12 февраля 2026',
    price: '41 800 000 ₸',
    rooms: '3 комнаты',
    area: '95 м²',
    floor: '9/14 этаж',
    location: 'Алматы, Бостандыкский район',
    coordinates: {
      latitude: 43.222,
      longitude: 76.9136,
    },
  },
  {
    id: 'o3',
    title: 'Студия 35 м²',
    project: 'ЖК "Smart City"',
    status: { label: 'На модерации', color: '#F57C00', bg: '#FFF3E0' },
    views: '67',
    date: '10 февраля 2026',
    price: '16 900 000 ₸',
    rooms: 'Студия',
    area: '35 м²',
    floor: '4/10 этаж',
    location: 'Шымкент, Аль-Фарабийский район',
    coordinates: {
      latitude: 42.3182,
      longitude: 69.5901,
    },
  },
];

export const DEVELOPER_REQUESTS: DeveloperRequest[] = [
  {
    id: 'r1',
    title: '2-комнатная квартира 65 м²',
    applicant: 'Иван Иванов',
    note: 'Семья из 3 человек, доход подтвержден',
    status: 'Новая',
    statusColor: '#1976D2',
    statusBg: '#E3F2FD',
    phone: '+7 701 445 22 18',
    income: 'Подтвержденный доход',
    project: 'ЖК "Comfort Town"',
    location: 'Астана, район Нура',
    coordinates: {
      latitude: 51.1288,
      longitude: 71.4307,
    },
  },
  {
    id: 'r2',
    title: '3-комнатная квартира 95 м²',
    applicant: 'Мария Петрова',
    note: 'Семья из 2 человек, постоянный доход',
    status: 'Рассматривается',
    statusColor: '#F57C00',
    statusBg: '#FFF3E0',
    phone: '+7 777 109 88 43',
    income: 'Постоянная работа',
    project: 'ЖК "Green Valley"',
    location: 'Алматы, Бостандыкский район',
    coordinates: {
      latitude: 43.222,
      longitude: 76.9136,
    },
  },
];

export function getDeveloperProjectById(id?: string) {
  return DEVELOPER_PROJECTS.find((item) => item.id === id);
}

export function getDeveloperObjectById(id?: string) {
  return DEVELOPER_OBJECTS.find((item) => item.id === id);
}

export function getDeveloperRequestById(id?: string) {
  return DEVELOPER_REQUESTS.find((item) => item.id === id);
}
