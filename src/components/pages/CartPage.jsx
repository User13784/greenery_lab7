import React from 'react';
import { Container, Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  updateQuantity,
  removeItem,
  selectCartItems,
  selectCartTotal
} from '../../features/cart/cartSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

function CartPage() {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) {
      dispatch(removeItem(id));
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const getTranslatedName = (name) => {
    const lang = i18n.language || 'ru';
    if (!name) return t('product');
    if (typeof name === 'string') return name;
    return name[lang] || name.en || t('product');
  };

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

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <h2>{t('emptyCart')}</h2>
          <p>{t('emptyCartHint')}</p>
        </Alert>
        <Button as={Link} to="/catalog" variant="primary" size="lg">
          {t('goToCatalog')}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">{t('shoppingCart')}</h1>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>{t('product')}</th>
            <th>{t('name')}</th>
            <th>{t('price')}</th>
            <th>{t('quantity')}</th>
            <th>{t('total')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.image}
                  alt={getTranslatedName(item.name)}
                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
                />
              </td>
              <td>{getTranslatedName(item.name)}</td>
              <td>£{item.price.toFixed(2)}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </Button>
                  <Badge bg="secondary" className="fs-6">{item.quantity}</Badge>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td className="fw-bold text-primary">
                £{(item.price * item.quantity).toFixed(2)}
              </td>
              <td>
                <Button size="sm" variant="danger" onClick={() => handleRemove(item.id)}>
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Alert variant="success" className="text-end">
        <h3 className="mb-0">{t('total')}: £{total.toFixed(2)}</h3>
      </Alert>

      <div className="d-flex justify-content-between flex-wrap gap-2">
        <Button as={Link} to="/catalog" variant="outline-secondary" size="lg">
          {t('continueShopping')}
        </Button>
        <Button variant="success" size="lg">{t('checkout')}</Button>
      </div>
    </Container>
  );
}

export default CartPage;