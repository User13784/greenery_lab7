# Greenery Lab 7 & 8 — PERN Stack Application

**Лабораторная работа № 7** — Проектирование и реализация веб-приложения с многоуровневой архитектурой на основе стека PERN (PostgreSQL, Express, React, Node.js).
**Лабораторная работа № 8** — Авторизация/аутентификация пользователей для доступа к API.

**Вариант:** 20 — «Аптечный склад»

---

## 🎯 Цель работы

Практическое освоение разработки веб-приложений с использованием:
- **PostgreSQL** — реляционная СУБД
- **Sequelize** — ORM для Node.js
- **Express.js** — REST API
- **React** — клиентское приложение
- **Redux Toolkit** — state management
- **Axios** — HTTP-запросы
- **JWT + bcrypt** — авторизация/аутентификация (lab8)
- **Postman** — тестирование API

---

## 📦 Предметная область

Аптечный склад РУП «БелФармация» осуществляет оптовую продажу лекарственных препаратов аптекам республики.

**Сущности:**
- **Лекарства** — код, название, производитель, цена, фото
- **Аптеки** — номер, название, адрес, телефон, фото
- **Заявки** — номер, аптека, дата составления, дата выполнения
- **Закупки** — заявка, лекарство, количество
- **Пользователи** *(lab8)* — email, пароль (bcrypt-хеш), роль, resetToken

**Связи:** Аптека 1:M Заявка 1:M Закупка M:1 Лекарство

---

## 🏗️ Архитектура проекта

```text
greenery_lab7/
├── server/                # Express + Sequelize (Backend)
│   ├── config/            # Конфигурация БД (PostgreSQL)
│   ├── models/            # Модели: Pharmacy, Medicine, Order, Purchase, User
│   ├── migrations/        # Миграции
│   ├── seeders/           # Сиды (50 записей)
│   ├── routes/            # API-роуты (включая auth.js)
│   ├── middleware/        # JWT-middleware (lab8)
│   ├── backup.js          # Скрипт backup БД
│   ├── backup.sql         # Дамп БД (52 записи)
│   └── index.js           # Точка входа
│
├── client/                # React (Frontend)
│   ├── src/
│   │   ├── app/           # Redux store
│   │   ├── features/      # Redux slices (включая auth)
│   │   ├── components/
│   │   │   └── pages/     # 5 auth-страниц + 5 страниц аптеки
│   │   ├── services/      # Axios (api.js + interceptor)
│   │   └── App.js
│   └── package.json
│
├── package.json
└── README.md