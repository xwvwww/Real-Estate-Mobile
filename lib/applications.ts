import type { ApiApplication, ApiListing } from '@/lib/api';

export type UserRequestStatus = 'Новая' | 'В обработке' | 'Одобрена' | 'Отклонена';

export type UserRequestViewModel = {
  id: string;
  listingId: string;
  title: string;
  company: string;
  date: string;
  status: UserRequestStatus;
  color: string;
  bg: string;
  phone: string;
  note: string;
  response?: string;
  listing?: ApiListing | null;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Дата не указана';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function mapStatus(status: string): Pick<UserRequestViewModel, 'status' | 'color' | 'bg' | 'note' | 'response'> {
  switch (status) {
    case 'review':
      return {
        status: 'В обработке',
        color: '#F08A00',
        bg: '#FFEED9',
        note: 'Менеджер проверяет данные по заявке и свяжется с вами после согласования условий.',
      };
    case 'approved':
      return {
        status: 'Одобрена',
        color: '#2E8C3C',
        bg: '#E3F5E7',
        note: 'По вашей заявке получено положительное решение. Можно продолжить общение по объекту.',
        response: 'Заявка одобрена. Перейдите в сообщения, чтобы согласовать следующие шаги.',
      };
    case 'rejected':
      return {
        status: 'Отклонена',
        color: '#D14F4F',
        bg: '#FCE4E4',
        note: 'По этой заявке получен отказ. Вы можете выбрать другой объект и отправить новую заявку.',
      };
    case 'new':
    default:
      return {
        status: 'Новая',
        color: '#2A7FE3',
        bg: '#DCEEFF',
        note: 'Заявка отправлена. Ожидайте первого ответа от менеджера по объекту.',
      };
  }
}

export function mapApplicationToUserRequest(
  application: ApiApplication,
  listing?: ApiListing | null
): UserRequestViewModel {
  const statusMeta = mapStatus(application.status);

  return {
    id: String(application.id),
    listingId: String(application.listing_id),
    title: listing?.title || `Объект #${application.listing_id}`,
    company: listing?.company_name || 'Компания',
    date: formatDate(application.created_at),
    status: statusMeta.status,
    color: statusMeta.color,
    bg: statusMeta.bg,
    phone: application.phone,
    note: statusMeta.note,
    response: statusMeta.response,
    listing: listing || null,
  };
}
