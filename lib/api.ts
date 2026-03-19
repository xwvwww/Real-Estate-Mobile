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