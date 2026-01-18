import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import type {
  ApiResponse,
  SharePrice,
  SeedwaveData,
  EcosystemStatus,
  PulseData,
  Sector,
  User,
} from '@/types/api.types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Share Price
  async getSharePrice(): Promise<ApiResponse<SharePrice>> {
    const response = await this.client.get('/share-price');
    return response.data;
  }

  // Seedwave
  async getSeedwave(): Promise<ApiResponse<SeedwaveData>> {
    const response = await this.client.get('/seedwave');
    return response.data;
  }

  // Ecosystem
  async getEcosystem(): Promise<ApiResponse<EcosystemStatus>> {
    const response = await this.client.get('/ecosystem');
    return response.data;
  }

  // Pulse
  async getPulse(): Promise<ApiResponse<PulseData>> {
    const response = await this.client.get('/pulse');
    return response.data;
  }

  // Pulses (new endpoint)
  async getPulses(): Promise<ApiResponse<PulseData[]>> {
    const response = await this.client.get('/pulses');
    return response.data;
  }

  // Sectors
  async getSectors(): Promise<ApiResponse<Sector[]>> {
    const response = await this.client.get('/sectors');
    return response.data;
  }

  async getSector(id: string): Promise<ApiResponse<Sector>> {
    const response = await this.client.get(`/sectors/${id}`);
    return response.data;
  }

  async subscribeSector(id: string): Promise<ApiResponse<{ subscribed: boolean }>> {
    const response = await this.client.post(`/sectors/${id}/subscribe`);
    return response.data;
  }

  // Users
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await this.client.get('/users');
    return response.data;
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.post('/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const response = await this.client.delete(`/users/${id}`);
    return response.data;
  }

  // Contact
  async submitContact(data: { name: string; email: string; message: string }): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.post('/contact', data);
    return response.data;
  }
}

export const api = new ApiClient();
