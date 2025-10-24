/**
 * 報表相關的共用類型定義
 */

// 🆕 字符錯誤類型
export interface CharacterError {
  expected: string    // 正確的字
  actual: string      // 用戶說的字
  position: number    // 位置
  type: 'missing' | 'wrong' | 'extra'  // 錯誤類型
  expectedPinyin?: string   // 正確拼音
  actualPinyin?: string     // 用戶拼音
}

export interface DetailedScores {
  pronunciation: number
  fluency: number
  accuracy: number
  comprehension: number
  confidence: number
}

export interface Suggestions {
  pronunciation?: string
  fluency?: string
  accuracy?: string
  comprehension?: string
  confidence?: string
}

export interface StepResult {
  stepId: number
  question: string
  score: number
  attempts: number
  passed: boolean
  detailedScores?: DetailedScores
  feedback?: string // 舊版建議（向後兼容）
  suggestions?: Suggestions // 新版每個維度的建議
  overallPractice?: string // 總體練習方法
  transcript?: string
  expectedAnswer?: string  // 🆕 正確答案
  errors?: CharacterError[]  // 🆕 錯誤字列表
  correctionFeedback?: string  // 🆕 糾正建議
}

export interface LessonReport {
  lessonId: string
  lessonTitle: string
  completedAt: string
  totalScore: number
  results: StepResult[]
}
