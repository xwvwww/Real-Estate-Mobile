export type UserRequestStatus = 'Новая' | 'В обработке' | 'Получен ответ';

export type UserRequest = {
  id: string;
  listingId: string;
  title: string;
  company: string;
  date: string;
  status: UserRequestStatus;
  color: string;
  bg: string;
  manager: string;
  phone: string;
  note: string;
  response?: string;
};

export const USER_REQUESTS: UserRequest[] = [
  {
    id: '1',
    listingId: 'r1',
    title: '2-комнатная квартира',
    company: 'Агентство недвижимости "Гарант"',
    date: '15 февраля 2026',
    status: 'Новая',
    color: '#2A7FE3',
    bg: '#DCEEFF',
    manager: 'Алина Садыкова',
    phone: '+7 701 000 12 34',
    note: 'Заявка отправлена. Ожидайте первого ответа от менеджера по объекту.',
  },
  {
    id: '2',
    listingId: 'r2',
    title: '3-комнатная квартира',
    company: 'ЖК "Comfort Town"',
    date: '12 февраля 2026',
    status: 'В обработке',
    color: '#F08A00',
    bg: '#FFEED9',
    manager: 'Марина Петрова',
    phone: '+7 702 555 89 10',
    note: 'Менеджер проверяет данные по заявке и свяжется с вами после согласования условий.',
  },
  {
    id: '3',
    listingId: 'r3',
    title: 'Студия в новостройке',
    company: 'Элитная недвижимость',
    date: '10 февраля 2026',
    status: 'Получен ответ',
    color: '#2E8C3C',
    bg: '#E3F5E7',
    manager: 'Дамир Касымов',
    phone: '+7 775 900 45 22',
    note: 'По вашей заявке есть ответ от собственника. Можно продолжить общение в сообщениях.',
    response: 'Собственник готов рассмотреть заселение с конца недели. Нужен созвон для уточнения деталей.',
  },
];

export function getUserRequestById(id?: string) {
  return USER_REQUESTS.find((item) => item.id === id);
}
