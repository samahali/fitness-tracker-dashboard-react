// __tests__/services/api.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock the entire axios module
vi.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },
    defaults: { 
      headers: { 
        common: {} 
      } 
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  };

  return {
    __esModule: true,
    default: {
      create: vi.fn(() => mockAxiosInstance)
    }
  };
});

describe('apiService', () => {
  const mockToken = 'test-token';
  const mockResponse = { data: { success: true } };
  const mockError = {
    response: {
      status: 401,
      data: { message: 'Unauthorized' }
    }
  };

  let apiService;
  let mockAxiosInstance;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      removeItem: vi.fn(),
      setItem: vi.fn()
    };

    // Mock window.location
    global.window = {
      location: {
        href: ''
      }
    };

    // Reset modules and clear cache
    vi.resetModules();
    
    // Set environment variables BEFORE importing the module
    process.env.VITE_API_BASE_URL = 'http://test-api';
    
    // Import the module after setting env vars
    const module = await import('../../src/services/api');
    apiService = module.default;
    
    // Get the mock axios instance
    mockAxiosInstance = axios.create();
    
    // Setup default mock implementations
    mockAxiosInstance.get.mockResolvedValue(mockResponse);
    mockAxiosInstance.post.mockResolvedValue(mockResponse);
    mockAxiosInstance.put.mockResolvedValue(mockResponse);
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);
  });

  it('should create axios instance with correct config', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://test-api/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  it('should add auth token to request if exists', () => {
    localStorage.getItem.mockReturnValue(mockToken);
    const requestHandler = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = requestHandler({ headers: {} });
    expect(config.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should handle 401 errors by redirecting to login', async () => {
    const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    await expect(errorHandler(mockError)).rejects.toEqual(mockError);
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(window.location.href).toBe('/login');
  });

  it('should implement all CRUD methods', async () => {
    const testUrl = '/test';
    const testData = { id: 1 };
    const testConfig = { headers: { 'X-Test': 'true' } };
    
    await apiService.get(testUrl, testConfig);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(testUrl, testConfig);
    
    await apiService.post(testUrl, testData, testConfig);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(testUrl, testData, testConfig);
  });

  it('should manage auth tokens', () => {
    apiService.setAuthToken(mockToken);
    expect(mockAxiosInstance.defaults.headers.common.Authorization).toBe(`Bearer ${mockToken}`);
    
    apiService.removeAuthToken();
    expect(mockAxiosInstance.defaults.headers.common.Authorization).toBeUndefined();
  });
});