export type MockRole = 'user' | 'agency' | 'developer';

export type MockAccount = {
  email: string;
  password: string;
  role: MockRole;
  route: '/(tabs)' | '/agency-dashboard' | '/developer-dashboard';
};

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: 'testuser@gmail.com',
    password: '123456',
    role: 'user',
    route: '/(tabs)',
  },
  {
    email: 'testagency@gmail.com',
    password: '123456',
    role: 'agency',
    route: '/agency-dashboard',
  },
  {
    email: 'testdeveloper@gmail.com',
    password: '123456',
    role: 'developer',
    route: '/developer-dashboard',
  },
];

export function findMockAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  return MOCK_ACCOUNTS.find(
    (account) => account.email === normalizedEmail && account.password === normalizedPassword
  );
}

export const MOCK_ACCOUNTS_HINT = MOCK_ACCOUNTS.map(
  (account) => `${account.email} / ${account.password}`
).join(', ');
