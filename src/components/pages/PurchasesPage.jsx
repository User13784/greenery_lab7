import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Pagination, Badge, Modal } from 'react-bootstrap';
import {
  fetchPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
  selectPurchases,
  selectPurchasesLoading,
  selectPurchasesError,
  selectPurchasesPagination
} from '../../features/purchases/purchasesSlice';
import { fetchMedicines, selectMedicines } from '../../features/medicines/medicinesSlice';
import { fetchOrders, selectOrders } from '../../features/orders/ordersSlice';

function PurchasesPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectPurchases);
  const medicines = useSelector(selectMedicines);
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectPurchasesLoading);
  const error = useSelector(selectPurchasesError);
  const { totalPages, currentPage } = useSelector(selectPurchasesPagination);

  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    orderId: '',
    medicineId: '',
    quantity: ''
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    dispatch(fetchPurchases({ page, limit: 10 }));
    if (medicines.length === 0) {
      dispatch(fetchMedicines({ limit: 100 }));
    }
    if (orders.length === 0) {
      dispatch(fetchOrders({ limit: 100 }));
    }
  }, [dispatch, page]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.orderId || !formData.medicineId || !formData.quantity) {
      alert('Заполните все поля');
      return;
    }
    if (parseInt(formData.quantity) < 1) {
      alert('Количество должно быть ≥ 1');
      return;
    }
    dispatch(createPurchase({
      orderId: parseInt(formData.orderId),
      medicineId: parseInt(formData.medicineId),
      quantity: parseInt(formData.quantity)
    })).then(() => {
      setFormData({ orderId: '', medicineId: '', quantity: '' });
      dispatch(fetchPurchases({ page, limit: 10 }));
    });
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      orderId: item.orderId || '',
      medicineId: item.medicineId || '',
      quantity: item.quantity || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.orderId || !editForm.medicineId || !editForm.quantity) {
      alert('Заполните все поля');
      return;
    }
    if (parseInt(editForm.quantity) < 1) {
      alert('Количество должно быть ≥ 1');
      return;
    }
    dispatch(updatePurchase({
      id: editingItem.id,
      data: {
        orderId: parseInt(editForm.orderId),
        medicineId: parseInt(editForm.medicineId),
        quantity: parseInt(editForm.quantity)
      }
    })).then(() => {
      setEditingItem(null);
      dispatch(fetchPurchases({ page, limit: 10 }));
    });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Удалить закупку №${id}?`)) {
      dispatch(deletePurchase(id)).then(() => {
        dispatch(fetchPurchases({ page, limit: 10 }));
      });
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">📦 Закупки</h1>

      {error && <Alert variant="danger">Ошибка: {error}</Alert>}

      <div className="bg-light p-3 rounded mb-4">
        <h5>➕ Добавить закупку</h5>
        <Form onSubmit={handleCreate} className="row g-2">
          <div className="col-md-4">
            <Form.Select
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
            >
              <option value="">— Выберите заявку —</option>
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  Заявка №{o.id} ({o.pharmacy?.name || '?'})
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Select
              value={formData.medicineId}
              onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
            >
              <option value="">— Выберите лекарство —</option>
              {medicines.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.manufacturer})
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-2">
            <Form.Control
              type="number"
              min="1"
              placeholder="Количество"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <Button type="submit" variant="primary" className="w-100">Добавить</Button>
          </div>
        </Form>
      </div>

      {loading && <p>Загрузка...</p>}

      {!loading && items.length === 0 && (
        <Alert variant="info">Закупки не найдены</Alert>
      )}

      {!loading && items.length > 0 && (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Заявка</th>
                <th>Лекарство</th>
                <th>Производитель</th>
                <th>Количество</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>№{p.orderId}</td>
                  <td>{p.medicine?.name || '—'}</td>
                  <td>{p.medicine?.manufacturer || '—'}</td>
                  <td><Badge bg="success">{p.quantity} шт.</Badge></td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleOpenEdit(p)}
                    >
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️
                    </Button>
                  </td>
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

      <Modal show={!!editingItem} onHide={() => setEditingItem(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Редактировать закупку №{editingItem?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveEdit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Заявка</Form.Label>
              <Form.Select
                value={editForm.orderId || ''}
                onChange={(e) => setEditForm({ ...editForm, orderId: e.target.value })}
                required
              >
                <option value="">— Выберите заявку —</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    Заявка №{o.id} ({o.pharmacy?.name || '?'})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Лекарство</Form.Label>
              <Form.Select
                value={editForm.medicineId || ''}
                onChange={(e) => setEditForm({ ...editForm, medicineId: e.target.value })}
                required
              >
                <option value="">— Выберите лекарство —</option>
                {medicines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.manufacturer})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Количество (шт.)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={editForm.quantity || ''}
                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
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
    </Container>
  );
}

export default PurchasesPage;