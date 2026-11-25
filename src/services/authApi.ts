import { AuthUser } from '../types/archive';

interface AuthResponse {
  user: AuthUser;
  token: string;
}

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchCurrentUser(token: string | null): Promise<AuthResponse | null> {
  const headers: Record<string, string> = {
    'X-Requested-With': 'PRIYONTOR',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch('/api/auth/me', {
    method: 'GET',
    headers,
    credentials: 'same-origin',
  });
  if (!res.ok) return null;
  const data = await parseJsonSafe<{ user?: AuthUser | null; token?: string }>(res);
  if (!data?.user) return null;
  return {
    user: data.user,
    token: data.token ?? token ?? '',
  };
}

export async function signupPatron(payload: {
  name: string;
  email: string;
  password: string;
  city?: string;
  wishlistIds?: string[];
}): Promise<AuthResponse> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'PRIYONTOR',
    },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafe<AuthResponse & { error?: string }>(res);
  if (!res.ok || !data?.user || !data?.token) {
    throw new Error(data?.error || 'Unable to create your account right now.');
  }
  return { user: data.user, token: data.token };
}

export async function loginPatron(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'PRIYONTOR',
    },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafe<AuthResponse & { error?: string }>(res);
  if (!res.ok || !data?.user || !data?.token) {
    throw new Error(data?.error || 'Invalid email or password.');
  }
  return { user: data.user, token: data.token };
}

export async function logoutPatron(token: string | null): Promise<void> {
  const headers: Record<string, string> = {
    'X-Requested-With': 'PRIYONTOR',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers,
    credentials: 'same-origin',
  });
}

export async function syncPatronWishlist(
  token: string | null,
  wishlistIds: string[]
): Promise<AuthUser | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'PRIYONTOR',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch('/api/auth/preferences', {
    method: 'PUT',
    headers,
    credentials: 'same-origin',
    body: JSON.stringify({ wishlistIds }),
  });
  if (!res.ok) return null;
  const data = await parseJsonSafe<{ user?: AuthUser }>(res);
  return data?.user ?? null;
}
