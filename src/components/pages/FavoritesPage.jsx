import React from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectFavorites } from '../../features/favorites/favoritesSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import ProductCard from '../product/ProductCard';

function FavoritesPage() {
  const { t } = useTranslation();
  const favorites = useAppSelector(selectFavorites);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <Container className="text-center py-5">
        <Alert variant="warning">
          <h2>🔒 {t('loginRequired')}</h2>
          <p>{t('cartLoginRequired')}</p>
        </Alert>
        <Button as={Link} to="/register" variant="primary" size="lg">
          👤 {t('login')}
        </Button>
      </Container>
    );
  }

  const formattedFavorites = favorites.map(item => ({
    id: item.productId,
    name: item.name || { en: 'Product', ru: 'Товар' },
    price: item.price || 0,
    image: item.image || '/assets/images/placeholder.jpg',
    category: item.category || 'General',
    rating: item.rating || 5,
    inStock: item.inStock !== undefined ? item.inStock : true,
    description: item.description || { en: '', ru: '' },
    isFavorite: true
  }));

  if (formattedFavorites.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <h2>{t('emptyFavorites')}</h2>
          <p>{t('emptyFavoritesHint')}</p>
        </Alert>
        <Button as={Link} to="/catalog" variant="primary" size="lg">
          {t('goToCatalog')}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">{t('favoritesTitle')}</h1>
        <p className="text-muted">{t('favoritesSubtitle')}</p>
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#c62828',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            marginTop: '15px'
          }}
        >
          ❤️ {formattedFavorites.length} {t('items')}
        </span>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {formattedFavorites.map(item => (
          <Col key={item.id}>
            <ProductCard product={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FavoritesPage;