import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Home } from './pages/Home';
import { Result } from './pages/Result';
import { Login } from './pages/Login';
import { MyPage } from './pages/MyPage';
import { Faq } from './pages/Faq';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/mypage"
            element={
              <RequireAuth>
                <MyPage />
              </RequireAuth>
            }
          />
          <Route path="/faq" element={<Faq />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
