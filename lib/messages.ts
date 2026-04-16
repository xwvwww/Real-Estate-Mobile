import type { ApiApplicationMessage, ApiChatSummary, ApiListing, ApiSession } from '@/lib/api';

export type UserChatListItem = {
  id: string;
  applicationId: string;
  name: string;
  object: string;
  preview: string;
  time: string;
  unread: number;
  avatarLetter: string;
};

export type UserChatMessageItem = {
  id: string;
  from: 'me' | 'company';
  text: string;
  time: string;
};

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function mapApiChatToListItem(chat: ApiChatSummary): UserChatListItem {
  return {
    id: String(chat.application_id),
    applicationId: String(chat.application_id),
    name: chat.company_name,
    object: chat.listing_title,
    preview: chat.last_message,
    time: formatTime(chat.last_message_at),
    unread: chat.is_unread ? 1 : 0,
    avatarLetter: chat.company_name.trim().charAt(0).toUpperCase() || 'К',
  };
}

export function mapApiMessageToChatMessage(
  message: ApiApplicationMessage,
  session: ApiSession | null
): UserChatMessageItem {
  const isMine = Boolean(session?.user.id && message.sender_user_id === session.user.id);

  return {
    id: String(message.id),
    from: isMine ? 'me' : 'company',
    text: message.body,
    time: formatTime(message.created_at),
  };
}

export function mapListingToChatBanner(listing: ApiListing | null) {
  if (!listing) {
    return null;
  }

  return {
    id: String(listing.id),
    title: listing.title,
  };
}
