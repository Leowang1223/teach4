
"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

interface StatsState {
  lessons: number
  avgScore: number
  levelIndex: number
  streak: number
}

interface LessonStep {
  id: number
  title: string
  progress: number
  completed: boolean
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", description: "Overview & path" },
  { href: "/flashcards", label: "Flashcards", description: "Review mistakes" },
  { href: "/history", label: "History", description: "Reports & playback" },
]

const LESSONS: LessonStep[] = [
  { id: 1, title: "Greetings & Introductions", progress: 100, completed: true },
  { id: 2, title: "Daily Routine", progress: 0, completed: false },
  { id: 3, title: "Travel Plans", progress: 100, completed: true },
  { id: 4, title: "Dining Out", progress: 100, completed: true },
  { id: 5, title: "Work & Study", progress: 100, completed: true },
]

export default function DashboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [stats, setStats] = useState<StatsState>({
    lessons: 5,
    avgScore: 81,
    levelIndex: 1.3,
    streak: 3,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const apiBase =
          (typeof window !== "undefined" && localStorage.getItem("api_base")) ||
          process.env.NEXT_PUBLIC_API_BASE ||
          "http://localhost:8082"

        const response = await fetch(`${apiBase}/api/stats`)
        if (response.ok) {
          const data = await response.json()
          setStats({
            lessons: data.lessons ?? 5,
            avgScore: data.avgScore ?? 81,
            levelIndex: data.levelIndex ?? 1.3,
            streak: data.streak ?? 3,
          })
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  const handleLessonClick = (lessonId: number) => {
    router.push(`/lesson/L${lessonId}`)
  }

  const handleStartLesson = () => {
    const nextLesson = LESSONS.find((lesson) => !lesson.completed)
    if (nextLesson) {
      handleLessonClick(nextLesson.id)
    }
  }

  const handleLogout = () => {
    router.push("/login")
  }

  const statCards = [
    { label: "已完成課程", value: stats.lessons.toString() },
    { label: "平均分數", value: `${stats.avgScore}%` },
    { label: "等級指數", value: stats.levelIndex.toString() },
    { label: "連續天數", value: `${stats.streak} 天` },
  ]

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-[#f7f9ff] to-[#edf1f9] text-slate-900">
      <aside className="w-72 border-r border-white/70 bg-[#f6f8fe]/90 px-7 py-10 shadow-[0_15px_40px_rgba(148,163,184,0.25)] backdrop-blur">
        <button className="self-start rounded-full border border-blue-100 bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm">
          Talk Learning
        </button>

        <div className="mt-7 space-y-4 text-[13px]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Navigate</div>
            <p className="mt-1 text-[11px] text-slate-400">
              Lessons, flashcards, and detailed history reports.
            </p>
          </div>

          <div className="space-y-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`w-full rounded-3xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-white bg-white text-slate-900 shadow-[0_18px_35px_rgba(15,23,42,0.12)]"
                      : "border-transparent bg-white/30 text-slate-500 hover:bg-white/60"
                  }`}
                >
                  <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                    {item.label}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    {item.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      <main className="flex flex-1 justify-center overflow-y-auto border-l border-white/70">
        <div className="w-full max-w-[1050px] px-10 py-10">
          <div className="space-y-8 rounded-[34px] border border-white/80 bg-white/90 px-10 py-10 shadow-[0_40px_80px_rgba(15,23,42,0.12)]">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Welcome back
                </p>
                <h1 className="text-2xl font-semibold tracking-tight">admin@test.com</h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-100 bg-white px-5 py-2.5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-blue-600">
                    S
                  </span>
                  <div className="leading-tight">
                    <div className="text-[11px] font-semibold text-slate-600">Keep your streak</div>
                    <div className="text-[10px] text-slate-400">Log one conversation today</div>
                  </div>
                </div>

                <button
                  onClick={handleStartLesson}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.45)] transition hover:shadow-[0_12px_28px_rgba(37,99,235,0.55)]"
                >
                  Start lesson
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-full px-2 py-1 text-[11px] text-slate-500 transition hover:bg-slate-100"
                >
                  log out
                </button>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                  A
                </div>
              </div>
            </div>

            <section className="relative rounded-[30px] border border-white bg-white px-8 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-1 pr-32">
                <h2 className="text-sm font-semibold text-slate-800">Talk Learning</h2>
                <p className="text-[11px] text-slate-500">
                  沿用實際的情境會話，先感受整體語感與節奏，
                  <span className="font-medium text-amber-500"> 完成課程後即可在實際情境上加速 </span>
                  應對，自信開口不怯場。
                </p>
              </div>

              <button
                onClick={handleStartLesson}
                className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-xs font-semibold text-white shadow-[0_15px_30px_rgba(37,99,235,0.45)] transition hover:scale-105"
              >
                Resume Daily Routine
              </button>
            </section>

            <section className="grid grid-cols-4 gap-5">
              {statCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[26px] border border-white bg-white px-6 py-5 shadow-[0_15px_30px_rgba(15,23,42,0.08)]"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                    {item.label}
                  </div>
                  <div className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
                    {item.value}
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-5 rounded-[32px] border border-white bg-white px-8 py-7 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-800">中文學習課程路線</h2>
                <p className="text-[11px] text-slate-500">
                  完成每個步驟，課程節奏會幫你從日常對話帶進高難度情境。
                </p>
              </div>

              <div className="flex items-end justify-between gap-5">
                {LESSONS.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className="group flex min-w-[90px] flex-col items-center gap-2"
                  >
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold transition group-hover:scale-110 ${
                        lesson.completed
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.45)]"
                          : "border-[3px] border-blue-200 bg-white text-blue-500"
                      }`}
                    >
                      <span className="relative z-10">{index + 1}</span>
                      {!lesson.completed && <div className="absolute inset-[3px] rounded-full bg-slate-50" />}
                    </div>
                    <div className="text-center leading-tight">
                      <p className="text-[11px] font-medium text-slate-700 group-hover:text-blue-600">
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{lesson.completed ? "100%" : `${lesson.progress}%`}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
