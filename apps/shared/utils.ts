import path from 'path';
import { existsSync } from 'fs';

// 解析插件目錄路徑
export function resolveInterviewDir(interviewType: string, baseDir: string): string {
  // 檢查是否為中文課程
  if (interviewType.startsWith('L') && /^\d+$/.test(interviewType.substring(1))) {
    // 中文課程：L1, L2, etc.
    const chineseLessonsDir = path.resolve(baseDir, 'plugins', 'chinese-lessons');
    if (existsSync(chineseLessonsDir)) return chineseLessonsDir;
  }

  // 開發環境路徑
  const devPath = path.resolve(baseDir, 'plugins', 'chinese-lessons', interviewType);
  if (existsSync(devPath)) return devPath;

  // 生產環境路徑
  const prodPath = path.resolve(baseDir, 'plugins', 'interview-types', interviewType);
  if (existsSync(prodPath)) return prodPath;

  // 回退路徑
  const fallbackPath = path.resolve(baseDir, '../../src', 'plugins', 'chinese-lessons', interviewType);
  return fallbackPath;
}

// 格式化 API 響應
export function formatApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): any {
  return {
    success,
    data,
    error,
    message,
    timestamp: new Date().toISOString()
  };
}

// 處理 API 錯誤
export function handleApiError(error: any): any {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return formatApiResponse(false, null, error.message, error.code);
  }

  if (error.name === 'ValidationError') {
    return formatApiResponse(false, null, '輸入驗證錯誤', 'VALIDATION_ERROR');
  }

  if (error.code === 'ENOENT') {
    return formatApiResponse(false, null, '檔案不存在', 'FILE_NOT_FOUND');
  }

  return formatApiResponse(false, null, '內部伺服器錯誤', 'INTERNAL_ERROR');
}

// 自定義 API 錯誤類
export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}
