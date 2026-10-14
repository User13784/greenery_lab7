import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Pagination, Modal } from 'react-bootstrap';
import {
  fetchPharmacies,
  createPharmacy,
  updatePharmacy,
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

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    dispatch(fetchPharmacies({ page, limit: 10, search }));
  }, [dispatch, page, search]);

  const handleCreate = (e) => {
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

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      address: item.address,
      phone: item.phone,
      photoUrl: item.photoUrl || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.address || !editForm.phone) {
      alert('Заполните обязательные поля');
      return;
    }
    dispatch(updatePharmacy({ id: editingItem.id, data: editForm })).then(() => {
      setEditingItem(null);
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
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleOpenEdit(p)}
                      title="Редактировать"
                    >
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(p.id, p.name)}
                      title="Удалить"
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
              <Form.Label>Адрес</Form.Label>
              <Form.Control
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Телефон</Form.Label>
              <Form.Control
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL фото</Form.Label>
              <Form.Control
                value={editForm.photoUrl || ''}
                onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })}
              />
            </Form.Group>
            {editForm.photoUrl && (
              <div className="text-center">
                <img
                  src={editForm.photoUrl}
                  alt="Preview"
                  style={{ maxHeight: 120, objectFit: 'cover', borderRadius: 8 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
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

export default PharmaciesPage;