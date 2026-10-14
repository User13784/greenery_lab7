import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Badge, Pagination } from 'react-bootstrap';
import {
  fetchMedicines,
  createMedicine,
  deleteMedicine,
  selectMedicines,
  selectMedicineLoading,
  selectMedicineError,
  selectMedicinePagination
} from '../../features/medicines/medicinesSlice';

function MedicinesPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectMedicines);
  const loading = useSelector(selectMedicineLoading);
  const error = useSelector(selectMedicineError);
  const { totalPages, currentPage } = useSelector(selectMedicinePagination);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    price: '',
    photoUrl: 'https://picsum.photos/seed/newmed/200/200'
  });

  useEffect(() => {
    dispatch(fetchMedicines({ page, limit: 10, search }));
  }, [dispatch, page, search]);

  const handleSubmit = (e) => {
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
        photoUrl: 'https://picsum.photos/seed/newmed/200/200'
      });
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

      {error && <Alert variant="danger">Ошибка: {error}</Alert>}

      {/* Форма поиска */}
      <Form.Control
        type="text"
        placeholder="🔍 Поиск по названию или производителю..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mb-3"
      />

      {/* Форма создания */}
      <div className="bg-light p-3 rounded mb-4">
        <h5>➕ Добавить лекарство</h5>
        <Form onSubmit={handleSubmit} className="row g-2">
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
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>
                    <img
                      src={m.photoUrl || 'https://picsum.photos/seed/med/50/50'}
                      alt={m.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </td>
                  <td>{m.name}</td>
                  <td>{m.manufacturer}</td>
                  <td><Badge bg="success">{parseFloat(m.price).toFixed(2)} руб.</Badge></td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(m.id, m.name)}
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
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default MedicinesPage;