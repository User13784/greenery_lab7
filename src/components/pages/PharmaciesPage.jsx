import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Pagination } from 'react-bootstrap';
import {
  fetchPharmacies,
  createPharmacy,
  deletePharmacy,
  selectPharmacies,
  selectPharmaciesLoading,
  selectPharmaciesError,
  selectPharmaciesPagination
} from '../../features/pharmacies/pharmaciesSlice';

function PharmaciesPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectPharmacies);
  const loading = useSelector(selectPharmaciesLoading);
  const error = useSelector(selectPharmaciesError);
  const { totalPages, currentPage } = useSelector(selectPharmaciesPagination);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    photoUrl: 'https://picsum.photos/seed/newpharm/200/200'
  });

  useEffect(() => {
    dispatch(fetchPharmacies({ page, limit: 10, search }));
  }, [dispatch, page, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Заполните обязательные поля');
      return;
    }
    dispatch(createPharmacy(formData)).then(() => {
      setFormData({
        name: '', address: '', phone: '',
        photoUrl: 'https://picsum.photos/seed/newpharm/200/200'
      });
      dispatch(fetchPharmacies({ page, limit: 10, search }));
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Удалить "${name}"?`)) {
      dispatch(deletePharmacy(id)).then(() => {
        dispatch(fetchPharmacies({ page, limit: 10, search }));
      });
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">🏥 Аптеки</h1>

      {error && <Alert variant="danger">Ошибка: {error}</Alert>}

      <Form.Control
        type="text"
        placeholder="🔍 Поиск по названию или адресу..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mb-3"
      />

      <div className="bg-light p-3 rounded mb-4">
        <h5>➕ Добавить аптеку</h5>
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
              placeholder="Адрес"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <Form.Control
              placeholder="Телефон"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
        <Alert variant="info">Аптеки не найдены</Alert>
      )}

      {!loading && items.length > 0 && (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Фото</th>
                <th>Название</th>
                <th>Адрес</th>
                <th>Телефон</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <img
                      src={p.photoUrl || 'https://picsum.photos/seed/pharm/50/50'}
                      alt={p.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.address}</td>
                  <td>{p.phone}</td>
                  <td>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(p.id, p.name)}>
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

export default PharmaciesPage;