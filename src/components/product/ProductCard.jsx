import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { addItem, selectCartItems } from '../../features/cart/cartSlice';
import {
  addFavorite,
  removeFavorite,
  selectFavorites
} from '../../features/favorites/favoritesSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { useNotification } from '../../hooks/useNotification';
import Notification from '../common/Notification';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();

  const cartItems = useAppSelector(selectCartItems);
  const favorites = useAppSelector(selectFavorites);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFavorite = favorites.some(f => f.productId === product.id);

  const getTranslatedName = () => {
    const lang = i18n.language || 'ru';
    if (!product.name) return t('product');
    if (typeof product.name === 'string') return product.name;
    return product.name[lang] || product.name.en || t('product');
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

  const requireAuth = (actionName) => {
    if (!isAuthenticated) {
      showWarning(`🔒 ${t('loginRequired')}: "${actionName}"`);
      setTimeout(() => {
        const goToLogin = window.confirm(t('goToLoginConfirm'));
        if (goToLogin) navigate('/register');
      }, 500);
      return false;
    }
    return true;
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!requireAuth(t('favorites'))) return;

    try {
      if (isFavorite) {
        const favItem = favorites.find(f => f.productId === product.id);
        if (favItem) {
          dispatch(removeFavorite(favItem.id));
          showSuccess(`❤️ "${getTranslatedName()}" ${t('removedFromFavorites')}`);
        }
      } else {
        dispatch(addFavorite({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating || 5,
          inStock: product.inStock !== undefined ? product.inStock : true,
          description: product.description || { en: '', ru: '' }
        }));
        showSuccess(`❤️ "${getTranslatedName()}" ${t('addedToFavorites')}`);
      }
    } catch (error) {
      console.error('Error:', error);
      showError(t('errorFavorite'));
    }
  };

  const addToCart = (e) => {
    e.stopPropagation();
    if (!requireAuth(t('cart'))) return;

    try {
      const existing = cartItems.find(i => i.productId === product.id);

      if (existing) {
        showWarning(t('alreadyInCart'));
        return;
      }

      dispatch(addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }));

      showSuccess(`🛒 "${getTranslatedName()}" ${t('addedToCart')}`);
    } catch (error) {
      console.error('Error:', error);
      showError(t('errorCart'));
    }
  };

  const generateStars = (rating) => {
    const stars = rating || 5;
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += i < Math.floor(stars) ? '★' : '☆';
    }
    return result;
  };

  if (!product) return null;

  return (
    <>
      <Card className="h-100 shadow-sm product-card-bs">
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={product.image || '/assets/images/placeholder.jpg'}
            alt={getTranslatedName()}
            style={{ height: '200px', objectFit: 'contain', padding: '10px' }}
            onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
          />

          <Button
            variant={isFavorite ? 'danger' : 'light'}
            size="sm"
            className="position-absolute top-0 end-0 m-2 rounded-circle"
            onClick={toggleFavorite}
            style={{ width: '40px', height: '40px', padding: 0, zIndex: 10 }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </Button>

          {product.rating >= 4.5 && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                display: 'inline-block',
                backgroundColor: '#FFB800',
                color: '#264A51',
                padding: '5px 12px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                width: 'auto',
                maxWidth: 'none',
                minWidth: 'fit-content',
                overflow: 'visible',
                zIndex: 5,
                lineHeight: '1.4'
              }}
            >
              {t('topProduct')}
            </span>
          )}
        </div>

        <Card.Body className="d-flex flex-column">
          <Card.Title className="fs-6">{getTranslatedName()}</Card.Title>

          <div style={{ marginBottom: '10px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#71B3C6',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '10px',
                fontSize: '12px',
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

          <Card.Text className="text-primary fw-bold fs-5 mb-2">
            £{(product.price || 0).toFixed(2)}
          </Card.Text>

          <div className="text-warning mb-2" style={{ letterSpacing: '2px' }}>
            {generateStars(product.rating)}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: product.inStock ? '#2e7d32' : '#c62828',
                color: 'white',
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '12px',
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

          <Button
            variant="primary"
            className="mt-auto w-100"
            onClick={addToCart}
            disabled={!product.inStock}
          >
            🛒 {t('addToCart')}
          </Button>
        </Card.Body>
      </Card>

      <Notification
        show={notification.show}
        message={notification.message}
        variant={notification.variant}
        title={notification.title}
        onClose={hideNotification}
      />
    </>
  );
}

export default ProductCard;