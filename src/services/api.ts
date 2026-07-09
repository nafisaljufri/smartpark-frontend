const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// ── Token Management ──────────────────────────────────────────
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// ── Base Fetch ─────────────────────────────────────────────────
async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: T = await response.json() as T;

if (!response.ok) {
  const errData = data as { message?: string; errors?: { field: string; message: string }[] };
  
  if (errData.errors && errData.errors.length > 0) {
    const errorMessages = errData.errors.map(e => e.message).join(", ");
    throw new Error(errorMessages);
  }
  
  throw new Error(errData.message || 'Terjadi kesalahan');
}

  return data;
}

// ── Auth API ───────────────────────────────────────────────────
export const authApi = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  logout: () =>
    request<any>('/auth/logout', { method: 'POST' }),

  refreshToken: (refreshToken: string) =>
    request<any>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    request<any>('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
};

// ── User API ───────────────────────────────────────────────────
export const userApi = {
  getProfile: () => request<any>('/users/profile'),

  updateProfile: (body: {
    name?: string;
    phone?: string;
    birthdate?: string;
  }) => request<any>('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

// ── Vehicle API ────────────────────────────────────────────────
export const vehicleApi = {
  getAll: () => request<any>('/vehicles'),

  create: (body: { name: string; plateNumber: string; type?: string }) =>
    request<any>('/vehicles', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: { name?: string; plateNumber?: string }) =>
    request<any>(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (id: string) =>
    request<any>(`/vehicles/${id}`, { method: 'DELETE' }),
};

// ── Parking API ────────────────────────────────────────────────
export const parkingApi = {
  getAll: () => request<any>('/parking'),

  search: (q: string) => request<any>(`/parking/search?q=${encodeURIComponent(q)}`),

  getDetail: (id: string) => request<any>(`/parking/${id}`),

  getFloors: (id: string) => request<any>(`/parking/${id}/floors`),

  getSlots: (floorId: string) => request<any>(`/parking/floors/${floorId}/slots`),

  getDashboard: () => request<any>('/parking/dashboard'),
};

// ── Booking API ────────────────────────────────────────────────
export const bookingApi = {
  create: (body: {
    vehicleId: string;
    slotId: string;
    arrivalTime: string;
    departureTime: string;
    durationHours: number;
    paymentMethod: string;
  }) => request<any>('/bookings', { method: 'POST', body: JSON.stringify(body) }),

  getActive: () => request<any>('/bookings/active'),

  getUpcoming: () => request<any>('/bookings/upcoming'),

  getHistory: () => request<any>('/bookings/history'),

  getDetail: (id: string) => request<any>(`/bookings/${id}`),

  cancel: (id: string, reason?: string) =>
    request<any>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),
};

// ── Payment API ────────────────────────────────────────────────
export const paymentApi = {
  getDetail: (bookingId: string) => request<any>(`/payments/${bookingId}`),

  success: (bookingId: string) =>
    request<any>(`/payments/${bookingId}/success`, { method: 'POST' }),

  failed: (bookingId: string) =>
    request<any>(`/payments/${bookingId}/failed`, { method: 'POST' }),
};