import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const { t, i18n } = useTranslation();

  const [counters, setCounters] = useState({
    clients: 0, sold: 0, awards: 0, experience: 0
  });

  const galleryImages = [
    { src: '/assets/images/c1.jpg', name: { en: 'Luxury Velvet Sofa', ru: 'Роскошный велюровый диван' } },
    { src: '/assets/images/c2.jpg', name: { en: 'Modern L-Shaped Sofa', ru: 'Современный угловой диван' } },
    { src: '/assets/images/c3.jpg', name: { en: 'Classic Leather Sofa', ru: 'Классический кожаный диван' } },
    { src: '/assets/images/c4.jpg', name: { en: 'Coffee Table', ru: 'Журнальный столик' } },
    { src: '/assets/images/c5.jpg', name: { en: 'Dining Table Set', ru: 'Обеденный стол' } }
  ];

  const getTranslatedGalleryName = (name) => {
    const lang = i18n.language || 'ru';
    if (typeof name === 'string') return name;
    return name[lang] || name.en || '';
  };

  useEffect(() => {
    const targets = { clients: 5000, sold: 1200, awards: 150, experience: 24 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounters({
        clients: Math.floor(targets.clients * eased),
        sold: Math.floor(targets.sold * eased),
        awards: Math.floor(targets.awards * eased),
        experience: Math.floor(targets.experience * eased)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const productCategories = [
    { title: t('catSofa'), img: '/assets/images/c1.jpg', category: 'sofa' },
    { title: t('catLiving'), img: '/assets/images/c4.jpg', category: 'living' },
    { title: t('catKitchen'), img: '/assets/images/c5.jpg', category: 'kitchen' },
    { title: t('catBedroom'), img: '/assets/images/c7.jpg', category: 'bedroom' },
    { title: t('catBathroom'), img: '/assets/images/c9.jpg', category: 'bathroom' },
    { title: t('catDecor'), img: '/assets/images/c10.jpg', category: 'decor' }
  ];

  return (
    <>
      {/* HERO CAROUSEL */}
      <Container fluid className="p-0 mb-5">
        <Carousel fade>
          <Carousel.Item>
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #0a1a1f 0%, #1A3E45 30%, #264A51 60%, #3C6C7F 100%)'
              }}
            >
              <div className="text-center px-3">
                <p className="fs-4 fst-italic text-info">{t('heroSmall')}</p>
                <h1 className="display-3 fw-bold">{t('heroMedium')}</h1>
                <h2 className="display-5 mb-4">{t('bestFurniture')}</h2>
                <Button as={Link} to="/catalog" variant="info" size="lg">
                  {t('exploreMore')}
                </Button>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #264A51 0%, #3C6C7F 50%, #71B3C6 100%)'
              }}
            >
              <div className="text-center px-3">
                <p className="fs-4 fst-italic">{t('bestQuality')}</p>
                <h1 className="display-3 fw-bold">{t('modernFurniture')}</h1>
                <h2 className="display-5 mb-4">{t('forYourHome')}</h2>
                <Button as={Link} to="/catalog" variant="light" size="lg">
                  {t('viewCollection')}
                </Button>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #1A3E45 0%, #3C6C7F 50%, #8cc4d6 100%)'
              }}
            >
              <div className="text-center px-3">
                <p className="fs-4 fst-italic">{t('specialOffer')}</p>
                <h1 className="display-3 fw-bold">50% {t('off')}</h1>
                <h2 className="display-5 mb-4">{t('weekendOnly')}</h2>
                <Button as={Link} to="/catalog" variant="danger" size="lg">
                  {t('shopNow')}
                </Button>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </Container>

      {/* СЧЁТЧИКИ */}
      <Container className="mb-5">
        <Row className="g-4 text-center">
          {[
            { value: counters.clients, label: t('happyClients'), icon: '😊' },
            { value: counters.sold, label: t('soldItems'), icon: '📦' },
            { value: counters.awards, label: t('awards'), icon: '🏆' },
            { value: counters.experience, label: t('yearsExperience'), icon: '📅' }
          ].map((item, idx) => (
            <Col xs={6} md={3} key={idx}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="fs-1">{item.icon}</div>
                  <h2 className="display-4 text-primary fw-bold">{item.value}</h2>
                  <p className="text-muted mb-0">{item.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* НАШИ ТОВАРЫ */}
      <Container className="mb-5">
        <div className="text-center mb-4">
          <h1 className="display-5">{t('ourProducts')}</h1>
          <p className="text-muted">{t('ourProductsSubtitle')}</p>
        </div>

        <Row xs={1} sm={2} md={3} className="g-4">
          {productCategories.map((cat, idx) => (
            <Col key={idx}>
              <Card className="h-100 shadow-sm text-center">
                <Card.Img
                  variant="top"
                  src={cat.img}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/assets/images/chair.png'; }}
                />
                <Card.Body>
                  <Card.Title>{cat.title}</Card.Title>
                  <Button
                    as={Link}
                    to={`/catalog?category=${cat.category}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    {t('viewItems')}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* МЕДИАГАЛЕРЕЯ */}
      <Container className="mb-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-4">{t('mediaGallery')}</h2>

            <Carousel variant="dark">
              {galleryImages.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100"
                    src={img.src}
                    alt={getTranslatedGalleryName(img.name)}
                    style={{ height: '400px', objectFit: 'contain', background: '#f5f7fa' }}
                    onError={(e) => { e.target.src = '/assets/images/chair.png'; }}
                  />
                  <Carousel.Caption>
                    <Badge bg="primary" className="fs-6">
                      {getTranslatedGalleryName(img.name)}
                    </Badge>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Card.Body>
        </Card>
      </Container>

      {/* ПРОМО 50% OFF */}
      <Container className="mb-5">
        <Card
          className="text-white border-0"
          style={{
            background: 'linear-gradient(135deg, #1A3E45 0%, #264A51 100%)',
            minHeight: '300px'
          }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-5">
            <h1 className="display-3 fw-bold text-warning">50% {t('off')}</h1>
            <h2 className="display-5 mb-3">{t('weekendTrendySofa')}</h2>
            <p className="lead mb-4">{t('heroLine1')} {t('heroLine2')}</p>
            <Button as={Link} to="/catalog" variant="warning" size="lg">
              {t('viewItems')}
            </Button>
          </Card.Body>
        </Card>
      </Container>

      {/* КАРТА */}
      <Container className="mb-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-4">{t('location')}</h2>
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded"
              style={{ height: '400px' }}
            >
              <div className="text-center">
                <div className="fs-1">🗺️</div>
                <p className="text-muted">{t('locationAddress')}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default HomePage;