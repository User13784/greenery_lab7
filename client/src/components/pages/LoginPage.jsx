import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { loginUser, selectAuthError, selectIsAuthenticated } from '../../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/medicines');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert('Заполните все поля');
      return;
    }
    dispatch(loginUser(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/medicines');
      }
    });
  };

  return (
    <Container className="py-5" style={{ maxWidth: 500 }}>
      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-4 text-center">🔐 Вход</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Войти</Button>
          </Form>
          <div className="mt-3 text-center">
            <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
            <br />
            <Link to="/forgot-password">Забыли пароль?</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}