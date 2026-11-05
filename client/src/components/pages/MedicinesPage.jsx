import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Alert, Button, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import { RobotoRegular } from '../../Roboto-Regular-normal.js';

import {
  fetchMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  selectMedicines,
  selectMedicinesLoading,
  selectMedicinesError
} from '../../features/medicines/medicinesSlice';
import { selectIsAdmin, selectIsAuthenticated } from '../../features/auth/authSlice';
import MedicinesTable from './MedicinesTable';

applyPlugin(jsPDF);

function MedicinesPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectMedicines);
  const loading = useSelector(selectMedicinesLoading);
  const error = useSelector(selectMedicinesError);
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [search, setSearch] = useState('');
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    price: '',
    photoUrl: '' // Пустая строка, чтобы требовать загрузку
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Запрашиваем сразу 100 записей для пагинации на клиенте
  useEffect(() => {
    dispatch(fetchMedicines({ limit: 100, search }));
  }, [dispatch, search]);

  // ────────────────────────────────────
  // ОТПРАВКА ФОРМЫ
  // ────────────────────────────────────
  const handleCreate = (e) => {
    e.preventDefault();
    
    // 1. Проверка обязательных полей
    if (!formData.name || !formData.manufacturer || !formData.price) {
      alert('Заполните все текстовые поля!');
      return;
    }

    // 2. Проверка, что фото загружено
    if (!formData.photoUrl) {
      alert('Пожалуйста, выберите фото для лекарства!');
      return;
    }

    dispatch(createMedicine({
      ...formData,
      price: parseFloat(formData.price)
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setFormData({ name: '', manufacturer: '', price: '', photoUrl: '' });
        dispatch(fetchMedicines({ limit: 100, search }));
        alert("Успех! Запись добавлена.");
      } else {
        alert('Ошибка сервера: ' + JSON.stringify(res.payload));
      }
    }).catch(err => {
      alert('Ошибка сети: ' + err.message);
    });
  };

  // ────────────────────────────────────
  // ЭКСПОРТ
  // ────────────────────────────────────
  const exportToExcel = () => {
    const data = items.map(m => ({ 'ID': m.id, 'Название': m.name, 'Производитель': m.manufacturer, 'Цена (руб.)': parseFloat(m.price) }));
    data.push({ 'Название': 'ИТОГО:', 'Цена (руб.)': items.reduce((sum, m) => sum + parseFloat(m.price), 0) });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Лекарства');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'Отчет.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addFileToVFS('Roboto-Regular.ttf', RobotoRegular);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    doc.setFontSize(16);
    doc.text('Отчет по лекарствам (Аптечный склад)', 14, 20);
    doc.setFontSize(10);
    doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 14, 28);
    doc.autoTable({
      startY: 35,
      head: [['ID', 'Название', 'Производитель', 'Цена (руб.)']],
      body: items.map(m => [m.id, m.name, m.manufacturer, parseFloat(m.price).toFixed(2)]),
      styles: { font: 'Roboto', fontSize: 10 },
      headStyles: { fillColor: [38, 74, 81], textColor: 255, font: 'Roboto', fontStyle: 'normal' },
    });
    doc.save('Отчет_Лекарства.pdf');
  };

  // ────────────────────────────────────
  // РЕДАКТИРОВАНИЕ И УДАЛЕНИЕ
  // ────────────────────────────────────
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm({ name: item.name, manufacturer: item.manufacturer, price: item.price });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    dispatch(updateMedicine({ id: editingItem.id, data: { ...editForm, price: parseFloat(editForm.price) } })).then(() => {
      setEditingItem(null);
      dispatch(fetchMedicines({ limit: 100, search }));
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Удалить "${name}"?`)) {
      dispatch(deleteMedicine(id)).then(() => dispatch(fetchMedicines({ limit: 100, search })));
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between mb-4 align-items-center">
        <h1 className="mb-0">💊 Лекарства</h1>
        <div>
          <Button variant="success" className="me-2" onClick={exportToExcel}>📊 Excel</Button>
          <Button variant="danger" onClick={exportToPDF}>📄 PDF</Button>
        </div>
      </div>

      {!isAdmin && <Alert variant="info">Режим «Только чтение»</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Control
        type="text" placeholder="🔍 Поиск на сервере..." value={search}
        onChange={(e) => setSearch(e.target.value)} className="mb-3"
      />

      {isAdmin && (
        <div className="bg-light p-3 rounded mb-4">
          <h5>➕ Добавить лекарство (все поля обязательны)</h5>
          <form onSubmit={handleCreate} className="row g-2">
            
            {/* Первая строка: Название, Производитель, Цена */}
            <div className="col-md-4">
              <input 
                className="form-control" 
                placeholder="Название" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <input 
                className="form-control" 
                placeholder="Производитель" 
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Цена" 
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            {/* Вторая строка: Загрузка фото и Кнопка Добавить */}
            <div className="col-md-8 mt-3">
              <input 
                type="file" 
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const localUrl = URL.createObjectURL(file);
                    setFormData({ ...formData, photoUrl: localUrl });
                  }
                }}
              />
            </div>

            <div className="col-md-4 mt-3">
              <button type="submit" className="btn btn-primary w-100">Добавить</button>
            </div>
          </form>
        </div>
      )}

      {loading && <p>Загрузка...</p>}

      {/* Таблица с ключом, чтобы перерисовывалась при обновлении */}
      {!loading && items.length > 0 && (
        <MedicinesTable 
          key={items.length} 
          data={items} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
          isAdmin={isAdmin} 
        />
      )}

      {isAdmin && (
        <Modal show={!!editingItem} onHide={() => setEditingItem(null)} centered>
          <Modal.Header closeButton><Modal.Title>✏️ Редактировать</Modal.Title></Modal.Header>
          <Form onSubmit={handleSaveEdit}>
            <Modal.Body>
              <Form.Group className="mb-3"><Form.Label>Название</Form.Label><Form.Control value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Производитель</Form.Label><Form.Control value={editForm.manufacturer} onChange={(e) => setEditForm({...editForm, manufacturer: e.target.value})} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Цена</Form.Label><Form.Control type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} required /></Form.Group>
            </Modal.Body>
            <Modal.Footer><Button variant="secondary" onClick={() => setEditingItem(null)}>Отмена</Button><Button variant="primary" type="submit">Сохранить</Button></Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  );
}

export default MedicinesPage;