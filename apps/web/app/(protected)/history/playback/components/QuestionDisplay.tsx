/**
 * 題目顯示組件
 * 顯示題目內容、拼音、英文提示和 TTS 播放按鈕
 */

import { TTSService } from '../services/ttsService'

interface QuestionDisplayProps {
  questionText: string
  pinyin?: string
  englishHint?: string
  lessonId: string
  stepId: number
}

export function QuestionDisplay({
  questionText,
  pinyin,
  englishHint,
  lessonId,
  stepId
}: QuestionDisplayProps) {
  const handlePlayTTS = () => {
    TTSService.playText(questionText)
  }

  return (
    <div className="space-y-6">
      {/* 課程資訊卡片 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {lessonId}: Question {stepId}
        </h1>
        <p className="text-blue-100">Practice Mode - Take your time!</p>
      </div>

      {/* 題目顯示卡片 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          {questionText}
        </h2>
        
        {pinyin && (
          <p className="text-xl text-gray-600 text-center mb-2">
            {pinyin}
          </p>
        )}
        
        {englishHint && (
          <p className="text-lg text-blue-600 text-center mb-6">
            💡 {englishHint}
          </p>
        )}

        {/* TTS 播放按鈕 */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handlePlayTTS}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold flex items-center gap-2 transition-colors"
          >
            🔊 Listen to Question
          </button>
        </div>
      </div>
    </div>
  )
}
