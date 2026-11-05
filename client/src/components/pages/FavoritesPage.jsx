import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { selectFavorites } from '../../features/favorites/favoritesSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import ProductCard from '../product/ProductCard';

// Импорты для Drag-and-Drop
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ────────────────────────────────────
// Компонент-обертка для одного элемента
// ────────────────────────────────────
function SortableItem({ id, product }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <Col ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProductCard product={product} />
    </Col>
  );
}

function FavoritesPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Локальный стейт для сортировки (синхронизируется с Redux)
  const [items, setItems] = useState([]);

  useEffect(() => {
    const formatted = favorites.map(item => ({
      id: item.productId,
      name: item.name || { en: 'Product', ru: 'Товар' },
      price: item.price || 0,
      image: item.image || '/assets/images/placeholder.jpg',
      category: item.category || 'General',
      rating: item.rating || 5,
      inStock: item.inStock !== undefined ? item.inStock : true,
      description: item.description || { en: '', ru: '' },
      isFavorite: true
    }));
    setItems(formatted);
  }, [favorites]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      // В реальном приложении здесь можно диспатчить экшен в Redux,
      // чтобы сохранить новый порядок избранного в БД.
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="text-center py-5">
        <Alert variant="warning">
          <h2>🔒 {t('loginRequired')}</h2>
          <p>{t('cartLoginRequired')}</p>
        </Alert>
        <Button as={Link} to="/register" variant="primary" size="lg">
          👤 {t('login')}
        </Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <h2>{t('emptyFavorites')}</h2>
          <p>{t('emptyFavoritesHint')}</p>
        </Alert>
        <Button as={Link} to="/catalog" variant="primary" size="lg">
          {t('goToCatalog')}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">{t('favoritesTitle')}</h1>
        <p className="text-muted">{t('favoritesSubtitle')}</p>
        <p className="text-muted small">💡 Перетащите карточки, чтобы изменить порядок</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} product={item} />
            ))}
          </Row>
        </SortableContext>
      </DndContext>
    </Container>
  );
}

export default FavoritesPage;