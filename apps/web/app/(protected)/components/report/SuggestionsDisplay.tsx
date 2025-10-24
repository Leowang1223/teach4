/**
 * 建議顯示組件
 * 顯示每個維度的具體建議和總體練習方法
 */

import { type Suggestions } from './types'

interface SuggestionsDisplayProps {
  suggestions?: Suggestions
  overallPractice?: string
}

export function SuggestionsDisplay({ suggestions, overallPractice }: SuggestionsDisplayProps) {
  const dimensions = [
    { key: 'pronunciation', label: 'Pronunciation', color: 'text-blue-600' },
    { key: 'fluency', label: 'Fluency', color: 'text-green-600' },
    { key: 'accuracy', label: 'Accuracy', color: 'text-purple-600' },
    { key: 'comprehension', label: 'Comprehension', color: 'text-orange-600' },
    { key: 'confidence', label: 'Confidence', color: 'text-pink-600' }
  ] as const

  const hasSuggestions = suggestions && Object.values(suggestions).some(v => v)

  if (!hasSuggestions && !overallPractice) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* 每個維度的建議 */}
      {hasSuggestions && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">💡 Dimension-Specific Suggestions:</p>
          <div className="space-y-2">
            {dimensions.map(({ key, label, color }) => {
              const suggestion = suggestions?.[key]
              if (!suggestion) return null
              
              return (
                <div key={key} className="flex items-start gap-2 text-sm">
                  <span className={`${color} font-medium min-w-[130px]`}>{label}:</span>
                  <span className="text-gray-700 flex-1">{suggestion}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 總體練習方法 */}
      {overallPractice && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-semibold text-green-700 mb-2">🎯 Practice Method:</p>
          <p className="text-sm text-gray-700">{overallPractice}</p>
        </div>
      )}
    </div>
  )
}
