
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { loadAllFlashcards, loadDueFlashcards, addCustomFlashcard, markFlashcardResult, removeFlashcardById, type Flashcard } from './utils/flashcards'
import { useAudioRecorder } from '../history/playback/hooks/useAudioRecorder'
import { TTSService } from '../history/playback/services/ttsService'
import { ScoringService } from '../history/playback/services/scoringService'

export default function FlashcardsPage() {
  const [useDueOnly, setUseDueOnly] = useState(true)
  const [cards, setCards] = useState<Flashcard[]>([])
  const [idx, setIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showPinyin, setShowPinyin] = useState(false)
  const [checking, setChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<{ passed?: boolean; transcript?: string; message?: string }>()

  // keep original recorder API
  const { isRecording, isPlaying, audioBlob, startRecording, stopRecording } = useAudioRecorder()
  const scoringGuardRef = useRef(false)
  const [recSec, setRecSec] = useState(0)
  const timerRef = useRef<number | null>(null)

  const visible = useMemo(() => (useDueOnly ? loadDueFlashcards() : loadAllFlashcards()), [useDueOnly])

  useEffect(() => {
    setCards(visible)
    setIdx(0)
  }, [visible])

  // progress
  const card = cards[idx]
  const total = cards.length
  const progressPct = total ? Math.round(((idx + 1) / total) * 100) : 0

  // auto-score when recording stops
  useEffect(() => {
    const run = async () => {
      if (!card || !audioBlob || isRecording || checking || scoringGuardRef.current) return
      scoringGuardRef.current = true
      setChecking(true)
      try {
        const attempt = await ScoringService.submitForScoring({
          audioBlob,
          lessonId: String(card.lessonId || 'flashcards'),
          stepId: typeof card.questionId === 'number' ? card.questionId : idx,
          expectedAnswer: card.expectedAnswer
        })
        setLastCheck({ passed: (attempt.score ?? 0) >= 75, transcript: attempt.transcript })
      } catch (e: any) {
        setLastCheck({ message: e?.message || 'scoring error' })
      } finally {
        setChecking(false)
        scoringGuardRef.current = false
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob, isRecording])

  // recording timer for aria-live feedback
  useEffect(() => {
    if (isRecording) {
      setRecSec(0)
      timerRef.current = window.setInterval(() => setRecSec(s => s + 1), 1000)
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  function reload() {
    const list = useDueOnly ? loadDueFlashcards() : loadAllFlashcards()
    setCards(list)
    if (idx >= list.length) setIdx(Math.max(0, list.length - 1))
  }

  function nextCard() {
    setShowAnswer(false)
    setShowPinyin(false)
    setLastCheck(undefined)
    setIdx(i => (i + 1) % Math.max(1, cards.length))
    reload()
  }

  function handleResult(correct: boolean) {
    if (!card) return
    markFlashcardResult(card.id, correct)
    reload()
    nextCard()
  }

  function handleRemove() {
    if (!card) return
    removeFlashcardById(card.id)
    reload()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Builder 放在頂部 */}
        <AddCustomCard onAdded={reload} />

        {/* main card */}
        {!cards.length ? (
          <section className="rounded-2xl shadow-md p-6 bg-white text-slate-600">No cards to review. Wrong items or custom items will appear here.</section>
        ) : (
          <section className="rounded-2xl shadow-md p-6 bg-white space-y-5">
            {/* Top: progress and index */}
            <header className="flex items-center justify-between">
              <p className="text-sm text-slate-600">Card <b>{Math.min(idx + 1, total)}</b> / {total || 0}</p>
              <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden" aria-hidden>
                <div className="h-full bg-blue-600" style={{ width: `${progressPct}%` }} />
              </div>
            </header>

            {/* Main copy */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">{card.prompt}</h2>
              <p className="text-sm text-slate-600">
                For example: <span className="font-medium">{card.expectedAnswer}</span>
              </p>
              {card.pinyin && <p className="text-sm text-slate-700">{card.pinyin}</p>}
            </div>

            {/* Controls row: Play → Record → Reveal ; right Skip/Remove（允許手機折行） */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                data-testid="btn-play"
                onClick={() => TTSService.playText(card.expectedAnswer)}
                className="h-10 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900"
                aria-label="Play audio"
              >
                ▶ Play
              </button>

              <button
                data-testid="btn-record"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                aria-pressed={isRecording}
                className={`h-10 px-4 rounded-2xl text-white ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                🎙 Record
              </button>

              <button
                data-testid="btn-reveal"
                onClick={() => setShowAnswer(s => !s)}
                className="h-10 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200"
                aria-label={showAnswer ? 'Hide answer' : 'Reveal answer'}
              >
                Reveal
              </button>

              {/* 手機尺寸時換到第二列並靠右 */}
              <div className="ml-auto sm:ml-auto w-full sm:w-auto flex gap-1 justify-end sm:justify-start">
                <button
                  data-testid="btn-skip"
                  onClick={nextCard}
                  className="h-10 px-3 rounded-2xl text-slate-600 hover:bg-slate-100"
                  aria-label="Skip card"
                >
                  Skip
                </button>
                <button
                  data-testid="btn-remove"
                  onClick={handleRemove}
                  className="h-10 px-3 rounded-2xl text-slate-600 hover:bg-slate-100"
                  aria-label="Remove card"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Banner state */}
            {(isRecording || checking || lastCheck) && (
              <div
                className={`rounded-xl px-3 py-2 text-sm ${lastCheck?.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}
                aria-live="assertive"
              >
                {isRecording
                  ? `Recording… ${String(Math.floor(recSec / 60)).padStart(2, '0')}:${String(recSec % 60).padStart(2, '0')}`
                  : checking
                    ? 'Scoring…'
                    : lastCheck?.passed
                      ? 'Great! Mark your result below.'
                      : 'Need more practice'}
              </div>
            )}

            {/* Reveal panel */}
            {showAnswer && (
              <div className="space-y-1">
                <div className="text-sm text-slate-600">Expected</div>
                <div className="text-slate-900">
                  <mark className="px-1 rounded">{card.expectedAnswer}</mark>
                </div>
                {card.userLastAnswer && (
                  <div className="text-sm text-slate-600">You said: {card.userLastAnswer}</div>
                )}
              </div>
            )}

            {/* 評分列：Again / Hard / Good / Easy（淺藍系列） */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button className="h-10 w-full rounded-xl bg-blue-50 hover:bg-blue-100 text-slate-900" onClick={() => handleResult(false)} aria-label="Rate again">Again</button>
              <button className="h-10 w-full rounded-xl bg-blue-50 hover:bg-blue-100 text-slate-900" onClick={() => handleResult(false)} aria-label="Rate hard">Hard</button>
              <button className="h-10 w-full rounded-xl bg-blue-50 hover:bg-blue-100 text-slate-900" onClick={() => handleResult(true)} aria-label="Rate good">Good</button>
              <button className="h-10 w-full rounded-xl bg-blue-50 hover:bg-blue-100 text-slate-900" onClick={() => handleResult(true)} aria-label="Rate easy">Easy</button>
            </div>

            {/* Screen-reader live region */}
            <div className="sr-only" aria-live="assertive" role="status">
              {isRecording && `Recording ${String(Math.floor(recSec / 60)).padStart(2,'0')}:${String(recSec % 60).padStart(2,'0')}`}
              {checking && 'Scoring…'}
              {lastCheck?.passed === true && 'Passed'}
              {lastCheck?.passed === false && 'Failed'}
              {lastCheck?.message}
            </div>

            {/* Tips */}
            <details className="text-sm text-slate-700">
              <summary className="cursor-pointer font-medium">Need help?</summary>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Use Reveal to see the expected answer.</li>
                <li>Play to listen and mimic the pronunciation.</li>
                <li>Mark the result to schedule the next review.</li>
              </ul>
            </details>
          </section>
        )}

        {/* Due-only filter moved out; keep logic but hide control to match minimalist preview */}
      </div>
    </div>
  )
}

function AddCustomCard({ onAdded }: { onAdded: () => void }) {
  const [prompt, setPrompt] = useState('')
  const [expected, setExpected] = useState('')
  const [pinyin, setPinyin] = useState('')

  function submit() {
    if (!prompt.trim() || !expected.trim()) return
    addCustomFlashcard({ prompt: prompt.trim(), expectedAnswer: expected.trim(), pinyin: pinyin.trim() || undefined })
    setPrompt(''); setExpected(''); setPinyin('')
    onAdded()
  }

  return (
    <section className="rounded-2xl shadow-md p-5 bg-white">
      <div className="font-medium mb-3 text-slate-900">Add Custom Practice</div>
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5">
          <label className="block text-xs text-slate-600 mb-1" htmlFor="builder-prompt">Prompt (題目)</label>
          <input id="builder-prompt" className="h-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/40 px-3 w-full" placeholder="e.g. To answer, say『我叫 + 你的名字』" value={prompt} onChange={e => setPrompt(e.target.value)} />
        </div>
        <div className="sm:col-span-5">
          <label className="block text-xs text-slate-600 mb-1" htmlFor="builder-expected">Expected answer (正解)</label>
          <input id="builder-expected" className="h-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/40 px-3 w-full" placeholder="e.g. 我叫Tom" value={expected} onChange={e => setExpected(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-slate-600 mb-1" htmlFor="builder-pinyin">Pinyin (optional)</label>
          <input id="builder-pinyin" className="h-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/40 px-3 w-full" placeholder="e.g. wǒ jiào Tom" value={pinyin} onChange={e => setPinyin(e.target.value)} />
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button className="px-4 h-10 bg-blue-600 text-white rounded-2xl hover:bg-blue-700" onClick={submit} aria-label="Add custom card">Add</button>
      </div>
    </section>
  )
}
