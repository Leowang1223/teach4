'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getPlaybackQuestion, type PlaybackAttempt } from '../../../utils/playbackStorage'

// Hooks
import { usePlaybackQuestion } from '../../hooks/usePlaybackQuestion'
import { useAudioRecorder } from '../../hooks/useAudioRecorder'

// Services
import { ScoringService } from '../../services/scoringService'

// Components
import { LoadingScreen } from '../../components/LoadingScreen'
import { ErrorScreen } from '../../components/ErrorScreen'
import { QuestionDisplay } from '../../components/QuestionDisplay'
import { RecordingControls } from '../../components/RecordingControls'
import { ScoreDisplay } from '../../components/ScoreDisplay'

export default function PlaybackQuestionPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.lessonId as string
  const stepId = parseInt(params.stepId as string)

  // 資料載入
  const { question, lessonData, loading, error } = usePlaybackQuestion(lessonId, stepId)
  
  // 錄音控制
  const { 
    isRecording, 
    isPlaying, 
    audioBlob, 
    startRecording, 
    stopRecording, 
    playRecording 
  } = useAudioRecorder()

  // 評分狀態
  const [latestScore, setLatestScore] = useState<PlaybackAttempt | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 載入最後一次評分
  useEffect(() => {
    if (question && question.attempts && question.attempts.length > 0) {
      const lastAttempt = question.attempts[question.attempts.length - 1]
      setLatestScore(lastAttempt)
    }
  }, [question])

  // 錄音完成後自動送出評分
  useEffect(() => {
    if (audioBlob && !isRecording && !isSubmitting && question) {
      handleSubmitScoring()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob, isRecording])

  // 送出評分
  const handleSubmitScoring = async () => {
    if (!question || !audioBlob) return
    
    setIsSubmitting(true)

    try {
      const attempt = await ScoringService.submitForScoring({
        audioBlob,
        lessonId,
        stepId,
        expectedAnswer: question.expectedAnswer
      })

      // 更新最新分數
      setLatestScore(attempt)
      
      // 重新載入題目資料以更新最高分
      const updatedQ = getPlaybackQuestion(lessonId, stepId)
      if (updatedQ) {
        // 這裡可以觸發 question 的更新，但因為 usePlaybackQuestion 不支持刷新
        // 所以我們直接更新頁面會在下次進入時看到新的最高分
      }
    } catch (error) {
      console.error('Scoring error:', error)
      alert('評分失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 處理錄音開始
  const handleStartRecording = async () => {
    await startRecording()
  }

  // 處理錄音停止
  const handleStopRecording = () => {
    stopRecording()
  }

  // Loading 狀態
  if (loading) {
    return <LoadingScreen />
  }

  // 錯誤狀態
  if (!question) {
    return (
      <ErrorScreen
        error={error}
        lessonId={lessonId}
        stepId={stepId}
        onRetry={() => window.location.reload()}
        onBack={() => router.push('/history?tab=playback')}
      />
    )
  }

  // 主畫面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 🆕 雙按鈕：返回報表 + 返回首頁 */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">← Back to Report</span>
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-medium">🏠 Home</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* 左側：題目和錄音區 */}
          <div className="col-span-2 space-y-6">
            <QuestionDisplay
              questionText={question.questionText}
              pinyin={question.pinyin}
              englishHint={question.englishHint}
              lessonId={lessonId}
              stepId={stepId}
            />

            <RecordingControls
              isRecording={isRecording}
              isPlaying={isPlaying}
              audioBlob={audioBlob}
              isSubmitting={isSubmitting}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onPlayRecording={playRecording}
            />
          </div>

          {/* 右側：分數卡片 */}
          <div className="col-span-1">
            <ScoreDisplay
              question={question}
              latestScore={latestScore}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
