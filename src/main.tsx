import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import css from './index.css?inline'
import App from '@/App'

// Inject CSS before first paint to avoid render-blocking request
;(function injectStyles(cssText: string) {
  const style = document.createElement('style')
  style.textContent = cssText
  document.head.appendChild(style)
})(css)
import { getTheme, setTheme } from '@/design-system'

// Apply saved theme before first paint
setTheme(getTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
