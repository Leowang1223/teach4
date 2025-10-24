# AI 模擬面試

一個基於 AI 的模擬面試應用程式，幫助使用者練習面試技巧。

## 功能特色

- 🎥 **AI 面試官**: 虛擬面試官提供真實的面試體驗
- 💬 **即時對話**: 支援語音輸入和文字轉語音
- 📝 **對話記錄**: 完整記錄面試過程，方便回顧
- 💡 **智能提示**: 提供面試技巧和建議
- 🎙️ **語音控制**: 直觀的語音錄製和控制介面

## 技術架構

- **前端框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **圖示**: Lucide React
- **狀態管理**: React Hooks

## 專案結構

```
apps/web/
├── src/
│   ├── app/                 # App Router 根目錄
│   │   ├── layout.tsx      # 全域框架
│   │   ├── globals.css     # Tailwind 基底樣式
│   │   ├── page.tsx        # 主頁面
│   │   └── mock-interview/ # 模擬面試頁面
│   ├── components/         # 可復用元件
│   │   ├── TopBar.tsx     # 頂部導航欄
│   │   ├── TutorPane/     # 導師面板
│   │   ├── TranscriptPane/ # 對話記錄面板
│   │   ├── HintPane/      # 提示面板
│   │   ├── ActionPane.tsx # 操作面板
│   │   └── VoiceDock.tsx  # 語音控制停靠
│   └── styles/            # 額外樣式
└── public/                # 靜態資產
```

## 快速開始

### 安裝依賴

```bash
cd apps/web
npm install
```

### 開發模式

```bash
npm run dev
```

### 建置專案

```bash
npm run build
npm start
```

## 主要元件說明

### TutorPane (導師面板)
- **VideoCard**: 顯示 AI 面試官的視訊畫面
- **SpeechWave**: 語音活動波形顯示
- **TTSControls**: 文字轉語音控制

### TranscriptPane (對話記錄面板)
- **MessageBubble**: 對話氣泡元件
- 即時顯示面試對話記錄

### HintPane (提示面板)
- **HintCard**: 面試提示卡片
- 提供實用的面試技巧和建議

### ActionPane (操作面板)
- 錄製控制、暫停、重置等功能
- 顯示錄製狀態和時間

### VoiceDock (語音控制停靠)
- 麥克風和揚聲器控制
- 語音等級指示器

## 開發注意事項

- 使用 TypeScript 確保型別安全
- 遵循 React Hooks 最佳實踐
- 響應式設計，支援各種螢幕尺寸
- 使用 Tailwind CSS 進行樣式設計

## 端到端驗收與自我檢查（語音串流）

目標：驗證「前端按下錄音 → 後端回傳 partial/final」整條鏈路。

- 前置準備
  - 確認後端 node-gateway 已啟動，且 WebSocket 服務綁在 `/ws`（目前伺服器實作支援 `speech.start/chunk/end`，每 ~800ms 推 `stt.partial`）。
  - 啟動 `apps/web`，打開包含 `TTSControls` 的頁面。

- 瀏覽器觀察點
  - 打開 DevTools → Network → WebSocket，選擇與 `ws(s)://<host>/ws` 的連線。

- 錄音開始（點「開始錄音」）
  - 應看到送出：`{type:'speech.start'}`。
  - 應收到：`{type:'speech.ack', status:'start'}`。
  - 隨後每 ~300ms 應看到一個二進位訊息（音訊分片）送出。

- 說話過程
  - 每 ~800ms 應收到：`{type:'stt.partial', text:'...'}`。
  - UI 應即時顯示「即時字幕（partial）」。

- 錄音結束（點「結束錄音」）
  - 應看到送出：`{type:'speech.end'}`。
  - 應收到：`{type:'stt.final', text:'完整內容'}`。
  - UI 應顯示「最終轉寫（final）」並清空 partial。
  - 若後端開啟 LLM/TTS：稍後會依序收到 `{type:'llm.reply'}`、多個 `{type:'tts.audio'}` 以及 `{type:'tts.end'}`。

- 資源釋放檢查
  - 停止後，`navigator.mediaDevices` 取得的麥克風 `MediaStreamTrack.readyState` 應為 `ended`。
  - 元件卸載時不應殘留開啟的麥克風或錄音器（無持續送片與裝置占用）。

## 未來規劃

- [ ] 整合真實的 AI 語音識別
- [ ] 支援多種面試類型
- [ ] 面試表現分析報告
- [ ] 多語言支援
- [ ] 行動裝置應用程式

## 授權

MIT License

## 檔案結構與功能對照表（完整）

以下彙總整個專案的主要檔案與職責，方便快速查找與提問。

### 根目錄
- `.dockerignore` / `.gitattributes` / `.gitignore`：容器與版控設定
- `docker-compose.yml`：本地一鍵啟動前後端（backend:8081、frontend:3000）與健康檢查
- `Git開發指南`：Git 分支、PR、提交規範
- `LICENSE`：MIT 授權
- `README.md`：專案總覽與驗收指南（本文件）
- `apps/`：前後端原始碼與測試資料

### apps/
- `sample.json`：分析 API 的測試輸入樣本

