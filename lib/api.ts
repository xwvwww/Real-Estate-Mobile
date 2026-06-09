export type ApiRole = {
  id: number;
  name: string;
  description: string;
  level: number;
};

export type ApiUser = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  country?: string;
  email: string;
  phone?: string;
  push_opt_in?: boolean;
  created_at: string;
  is_active: boolean;
  role_id: number;
  role: ApiRole;
  company_id?: number | null;
  job_title?: string;
};

export type ApiSession = {
  token: string;
  user: ApiUser;
};

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  phone?: string;
};

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
};

export type RequestPasswordResetPayload = {
  email: string;
};

export type ConfirmPasswordResetPayload = {
  token: string;
  password: string;
  password_confirmation: string;
};

export type ApiListingMedia = {
  id: number;
  listing_id: number;
  url: string;
  position: number;
};

export type ApiFavoriteListing = {
  id: number;
  title: string;
  city: string;
  address: string;
  price: number;
  property_type: string;
  deal_type: 'rent' | 'sale' | string;
  status: string;
  company_name?: string;
  latitude?: number | null;
  longitude?: number | null;
  rooms?: number | null;
  area?: number | null;
  floor?: number | null;
  media?: ApiListingMedia[];
};

export type ApiRentConstraints = {
  listing_id: number;
  allow_children: boolean;
  allow_pets: boolean;
  allow_students: boolean;
  max_occupants: number;
  min_term_months: number;
};

export type ApiListing = {
  id: number;
  company_id: number;
  company_name?: string;
  project_id?: number | null;
  title: string;
  description: string;
  property_type: string;
  deal_type: 'rent' | 'sale' | string;
  status: string;
  price: number;
  city: string;
  address: string;
  rooms?: number | null;
  area?: number | null;
  floor?: number | null;
  total_floors?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  media?: ApiListingMedia[];
  rent_constraints?: ApiRentConstraints | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
};

type ApiResponseEnvelope<T> = {
  data?: T;
};

export type ApiRegistrationResponse = ApiUser & {
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UserRegistrationPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

export type CompanyRegistrationPayload = {
  company_name: string;
  registration_number: string;
  city: string;
  company_email: string;
  company_phone: string;
  company_type: 'agency' | 'developer';
  first_name: string;
  last_name: string;
  job_title: string;
  password: string;
  password_confirmation: string;
  invite_token?: string;
  document: {
    uri: string;
    name: string;
    type?: string;
  };
};

export type ListingFilters = {
  dealType?: 'buy' | 'rent';
  city?: string;
  propertyType?: string;
  priceMin?: number;
  priceMax?: number;
  roomsMin?: number;
  roomsMax?: number;
  areaMin?: number;
  areaMax?: number;
  limit?: number;
  offset?: number;
};

export type CreateListingPayload = {
  project_id?: number;
  title: string;
  description: string;
  property_type: string;
  deal_type: 'rent' | 'sale';
  price: number;
  city: string;
  address: string;
  rooms?: number;
  area?: number;
  floor?: number;
  total_floors?: number;
  media?: { url: string; position?: number }[];
  rent_constraints?: {
    allow_children?: boolean;
    allow_pets?: boolean;
    allow_students?: boolean;
    max_occupants?: number;
    min_term_months?: number;
  };
  latitude?: number;
  longitude?: number;
};

export type CreateApplicationPayload = {
  full_name: string;
  phone: string;
  email: string;
  comment?: string;
  occupant_count?: number;
  has_children?: boolean;
  has_pets?: boolean;
  is_student?: boolean;
  stay_term_months?: number;
  needs_mortgage?: boolean;
  purchase_term?: string;
};

export type ApiApplication = {
  id: number;
  listing_id: number;
  user_id: number;
  full_name: string;
  phone: string;
  email: string;
  status: string;
  is_compatible: boolean;
  deal_type: string;
  occupant_count?: number | null;
  has_children?: boolean | null;
  has_pets?: boolean | null;
  is_student?: boolean | null;
  stay_term_months?: number | null;
  needs_mortgage?: boolean | null;
  purchase_term?: string | null;
  comment?: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiChatSummary = {
  application_id: number;
  listing_title: string;
  company_name: string;
  last_message: string;
  last_message_at: string;
  is_unread: boolean;
};

export type ApiApplicationMessage = {
  id: number;
  application_id: number;
  sender_user_id?: number | null;
  body: string;
  created_at: string;
};

export type ApiDashboardFavoriteListing = {
  listing_id: number;
  title: string;
  city: string;
  price: number;
  area?: number | null;
  cover_url?: string;
  created_at: string;
};

export type ApiDashboardApplicationSummary = {
  id: number;
  listing_title: string;
  company_name: string;
  status: string;
  updated_at: string;
};

export type ApiDashboardOverview = {
  favorites_count: number;
  active_applications_count: number;
  unread_messages_count: number;
  recent_listings: ApiDashboardFavoriteListing[];
  recent_applications: ApiDashboardApplicationSummary[];
};

export type ApiProject = {
  id: number;
  company_id: number;
  name: string;
  city: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type ListingUploadFile = {
  uri: string;
  name: string;
  type?: string;
};

export type CreateProjectPayload = {
  name: string;
  city: string;
  description?: string;
};

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export type UpdateListingPayload = Partial<CreateListingPayload>;

const DEFAULT_API_URL = 'http://localhost:8080/v1';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL).replace(
  /\/$/,
  ''
);

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function resolveBackendAssetUrl(url: string) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const apiUrl = new URL(API_BASE_URL);
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;

  return `${apiUrl.origin}${normalizedPath}`;
}

async function readErrorMessage(response: Response) {
  const text = await response.text();

  if (!text) {
    return `Request failed with status ${response.status}`;
  }

  try {
    const payload = JSON.parse(text) as { error?: string; message?: string };
    return payload.error || payload.message || text;
  } catch {
    return text;
  }
}

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response;
}

