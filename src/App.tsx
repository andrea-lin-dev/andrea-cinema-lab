import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/app/AppShell'
import { SearchPage } from '@/pages/SearchPage'
import { WatchlistPage } from '@/pages/WatchlistPage'
import { MovieDetailPage } from '@/pages/MovieDetailPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
