# Andrea's Cinema Lab — 測試介紹 / Testing Introduction

## 概述 Overview

本專案使用 **Vitest** 作為測試框架，針對核心業務邏輯撰寫單元測試，確保 API 適配、資料驗證與工具函式行為正確。

---

## 測試範圍 Test Coverage

### 1. TMDB Schema (`src/shared/api/schema/tmdb.test.ts`)

**重點：API 回應的型別驗證與容錯**

- **`searchMoviesResponseSchema`**
  - 當 `results` 為陣列時，正確解析電影列表
  - **重要**：當後端錯誤回傳 `results` 為 object 時，**不會 parse fail**，而是轉成空陣列 `[]`
  - 使用 `union([array, record])` 與其他 schema 一致，避免 API 型別變動導致整頁崩潰
- **`movieSummarySchema`**：驗證預設值（title、vote_average、overview）

### 2. Movie Adapter (`src/shared/api/adapter/movieAdapter.test.ts`)

**重點：將 TMDB API 原始資料轉換為 domain 型別**

- **`adaptSearchResults`**
  - 正確將 API 回應轉成 `MovieSummary[]`
  - 當 `results` 為 object 時，回傳空陣列與預設分頁資訊，不拋錯
  - 當 parse 完全失敗時，回傳 `schemaErrors` 供 UI 顯示

### 3. Formatters (`src/shared/lib/formatters.test.ts`)

**重點：顯示層格式化**

- `formatRuntime`：分鐘 → `"1h 30m"` 或 `"45m"`
- `formatYear`：日期字串 → 年份 `"2020"`
- `formatRating`：評分 → 小數一位，0 以下顯示 `—`

### 4. Sort Movies (`src/shared/lib/sortMovies.test.ts`)

**重點：待看清單排序邏輯**

- `sortMovies`：依評分、上映日期、片名排序
- `sortWatchlistByAddedAt`：依加入時間升序/降序
- 驗證不 mutate 原始陣列

---

## 執行測試 Run Tests

```bash
# 執行一次
pnpm test

# 監聽模式（開發時）
pnpm test:watch
```

---

## 會議簡報要點 Key Points for Meeting

1. **防禦性設計**：Schema 使用 `union([array, record])` 處理 API 型別異常，避免前端因後端格式變動而 crash
2. **適配層測試**：`adaptSearchResults` 確保無論 API 回傳 array 或 object，都能安全降級
3. **純函式測試**：formatters、sortMovies 為純函式，易於測試且無副作用

---

## Next Steps（簡報用）

- **schemaErrors**：`adaptSearchResults` / `adaptMovieDetail` 已收集 schema 驗證錯誤
- **Dev**：頁面角落顯示「資料異常已 fallback」badge（`SchemaErrorBadge`）
- **Prod**：接 Sentry / logger 上報 schemaErrors，便於監控 API 格式異常
