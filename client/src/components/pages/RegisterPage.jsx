import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { registerUser, loginUser, selectAuthError } from '../../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);

  const [form, setForm] = useState({ email: '', password: '', confirm: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert('Заполните все поля');
      return;
    }
    if (form.password.length < 6) {
      alert('Пароль должен быть ≥ 6 символов');
      return;
    }
    if (form.password !== form.confirm) {
      alert('Пароли не совпадают');
      return;
    }
    dispatch(registerUser({ email: form.email, password: form.password }))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(loginUser({ email: form.email, password: form.password }))
            .then(() => navigate('/medicines'));
        }
      });
  };

  return (
    <Container className="py-5" style={{ maxWidth: 500 }}>
      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-4 text-center">📝 Регистрация</h2>
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
              <Form.Label>Пароль (≥ 6 символов)</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Повторите пароль</Form.Label>
              <Form.Control
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">Зарегистрироваться</Button>
          </Form>
          <div className="mt-3 text-center">
            <Link to="/login">Уже есть аккаунт? Войти</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}