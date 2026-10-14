# Greenery Lab 7 — PERN Stack Application

**Лабораторная работа № 7** по дисциплине «Технологии баз данных»
**Тема:** Проектирование и реализация веб-приложения с многоуровневой архитектурой на основе стека PERN
**Вариант:** 20 — «Аптечный склад»

---

## 🎯 Цель работы

Практическое освоение разработки веб-приложений с использованием:
- **PostgreSQL/SQLite** — реляционная СУБД
- **Sequelize** — ORM для Node.js
- **Express.js** — REST API
- **React** — клиентское приложение
- **Redux Toolkit** — state management
- **Axios** — HTTP-запросы
- **Postman** — тестирование API

---

## 📦 Предметная область

Аптечный склад РУП «БелФармация» осуществляет оптовую продажу лекарственных препаратов аптекам республики.

**Сущности:**
- **Лекарства** — код, название, производитель, цена, фото
- **Аптеки** — номер, название, адрес, телефон, фото
- **Заявки** — номер, аптека, дата составления, дата выполнения
- **Закупки** — заявка, лекарство, количество

**Связи:** Аптека 1:M Заявка 1:M Закупка M:1 Лекарство

---

## 🏗️ Архитектура проекта

greenery_lab7/
├── server/                # Express + Sequelize (Backend)
│   ├── config/            # Конфигурация БД (SQLite / PostgreSQL)
│   ├── models/            # Модели Sequelize (Pharmacy, Medicine, Order, Purchase)
│   ├── migrations/        # Миграции
│   ├── seeders/           # Сиды (70 записей)
│   ├── routes/            # API-роуты
│   ├── database.sqlite    # БД SQLite (генерируется автоматически)
│   ├── backup.sql         # Backup БД
│   └── index.js           # Точка входа сервера
│
├── src/                   # React (Frontend)
│   ├── app/               # Redux store
│   ├── features/          # Redux slices (medicines, pharmacies, orders, purchases, reports)
│   ├── components/        # React-компоненты и страницы
│   ├── services/          # Axios-клиент (api.js)
│   └── App.js
│
├── package.json           # Frontend зависимости
└── README.md

---

## 🛠️ Стек технологий

**Backend:** Node.js, Express, Sequelize ORM, SQLite (легко переключается на PostgreSQL)
**Frontend:** React 19, Redux Toolkit, React Router, React-Bootstrap, Axios

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/User13784/greenery_lab7.git
cd greenery_lab7
```

### 2. Настройка Backend

```bash
cd server
npm install
```

Создайте файл `server/.env`:

```
PORT=5000
NODE_ENV=development
```

Примените миграции и сиды:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Запустите сервер:

```bash
npm run dev
```

Сервер: http://localhost:5000

### 3. Настройка Frontend

В **новом терминале** (из корня проекта):

```bash
npm install
npm start
```

Frontend: http://localhost:3000

---

## 👤 Тестовые аккаунты

| Роль  | Email               | Пароль   |
|-------|---------------------|----------|
| Админ | admin@example.com   | admin123 |
| Юзер  | user@example.com    | user123  |

---

## 📚 API Endpoints

### Лекарства (Medicines)

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/medicines` | Список с пагинацией |
| GET | `/api/medicines?page=1&limit=5` | Пагинация |
| GET | `/api/medicines?sort=price&order=DESC` | Сортировка |
| GET | `/api/medicines?search=Аспирин` | Поиск |
| GET | `/api/medicines?manufacturer=Sanofi&minPrice=10` | Фильтр |
| GET | `/api/medicines/:id` | Детали |
| HEAD | `/api/medicines/:id` | Проверка существования |
| POST | `/api/medicines` | Создание |
| PUT | `/api/medicines/:id` | Обновление |
| DELETE | `/api/medicines/:id` | Удаление |

### Аптеки (Pharmacies)
Аналогично: `/api/pharmacies`, `/api/pharmacies/:id` и т.д.

### Заявки (Orders)
Аналогично: `/api/orders`, `/api/orders/:id` — возвращает аптеку и закупки.

### Закупки (Purchases)
Аналогично: `/api/purchases`, `/api/purchases/:id` — возвращает заявку и лекарство.

### Отчёты (Reports)

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/reports/orders?year=2024` | Ведомость отпуска лекарств по заявкам |

---

## 🧪 Тестовые сценарии для Postman

### Сценарий 1: Получение списка лекарств с пагинацией
- **Метод:** GET
- **URL:** `http://localhost:5000/api/medicines?page=1&limit=5`
- **Ожидаемый результат:** JSON с 5 записями, `totalPages`, `currentPage`.

