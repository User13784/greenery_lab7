import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Pagination, Badge, Modal } from 'react-bootstrap';
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrdersPagination
} from '../../features/orders/ordersSlice';
import { fetchPharmacies, selectPharmacies } from '../../features/pharmacies/pharmaciesSlice';
import { selectIsAdmin, selectIsAuthenticated } from '../../features/auth/authSlice';

function OrdersPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectOrders);
  const pharmacies = useSelector(selectPharmacies);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const { totalPages, currentPage } = useSelector(selectOrdersPagination);
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [page, setPage] = useState(1);

  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    pharmacyId: '',
    createdDate: today,
    dueDate: ''
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    dispatch(fetchOrders({ page, limit: 10 }));
    if (pharmacies.length === 0) {
      dispatch(fetchPharmacies({ limit: 100 }));
    }
  }, [dispatch, page]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.pharmacyId || !formData.createdDate || !formData.dueDate) {
      alert('Заполните все поля');
      return;
    }
    dispatch(createOrder({
      pharmacyId: parseInt(formData.pharmacyId),
      createdDate: formData.createdDate,
      dueDate: formData.dueDate
    })).then(() => {
      setFormData({ pharmacyId: '', createdDate: today, dueDate: '' });
      dispatch(fetchOrders({ page, limit: 10 }));
    });
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      pharmacyId: item.pharmacyId || '',
      createdDate: item.createdDate ? item.createdDate.slice(0, 10) : '',
      dueDate: item.dueDate ? item.dueDate.slice(0, 10) : ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.pharmacyId || !editForm.createdDate || !editForm.dueDate) {
      alert('Заполните все поля');
      return;
    }
    dispatch(updateOrder({
      id: editingItem.id,
      data: {
        pharmacyId: parseInt(editForm.pharmacyId),
        createdDate: editForm.createdDate,
        dueDate: editForm.dueDate
      }
    })).then(() => {
      setEditingItem(null);
      dispatch(fetchOrders({ page, limit: 10 }));
    });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Удалить заявку №${id}?`)) {
      dispatch(deleteOrder(id)).then(() => {
        dispatch(fetchOrders({ page, limit: 10 }));
      });
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">📋 Заявки</h1>

      {!isAdmin && (
        <Alert variant="info">
          ℹ️ Режим <strong>«Только чтение»</strong>.
          {!isAuthenticated && ' Войдите как администратор, чтобы управлять данными.'}
        </Alert>
      )}

      {error && <Alert variant="danger">Ошибка: {error}</Alert>}

      {/* Форма создания — только для админа */}
      {isAdmin && (
        <div className="bg-light p-3 rounded mb-4">
          <h5>➕ Добавить заявку</h5>
          <Form onSubmit={handleCreate} className="row g-2">
            <div className="col-md-4">
              <Form.Select
                value={formData.pharmacyId}
                onChange={(e) => setFormData({ ...formData, pharmacyId: e.target.value })}
              >
                <option value="">— Выберите аптеку —</option>
                {pharmacies.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Form.Control
                type="date"
                value={formData.createdDate}
                onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
        <Alert variant="info">Заявки не найдены</Alert>
      )}

      {!loading && items.length > 0 && (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Аптека</th>
                <th>Дата составления</th>
                <th>Дата выполнения</th>
                <th>Закупок</th>
                {isAdmin && <th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {items.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.pharmacy?.name || '—'}</td>
                  <td>{new Date(o.createdDate).toLocaleDateString('ru-RU')}</td>
                  <td>{new Date(o.dueDate).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <Badge bg="info">{o.purchases?.length || 0}</Badge>
                  </td>
                  {isAdmin && (
                    <td>
                      <Button size="sm" variant="warning" className="me-2" onClick={() => handleOpenEdit(o)}>
                        ✏️
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(o.id)}>
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

      {/* Модальное окно редактирования — только для админа */}
      {isAdmin && (
        <Modal show={!!editingItem} onHide={() => setEditingItem(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>✏️ Редактировать заявку №{editingItem?.id}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSaveEdit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Аптека</Form.Label>
                <Form.Select
                  value={editForm.pharmacyId || ''}
                  onChange={(e) => setEditForm({ ...editForm, pharmacyId: e.target.value })}
                  required
                >
                  <option value="">— Выберите аптеку —</option>
                  {pharmacies.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Дата составления</Form.Label>
                <Form.Control
                  type="date"
                  value={editForm.createdDate || ''}
                  onChange={(e) => setEditForm({ ...editForm, createdDate: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Дата выполнения</Form.Label>
                <Form.Control
                  type="date"
                  value={editForm.dueDate || ''}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  required
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

export default OrdersPage;