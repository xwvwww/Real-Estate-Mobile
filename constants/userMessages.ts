export type UserChatMessage = {
  id: string;
  from: 'me' | 'company';
  text: string;
  time: string;
};

export type UserChat = {
  id: string;
  name: string;
  object: string;
  preview: string;
  time: string;
  unread: number;
  avatarLetter: string;
  listingId: string;
  messages: UserChatMessage[];
};

export const USER_CHATS: UserChat[] = [
  {
    id: '1',
    name: 'Агентство Гарант',
    object: '2-комнатная квартира',
    preview: 'Добрый день, можем показать квартиру завтра.',
    time: '14:32',
    unread: 2,
    avatarLetter: 'Г',
    listingId: 'r1',
    messages: [
      { id: '1', from: 'company', text: 'Здравствуйте. Получили вашу заявку.', time: '14:10' },
      { id: '2', from: 'me', text: 'Добрый день. Когда можно посмотреть квартиру?', time: '14:18' },
      { id: '3', from: 'company', text: 'Добрый день, можем показать квартиру завтра.', time: '14:32' },
    ],
  },
  {
    id: '2',
    name: 'Comfort Town',
    object: '3-комнатная квартира',
    preview: 'Спасибо за заявку, мы с вами свяжемся.',
    time: '12:15',
    unread: 0,
    avatarLetter: 'C',
    listingId: 'r2',
    messages: [
      { id: '1', from: 'company', text: 'Спасибо за заявку, мы с вами свяжемся.', time: '12:15' },
      { id: '2', from: 'me', text: 'Хорошо, буду ждать обратной связи.', time: '12:18' },
    ],
  },
];

export function getUserChatById(id?: string) {
  return USER_CHATS.find((item) => item.id === id);
}
