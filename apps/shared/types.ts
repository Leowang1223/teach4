// 共享類型定義 - 統一整個專案的資料結構

// API 響應統一格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// API 錯誤類
export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

// 用戶相關類型
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// 會話相關類型
export interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  entries: SessionEntry[];
  metadata?: SessionMetadata;
}

export interface SessionMetadata {
  interviewType: string;
  totalQuestions: number;
  completedQuestions: number;
  duration: number; // 總時長（秒）
}

// 會話條目類型
export interface SessionEntry {
  index: number;
  question: string;
  answer: string;
  askedAt: string;
  answeredAt: string;
  thinkingTime: number; // 思考時間（秒）
  answeringTime: number; // 回答時間（秒）
  lessonId?: string;
  stepId?: number;
  completed: boolean;
}

// Q&A 項目類型（用於分析）
export interface QAItem {
  index: number;
  question: string;
  answer: string;
  thinkingTime: number;
  answeringTime: number;
  lessonId?: string;
  stepId?: number;
  expectedAnswer?: string | string[];
}

// 分析結果類型
export interface AnalysisResult {
  sessionId: string;
  results: PerQuestionResult[];
  summary: AnalysisSummary;
  recommendations: Recommendation[];
}

export interface PerQuestionResult {
  questionId: string;
  title: string;
  metrics: {
    thinkingTime: number;
    answeringTime: number;
    tokensPerMinute: number;
    tokenCount: number;
    ratio: number;
  };
  scores: {
    pronunciation: number;
    fluency: number;
    accuracy: number;
    comprehension: number;
    confidence: number;
    total: number;
  };
  notes?: string;
  llmAnalysis?: PerQuestionLLMAnalysis;
  advice?: string;
  optimizedAnswer?: string;
}

export interface PerQuestionLLMAnalysis {
  signals?: SemanticSignals;
  highlights?: AnalysisHighlight[];
}

export interface SemanticSignals {
  semanticRelevance?: number;
  directAnswerProbability?: number;
  conclusionFirstProbability?: number;
  structureCompleteness?: number;
  coverageRatio?: number;
  missingPoints?: string[];
}

export interface AnalysisHighlight {
  type: 'support' | 'risk';
  start: number;
  end: number;
  note?: string;
}

export interface AnalysisSummary {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
}

export interface Recommendation {
  type: 'practice' | 'study' | 'technique';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

// 報告類型
export interface Report {
  id: string;
  sessionId: string;
  studentName: string;
  lessonTitle: string;
  interviewType: string;
  createdAt: Date;
  analysis: AnalysisResult;
  metadata: ReportMetadata;
}

export interface ReportMetadata {
  totalQuestions: number;
  averageScore: number;
  duration: number;
  generatedBy: string; // 'ai' | 'manual'
}

// 面試題目類型
export interface InterviewQuestion {
  id: string;
  type: string;
  lessonId?: string;
  stepId?: number;
  question: string;
  expectedAnswer?: string | string[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

// 課程資料類型
export interface Lesson {
  lessonId: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export interface LessonStep {
  stepId: number;
  title: string;
  content: string;
  expectedAnswer?: string | string[];
  tips?: string[];
}

// 插件配置類型
export interface PluginConfig {
  interviewTypes: InterviewTypeConfig[];
}

export interface InterviewTypeConfig {
  type: string;
  name: string;
  description: string;
  questions: InterviewQuestion[];
  lessons?: Lesson[];
  rules?: any;
}