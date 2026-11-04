import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { authAPI } from '../../services/api';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.newPassword.length < 6) {
      setError('Новый пароль должен быть ≥ 6 символов');
      return;
    }
    try {
      const res = await authAPI.changePassword(form);
      setSuccess(res.message);
      setForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 500 }}>
      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-4 text-center">🔒 Смена пароля</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Старый пароль</Form.Label>
              <Form.Control
                type="password"
                value={form.oldPassword}
                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
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
            <Button type="submit" variant="primary" className="w-100">Изменить пароль</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}