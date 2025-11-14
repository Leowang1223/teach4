import { AppButton } from '@/components/ui/AppButton'
import { Mic, Play, Square } from 'lucide-react'

/**
 * ??批蝯辣
 * ????整閰?蝑???
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
      <h3 className="text-xl font-bold text-gray-800 mb-6">? Recording Controls</h3>
      
      <div className="space-y-4">
        {/* ?剜??? */}
        {audioBlob && (
          <AppButton
            icon={Play}
            onClick={onPlayRecording}
            disabled={isPlaying || isRecording}
            className="max-w-none w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPlaying ? 'Playing…' : 'Listen to My Recording'}
          </AppButton>
        )}

        {/* ??? */}
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 text-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            ? Start Recording
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg font-semibold animate-pulse"
          >
            ?對? Stop Recording
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


