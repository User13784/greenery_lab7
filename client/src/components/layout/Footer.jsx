import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5 py-4 rounded">
      <Container>
        <Row className="g-4">
          <Col md={6} lg={3}>
            <h5 className="text-info">🌿 Greenery</h5>
            <p className="small">{t('footerAbout')}</p>
            <div className="d-flex gap-2">
              <a href="#" className="text-light text-decoration-none fs-4">📘</a>
              <a href="#" className="text-light text-decoration-none fs-4">📷</a>
              <a href="#" className="text-light text-decoration-none fs-4">🐦</a>
              <a href="#" className="text-light text-decoration-none fs-4">📺</a>
            </div>
          </Col>

          <Col md={6} lg={3}>
            <h5 className="text-info">{t('explore')}</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">🏠 {t('home')}</Link>
              </li>
              <li className="mb-2">
                <Link to="/catalog" className="text-light text-decoration-none">🛍️ {t('shop')}</Link>
              </li>
              <li className="mb-2">
                <Link to="/favorites" className="text-light text-decoration-none">❤️ {t('favorites')}</Link>
              </li>
              <li className="mb-2">
                <Link to="/feedback" className="text-light text-decoration-none">💬 {t('reviews')}</Link>
              </li>
            </ul>
          </Col>

          <Col md={6} lg={3}>
            <h5 className="text-info">{t('contacts')}</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">📍 Minsk, Nemiga 5</li>
              <li className="mb-2">📞 +375 (29) 123-45-67</li>
              <li className="mb-2">✉️ info@greenery.com</li>
            </ul>
          </Col>

          <Col md={6} lg={3}>
            <h5 className="text-info">{t('workingHours')}</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">{t('monFri')}</li>
              <li className="mb-2">{t('saturday')}</li>
              <li className="mb-2">{t('sunday')}</li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <div className="text-center small">
          © {currentYear} Greenery. {t('allRightsReserved')}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;