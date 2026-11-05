import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Badge, Pagination, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

// ────────────────────────────────────
// Схема валидации Yup
// ────────────────────────────────────
const medicineSchema = yup.object({
  name: yup.string().required('Название обязательно').min(2, 'Слишком короткое'),
  manufacturer: yup.string().required('Производитель обязателен'),
  price: yup.number()
    .typeError('Должно быть число')
    .positive('Цена должна быть > 0')
    .required('Цена обязательна'),
  discount: yup.number()
    .min(0, 'Не меньше 0')
    .max(100, 'Не больше 100')
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? null : value),
  dateReceived: yup.date().required('Дата обязательна'),
  photoUrl: yup.string().default('/photos/medicine1.jpg'),
});

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

  // Состояние для редактирования (пока оставляем на useState для простоты)
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ────────────────────────────────────
  // React Hook Form для создания
  // ────────────────────────────────────
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(medicineSchema),
    defaultValues: {
      name: '',
      manufacturer: '',
      price: '',
      discount: '',
      dateReceived: new Date().toISOString().slice(0, 10),
      photoUrl: '/photos/medicine1.jpg',
    },
  });

  const priceValue = watch('price');

  useEffect(() => {
    dispatch(fetchMedicines({ page, limit: 10, search }));
  }, [dispatch, page, search]);

  // ────────────────────────────────────
  // ЭКСПОРТ В EXCEL
  // ────────────────────────────────────
  const exportToExcel = () => {
    const dataForExcel = items.map(m => ({
      'ID': m.id,
      'Название': m.name,
      'Производитель': m.manufacturer,
      'Цена (руб.)': parseFloat(m.price),
    }));

    const totalPrice = items.reduce((sum, m) => sum + parseFloat(m.price), 0);
    dataForExcel.push({ 'Название': 'ИТОГО:', 'Цена (руб.)': totalPrice });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Лекарства');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Отчет_Лекарства.xlsx');
  };

  // ────────────────────────────────────
  // ЭКСПОРТ В PDF
  // ────────────────────────────────────
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Отчет по лекарствам (Аптечный склад)', 14, 20);
    doc.setFontSize(10);
    doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 14, 28);

    const tableData = items.map(m => [
      m.id, m.name, m.manufacturer, parseFloat(m.price).toFixed(2)
    ]);
    const total = items.reduce((sum, m) => sum + parseFloat(m.price), 0);
    tableData.push(['', 'ИТОГО:', '', total.toFixed(2)]);

    doc.autoTable({
      startY: 35,
      head: [['ID', 'Название', 'Производитель', 'Цена (руб.)']],
      body: tableData,
      styles: { font: 'helvetica', fontSize: 10 },
      headStyles: { fillColor: [38, 74, 81] },
    });
    doc.save('Отчет_Лекарства.pdf');
  };

  // ────────────────────────────────────
  // СОЗДАНИЕ (через RHF)
  // ────────────────────────────────────
  const onSubmitCreate = (data) => {
    const payload = {
      name: data.name,
      manufacturer: data.manufacturer,
      price: parseFloat(data.price),
      photoUrl: data.photoUrl || '/photos/medicine1.jpg',
    };

    dispatch(createMedicine(payload)).then(() => {
      dispatch(fetchMedicines({ page, limit: 10, search }));
      reset(); // Сброс формы
    });
  };

  // ────────────────────────────────────
  // РЕДАКТИРОВАНИЕ (старая логика)
  // ────────────────────────────────────
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
      {/* Заголовок и кнопки экспорта */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="mb-0">💊 Лекарства</h1>
        <div>
          <Button variant="success" className="me-2" onClick={exportToExcel}>
            📊 Экспорт в Excel
          </Button>
          <Button variant="danger" onClick={exportToPDF}>
            📄 Экспорт в PDF
          </Button>
        </div>
      </div>

      {!isAdmin && (
        <Alert variant="info">
          ℹ️ Вы просматриваете страницу в режиме <strong>«Только чтение»</strong>.
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

      {/* ─── НОВАЯ ФОРМА С RHF ─── */}
      {isAdmin && (
        <div className="bg-light p-3 rounded mb-4">
          <h5>➕ Добавить лекарство (React Hook Form)</h5>
          <form onSubmit={handleSubmit(onSubmitCreate)} className="row g-2">
            
            <div className="col-md-3">
              <label className="form-label">Название *</label>
              <input {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label">Производитель *</label>
              <input {...register('manufacturer')} className={`form-control ${errors.manufacturer ? 'is-invalid' : ''}`} />
              {errors.manufacturer && <div className="invalid-feedback">{errors.manufacturer.message}</div>}
            </div>

            <div className="col-md-2">
              <label className="form-label">Цена (руб.) *</label>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              />
              {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
            </div>

            {/* Зависимое поле: показываем, если цена > 500 */}
            {parseFloat(priceValue) > 500 && (
              <div className="col-md-2">
                <label className="form-label">Скидка (%)</label>
                <input
                  type="number"
                  {...register('discount')}
                  className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                />
                {errors.discount && <div className="invalid-feedback">{errors.discount.message}</div>}
              </div>
            )}

            <div className="col-md-2">
              <label className="form-label">Дата поступления *</label>
              <input
                type="date"
                {...register('dateReceived')}
                className={`form-control ${errors.dateReceived ? 'is-invalid' : ''}`}
              />
              {errors.dateReceived && <div className="invalid-feedback">{errors.dateReceived.message}</div>}
            </div>

            {/* Загрузка файла */}
            <div className="col-md-4 mt-3">
              <label className="form-label">Фото (загрузка файла)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const localUrl = URL.createObjectURL(file);
                    setValue('photoUrl', localUrl);
                  }
                }}
              />
            </div>

            <div className="col-md-2 mt-5">
              <button type="submit" className="btn btn-primary w-100">
                Добавить
              </button>
            </div>
          </form>
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

      {/* Модалка редактирования (пока старая логика) */}
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