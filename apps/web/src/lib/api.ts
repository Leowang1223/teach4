export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const fullUrl = (url.startsWith('http://') || url.startsWith('https://')) ? url : `${getApiBase()}${url}`
  const res = await fetch(fullUrl, { ...(init || {}), headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  if (!res.ok) {
    let body = ''
    try { body = await res.text() } catch {}
    throw new Error(`${res.status} ${res.statusText}${body ? ` - ${body}` : ''}`);
  }
  return res.json() as Promise<T>;
}

// 中文學習報告類型定義
export interface Report {
  student_name: string;
  lesson_title: string;
  lesson_objective: string;
  date_completed: string;
  overall_feedback: {
    teacher_summary: string;
    next_focus: string;
    encouragement: string;
  };
  lesson_score: {
    Pronunciation: number;
    Fluency: number;
    Accuracy: number;
    Comprehension: number;
    Confidence: number;
    Total: number;
  };
  question_feedback: Array<{
    question_id: number;
    original_prompt: {
      chinese: string;
      pinyin: string;
      english: string;
    };
    student_answer: string;
    evaluation: {
      Pronunciation: number;
      Fluency: number;
      Accuracy: number;
      Comprehension: number;
    };
    teacher_comment: string;
  }>;
  practice_recommendations: Array<{
    type: string;
    description: string;
    duration: string;
    audio_link?: string;
  }>;
  teacher_signature: string;
}

export function getApiBase(): string {
  // 1) If on client, allow runtime override from localStorage (useful when前後端分離或更換網路)
  if (typeof window !== 'undefined') {
    try {
      const lsBase = localStorage.getItem('api_base');
      if (lsBase && lsBase.trim().length > 0) return lsBase.trim().replace(/\/$/, '');
    } catch {}

    // 2) Runtime detection: if running locally, use port 8082; otherwise use same-origin
    const { protocol, hostname } = window.location;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    if (isLocalHost) return `${protocol}//${hostname}:8082`;
    return '';
  }

  // 3) SSR fallback: use relative path (requires reverse proxy)
  return '';
}

export async function apiGetQuestions(type: string): Promise<{ questions: any[]; lessons?: any[]; playbackMode?: string }> {
  // Use relative path so Next.js rewrites can proxy to the backend in any env
  return fetchJson(`/api/questions/${encodeURIComponent(type)}`);
}

export async function apiGetLessonContent(type: string, lessonId: string): Promise<any> {
  return fetchJson(`/api/questions/${encodeURIComponent(type)}/${encodeURIComponent(lessonId)}`);
}

export async function apiTts(text: string): Promise<{ audioBase64: string; mime: string }> {
  return fetchJson(`/api/tts`, { method: 'POST', body: JSON.stringify({ text }) });
}

export async function apiStt(audioBase64: string, mime: string): Promise<{ text: string }> {
  return fetchJson(`/api/stt`, { method: 'POST', body: JSON.stringify({ audioBase64, mime }) });
}

export async function apiAnalyze(payload: {
  sessionId: string
  interviewType: string
  items: Array<{
    index: number
    question: string
    answer: string
    lessonId?: string
    stepId?: number
    expectedAnswer?: string
  }>
}): Promise<any> {
  return fetchJson(`/api/analyze`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function apiGetSessions(): Promise<{ sessions: any[] }> {
  return fetchJson(`/api/sessions`);
}

export async function apiGetSessionDetail(sessionId: string): Promise<any> {
  return fetchJson(`/api/sessions/${encodeURIComponent(sessionId)}`);
}

export async function apiLog(payload: { 
  sessionId: string; 
  index: number; 
  question?: string; 
  answer?: string; 
  completed?: boolean;
  thinkingTime?: number;
  answeringTime?: number;
  lesson_id?: string;    // 新增：課程 ID
  step_id?: number;      // 新增：步驟 ID
}): Promise<{ ok: true }> {
  return fetchJson(`/api/log`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function apiGenerateReport(payload: {
  sessionId?: string;  // 新增：session ID
  studentName: string;
  lessonTitle: string;
  lessonObjective: string;
  dateCompleted: string;
  questions: Array<{
    id: number;
    prompt: { chinese: string; pinyin: string; english: string };
    studentAnswer: string;
    scores: { Pronunciation: number; Fluency: number; Accuracy: number; Comprehension: number };
  }>;
  overallScores: { Pronunciation: number; Fluency: number; Accuracy: number; Comprehension: number; Confidence: number };
}): Promise<Report> {
  return fetchJson(`/v1/generate-report`, { method: 'POST', body: JSON.stringify(payload) });
}


