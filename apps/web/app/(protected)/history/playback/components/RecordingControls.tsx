/**
 * 錄音控制組件
 * 包含錄音、播放、送出評分等功能
 */

interface RecordingControlsProps {
  isRecording: boolean
  isPlaying: boolean
  audioBlob: Blob | null
  isSubmitting: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onPlayRecording: () => void
}

export function RecordingControls({
  isRecording,
  isPlaying,
  audioBlob,
  isSubmitting,
  onStartRecording,
  onStopRecording,
  onPlayRecording
}: RecordingControlsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">🎤 Recording Controls</h3>
      
      <div className="space-y-4">
        {/* 播放我的錄音 */}
        {audioBlob && (
          <button
            onClick={onPlayRecording}
            disabled={isPlaying || isRecording}
            className={`w-full px-6 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isPlaying
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span>🔊</span>
            {isPlaying ? 'Playing...' : 'Listen to My Recording'}
          </button>
        )}

        {/* 錄音按鈕 */}
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 text-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg font-semibold animate-pulse"
          >
            ⏹️ Stop Recording
          </button>
        )}

        {isSubmitting && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-2">Scoring your pronunciation...</p>
          </div>
        )}
      </div>
    </div>
  )
}
