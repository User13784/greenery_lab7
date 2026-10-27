import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';

// Layout
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import { ThemeProvider } from './context/ThemeContext';

// Магазин мебели (lab7 — основной функционал)
import HomePage from './components/pages/HomePage';
import CatalogPage from './components/pages/CatalogPage';
import CartPage from './components/pages/CartPage';
import FavoritesPage from './components/pages/FavoritesPage';
import FeedbackPage from './components/pages/FeedbackPage';
import AdminPage from './components/pages/AdminPage';
import NotFoundPage from './components/pages/NotFoundPage';

// Аптечный склад (lab7)
import MedicinesPage from './components/pages/MedicinesPage';
import PharmaciesPage from './components/pages/PharmaciesPage';
import OrdersPage from './components/pages/OrdersPage';
import PurchasesPage from './components/pages/PurchasesPage';
import ReportsPage from './components/pages/ReportsPage';

// Авторизация (lab8)
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import ChangePasswordPage from './components/pages/ChangePasswordPage';

// Redux
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { selectCartCount, clearCart } from './features/cart/cartSlice';
import { clearFavorites } from './features/favorites/favoritesSlice';
import {
  logout,
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin
} from './features/auth/authSlice';

import './App.css';

// ────────────────────────────────────────
// Header
// ────────────────────────────────────────
function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const cartCount = useAppSelector(selectCartCount);

  const handleLogout = () => {
    if (window.confirm('Выйти из аккаунта?')) {
      dispatch(logout());
      dispatch(clearCart());
      dispatch(clearFavorites());
      navigate('/login');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 rounded">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🌿 Greenery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-nav" />
        <Navbar.Collapse id="header-nav">
          {/* Левая часть — навигация по аптечному складу */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/medicines">💊 Лекарства</Nav.Link>
            <Nav.Link as={Link} to="/pharmacies">🏥 Аптеки</Nav.Link>
            <Nav.Link as={Link} to="/orders">📋 Заявки</Nav.Link>
            <Nav.Link as={Link} to="/purchases">📦 Закупки</Nav.Link>
            <Nav.Link as={Link} to="/reports">📊 Отчёты</Nav.Link>
          </Nav>

          {/* Правая часть — пользователь */}
          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/cart">
              🛒 Корзина
              {cartCount > 0 && (
                <Badge bg="danger" pill className="ms-1">{cartCount}</Badge>
              )}
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Navbar.Text className="mx-2">
                  👤 {user?.email}{' '}
                  {isAdmin && <Badge bg="warning" text="dark">ADMIN</Badge>}
                </Navbar.Text>
                <Nav.Link as={Link} to="/change-password">🔒 Пароль</Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// ────────────────────────────────────────
// App
// ────────────────────────────────────────
function App() {
  const companyName = 'Greenery';
  const mainTitle = 'Best Furniture For Your Interior';

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container d-flex">
          <Sidebar companyName={companyName} />
          <main className="main-content flex-grow-1 p-3">
            <Header />
            <Routes>
              {/* ─── Магазин мебели ─── */}
              <Route path="/" element={<HomePage title={mainTitle} />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/admin" element={<AdminPage />} />

              {/* ─── Аптечный склад (lab7) ─── */}
              <Route path="/medicines" element={<MedicinesPage />} />
              <Route path="/pharmacies" element={<PharmaciesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/reports" element={<ReportsPage />} />

              {/* ─── Авторизация (lab8) ─── */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />

              {/* ─── 404 ─── */}
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