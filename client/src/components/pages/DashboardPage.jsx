import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { fetchMedicines, selectMedicines } from '../../features/medicines/medicinesSlice';

// Регистрируем компоненты Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectMedicines);

  // Загружаем данные при монтировании, если их еще нет
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchMedicines({ limit: 100 })); // берем максимум для статистики
    }
  }, [dispatch, items.length]);

  // ────────────────────────────────────
  // 1. Круговая диаграмма: Распределение по производителям
  // ────────────────────────────────────
  const manufacturerCount = {};
  items.forEach(m => {
    manufacturerCount[m.manufacturer] = (manufacturerCount[m.manufacturer] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(manufacturerCount),
    datasets: [
      {
        label: 'Количество лекарств',
        data: Object.values(manufacturerCount),
        backgroundColor: [
          '#264A51', '#71B3C6', '#FFB800', '#c62828', '#2e7d32'
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'Распределение лекарств по производителям',
        font: { size: 16 },
      },
    },
  };

  // ────────────────────────────────────
  // 2. Столбчатая диаграмма: Топ-5 по цене
  // ────────────────────────────────────
  const top5 = [...items].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 5);

  const barData = {
    labels: top5.map(m => m.name),
    datasets: [
      {
        label: 'Цена (руб.)',
        data: top5.map(m => parseFloat(m.price)),
        backgroundColor: '#71B3C6',
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Топ-5 самых дорогих лекарств',
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Цена (руб.)' },
      },
      x: {
        title: { display: true, text: 'Название лекарства' },
      },
    },
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">📊 Дашборд / Аналитика</h1>
      
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Pie data={pieData} options={pieOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Bar data={barData} options={barOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}