### apps/backend（Express + TypeScript）
- `.env.bak`：環境變數樣板（GEMINI_API_KEY / GOOGLE_API_KEY）
- `Dockerfile`：後端容器建置腳本
- `package.json`：腳本與依賴（express、@google/generative-ai）
- `tsconfig.json`：TypeScript 編譯設定
- `logs/sessions/`：面試會話記錄輸出（每個 session 一個 JSON 檔）

#### apps/backend/src
- `server.ts`：Express 入口；掛載中介軟體、路由、健康檢查
  - 路由：`/api`（題庫/語音/日誌）與 `/v1/analyze`（POST 原始資料、GET 以 sessionId）
- `geminiService.ts`：Gemini 服務封裝
  - `synthesizeSpeech(text)`：TTS 文字轉語音（回傳音訊 Base64 + MIME）
  - `transcribeAudio(buffer, mime)`：STT 語音轉逐字稿（嚴格純文字）

##### src/routes
- `qa.ts`
  - `GET /api/questions/:type`：載入題庫外掛 `plugins/interview-types/<type>/rule`
  - `POST /api/tts`：呼叫 Gemini TTS
  - `POST /api/stt`：呼叫 Gemini STT
  - `POST /api/log`：寫入/更新 `logs/sessions` 單題記錄
- `analyze.ts`
  - `POST /v1/analyze`：規則評分 →（選配）Gemini 語義融合 →（選配）逐題建議/優化稿
  - `GET /v1/analyze/:sessionId`：讀取 session 檔後做同等分析並回傳

##### src/analysis-core（評分核心）
- `types.ts`：分析輸入/輸出與結構型別（QAItem、PerQuestionResult、Overview 等）
- `compute.ts`：規則打分（題意契合/結構/具體度/節奏），`fuseWithLLM()` 融合語義訊號
- `aggregate.ts`：彙整總分、雷達圖與平均時長
- `recommend.ts`：挑最弱題與全局弱項給出建議列點
- `index.ts`：統一匯出

##### src/service
- `semantic.ts`：語義訊號抽取器介面與實作
  - `DummySemanticExtractor`：假資料（本地開發）
  - `GeminiSemanticExtractor`：以 Gemini 2.0 Flash 生成 `SemanticSignals`

##### src/utils
- `fileStore.ts`：
  - `ensureSessionLogDir()`：確保 `logs/sessions` 目錄存在
  - `upsertQaLogEntry(sessionId, entry)`：新增或覆寫指定 index 記錄
  - `readSessionLog(sessionId)`：讀取整份 session 陣列

##### src/plugins/interview-types（題庫/流程外掛）
- `self_intro/rule`：自我介紹題庫（含 `playbackMode`、`videoPath`、`answer_hint`、`advice`、`enable`）
- `pm_interview/flow_interview.json`：PM 面試對話狀態機（opening/product_sense/execution/leadership/wrap_up）

### apps/web（Next.js 14 + React 18 + Tailwind）
- `Dockerfile`：前端容器建置
- `package.json`：Next/Tailwind/Chart.js/html2canvas/jsPDF 等依賴
- `next.config.js`：可配置 API 代理或環境變數
- `middleware.ts`：路由中介層（保留點）
- `README.md`：前端音訊處理與資料流說明
- `public/`
  - `ws-test.html`：WebSocket 測試頁
  - `videos/self_intro/`：面試官預錄影片
  - `worklets/pcm-worklet.js`：錄音 PCM Worklet（若有使用）

#### apps/web/src
- `app/layout.tsx`、`app/providers.tsx`、`app/globals.css`：App Router 框架與全域樣式/Provider
- `app/(protected)/prepare/page.tsx`：裝置檢測與切換（MediaSessionProvider，同一個 MediaStream）
- `app/(protected)/interview/`：面試頁（語音對話、字幕、流程控制）
- `app/(protected)/analysis/page.tsx`：分析報告（雷達圖、逐題卡、PDF 匯出；支援以 query 帶入 sessionId）
- `components/`：TopBar、VoiceDock、TutorPane、TranscriptPane、HintPane 等 UI
- `lib/api.ts`：REST API 包裝（支援以 localStorage.api_base 覆蓋 API Base）
- `lib/ttsPlayer.ts`：TTS 播放器（解碼、重採樣、邊界平滑、佇列）
- `lib/chunkSmoother.ts`：音訊片段接合與平滑
- `lib/media/MediaSessionProvider.tsx`：統一管理 MediaStream 與 audio/video/speaker 狀態
- `lib/useInterviewFlow.ts` 與 `lib/strategies/`：面試流程控制與 TTS/Video 播放策略

### 常見提問索引
- 想改評分邏輯：請看 `apps/backend/src/analysis-core/compute.ts`
- 想加/換題庫：新增 `apps/backend/src/plugins/interview-types/<type>/rule`，前端以 `?type=<type>` 載入
- 以 sessionId 直接出報告：前端造訪 `/analysis?sessionId=<id>` → 觸發 `GET /v1/analyze/:sessionId`
- 改 STT/TTS 供應商：替換 `apps/backend/src/geminiService.ts` 內部實作
