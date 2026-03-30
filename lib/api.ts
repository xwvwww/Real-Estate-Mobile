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
  media?: Array<{ url: string; position?: number }>;
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

const DEFAULT_API_URL = 'http://localhost:8080/v1';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL).replace(
  /\/$/,
  ''
);

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
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

  const payload = (await response.json()) as T | ApiResponseEnvelope<T>;

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
  return requestJson<ApiRegistrationResponse>('/authentication/company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

export async function fetchListingById(listingId: string | number) {
  return requestJson<ApiListing>(`/listings/${encodeURIComponent(String(listingId))}`);
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

export type ListingUploadFile = {
  uri: string;
  name: string;
  type?: string;
};

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

  return (await response.json()) as ApiListingMedia;
}
