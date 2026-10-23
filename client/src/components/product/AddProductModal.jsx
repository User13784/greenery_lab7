import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addProduct } from '../../features/products/productsSlice';

function AddProductModal({ isOpen, onClose }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    nameEn: '',
    nameRu: '',
    price: '',
    category: 'sofa',
    image: '/assets/images/c1.jpg',
    descriptionEn: '',
    descriptionRu: '',
    inStock: true,
    rating: 5
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.nameEn.trim()) errs.nameEn = 'Required';
    if (!formData.nameRu.trim()) errs.nameRu = 'Required';
    if (!formData.price || parseFloat(formData.price) <= 0) errs.price = 'Must be > 0';
    if (!formData.image.trim()) errs.image = 'Required';
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

  // ===== СОЗДАНИЕ (СИНХРОННО) =====
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const newProduct = {
        id: Date.now().toString(),
        name: { en: formData.nameEn, ru: formData.nameRu },
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        description: { en: formData.descriptionEn, ru: formData.descriptionRu },
        inStock: formData.inStock,
        rating: parseFloat(formData.rating) || 5,
        isFavorite: false
      };

      // ✅ Синхронный dispatch — без async/await
      dispatch(addProduct(newProduct));

      setSuccess(true);

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + t('errorAdding'));
    }
  };

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameRu: '',
      price: '',
      category: 'sofa',
      image: '/assets/images/c1.jpg',
      descriptionEn: '',
      descriptionRu: '',
      inStock: true,
      rating: 5
    });
    setErrors({});
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t('addProductTitle')}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          {success && <Alert variant="success">✅ {t('productAdded')}</Alert>}

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
            <Form.Label>{t('category')} *</Form.Label>
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
            <Form.Label>{t('imageUrl')} *</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              isInvalid={!!errors.image}
            />
            <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
          </Form.Group>

          {formData.image && (
            <div className="text-center mb-3">
              <img
                src={formData.image}
                alt="Preview"
                className="img-thumbnail"
                style={{ maxHeight: '150px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

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
              id="inStock-switch"
              name="inStock"
              label={formData.inStock ? `✓ ${t('inStock')}` : `✗ ${t('outOfStock')}`}
              checked={formData.inStock}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>{t('cancelBtn')}</Button>
          <Button variant="primary" type="submit">{t('save')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddProductModal;