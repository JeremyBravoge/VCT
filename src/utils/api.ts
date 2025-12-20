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

// Users API functions
export const usersApi = {
  login: (data: { username: string; password: string }) => api.post('/users/login', data),
  register: (data: any) => api.post('/users/register', data),
  getUsers: () => api.get('/users'),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// Students API functions
export const studentsApi = {
  getStudents: () => api.get('/students'),
  getStudent: (id: string) => api.get(`/students/${id}`),
  registerStudent: (data: any) => api.post('/students/register', data),
  updateStudent: (id: string, data: any) => api.put(`/students/${id}`, data),
  deleteStudent: (id: string) => api.delete(`/students/${id}`),
  uploadStudentPhoto: (formData: FormData) => api.post('/upload/student', formData),
};

// Courses API functions
export const coursesApi = {
  getCourses: () => api.get('/courses'),
  getCourse: (id: string) => api.get(`/courses/${id}`),
  getCourseLevels: (courseId: string) => api.get(`/courses/${courseId}/levels`),
  createCourse: (data: any) => api.post('/courses', data),
  updateCourse: (id: string, data: any) => api.put(`/courses/${id}`, data),
  deleteCourse: (id: string) => api.delete(`/courses/${id}`),
};

// Departments API functions
export const departmentsApi = {
  getDepartments: () => api.get('/departments'),
  getDepartment: (id: string) => api.get(`/departments/${id}`),
  createDepartment: (data: any) => api.post('/departments', data),
  updateDepartment: (id: string, data: any) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id: string) => api.delete(`/departments/${id}`),
};

// Levels API functions
export const levelsApi = {
  getLevels: () => api.get('/levels'),
  getLevel: (id: string) => api.get(`/levels/${id}`),
  createLevel: (data: any) => api.post('/levels', data),
  updateLevel: (id: string, data: any) => api.put(`/levels/${id}`, data),
  deleteLevel: (id: string) => api.delete(`/levels/${id}`),
};

// Intakes API functions
export const intakesApi = {
  getIntakes: () => api.get('/intakes'),
  getIntake: (id: string) => api.get(`/intakes/${id}`),
  createIntake: (data: any) => api.post('/intakes', data),
  updateIntake: (id: string, data: any) => api.put(`/intakes/${id}`, data),
  deleteIntake: (id: string) => api.delete(`/intakes/${id}`),
};

// Branches API functions
export const branchesApi = {
  getBranches: () => api.get('/branches'),
  getBranch: (id: string) => api.get(`/branches/${id}`),
  createBranch: (data: any) => api.post('/branches', data),
  updateBranch: (id: string, data: any) => api.put(`/branches/${id}`, data),
  deleteBranch: (id: string) => api.delete(`/branches/${id}`),
};

// Instructors API functions
export const instructorsApi = {
  getInstructors: () => api.get('/instructors'),
  getInstructor: (id: string) => api.get(`/instructors/${id}`),
  createInstructor: (data: any) => api.post('/instructors', data),
  updateInstructor: (id: string, data: any) => api.put(`/instructors/${id}`, data),
  deleteInstructor: (id: string) => api.delete(`/instructors/${id}`),
};

// Modules API functions
export const modulesApi = {
  getModules: (courseId?: string, levelId?: string) => {
    const params = new URLSearchParams();
    if (courseId) params.append('course_id', courseId);
    if (levelId) params.append('level_id', levelId);
    return api.get(`/modules${params.toString() ? `?${params}` : ''}`);
  },
  getModulesByCourseLevel: (courseId: string, levelId: string) => api.get(`/modules/${courseId}/${levelId}`),
  getModule: (id: string) => api.get(`/modules/${id}`),
  createModule: (data: any) => api.post('/modules', data),
  updateModule: (id: string, data: any) => api.put(`/modules/${id}`, data),
  deleteModule: (id: string) => api.delete(`/modules/${id}`),
};

// Student Modules API functions
export const studentModulesApi = {
  getStudentModules: (studentId: string, courseId: string, levelId: string) => api.get(`/student-modules/${studentId}/${courseId}/${levelId}`),
  enrollStudent: (data: any) => api.post('/student-modules/enroll', data),
  updateStudentModule: (id: string, data: any) => api.put(`/student-modules/${id}`, data),
  deleteStudentModule: (id: string) => api.delete(`/student-modules/${id}`),
};

// Enrollments API functions
export const enrollmentsApi = {
  createEnrollment: (data: any) => api.post('/enrollments/create', data),
  getEnrollments: () => api.get('/enrollments'),
  updateEnrollment: (id: string, data: any) => api.put(`/enrollments/${id}`, data),
  deleteEnrollment: (id: string) => api.delete(`/enrollments/${id}`),
};

