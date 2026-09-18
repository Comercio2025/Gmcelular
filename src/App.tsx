import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { PageViewer } from './pages/PageViewer';
import { PromocoesPage } from './pages/PromocoesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { TrabalheConosco } from './pages/TrabalheConosco';
import { SobreNosPage } from './pages/SobreNosPage';
import { PixelTracker } from './components/PixelTracker';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { PhoneRecommenderPage } from './pages/PhoneRecommenderPage';

// HashRouter is used for cPanel compatibility ensuring no 404s on refresh
function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <PixelTracker />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/promocoes" element={<PromocoesPage />} />
            <Route path="/artigos" element={<ArticlesPage />} />
            <Route path="/artigos/:slug" element={<ArticleDetailPage />} />
            <Route path="/melhor-celular" element={<PhoneRecommenderPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/pages/sobre-n-s" element={<SobreNosPage />} />
            <Route path="/pages/sobre-nos" element={<SobreNosPage />} />
            <Route path="/pages/:slug" element={<PageViewer />} />
            <Route path="/trabalheconosco" element={<TrabalheConosco />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