### Сценарий 2: Сортировка по цене (убывание)
- **Метод:** GET
- **URL:** `http://localhost:5000/api/medicines?sort=price&order=DESC`
- **Ожидаемый результат:** записи отсортированы по убыванию цены.

### Сценарий 3: Поиск по нескольким полям
- **Метод:** GET
- **URL:** `http://localhost:5000/api/medicines?search=Аспирин`
- **Ожидаемый результат:** записи, где `name` ИЛИ `manufacturer` содержит «Аспирин».

### Сценарий 4: Фильтрация по нескольким полям
- **Метод:** GET
- **URL:** `http://localhost:5000/api/medicines?manufacturer=Sanofi&minPrice=10&maxPrice=20`
- **Ожидаемый результат:** записи, где `manufacturer = Sanofi` И `price` в диапазоне [10, 20].

### Сценарий 5: Детальная информация по ID
- **Метод:** GET
- **URL:** `http://localhost:5000/api/medicines/1`
- **Ожидаемый результат:** JSON одного объекта.

### Сценарий 6: Обработка отсутствия записи (негативный тест)
- **Метод:** GET
- **URL:** `http://localhost:5000/api/medicines/99999`
- **Ожидаемый результат:** статус **404** и JSON `{ "error": "Лекарство не найдено" }`.

### Сценарий 7: Проверка существования (HEAD)
- **Метод:** HEAD
- **URL:** `http://localhost:5000/api/medicines/1`
- **Ожидаемый результат:** статус **200**, тело пустое.
- **Негативный тест:** HEAD на `/api/medicines/99999` → **404**.

### Сценарий 8: Создание новой записи
- **Метод:** POST
- **URL:** `http://localhost:5000/api/medicines`
- **Body → raw → JSON:**
```json
{
  "name": "Тестовое лекарство",
  "manufacturer": "Тестовый производитель",
  "price": 99.99,
  "photoUrl": "https://picsum.photos/seed/test/200/200"
}
```
- **Ожидаемый результат:** статус **201 Created** и JSON с новой записью.

### Сценарий 9: Валидация (негативный тест)
- **Метод:** POST
- **URL:** `http://localhost:5000/api/medicines`
- **Body:**
```json
{ "name": "", "manufacturer": "Test", "price": -10 }
```
- **Ожидаемый результат:** статус **400 Bad Request** с сообщением об ошибке валидации.

### Сценарий 10: Обновление записи
- **Метод:** PUT
- **URL:** `http://localhost:5000/api/medicines/1`
- **Body:**
```json
{ "price": 150.00 }
```
- **Ожидаемый результат:** статус **200** и JSON с обновлённой записью.

### Сценарий 11: Удаление записи
- **Метод:** DELETE
- **URL:** `http://localhost:5000/api/medicines/1`
- **Ожидаемый результат:** статус **200** и `{ "message": "Лекарство удалено" }`.

### Сценарий 12: Список аптек
- **Метод:** GET
- **URL:** `http://localhost:5000/api/pharmacies?limit=5`

### Сценарий 13: Список заявок с включением связанных данных
- **Метод:** GET
- **URL:** `http://localhost:5000/api/orders?limit=3`
- **Ожидаемый результат:** каждая заявка содержит объект `pharmacy` и массив `purchases`.

### Сценарий 14: Список закупок с включением лекарств и заявок
- **Метод:** GET
- **URL:** `http://localhost:5000/api/purchases?limit=5`

### Сценарий 15: Отчёт по заявкам за год
- **Метод:** GET
- **URL:** `http://localhost:5000/api/reports/orders?year=2024`
- **Ожидаемый результат:** JSON с массивом `report` (группировка по заявкам) и `grandTotal`.

---

## 📁 Backup базы данных

Файл `server/backup.sql` содержит полный дамп БД со всеми данными. Для восстановления:

```bash
cd server
node backup.js    # создаст database.sqlite из backup.sql
```

Либо примените миграции и сиды:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## 🗄️ Переключение на PostgreSQL

Проект легко переключается на PostgreSQL. В `server/config/config.json` замените:

```json
{
  "development": {
    "dialect": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "pharmacy_db"
  }
}
```

Затем переустановите драйвер:
```bash
npm install pg pg-hstore
```

И пересоздайте БД:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