// Student Performance API functions
export const studentPerformanceApi = {
  getStudentPerformance: () => api.get('/student-performance'),
  getStudentsForMarks: () => api.get('/student-performance/students'),
  getModulesForStudent: (studentId: string) => api.get(`/student-performance/modules?student_id=${studentId}`),
  saveMarks: (data: any) => api.post('/student-performance', data),
  updateMark: (id: string, moduleId: string, data: any) => api.put(`/student-performance/${id}/${moduleId}`, data),
  deleteMark: (id: string, moduleId: string) => api.delete(`/student-performance/${id}/${moduleId}`),
};

// Performance API functions
export const performanceApi = {
  getCoursePerformance: (courseId: string, levelId: string) => api.get(`/performance/courses/${courseId}/levels/${levelId}/performance`),
  getModulePerformance: (moduleId: string) => api.get(`/performance/modules/${moduleId}/performance`),
  getLevelModules: (courseId: string, levelId: string) => api.get(`/performance/courses/${courseId}/levels/${levelId}/modules`),
};

// Ranking API functions
export const rankingApi = {
  getOverallRanking: (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
    }
    return api.get(`/ranking/overall${queryParams.toString() ? `?${queryParams}` : ''}`);
  },
  exportRanking: (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
    }
    return `${API_BASE}/ranking/export${queryParams.toString() ? `?${queryParams}` : ''}`;
  },
};

// Finance API functions
export const financeApi = {
  getFinanceData: () => api.get('/finance'),
  getFeesSummary: () => api.get('/finance/fees-summary'),
  createTransaction: (data: any) => api.post('/finance/transactions', data),
  updateTransaction: (id: string, data: any) => api.put(`/finance/transactions/${id}`, data),
  deleteTransaction: (id: string) => api.delete(`/finance/transactions/${id}`),
};

// Transactions API functions
export const transactionsApi = {
  getTransactions: () => api.get('/transactions'),
  getTransaction: (id: string) => api.get(`/transactions/${id}`),
  createTransaction: (data: any) => api.post('/transactions', data),
  updateTransaction: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id: string) => api.delete(`/transactions/${id}`),
};

// Dashboard API functions
export const dashboardApi = {
  getDashboardData: () => api.get('/dashboard'),
};

// Report API functions
export const reportApi = {
  getReports: () => api.get('/report'),
  generateReport: (data: any) => api.post('/report/generate', data),
};

// Media API functions
export const mediaApi = {
  getMedia: () => api.get('/media'),
  uploadMedia: (formData: FormData) => api.post('/media/upload', formData),
  deleteMedia: (id: string) => api.delete(`/media/${id}`),
  renameMedia: (id: string, data: any) => api.put(`/media/rename/${id}`, data),
  getFolders: (category: string) => api.get(`/media/folders/${category}`),
  createFolder: (category: string, data: any) => api.post(`/media/folders/${category}`, data),
  getCategoryMedia: (category: string, params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
    }
    return api.get(`/media/category/${category}${queryParams.toString() ? `?${queryParams}` : ''}`);
  },
};

// Activities API functions
export const activitiesApi = {
  getActivities: () => api.get('/activities'),
  createActivity: (data: any) => api.post('/activities', data),
  updateActivity: (id: string, data: any) => api.put(`/activities/${id}`, data),
  deleteActivity: (id: string) => api.delete(`/activities/${id}`),
};

// Facilities API functions
export const facilitiesApi = {
  getFacilities: () => api.get('/facilities'),
  createFacility: (data: any) => api.post('/facilities', data),
  updateFacility: (id: string, data: any) => api.put(`/facilities/${id}`, data),
  deleteFacility: (id: string) => api.delete(`/facilities/${id}`),
};

// Repairs API functions
export const repairsApi = {
  getRepairs: () => api.get('/repairs'),
  createRepair: (data: any) => api.post('/repairs', data),
  updateRepair: (id: string, data: any) => api.put(`/repairs/${id}`, data),
  deleteRepair: (id: string) => api.delete(`/repairs/${id}`),
};

// Vocational Performance API functions
export const vocationalPerformanceApi = {
  getVocationalPerformance: () => api.get('/vocational-performance'),
  createVocationalPerformance: (data: any) => api.post('/vocational-performance', data),
  updateVocationalPerformance: (id: string, data: any) => api.put(`/vocational-performance/${id}`, data),
  deleteVocationalPerformance: (id: string) => api.delete(`/vocational-performance/${id}`),
};

export default api;
