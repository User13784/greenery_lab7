import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await authAPI.forgotPassword({ email });
      setMessage(res.message);
      if (res.resetToken) setResetToken(res.resetToken);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 500 }}>
      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-4 text-center">🔑 Восстановление пароля</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Запросить токен</Button>
          </Form>

          {resetToken && (
            <Alert variant="info" className="mt-3">
              <strong>Ваш resetToken:</strong>
              <code className="d-block mt-2" style={{ wordBreak: 'break-all' }}>{resetToken}</code>
              <Link to="/reset-password" className="btn btn-warning w-100 mt-3">
                → Перейти к сбросу пароля
              </Link>
            </Alert>
          )}

          <div className="mt-3 text-center">
            <Link to="/login">← Назад ко входу</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}