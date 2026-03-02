# Design System

## 主題 Themes

| ID | 名稱 | 主色 Accent | 中性色 Neutral |
|----|------|-------------|----------------|
| `lavender` | 紫色 · 淡咖啡 | 淡紫 #9b8bb4 | 淡咖啡 #d4c8b8 |
| `morandi` | 莫蘭迪綠 · 淡灰 | 莫蘭迪綠 #7a9b7a | 淡灰 #d4d4d0 |

## Token 語意

- **accent**：主色／品牌色（按鈕、連結、active 狀態）
- **neutral**：背景、邊框、表面
- **stone**：文字（Tailwind 內建，兩主題共用）

## 檔案結構

```
src/design-system/
├── index.ts        # setTheme, getTheme, THEMES
├── theme.css       # @theme inline + [data-theme] 變數
├── ThemeToggle.tsx # 主題切換下拉
└── docs/          # 本文件
```

## 使用方式

### 切換主題

```tsx
import { setTheme, getTheme } from '@/design-system'

setTheme('morandi')  // 切換為莫蘭迪綠
getTheme()           // 取得目前主題
```

### 元件 class 建議

- 新元件：優先使用 `accent-*`、`neutral-*`
- 既有元件：`lavender-*`、`brown-*` 為 alias，會隨主題自動切換

### 新增主題

1. 在 `theme.css` 的 `@layer base` 新增 `[data-theme='新主題']` 區塊
2. 設定 `--ds-accent-*`、`--ds-neutral-*`
3. 在 `index.ts` 的 `THEMES` 與 `ThemeId` 加入新主題
