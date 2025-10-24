'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PlaybackLesson } from '../utils/playbackStorage'

interface Props {
  lessons: PlaybackLesson[]
}

export default function PlaybackPracticeList({ lessons }: Props) {
  const router = useRouter()
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set())

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons)
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId)
    } else {
      newExpanded.add(lessonId)
    }
    setExpandedLessons(newExpanded)
  }

  const handleQuestionClick = (lessonId: string, stepId: number) => {
    router.push(`/history/playback/${lessonId}/${stepId}`)
  }

  if (lessons.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='text-6xl mb-4'>🎯</div>
        <h2 className='text-2xl font-bold text-gray-700 mb-2'>No Practice History</h2>
        <p className='text-gray-600 mb-6'>Complete some lessons to start practicing!</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Start Learning
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => {
        const isExpanded = expandedLessons.has(lesson.lessonId)
        
        return (
          <div
            key={lesson.lessonId}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all"
          >
            {/* 課程標題列 */}
            <div
              onClick={() => toggleLesson(lesson.lessonId)}
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {lesson.averageScore}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {lesson.lessonId}: {lesson.lessonTitle}
                  </h3>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span>📝 {lesson.questions.length} Questions</span>
                    <span>🔄 {lesson.totalPracticeCount} Total Practices</span>
                    <span>⭐ Avg: {lesson.averageScore}</span>
                  </div>
                </div>
              </div>
              <div className="text-3xl text-gray-400">
                {isExpanded ? '▼' : '▶'}
              </div>
            </div>

            {/* 題目列表 (展開時顯示) */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-4 space-y-2">
                  {lesson.questions.map((question) => (
                    <div
                      key={question.stepId}
                      onClick={() => handleQuestionClick(lesson.lessonId, question.stepId)}
                      className="bg-white rounded-lg p-4 hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-500">
                              Q{question.stepId}
                            </span>
                            <span className="text-gray-800 font-medium">
                              {question.questionText}
                            </span>
                          </div>
                          {question.englishHint && (
                            <div className="text-sm text-gray-500 mt-1 ml-10">
                              💡 {question.englishHint}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${
                              question.highestScore >= 90 ? 'text-green-600' :
                              question.highestScore >= 75 ? 'text-blue-600' :
                              'text-orange-600'
                            }`}>
                              ⭐ {question.highestScore}
                            </div>
                            <div className="text-xs text-gray-500">Highest</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-700">
                              {question.practiceCount}
                            </div>
                            <div className="text-xs text-gray-500">Practices</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleQuestionClick(lesson.lessonId, question.stepId)
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                          >
                            Practice →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
