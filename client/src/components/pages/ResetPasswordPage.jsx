import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ token: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.newPassword.length < 6) {
      setError('Пароль должен быть ≥ 6 символов');
      return;
    }
    try {
      const res = await authAPI.resetPassword(form);
      setSuccess(res.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 500 }}>
      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-4 text-center">🔓 Сброс пароля</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Токен восстановления</Form.Label>
              <Form.Control
                type="text"
                value={form.token}
                onChange={(e) => setForm({ ...form, token: e.target.value })}
                placeholder="Вставьте resetToken"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" variant="warning" className="w-100">Сбросить пароль</Button>
          </Form>
          <div className="mt-3 text-center">
            <Link to="/login">← Назад ко входу</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}