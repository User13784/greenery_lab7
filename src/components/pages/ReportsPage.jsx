import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Form, Alert, Spinner, Card } from 'react-bootstrap';
import {
  fetchOrdersReport,
  selectReportData,
  selectReportLoading,
  selectReportError
} from '../../features/reports/reportsSlice';

function ReportsPage() {
  const dispatch = useDispatch();
  const data = useSelector(selectReportData);
  const loading = useSelector(selectReportLoading);
  const error = useSelector(selectReportError);

  // Год по умолчанию — 2026 (текущий)
  const [year, setYear] = useState(2026);

  // Загружаем отчёт за 2026 при первом рендере
  useEffect(() => {
    dispatch(fetchOrdersReport(2026));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchOrdersReport(parseInt(year)));
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">📊 Отчёты</h1>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Ведомость отпуска лекарственных препаратов аптеками</h5>
          <Form onSubmit={handleSubmit} className="row g-2 align-items-end">
            <div className="col-md-4">
              <Form.Label>Год:</Form.Label>
              <Form.Select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {[2024, 2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Загрузка...' : '🔍 Сформировать отчёт'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">Ошибка: {error}</Alert>}

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Формирование отчёта...</p>
        </div>
      )}

      {!loading && data && data.report.length === 0 && (
        <Alert variant="warning">
          ⚠️ За <strong>{data.year}</strong> год заявок не найдено.
        </Alert>
      )}

      {!loading && data && data.report.length > 0 && (
        <>
          <h4 className="mb-3">
            Ведомость отпуска лекарственных препаратов аптеками в {data.year} году
          </h4>

          {data.report.map((orderGroup) => (
            <Card key={orderGroup.orderId} className="mb-4 shadow-sm">
              <Card.Header className="bg-dark text-white">
                <strong>
                  Номер заявки: {orderGroup.orderId}
                  {orderGroup.pharmacyName && ` — ${orderGroup.pharmacyName}`}
                </strong>
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped bordered hover responsive className="mb-0">
                  <thead className="table-secondary">
                    <tr>
                      <th>Название лекарства</th>
                      <th>Производитель</th>
                      <th className="text-end">Количество, шт.</th>
                      <th className="text-end">Цена, руб.</th>
                      <th className="text-end">Сумма оплаты, руб.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderGroup.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.medicineName}</td>
                        <td>{item.manufacturer}</td>
                        <td className="text-end">{item.quantity}</td>
                        <td className="text-end">{item.price.toFixed(2)}</td>
                        <td className="text-end fw-bold">{item.sum.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="2" className="fw-bold">Итого по заявке:</td>
                      <td className="text-end fw-bold">{orderGroup.orderQuantity}</td>
                      <td></td>
                      <td className="text-end fw-bold text-primary">
                        {orderGroup.orderTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>
          ))}

          <Card className="shadow bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h5 className="mb-0">ИТОГО за {data.year} год:</h5>
                </div>
                <div className="d-flex gap-4">
                  <div>
                    <small>Всего отпущено:</small>
                    <h4 className="mb-0">{data.grandQuantity} шт.</h4>
                  </div>
                  <div>
                    <small>Общая сумма:</small>
                    <h4 className="mb-0">{data.grandTotal.toFixed(2)} руб.</h4>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
}

export default ReportsPage;