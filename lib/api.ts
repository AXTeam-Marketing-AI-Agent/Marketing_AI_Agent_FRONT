// 중앙화된 API 호출 함수들
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 기본 fetch 래퍼
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
  }
  
  return response;
}

// Factbook API
export const factbookApi = {
  getAll: () => apiCall('/factbooks', { cache: 'no-store' }),
  getById: (id: string) => apiCall(`/factbooks/${id}`),
  delete: (id: string) => apiCall(`/factbooks/${id}`, { method: 'DELETE' }),
  duplicate: (id: string) => apiCall(`/factbooks/${id}/duplicate`, { method: 'POST' }),
  getStrategies: (id: string) => apiCall(`/factbooks/${id}/strategies`),
};

// Strategy API
export const strategyApi = {
  getAll: () => apiCall('/strategies', { cache: 'no-store' }),
  getById: (id: string) => apiCall(`/strategies/${id}`),
  delete: (id: string) => apiCall(`/strategies/${id}`, { method: 'DELETE' }),
  duplicate: (id: string) => apiCall(`/strategies/${id}/duplicate`, { method: 'POST' }),
};

// Activities API
export const activitiesApi = {
  getRecent: (limit?: number) => apiCall(`/activities/recent${limit ? `?limit=${limit}` : ''}`),
  getRecentWithOffset: (offset: number, limit: number) => 
    apiCall(`/activities/recent?offset=${offset}&limit=${limit}`),
};

// LLM Logs API
export const llmLogsApi = {
  getAll: (limit: number = 200) => apiCall(`/llm-logs?limit=${limit}`),
};

// Chat API
export const chatApi = {
  stream: (input: string, strategyId?: number) => 
    apiCall('/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ input, strategy_id: strategyId }),
    }),
};

// 직접 URL이 필요한 경우를 위한 헬퍼
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
export { API_BASE_URL }; 