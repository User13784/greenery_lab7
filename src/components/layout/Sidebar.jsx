import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectIsAdmin } from '../../features/auth/authSlice';

function Sidebar({ companyName = "Greenery" }) {
  const { t } = useTranslation();
  const isAdmin = useAppSelector(selectIsAdmin);

  const menuItems = [
    { path: '/', icon: 'home', label: t('home') },
    { path: '/catalog', icon: 'shop', label: t('shop') },
    { path: '/favorites', icon: 'heart', label: t('favorites') },
    { path: '/feedback', icon: 'blog', label: t('reviews') },
    { path: '/cart', icon: 'cart', label: t('cart') }
  ];

  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="flex-column sidebar-bs"
      style={{ width: '165px', minHeight: '100vh', padding: '20px 0' }}
    >
      <Container fluid className="flex-column align-items-center">
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="text-center d-flex flex-column align-items-center mb-4"
        >
          <img src="/assets/icons/logo.png" alt={companyName} width="60" height="60" />
          <span className="mt-2 fw-bold">{companyName}</span>
        </Navbar.Brand>

        <Nav className="flex-column w-100 text-center">
          {menuItems.map(item => (
            <Nav.Link
              as={NavLink}
              key={item.path}
              to={item.path}
              className="d-flex flex-column align-items-center py-3"
            >
              <img
                src={`/assets/icons/${item.icon}.png`}
                alt={item.label}
                width="28"
                height="28"
                className="mb-1"
                style={{ filter: 'brightness(0) invert(0.85)' }}
              />
              <span style={{ fontSize: '12px' }}>{item.label}</span>
            </Nav.Link>
          ))}

          {isAdmin && (
            <Nav.Link
              as={NavLink}
              to="/admin"
              className="d-flex flex-column align-items-center py-3"
            >
              <img
                src="/assets/icons/admin.png"
                alt="admin"
                width="28"
                height="28"
                className="mb-1"
                style={{ filter: 'brightness(0) invert(0.85)' }}
              />
              <span style={{ fontSize: '12px' }}>{t('admin')}</span>
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Sidebar;