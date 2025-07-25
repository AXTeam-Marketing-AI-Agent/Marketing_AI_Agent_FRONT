// API 설정
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API 엔드포인트들
export const API_ENDPOINTS = {
  factbooks: `${API_BASE_URL}/factbooks`,
  strategies: `${API_BASE_URL}/strategies`,
  activities: `${API_BASE_URL}/activities`,
  llmLogs: `${API_BASE_URL}/llm-logs`,
  chat: `${API_BASE_URL}/chat`,
} as const; 