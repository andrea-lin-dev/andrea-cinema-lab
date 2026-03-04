# Andrea's Cinema Lab

電影搜尋、待看清單與抽籤選片應用。使用 TMDB API 取得電影資料，支援搜尋、收藏、排序與隨機抽籤決定今晚看什麼。

## Tech Stack

| 類別       | 技術                     |
| ---------- | ------------------------ |
| Framework  | React 19, React Router 7 |
| Data       | TanStack Query, Zustand  |
| Styling    | Tailwind CSS v4          |
| Validation | Zod                      |
| Build      | Vite 7                   |
| Test       | Vitest                   |

## Features

- **搜尋電影**：關鍵字搜尋、分頁載入、排序（預設／上映時間／評分／片名）
- **待看清單**：加入／移除、多種排序、localStorage 持久化
- **抽籤**：從待看清單隨機選片，含 focus trap、Escape 關閉
- **電影詳情**：海報、預告、演員、評論
- **Design System**：雙主題（紫色·淡咖啡、莫蘭迪綠·淡灰），語意化 token

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# 安裝依賴
pnpm install

# 建立 .env，設定 TMDB API Key
echo "VITE_TMDB_API_KEY=your_api_key" > .env

# 開發
pnpm dev

# 建置
pnpm build

# 預覽建置結果
pnpm preview
```

取得 API Key：<https://www.themoviedb.org/settings/api>

### API Error Demo

設定 `VITE_DEMO_API_ERROR=true` 可模擬 API 回傳錯誤格式，測試 schema 防禦：

- **搜尋**：第 1 頁回傳 array 當 root（預期 object）→ 觸發 schema 驗證失敗、顯示 schemaErrors
- **搜尋**：第 2 頁回傳 `results` 為 object（預期 array）→ schema 自動 fallback 成空陣列
- **電影詳情**：credits 回傳 array 當 root（預期 `{ cast, crew }`）→ adapter fallback 成空 cast/crew

### Scripts

| 指令              | 說明                |
| ----------------- | ------------------- |
| `pnpm dev`        | 開發伺服器          |
| `pnpm build`      | 建置生產版本        |
| `pnpm test`       | 執行測試            |
| `pnpm test:watch` | 監聽模式測試        |
| `pnpm lint`       | ESLint              |
| `pnpm type-check` | TypeScript 型別檢查 |

## Project Structure

```
src/
├── app/                 # 應用殼層（AppShell）
├── design-system/       # 主題、token、ThemeToggle
├── features/            # 功能模組
│   ├── lottery/         # 抽籤 modal、carousel
│   ├── search/          # useSearchMovies
│   └── watchlist/       # store、WatchlistButton
├── pages/               # 頁面元件
├── shared/
│   ├── api/             # TMDB client、schema、adapter、service
│   ├── lib/             # formatters、sortMovies、debounce
│   ├── types/           # domain types
│   └── ui/              # 共用 UI 元件
└── main.tsx
```

## Technical Highlights

### API Resiliency

- **Schema 防禦**：`union([array, record])` 處理 API 回傳 object 而非 array 的異常，避免 parse fail
- **schemaErrors**：適配層收集驗證錯誤，dev 模式顯示 fallback badge，prod 可接 Sentry

### Performance

- **Route-based code splitting**：`React.lazy` 分頁載入，減少 initial bundle
- **AbortSignal**：React Query `signal` 傳遞至 fetch，避免快速輸入時舊請求覆蓋新結果
- **圖片優化**：`loading="lazy"`、`width`/`height` 減少 CLS
- **字型**：Google Fonts 僅載入所需字重（400–700）

### Accessibility

- **Lottery Modal**：focus trap、initial focus、Escape 關閉、`role="dialog"`、`aria-modal`
- **響應式**：`w-full max-w-2xl` 取代 `min-w-[400px]`，小螢幕友善

### Design System

- 語意化 token：`accent-*`（主色）、`neutral-*`（背景／邊框）
- `data-theme` + CSS variables 切換主題
- 詳見 [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)

## Testing

核心邏輯單元測試：schema、adapter、formatters、sortMovies。

```bash
pnpm test
```

詳見 [docs/TESTING_INTRODUCTION.md](docs/TESTING_INTRODUCTION.md)。

## License

Data © [The Movie Database](https://www.themoviedb.org/).
