import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { updateProduct } from '../../features/products/productsSlice';

function EditProductModal({ product, isOpen, onClose }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    nameEn: '',
    nameRu: '',
    price: '',
    category: 'sofa',
    image: '',
    descriptionEn: '',
    descriptionRu: '',
    inStock: true,
    rating: 5
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Заполняем форму при открытии
  useEffect(() => {
    if (product) {
      setFormData({
        nameEn: product.name?.en || '',
        nameRu: product.name?.ru || '',
        price: product.price || '',
        category: product.category || 'sofa',
        image: product.image || '',
        descriptionEn: product.description?.en || '',
        descriptionRu: product.description?.ru || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        rating: product.rating || 5
      });
      setErrors({});
      setSuccess(false);
    }
  }, [product]);

  if (!product) return null;

  const validate = () => {
    const errs = {};
    if (!formData.nameEn.trim()) errs.nameEn = 'Required';
    if (!formData.nameRu.trim()) errs.nameRu = 'Required';
    if (!formData.price || parseFloat(formData.price) <= 0) errs.price = 'Must be > 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ===== СОХРАНЕНИЕ (СИНХРОННО) =====
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const updatedProduct = {
        ...product,
        name: { en: formData.nameEn, ru: formData.nameRu },
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        description: { en: formData.descriptionEn, ru: formData.descriptionRu },
        inStock: formData.inStock,
        rating: parseFloat(formData.rating) || 5
      };

      // ✅ Синхронный dispatch — без async/await
      dispatch(updateProduct(updatedProduct));

      setSuccess(true);
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + t('errorUpdating'));
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t('editProductTitle')}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          {success && <Alert variant="success">✅ {t('productUpdated')}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>{t('nameEn')} *</Form.Label>
            <Form.Control
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              isInvalid={!!errors.nameEn}
            />
            <Form.Control.Feedback type="invalid">{errors.nameEn}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('nameRu')} *</Form.Label>
            <Form.Control
              type="text"
              name="nameRu"
              value={formData.nameRu}
              onChange={handleChange}
              isInvalid={!!errors.nameRu}
            />
            <Form.Control.Feedback type="invalid">{errors.nameRu}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('price')} *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              isInvalid={!!errors.price}
              min="0"
              step="0.01"
            />
            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('category')}</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange}>
              <option value="sofa">{t('catSofa')}</option>
              <option value="living">{t('catLiving')}</option>
              <option value="kitchen">{t('catKitchen')}</option>
              <option value="bedroom">{t('catBedroom')}</option>
              <option value="bathroom">{t('catBathroom')}</option>
              <option value="decor">{t('catDecor')}</option>
              <option value="ceramics">{t('catCeramics')}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('imageUrl')}</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('descriptionEn')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('descriptionRu')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descriptionRu"
              value={formData.descriptionRu}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="edit-inStock"
              name="inStock"
              label={formData.inStock ? `✓ ${t('inStock')}` : `✗ ${t('outOfStock')}`}
              checked={formData.inStock}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>{t('cancelBtn')}</Button>
          <Button variant="primary" type="submit">{t('save')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditProductModal;