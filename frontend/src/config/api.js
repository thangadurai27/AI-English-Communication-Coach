// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  ME: `${API_BASE_URL}/auth/me`,
  UPDATE: `${API_BASE_URL}/auth/update`,
  
  // AI
  ANALYZE: `${API_BASE_URL}/ai/analyze`,
  
  // Challenge
  DAILY_CHALLENGE: `${API_BASE_URL}/challenge/daily`,
  COMPLETE_CHALLENGE: `${API_BASE_URL}/challenge/complete`,
  
  // Conversation
  START_CONVERSATION: `${API_BASE_URL}/conversation/start`,
  SEND_MESSAGE: `${API_BASE_URL}/conversation/message`,
  END_CONVERSATION: `${API_BASE_URL}/conversation/end`,
  
  // Lessons
  GENERATE_LESSON: `${API_BASE_URL}/lessons/generate`,
  RAPIDFIRE: `${API_BASE_URL}/lessons/rapidfire`,
  WORDBUILDER_WORD: `${API_BASE_URL}/lessons/wordbuilder/word`,
  WORDBUILDER_EVALUATE: `${API_BASE_URL}/lessons/wordbuilder/evaluate`,
  
  // Progress
  DASHBOARD: `${API_BASE_URL}/progress/dashboard`,
  WEEKLY: `${API_BASE_URL}/progress/weekly`,
  SKILLS: `${API_BASE_URL}/progress/skills`,
};

export default API_BASE_URL;
