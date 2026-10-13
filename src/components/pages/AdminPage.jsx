import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Badge, Alert,
  Tabs, Tab, Form, InputGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  deleteProduct,
  selectAllProducts
} from '../../features/products/productsSlice';
import {
  deleteFeedback,
  selectFeedback
} from '../../features/feedback/feedbackSlice';
import {
  selectUser,
  selectIsAdmin,
  selectIsAuthenticated
} from '../../features/auth/authSlice';
import ProductCard from '../product/ProductCard';

function AdminPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const products = useAppSelector(selectAllProducts);
  const feedback = useAppSelector(selectFeedback);
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h2>🔒 {t('loginRequired')}</h2>
          <Button as={Link} to="/register" variant="primary" size="lg">
            {t('login')}
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h2>⛔ {t('accessDenied')}</h2>
          <p>{t('adminRequired')}</p>
          <Button as={Link} to="/catalog" variant="primary" size="lg">
            {t('goToCatalogBtn')}
          </Button>
        </Alert>
      </Container>
    );
  }

  const handleDeleteProduct = (productId, productName) => {
    if (!window.confirm(`${t('confirmDelete')} "${productName}"?`)) return;
    dispatch(deleteProduct(productId));
    alert('✅ ' + t('productsDeleted'));
  };

  const handleDeleteFeedback = (feedbackId) => {
    if (!window.confirm(t('confirmDelete') + '?')) return;
    dispatch(deleteFeedback(feedbackId));
    alert('✅ ' + t('productsDeleted'));
  };

  const filteredProducts = products.filter(product => {
    const nameEn = product.name?.en || '';
    const nameRu = product.name?.ru || '';
    const searchLower = searchTerm.toLowerCase();
    return nameEn.toLowerCase().includes(searchLower) ||
           nameRu.toLowerCase().includes(searchLower);
  });

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = products.filter(p => !p.inStock).length;
  const totalFeedback = feedback.length;
  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, r) => sum + (r.rating || 0), 0) / feedback.length).toFixed(1)
    : 0;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <Container fluid className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">{t('adminPanel')}</h1>
        <p className="text-muted">{t('adminSubtitle')}</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#FFB800',
              color: '#264A51',
              padding: '8px 20px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(255, 184, 0, 0.3)'
            }}
          >
            👤 {user?.firstName || user?.email}
          </span>
        </div>
      </div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4 justify-content-center" fill>
        <Tab eventKey="dashboard" title={t('dashboard')}>
          <Row className="g-4 mb-4">
            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-primary">
                <Card.Body>
                  <div className="fs-1">📦</div>
                  <h2 className="text-primary">{totalProducts}</h2>
                  <p className="text-muted mb-0">{t('products')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-success">
                <Card.Body>
                  <div className="fs-1">✅</div>
                  <h2 className="text-success">{inStockProducts}</h2>
                  <p className="text-muted mb-0">{t('inStock')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-danger">
                <Card.Body>
                  <div className="fs-1">❌</div>
                  <h2 className="text-danger">{outOfStockProducts}</h2>
                  <p className="text-muted mb-0">{t('outOfStock')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-info">
                <Card.Body>
                  <div className="fs-1">💬</div>
                  <h2 className="text-info">{totalFeedback}</h2>
                  <p className="text-muted mb-0">{t('reviews')}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={6}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <div className="fs-1">⭐</div>
                  <h2 className="text-warning">{avgRating} / 5</h2>
                  <p className="text-muted mb-0">{t('avgRating')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <div className="fs-1">💰</div>
                  <h2 className="text-success">£{totalValue.toFixed(2)}</h2>
                  <p className="text-muted mb-0">{t('totalValue')}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="mt-4 text-center">
            <Button as={Link} to="/catalog" variant="primary" size="lg" className="m-1">
              {t('goToCatalog')}
            </Button>
          </div>
        </Tab>

        <Tab eventKey="products" title="📦 Products">
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>🔍</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder={t('searchProducts')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>✖</Button>
                    )}
                  </InputGroup>
                </Col>
                <Col md={6} className="text-end">
                  <Badge bg="primary" className="fs-6">
                    {filteredProducts.length} {t('of')} {products.length}
                  </Badge>
                </Col>
              </Row>

              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>{t('id')}</th>
                    <th>Photo</th>
                    <th>{t('name')}</th>
                    <th>{t('category')}</th>
                    <th>{t('price')}</th>
                    <th>{t('rating')}</th>
                    <th>{t('availability')}</th>
                    <th className="text-center">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <Alert variant="info" className="mb-0">{t('noProducts')}</Alert>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name?.en}
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = '/assets/images/chair.png'; }}
                          />
                        </td>
                        <td>{product.name?.en}</td>
                        <td><Badge bg="info">{product.category}</Badge></td>
                        <td className="fw-bold">£{product.price}</td>
                        <td className="text-warning">{'★'.repeat(Math.floor(product.rating))}</td>
                        <td>
                          <Badge bg={product.inStock ? 'success' : 'danger'}>
                            {product.inStock ? t('yes') : t('no')}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteProduct(product.id, product.name?.en)}
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="feedback" title="💬 Reviews">
          <Card className="shadow-sm">
            <Card.Body>
              {feedback.length === 0 ? (
                <Alert variant="info" className="text-center mb-0">
                  <h4>{t('noReviews')}</h4>
                </Alert>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {feedback.map(review => (
                    <Col key={review.id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <strong>{review.userNickname || 'User'}</strong>
                          <Badge bg="warning" text="dark">{'★'.repeat(review.rating)}</Badge>
                        </Card.Header>
                        <Card.Body>
                          <Card.Text>{review.text?.ru || review.text?.en}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                          <Button size="sm" variant="danger" onClick={() => handleDeleteFeedback(review.id)}>
                            🗑️
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {activeTab === 'products' && filteredProducts.length > 0 && (
        <Container className="mt-4">
          <h4 className="text-center mb-3">{t('preview')}</h4>
          <Row xs={1} sm={2} md={3} lg={4} className="g-3">
            {filteredProducts.slice(0, 4).map(product => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </Container>
  );
}

export default AdminPage;