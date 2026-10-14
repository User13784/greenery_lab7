import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Pagination, Badge } from 'react-bootstrap';
import {
  fetchPurchases,
  createPurchase,
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

  useEffect(() => {
    dispatch(fetchPurchases({ page, limit: 10 }));
    if (medicines.length === 0) {
      dispatch(fetchMedicines({ limit: 100 }));
    }
    if (orders.length === 0) {
      dispatch(fetchOrders({ limit: 100 }));
    }
  }, [dispatch, page]);

  const handleSubmit = (e) => {
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
        <Form onSubmit={handleSubmit} className="row g-2">
          <div className="col-md-4">
            <Form.Select
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
            >
              <option value="">— Выберите заявку —</option>
              {orders.map(o => (
                <option key={o.id} value={o.id}>Заявка №{o.id} ({o.pharmacy?.name || '?'})</option>
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
                <option key={m.id} value={m.id}>{m.name} ({m.manufacturer})</option>
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
                    <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
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
    </Container>
  );
}

export default PurchasesPage;