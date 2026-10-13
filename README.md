# 3rd-year-laboratory-assignments

React SPA — Laboratory works. Greenery Furniture Store.

## 📚 Лабораторная работа №4: Redux Toolkit

### 🎯 Цель работы

Создать веб-приложение на React с использованием Redux для управления состоянием.

### 📦 Использованные библиотеки

- **React Bootstrap** v2.10 — UI-компоненты
- **Bootstrap 5** — CSS-фреймворк
- **@reduxjs/toolkit** — управление состоянием
- **react-redux** — связка Redux с React
- **i18next** — интернационализация (RU/EN)
- **react-i18next** — React-обёртка для i18next

### Установка

```bash
npm install @reduxjs/toolkit react-redux
npm install i18next react-i18next i18next-browser-languagedetector --legacy-peer-deps
npm install react-bootstrap bootstrap
```

---

## 🏗️ Архитектура Redux

### Store (`src/app/store.js`)

Объединяет все редьюсеры:

```jsx
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    feedback: feedbackReducer
  }
});
```

### 5 слайсов Redux

| № | Слайс | Файл | Что управляет |
|---|-------|------|---------------|
| 1 | **cart** | `features/cart/cartSlice.js` | Корзина (CRUD) |
| 2 | **favorites** | `features/favorites/favoritesSlice.js` | Избранное (CRUD) |
| 3 | **products** | `features/products/productsSlice.js` | Товары + фильтры + сортировка |
| 4 | **auth** | `features/auth/authSlice.js` | Пользователь + права |
| 5 | **feedback** | `features/feedback/feedbackSlice.js` | Отзывы |

---

## 🔄 CRUD в слайсах

### Cart Slice (пример)

```jsx
// CREATE
addItem(state, action) { ... }

// READ
selectCartItems = (state) => state.cart.items;

// UPDATE
updateQuantity(state, action) { ... }

// DELETE
removeItem(state, action) { ... }
```

### Async Thunks (для работы с API)

```jsx
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (item) => await api.addToCart(item)
);
```

---

## 🎣 Хуки Redux в компонентах

### useSelector — чтение данных

```jsx
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectCartItems } from '../../features/cart/cartSlice';

const cartItems = useAppSelector(selectCartItems);
```

### useDispatch — отправка действий

```jsx
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addToCartAsync } from '../../features/cart/cartSlice';

const dispatch = useAppDispatch();
dispatch(addToCartAsync({ productId: 1, price: 899 }));
```

---

## 🧩 Список использованных Bootstrap-компонентов (37)

### Layout
`Container`, `Row`, `Col`

### Навигация
`Navbar`, `Nav`, `Nav.Link`, `Navbar.Brand`, `Navbar.Toggle`, `Navbar.Collapse`

### Формы
`Form`, `Form.Control`, `Form.Group`, `Form.Label`, `Form.Select`, `Form.Check`

### Отображение
`Card`, `Card.Img`, `Card.Body`, `Card.Title`, `Card.Text`, `Card.Header`, `Card.Footer`, `Table`, `ListGroup`, `Badge`

### Интерактив
`Button`, `ButtonGroup`, `Modal`, `Toast`, `ToastContainer`, `Spinner`, `Alert`, `Carousel`, `Pagination`, `InputGroup`, `Tabs`, `Tab`

---

## 🌐 Интернационализация (i18next)

### Настройка `src/i18n/i18n.js`

```jsx
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false }
  });
```

### Использование в компонентах

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('ru')}>RU</button>
      <button onClick={() => changeLanguage('en')}>EN</button>
    </div>
  );
}
```

---

## 🗺️ Страницы приложения

| Путь | Страница | Что использует |
|------|----------|----------------|
| `/` | Home | Redux, i18next |
| `/catalog` | Catalog | Redux (products), CRUD |
| `/cart` | Cart | Redux (cart) |
| `/favorites` | Favorites | Redux (favorites) |
| `/feedback` | Reviews | Redux (feedback) |
| `/register` | Register | Redux (auth) |
| `/admin` | Admin | Redux (products, feedback) |
| `*` | 404 | — |

---

## 🚀 Запуск проекта

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск JSON Server (порт 3001)
npm run server

# 3. Запуск React (порт 3000) — в отдельном терминале
npm start
```

---

## 🔑 Тестовые аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Админ | `admin@example.com` | `admin123` |
| Пользователь | `user@example.com` | `user123` |

---

## 🎯 Требования лабораторной №4

| Требование | Реализация |
|-----------|-----------|
| ✅ Store Redux | `src/app/store.js` с `configureStore` |
| ✅ 2+ слайса | 5 слайсов: cart, favorites, products, auth, feedback |
| ✅ CRUD в слайсах | Добавление, чтение, обновление, удаление |
| ✅ Обработка ошибок | `try/catch` в async thunks + `error` в state |
| ✅ Валидация данных | `Form.Control.Feedback` в формах |
| ✅ Список компонентов | `CatalogPage`, `FavoritesPage`, `AdminPage` |
| ✅ Формы создания/редактирования | `AddProductModal`, `EditProductModal` |
| ✅ Фильтрация и сортировка | `selectFilteredProducts` |
| ✅ useSelector/useDispatch | Во всех компонентах |
| ✅ React Router | 8 страниц |
| ✅ i18next | `src/i18n/i18n.js` |
| ✅ Отзывчивый дизайн | Bootstrap 320px→1920px |
| ✅ Redux DevTools | Подключены |

---

## 🛠️ Технологии

- **React 19**
- **React Router v6**
- **Redux Toolkit 2**
- **React Redux 9**
- **i18next 24**
- **React Bootstrap 2**
- **Bootstrap 5**
- **JSON Server**

---

## 📄 Лицензия

MIT