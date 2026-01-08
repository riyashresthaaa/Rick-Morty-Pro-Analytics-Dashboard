import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CharacterDetailPage } from './pages/CharacterDetailPage';
import { useFavorites } from './hooks/useFavorites';

function AppContent() {
  // Get favorites count for the header
  const { favoritesCount } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header favoritesCount={favoritesCount} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:id" element={<CharacterDetailPage />} />
        </Routes>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>
          Data provided by{' '}
          <a
            href="https://rickandmortyapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#97ce4c] transition-colors hover:text-[#b8e87c]"
          >
            Rick and Morty API
          </a>
        </p>
        <p className="mt-1">
          Built with React, TypeScript & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
