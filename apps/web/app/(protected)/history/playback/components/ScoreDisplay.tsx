/**
 * 分數顯示組件
 * 顯示歷史記錄、最高分、最新評分結果
 */

import { type PlaybackQuestion, type PlaybackAttempt } from '../../utils/playbackStorage'

interface ScoreDisplayProps {
  question: PlaybackQuestion
  latestScore: PlaybackAttempt | null
}

export function ScoreDisplay({ question, latestScore }: ScoreDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Your Record</h3>
      
      <div className="space-y-4">
        {/* 最高分 */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-4 text-center">
          <div className="text-sm text-yellow-900 mb-1">⭐ Highest Score</div>
          <div className="text-4xl font-bold text-white">{question.highestScore}</div>
        </div>

        {/* 練習次數 */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Practices:</span>
            <span className="text-2xl font-bold text-gray-800">{question.practiceCount}</span>
          </div>
        </div>

        {/* 最後練習時間 */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Last Practice:</div>
          <div className="text-xs text-gray-500">
            {new Date(question.lastAttemptDate).toLocaleString()}
          </div>
        </div>
      </div>

      {/* 最新評分結果 */}
      {latestScore && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">📈 Latest Score</h4>
          
          {/* 總分 */}
          <div className={`rounded-lg p-4 text-center mb-4 ${
            latestScore.score >= 90 ? 'bg-green-100' :
            latestScore.score >= 75 ? 'bg-blue-100' :
            'bg-orange-100'
          }`}>
            <div className="text-sm text-gray-600 mb-1">This Attempt</div>
            <div className={`text-3xl font-bold ${
              latestScore.score >= 90 ? 'text-green-600' :
              latestScore.score >= 75 ? 'text-blue-600' :
              'text-orange-600'
            }`}>
              {latestScore.score}
            </div>
            {latestScore.score > question.highestScore - latestScore.score && (
              <div className="text-sm text-green-600 mt-1">🎉 New High Score!</div>
            )}
          </div>

          {/* 五維度分數 */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pronunciation:</span>
              <span className="font-bold text-blue-600">{latestScore.detailedScores.pronunciation}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fluency:</span>
              <span className="font-bold text-green-600">{latestScore.detailedScores.fluency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-bold text-purple-600">{latestScore.detailedScores.accuracy}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Comprehension:</span>
              <span className="font-bold text-orange-600">{latestScore.detailedScores.comprehension}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-bold text-pink-600">{latestScore.detailedScores.confidence}</span>
            </div>
          </div>

          {/* 建議 */}
          {latestScore.suggestions && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-blue-800 mb-2">💡 Suggestions:</div>
              <div className="space-y-2 text-xs text-gray-700">
                {latestScore.suggestions.pronunciation && (
                  <div><strong>Pronunciation:</strong> {latestScore.suggestions.pronunciation}</div>
                )}
                {latestScore.suggestions.fluency && (
                  <div><strong>Fluency:</strong> {latestScore.suggestions.fluency}</div>
                )}
                {latestScore.suggestions.accuracy && (
                  <div><strong>Accuracy:</strong> {latestScore.suggestions.accuracy}</div>
                )}
              </div>
            </div>
          )}

          {/* 練習方法 */}
          {latestScore.overallPractice && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-semibold text-green-800 mb-2">🎯 Practice Method:</div>
              <div className="text-xs text-gray-700">{latestScore.overallPractice}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
