import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  ButtonGroup,
  InputGroup,
  Pagination
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  deleteProduct,
  selectFilteredProducts,
  selectSearchTerm,
  selectCategory,
  selectSortBy,
  setSearchTerm,
  setCategory,
  setSortBy
} from '../../features/products/productsSlice';
import { addItem, selectCartItems } from '../../features/cart/cartSlice';
import { selectIsAdmin, selectIsAuthenticated } from '../../features/auth/authSlice';
import ProductCard from '../product/ProductCard';
import ProductModal from '../product/ProductModal';
import EditProductModal from '../product/EditProductModal';
import AddProductModal from '../product/AddProductModal';

function CatalogPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const products = useAppSelector(selectFilteredProducts);
  const searchTerm = useAppSelector(selectSearchTerm);
  const selectedCategory = useAppSelector(selectCategory);
  const sortBy = useAppSelector(selectSortBy);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartItems = useAppSelector(selectCartItems);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const openEditModal = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAdmin) {
      alert(t('adminRequired'));
      return;
    }
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert(t('loginRequired'));
      return;
    }

    try {
      const existing = cartItems.find(i => i.productId === product.id);
      if (existing) {
        alert(t('alreadyInCart'));
        return;
      }

      dispatch(addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }));

      alert(`✅ ${t('addedToCart')}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const deleteSelected = () => {
    if (!isAdmin) return;
    if (selectedProducts.length === 0) return;

    if (!window.confirm(`${t('confirmDelete')} ${selectedProducts.length} ${t('confirmDeleteEnd')}`)) return;

    try {
      selectedProducts.forEach(id => {
        dispatch(deleteProduct(id));
      });
      setSelectedProducts([]);
      alert('✅ ' + t('productsDeleted'));
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + t('errorDeleting'));
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const categories = [
    { key: 'all', label: t('catAll') },
    { key: 'sofa', label: t('catSofa') },
    { key: 'living', label: t('catLiving') },
    { key: 'kitchen', label: t('catKitchen') },
    { key: 'bedroom', label: t('catBedroom') },
    { key: 'bathroom', label: t('catBathroom') },
    { key: 'decor', label: t('catDecor') },
    { key: 'ceramics', label: t('catCeramics') }
  ];

  return (
    <Container fluid className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">{t('ourCatalog')}</h1>
        <p className="text-muted">{t('catalogSubtitle')}</p>

        {isAdmin && (
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
              {t('adminMode')}
            </span>
          </div>
        )}
      </div>

      <div className="bg-light p-3 rounded mb-4 shadow-sm">
        <Row className="g-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
              {searchTerm && (
                <Button variant="outline-secondary" onClick={() => dispatch(setSearchTerm(''))}>✖</Button>
              )}
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}>
              <option value="default">{t('sortDefault')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
              <option value="rating-desc">{t('sortRating')}</option>
            </Form.Select>
          </Col>

          {isAdmin && products.length > 0 && (
            <Col md={3} className="d-flex align-items-center">
              <Button
                variant={selectedProducts.length === products.length ? 'danger' : 'outline-primary'}
                onClick={selectAll}
                className="w-100"
              >
                {selectedProducts.length === products.length ? t('deselectAll') : t('selectAll')}
              </Button>
            </Col>
          )}
        </Row>

        <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
          <ButtonGroup className="flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat.key}
                variant={selectedCategory === cat.key ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => dispatch(setCategory(cat.key))}
              >
                {cat.label}
              </Button>
            ))}
          </ButtonGroup>

          {isAdmin && (
            <Button variant="success" size="sm" onClick={() => setIsAddModalOpen(true)}>
              {t('addProduct')}
            </Button>
          )}
        </div>
      </div>

      {isAdmin && selectedProducts.length > 0 && (
        <Alert variant="primary" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>✅ {t('selected')}: <strong>{selectedProducts.length}</strong> {t('of')} {products.length}</span>
          <div className="d-flex gap-2">
            <Button variant="danger" size="sm" onClick={deleteSelected}>{t('deleteSelected')}</Button>
            <Button variant="secondary" size="sm" onClick={() => setSelectedProducts([])}>{t('cancel')}</Button>
          </div>
        </Alert>
      )}

      {!isAuthenticated && (
        <Alert variant="warning">
          ℹ️ <a href="/register" className="alert-link">{t('guestWarning')}</a>
        </Alert>
      )}

      {products.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>{t('noProducts')}</h4>
          <p>{t('noProductsHint')}</p>
        </Alert>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {paginatedProducts.map(product => (
              <Col key={product.id}>
                <div
                  className={`position-relative h-100 product-wrapper-admin ${
                    isAdmin && selectedProducts.includes(product.id)
                      ? 'border border-primary border-3 rounded'
                      : ''
                  }`}
                >
                  {isAdmin && (
                    <Form.Check
                      type="checkbox"
                      className="position-absolute"
                      style={{ top: '10px', left: '10px', zIndex: 10 }}
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}

                  <div onClick={() => openProductModal(product)} style={{ cursor: 'pointer', height: '100%' }}>
                    <ProductCard product={product} />
                  </div>

                  {isAdmin && (
                    <button
                      className="edit-product-btn-center"
                      onClick={(e) => openEditModal(product, e)}
                      title={t('editProduct')}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
              </Pagination>
            </div>
          )}

          <p className="text-center text-muted mt-3">
            {t('shown')}: {startIndex + 1}–{Math.min(startIndex + itemsPerPage, products.length)} {t('of')} {products.length} {t('products')}
          </p>
        </>
      )}

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
        onAddToCart={handleAddToCart}
      />

      {isAdmin && (
        <EditProductModal
          product={editingProduct}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}

      {isAdmin && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </Container>
  );
}

export default CatalogPage;