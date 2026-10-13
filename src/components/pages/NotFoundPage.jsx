import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          <h1
            className="display-1 fw-bold"
            style={{
              background: 'linear-gradient(135deg, #264A51, #71B3C6, #264A51)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '10rem'
            }}
          >
            404
          </h1>

          <h2 className="mb-3">{t('notFoundTitle')}</h2>
          <p className="text-muted mb-4">{t('notFoundText')}</p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button as={Link} to="/" variant="primary" size="lg">{t('goHome')}</Button>
            <Button as={Link} to="/catalog" variant="outline-primary" size="lg">{t('goToCatalogBtn')}</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFoundPage;