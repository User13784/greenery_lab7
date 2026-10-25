import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Badge, Pagination, Modal } from 'react-bootstrap';
import {
  fetchMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  selectMedicines,
  selectMedicinesLoading,
  selectMedicinesError,
  selectMedicinesPagination
} from '../../features/medicines/medicinesSlice';
import { selectIsAdmin, selectIsAuthenticated } from '../../features/auth/authSlice';

function MedicinesPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectMedicines);
  const loading = useSelector(selectMedicinesLoading);
  const error = useSelector(selectMedicinesError);
  const { totalPages, currentPage } = useSelector(selectMedicinesPagination);
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    price: '',
    photoUrl: '/photos/medicine1.jpg'
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    dispatch(fetchMedicines({ page, limit: 10, search }));
  }, [dispatch, page, search]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.manufacturer || !formData.price) {
      alert('Заполните все поля');
      return;
    }
    dispatch(createMedicine({
      ...formData,
      price: parseFloat(formData.price)
    })).then(() => {
      setFormData({
        name: '',
        manufacturer: '',
        price: '',
        photoUrl: '/photos/medicine1.jpg'
      });
      dispatch(fetchMedicines({ page, limit: 10, search }));
    });
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      manufacturer: item.manufacturer,
      price: item.price,
      photoUrl: item.photoUrl || '/photos/medicine1.jpg'
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    dispatch(updateMedicine({
      id: editingItem.id,
      data: { ...editForm, price: parseFloat(editForm.price) }
    })).then(() => {
      setEditingItem(null);
      dispatch(fetchMedicines({ page, limit: 10, search }));
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Удалить "${name}"?`)) {
      dispatch(deleteMedicine(id)).then(() => {
        dispatch(fetchMedicines({ page, limit: 10, search }));
      });
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">💊 Лекарства</h1>

      {!isAdmin && (
        <Alert variant="info">
          ℹ️ Вы просматриваете страницу в режиме <strong>«Только чтение»</strong>.
          {!isAuthenticated && ' Войдите как администратор, чтобы управлять данными.'}
        </Alert>
      )}

      {error && <Alert variant="danger">Ошибка: {error}</Alert>}

      <Form.Control
        type="text"
        placeholder="🔍 Поиск по названию или производителю..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mb-3"
      />

      {isAdmin && (
        <div className="bg-light p-3 rounded mb-4">
          <h5>➕ Добавить лекарство</h5>
          <Form onSubmit={handleCreate} className="row g-2">
            <div className="col-md-3">
              <Form.Control
                placeholder="Название"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <Form.Control
                placeholder="Производитель"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Цена"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <Form.Control
                placeholder="URL фото"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <Button type="submit" variant="primary" className="w-100">Добавить</Button>
            </div>
          </Form>
        </div>
      )}

      {loading && <p>Загрузка...</p>}

      {!loading && items.length === 0 && (
        <Alert variant="info">Лекарства не найдены</Alert>
      )}

      {!loading && items.length > 0 && (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Фото</th>
                <th>Название</th>
                <th>Производитель</th>
                <th>Цена</th>
                {isAdmin && <th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>
                    <img
                      src={m.photoUrl || '/photos/medicine1.jpg'}
                      alt={m.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      onError={(e) => { e.target.src = '/photos/medicine1.jpg'; }}
                    />
                  </td>
                  <td>{m.name}</td>
                  <td>{m.manufacturer}</td>
                  <td><Badge bg="success">{parseFloat(m.price).toFixed(2)} руб.</Badge></td>
                  {isAdmin && (
                    <td>
                      <Button size="sm" variant="warning" className="me-2" onClick={() => handleOpenEdit(m)}>
                        ✏️
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(m.id, m.name)}>
                        🗑️
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} />
              </Pagination>
            </div>
          )}
        </>
      )}

      {isAdmin && (
        <Modal show={!!editingItem} onHide={() => setEditingItem(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>✏️ Редактировать: {editingItem?.name}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSaveEdit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Название</Form.Label>
                <Form.Control
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Производитель</Form.Label>
                <Form.Control
                  value={editForm.manufacturer || ''}
                  onChange={(e) => setEditForm({ ...editForm, manufacturer: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Цена (руб.)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={editForm.price || ''}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>URL фото</Form.Label>
                <Form.Control
                  value={editForm.photoUrl || '/photos/medicine1.jpg'}
                  onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setEditingItem(null)}>Отмена</Button>
              <Button variant="primary" type="submit">💾 Сохранить</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  );
}

export default MedicinesPage;