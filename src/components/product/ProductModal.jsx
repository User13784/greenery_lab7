import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import Modal from '../common/Modal';

function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!product) return null;

  const getTranslatedName = () => {
    const lang = i18n.language || 'ru';
    if (typeof product.name === 'string') return product.name;
    return product.name?.[lang] || product.name?.en || t('product');
  };

  const getTranslatedDescription = () => {
    const lang = i18n.language || 'ru';
    if (typeof product.description === 'string') return product.description;
    return product.description?.[lang] || product.description?.en || '';
  };

  const getTranslatedCategory = () => {
    const catMap = {
      sofa: 'catSofa',
      living: 'catLiving',
      kitchen: 'catKitchen',
      bedroom: 'catBedroom',
      bathroom: 'catBathroom',
      decor: 'catDecor',
      ceramics: 'catCeramics'
    };
    const key = catMap[product.category];
    return key ? t(key) : (product.category || 'General');
  };

  const generateStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < Math.floor(rating || 5) ? '★' : '☆';
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      const goToLogin = window.confirm(t('goToLoginConfirm'));
      if (goToLogin) {
        onClose();
        navigate('/register');
      }
      return;
    }
    onAddToCart(product);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTranslatedName()} size="lg">
      <Row>
        <Col md={5} className="text-center mb-3 mb-md-0">
          <img
            src={product.image || '/assets/images/placeholder.jpg'}
            alt={getTranslatedName()}
            className="img-fluid rounded"
            style={{ maxHeight: '300px', objectFit: 'contain' }}
            onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
          />
        </Col>

        <Col md={7}>
          <div style={{ marginBottom: '10px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#71B3C6',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                width: 'auto',
                maxWidth: 'none',
                minWidth: 'fit-content',
                overflow: 'visible',
                lineHeight: '1.4'
              }}
            >
              {getTranslatedCategory()}
            </span>
          </div>

          <h3 className="text-primary">£{(product.price || 0).toFixed(2)}</h3>

          <div className="text-warning fs-5 mb-3">{generateStars(product.rating)}</div>

          <p className="text-muted">{getTranslatedDescription()}</p>

          <div style={{ marginBottom: '15px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: product.inStock ? '#2e7d32' : '#c62828',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                width: 'auto',
                maxWidth: 'none',
                minWidth: 'fit-content',
                overflow: 'visible',
                lineHeight: '1.4'
              }}
            >
              {product.inStock ? `✓ ${t('inStock')}` : `✗ ${t('outOfStock')}`}
            </span>
          </div>

          {/* Характеристики */}
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>
              <strong>{t('id')}:</strong> {product.id}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>{t('category')}:</strong> {getTranslatedCategory()}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>{t('rating')}:</strong> {product.rating} / 5
            </ListGroup.Item>
          </ListGroup>

          {!isAuthenticated && (
            <div
              className="alert alert-warning small"
              style={{ borderRadius: '10px' }}
            >
              ℹ️ <a href="/register" className="alert-link">{t('login')}</a>, {t('addToCart')}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-100"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            🛒 {t('addToCart')}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default ProductModal;