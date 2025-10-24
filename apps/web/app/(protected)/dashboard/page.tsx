'use client'

import { useState, useEffect } from 'react'
import { API_BASE } from '../config'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

interface LessonSummary {
  lesson_id: string
  title: string
  description: string
  stepCount: number
}

// 中文課程列表組件
function ChineseLessonsList() {
  const [expanded, setExpanded] = useState(false)
  const [lessons, setLessons] = useState<LessonSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLessons() {
      try {
            const response = await fetch(`${API_BASE}/api/lessons`)
        if (!response.ok) throw new Error('Failed to load lessons')
        const data = await response.json()
        // 升冪排序：L1 → L10
        const sortedLessons = data.sort((a: LessonSummary, b: LessonSummary) => {
          const aNum = parseInt(a.lesson_id.replace('L', ''))
          const bNum = parseInt(b.lesson_id.replace('L', ''))
          return aNum - bNum
        })
        setLessons(sortedLessons)
      } catch (error) {
        console.error('Error loading lessons:', error)
        // 如果 API 失敗，使用備用數據（升冪順序）
        setLessons([
          { lesson_id: 'L1', title: 'Self Introduction', description: '學習如何用中文打招呼和自我介紹', stepCount: 10 },
          { lesson_id: 'L2', title: 'Lesson 2', description: '中文學習課程 2', stepCount: 10 },
          { lesson_id: 'L3', title: 'Lesson 3', description: '中文學習課程 3', stepCount: 10 },
          { lesson_id: 'L4', title: 'Lesson 4', description: '中文學習課程 4', stepCount: 10 },
          { lesson_id: 'L5', title: 'Lesson 5', description: '中文學習課程 5', stepCount: 10 },
          { lesson_id: 'L6', title: 'Lesson 6', description: '中文學習課程 6', stepCount: 10 },
          { lesson_id: 'L7', title: 'Lesson 7', description: '中文學習課程 7', stepCount: 10 },
          { lesson_id: 'L8', title: 'Lesson 8', description: '中文學習課程 8', stepCount: 10 },
          { lesson_id: 'L9', title: 'Lesson 9', description: '中文學習課程 9', stepCount: 10 },
          { lesson_id: 'L10', title: 'Lesson 10', description: '中文學習課程 10', stepCount: 10 },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadLessons()
  }, [])

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* 主標題：點擊展開/收合 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-left">
            <div className="text-gray-900 font-medium">中文學習課程</div>
            <div className="text-sm text-gray-500">中文對話學習與練習（10個課程）</div>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 展開的課程列表 */}
      {expanded && (
        <div className="border-t border-gray-200 divide-y">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              載入課程中...
            </div>
          ) : (
            lessons.map((lesson) => (
              <Link
                key={lesson.lesson_id}
                href={`/lesson/${lesson.lesson_id}`}
                className="flex items-center justify-between px-4 py-3 pl-16 hover:bg-blue-50 transition-colors group"
              >
                <div>
                  <div className="text-gray-900 group-hover:text-blue-600 font-medium">
                    {lesson.lesson_id}: {lesson.title}
                  </div>
                  <div className="text-sm text-gray-500">{lesson.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    📝 {lesson.stepCount} 個題目
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-content">
        {/* 歡迎區域 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">歡迎來到 AI 模擬面試平台</h1>
          <p className="text-gray-600 text-lg">開始您的面試練習之旅，提升您的面試技巧！</p>
        </div>

        {/* 極簡統計（置頂） */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="text-sm text-gray-500 mb-1">已完成面試</div>
              <div className="text-3xl font-semibold text-gray-900">0</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="text-sm text-gray-500 mb-1">平均分數</div>
              <div className="text-3xl font-semibold text-gray-900">0</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="text-sm text-gray-500 mb-1">學習時數</div>
              <div className="text-3xl font-semibold text-gray-900">0</div>
            </div>
          </div>
        </div>

        {/* 面試種類（極簡列表） */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">選擇面試種類</h3>
          <ChineseLessonsList />
        </div>
      </div>
    </DashboardLayout>
  )
}