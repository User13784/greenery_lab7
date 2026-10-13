import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import {
  selectIsAuthenticated,
  selectIsAdmin,
  selectUser,
  logout
} from './features/auth/authSlice';
import { selectCartCount, clearCartOnLogout } from './features/cart/cartSlice';
import { clearFavoritesOnLogout } from './features/favorites/favoritesSlice';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import CatalogPage from './components/pages/CatalogPage';
import CartPage from './components/pages/CartPage';
import FavoritesPage from './components/pages/FavoritesPage';
import FeedbackPage from './components/pages/FeedbackPage';
import AdminPage from './components/pages/AdminPage';
import RegisterPage from './components/pages/RegisterPage';
import NotFoundPage from './components/pages/NotFoundPage';
import './App.css';

function Header() {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const cartCount = useAppSelector(selectCartCount);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    if (window.confirm(t('logoutConfirm'))) {
      dispatch(clearCartOnLogout());
      dispatch(clearFavoritesOnLogout());
      dispatch(logout());
      window.location.href = '/';
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 rounded">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-lg-none">
          🌿 Greenery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-nav" />
        <Navbar.Collapse id="header-nav">
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Navbar.Text className="d-flex align-items-center me-3">
                  <img
                    src="/assets/icons/human.png"
                    alt="user"
                    width="20"
                    height="20"
                    className="me-2"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  {user?.firstName || user?.email}
                  {isAdmin && <Badge bg="warning" text="dark" className="ms-2">👑 Admin</Badge>}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  🚪 {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">
                  👤 {t('login')}
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  🚪 {t('signup')}
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/cart">
              🛒 {t('cart')}
              {cartCount > 0 && (
                <Badge bg="danger" pill className="ms-1">{cartCount}</Badge>
              )}
            </Nav.Link>

            <ButtonGroup size="sm" className="ms-2">
              <Button variant="outline-light" onClick={toggleLanguage}>
                {i18n.language === 'ru' ? '🇬🇧 EN' : '🇷🇺 RU'}
              </Button>
              <Button variant="outline-light" onClick={toggleTheme}>
                {isDark ? '☀️' : '🌙'}
              </Button>
            </ButtonGroup>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  const companyName = "Greenery";
  const mainTitle = "Best Furniture For Your Interior";

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container d-flex">
          <Sidebar companyName={companyName} />
          <main className="main-content flex-grow-1 p-3">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage title={mainTitle} />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;