export async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await request(path, init);

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  const payload = JSON.parse(text) as T | ApiResponseEnvelope<T>;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponseEnvelope<T>).data as T;
  }

  return payload as T;
}

export async function requestNoContent(path: string, init: RequestInit = {}) {
  await request(path, init);
}

export async function loginWithPassword(payload: LoginPayload) {
  return requestJson<ApiSession>('/authentication/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function updateCurrentUserProfile(payload: UpdateProfilePayload, token: string) {
  return requestJson<ApiUser>('/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function changeCurrentUserPassword(payload: ChangePasswordPayload, token: string) {
  return requestJson<{ message: string }>('/users/me/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(payload: RequestPasswordResetPayload) {
  return requestJson<{ message?: string } | undefined>('/authentication/password-reset/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function confirmPasswordReset(payload: ConfirmPasswordResetPayload) {
  return requestNoContent('/authentication/password-reset/confirm', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: UserRegistrationPayload) {
  return requestJson<ApiRegistrationResponse>('/authentication/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function registerCompany(payload: CompanyRegistrationPayload) {
  const formData = new FormData();
  formData.append('company_name', payload.company_name);
  formData.append('registration_number', payload.registration_number);
  formData.append('city', payload.city);
  formData.append('company_email', payload.company_email);
  formData.append('company_phone', payload.company_phone);
  formData.append('company_type', payload.company_type);
  formData.append('first_name', payload.first_name);
  formData.append('last_name', payload.last_name);
  formData.append('job_title', payload.job_title);
  formData.append('password', payload.password);
  formData.append('password_confirmation', payload.password_confirmation);

  if (payload.invite_token) {
    formData.append('invite_token', payload.invite_token);
  }

  formData.append('document', {
    uri: payload.document.uri,
    name: payload.document.name,
    type: payload.document.type || 'application/pdf',
  } as unknown as Blob);

  return requestJson<ApiRegistrationResponse>('/authentication/company', {
    method: 'POST',
    body: formData,
  });
}

export async function activateUserToken(token: string) {
  return requestNoContent(`/users/activate/${encodeURIComponent(token)}`, {
    method: 'PUT',
  });
}

export async function fetchListings(filters: ListingFilters = {}) {
  const params = new URLSearchParams();

  if (filters.dealType) {
    params.set('deal_type', filters.dealType === 'buy' ? 'sale' : 'rent');
  }
  if (filters.city) {
    params.set('city', filters.city);
  }
  if (filters.propertyType) {
    params.set('property_type', filters.propertyType);
  }
  if (typeof filters.priceMin === 'number') {
    params.set('price_min', String(filters.priceMin));
  }
  if (typeof filters.priceMax === 'number') {
    params.set('price_max', String(filters.priceMax));
  }
  if (typeof filters.roomsMin === 'number') {
    params.set('rooms_min', String(filters.roomsMin));
  }
  if (typeof filters.roomsMax === 'number') {
    params.set('rooms_max', String(filters.roomsMax));
  }
  if (typeof filters.areaMin === 'number') {
    params.set('area_min', String(filters.areaMin));
  }
  if (typeof filters.areaMax === 'number') {
    params.set('area_max', String(filters.areaMax));
  }
  if (typeof filters.limit === 'number') {
    params.set('limit', String(filters.limit));
  }
  if (typeof filters.offset === 'number') {
    params.set('offset', String(filters.offset));
  }

  const query = params.toString();
  const payload = await requestJson<ApiListing[] | null>(query ? `/listings?${query}` : '/listings');
  return Array.isArray(payload) ? payload : [];
}

export async function fetchListingById(listingId: string | number, token?: string) {
  return requestJson<ApiListing>(`/listings/${encodeURIComponent(String(listingId))}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });
}

export async function createListing(payload: CreateListingPayload, token: string) {
  return requestJson<ApiListing>('/listings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateListing(
  listingId: string | number,
  payload: UpdateListingPayload,
  token: string
) {
  return requestJson<ApiListing>(`/listings/${encodeURIComponent(String(listingId))}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteListing(listingId: string | number, token: string) {
  return requestNoContent(`/listings/${encodeURIComponent(String(listingId))}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchFavorites(token: string) {
  const payload = await requestJson<ApiFavoriteListing[] | null>('/favorites', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return Array.isArray(payload) ? payload : [];
}

export async function addFavorite(listingId: string | number, token: string) {
  return requestNoContent(`/favorites/${encodeURIComponent(String(listingId))}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function removeFavorite(listingId: string | number, token: string) {
  return requestNoContent(`/favorites/${encodeURIComponent(String(listingId))}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createApplication(
  listingId: string | number,
  payload: CreateApplicationPayload,
  token: string
) {
  return requestJson<ApiApplication>(`/listings/${encodeURIComponent(String(listingId))}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchApplications(
  token: string,
  filters: { status?: string; limit?: number; offset?: number } = {}
) {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set('status', filters.status);
  }
  if (typeof filters.limit === 'number') {
    params.set('limit', String(filters.limit));
  }
  if (typeof filters.offset === 'number') {
    params.set('offset', String(filters.offset));
  }

  const query = params.toString();
  const payload = await requestJson<ApiApplication[] | null>(
    query ? `/applications?${query}` : '/applications',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return Array.isArray(payload) ? payload : [];
}

export async function updateApplicationStatus(
  applicationId: string | number,
  status: 'new' | 'review' | 'approved' | 'rejected',
  token: string
) {
  return requestJson<ApiApplication>(`/applications/${encodeURIComponent(String(applicationId))}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}

export async function fetchChats(token: string) {
  const payload = await requestJson<ApiChatSummary[] | null>('/chats', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return Array.isArray(payload) ? payload : [];
}

export async function fetchApplicationMessages(
  applicationId: string | number,
  token: string,
  filters: { limit?: number; offset?: number } = {}
) {
  const params = new URLSearchParams();

  if (typeof filters.limit === 'number') {
    params.set('limit', String(filters.limit));
  }
  if (typeof filters.offset === 'number') {
    params.set('offset', String(filters.offset));
  }

  const query = params.toString();
  const payload = await requestJson<ApiApplicationMessage[] | null>(
    query
      ? `/applications/${encodeURIComponent(String(applicationId))}/messages?${query}`
      : `/applications/${encodeURIComponent(String(applicationId))}/messages`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return Array.isArray(payload) ? payload : [];
}

export async function createApplicationMessage(
  applicationId: string | number,
  body: string,
  token: string
) {
  return requestJson<ApiApplicationMessage>(`/applications/${encodeURIComponent(String(applicationId))}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  });
}

export async function fetchDashboardOverview(token: string) {
  return requestJson<ApiDashboardOverview>('/dashboard/overview', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function uploadListingMedia(
  listingId: string | number,
  file: ListingUploadFile,
  token: string
) {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type || 'application/octet-stream',
  } as unknown as Blob);

  const response = await fetch(buildUrl(`/listings/${encodeURIComponent(String(listingId))}/media`), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = (await response.json()) as ApiListingMedia | ApiResponseEnvelope<ApiListingMedia>;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponseEnvelope<ApiListingMedia>).data as ApiListingMedia;
  }

  return payload as ApiListingMedia;
}

export async function deleteListingMedia(
  listingId: string | number,
  mediaId: string | number,
  token: string
) {
  return requestNoContent(
    `/listings/${encodeURIComponent(String(listingId))}/media/${encodeURIComponent(String(mediaId))}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function fetchProjects(token: string) {
  const payload = await requestJson<ApiProject[] | null>('/projects', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return Array.isArray(payload) ? payload : [];
}

export async function fetchProjectById(projectId: string | number, token: string) {
  return requestJson<ApiProject>(`/projects/${encodeURIComponent(String(projectId))}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createProject(payload: CreateProjectPayload, token: string) {
  return requestJson<ApiProject>('/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateProject(
  projectId: string | number,
  payload: UpdateProjectPayload,
  token: string
) {
  return requestJson<ApiProject>(`/projects/${encodeURIComponent(String(projectId))}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(projectId: string | number, token: string) {
  return requestNoContent(`/projects/${encodeURIComponent(String(projectId))}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
