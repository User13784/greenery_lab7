import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { fetchMedicines, selectMedicines } from '../../features/medicines/medicinesSlice';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectMedicines);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchMedicines({ limit: 100 }));
  }, [dispatch, items.length]);

  const manufacturerCount = {};
  items.forEach(m => { manufacturerCount[m.manufacturer] = (manufacturerCount[m.manufacturer] || 0) + 1; });

  const pieData = {
    labels: Object.keys(manufacturerCount),
    datasets: [{ label: 'Количество', data: Object.values(manufacturerCount), backgroundColor: ['#264A51', '#71B3C6', '#FFB800', '#c62828', '#2e7d32'] }],
  };

  const top5 = [...items].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 5);
  const barData = {
    labels: top5.map(m => m.name),
    datasets: [{ label: 'Цена (руб.)', data: top5.map(m => parseFloat(m.price)), backgroundColor: '#71B3C6' }],
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">📊 Дашборд</h1>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body><Pie data={pieData} options={{ plugins: { title: { display: true, text: 'По производителям' }, legend: { position: 'bottom' } } }} /></Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body><Bar data={barData} options={{ plugins: { title: { display: true, text: 'Топ-5 по цене' } }, scales: { y: { title: { display: true, text: 'Цена (руб.)' } } } }} /></Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}