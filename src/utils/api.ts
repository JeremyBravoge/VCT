export const BASE_URL = 'https://college-cohatmi-college-1.onrender.com';
const API_BASE = `${BASE_URL}/api`;

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const token = localStorage.getItem('token');

      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE);

// Notification API functions
export const notificationsApi = {
  // Get notifications with pagination and filters
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    read?: 'all' | 'unread' | 'read';
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.read) queryParams.append('read', params.read);

    const query = queryParams.toString();
    return api.get(`/notifications${query ? `?${query}` : ''}`);
  },

  // Get notification statistics
  getStats: () => api.get('/notifications/stats'),

  // Mark notification as read/unread
  markAsRead: (id: string) => api.post(`/notifications/mark-read/${id}`),

  // Mark all notifications as read
  markAllAsRead: () => api.post('/notifications/mark-all-read'),

  // Delete notification
  delete: (id: string) => api.delete(`/notifications/${id}`),

  // Clear all read notifications
  clearRead: (params?: { olderThan?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.olderThan) queryParams.append('olderThan', params.olderThan.toString());

    const query = queryParams.toString();
    return api.delete(`/notifications/clear-read${query ? `?${query}` : ''}`);
  },

  // Create notification (for system use)
  create: (data: {
    student_id?: string;
    action: string;
    course?: string;
    type?: string;
    priority?: 'high' | 'medium' | 'low';
    target_user_id?: string;
    target_user_type?: string;
    action_url?: string;
    metadata?: Record<string, unknown>;
  }) => api.post('/notifications/create', data),

  // Test notification generation
  test: () => api.get('/notifications/test'),
};

export default api;
