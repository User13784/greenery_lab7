import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectFavorites } from '../../features/favorites/favoritesSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import ProductCard from '../product/ProductCard';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, product }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, cursor: 'grab' };
  return <Col ref={setNodeRef} style={style} {...attributes} {...listeners}><ProductCard product={product} /></Col>;
}

export default function FavoritesPage() {
  const favorites = useAppSelector(selectFavorites);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(favorites.map(item => ({
      id: item.productId, name: item.name || { en: 'Product', ru: 'Товар' }, price: item.price || 0,
      image: item.image || '/assets/images/placeholder.jpg', category: item.category || 'General',
      rating: item.rating || 5, inStock: item.inStock !== undefined ? item.inStock : true,
      description: item.description || { en: '', ru: '' }, isFavorite: true
    })));
  }, [favorites]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  if (!isAuthenticated) return <Container className="py-5 text-center"><Alert variant="warning">🔒 Войдите в аккаунт</Alert><Button as={Link} to="/register">Войти</Button></Container>;
  if (items.length === 0) return <Container className="py-5 text-center"><Alert variant="info">Пусто</Alert></Container>;

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">❤️ Избранное</h1>
      <p className="text-center text-muted">Перетащите карточки, чтобы изменить порядок</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
          setItems((it) => arrayMove(it, it.findIndex(i => i.id === active.id), it.findIndex(i => i.id === over.id)));
        }
      }}>
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {items.map((item) => <SortableItem key={item.id} id={item.id} product={item} />)}
          </Row>
        </SortableContext>
      </DndContext>
    </Container>
  );
}