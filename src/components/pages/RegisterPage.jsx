import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  loginSuccess,
  selectAllUsers
} from '../../features/auth/authSlice';
import {
  loadUserCart
} from '../../features/cart/cartSlice';
import {
  loadUserFavorites
} from '../../features/favorites/favoritesSlice';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const allUsers = useAppSelector(selectAllUsers);   

  const [key, setKey] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [registerError, setRegisterError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginData.email || !loginData.password) {
      setLoginError(t('fillFields'));
      return;
    }

    const user = allUsers.find(u => u.email === loginData.email);

    if (!user) {
      setLoginError(t('userNotFound'));
      return;
    }

    if (user.password !== loginData.password) {
      setLoginError(t('wrongPassword'));
      return;
    }

    dispatch(loginSuccess(user));
    dispatch(loadUserCart());        
    dispatch(loadUserFavorites());    

    navigate('/catalog');
    alert(
      user.role === 'admin'
        ? `${t('welcomeAdmin')}, ${user.firstName}!`
        : `${t('welcomeUser')}, ${user.firstName}!`
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerData.firstName || !registerData.lastName ||
        !registerData.email || !registerData.password) {
      setRegisterError(t('fillFields'));
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError(t('passwordMin'));
      return;
    }

    const existing = allUsers.find(u => u.email === registerData.email);
    if (existing) {
      setRegisterError(t('emailTaken'));
      return;
    }

    // ⚠️ Регистрация новых пользователей пока не сохраняется
    // (потому что нет бэкенда). Можно добавить сохранение в localStorage.
    const newUser = {
      id: Date.now().toString(),
      ...registerData,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    dispatch(loginSuccess(newUser));
    navigate('/catalog');
    alert(`${t('registerSuccess')}, ${newUser.firstName}!`);
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow" style={{ maxWidth: '500px' }}>
        <Card.Header className="text-center bg-primary text-white">
          <h3 className="mb-0">{t('account')}</h3>
        </Card.Header>
        <Card.Body>
          <Tabs activeKey={key} onSelect={setKey} className="mb-4 justify-content-center">
            <Tab eventKey="login" title={t('loginTab')}>
              <Form onSubmit={handleLogin}>
                {loginError && <Alert variant="danger">{loginError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>{t('email')}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@mail.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('password')}</Form.Label>
                  <Form.Control
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  {t('loginBtn')}
                </Button>

                <div className="text-center mt-3 text-muted small">
                  {t('testAdmin')}: <strong>admin@example.com</strong> / <strong>admin123</strong>
                  <br />
                  {t('testUser')}: <strong>user@example.com</strong> / <strong>user123</strong>
                </div>
              </Form>
            </Tab>

            <Tab eventKey="register" title={t('registerTab')}>
              <Form onSubmit={handleRegister}>
                {registerError && <Alert variant="danger">{registerError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>{t('firstName')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('lastName')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('email')}</Form.Label>
                  <Form.Control
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('password')}</Form.Label>
                  <Form.Control
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  {t('registerBtn')}
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;